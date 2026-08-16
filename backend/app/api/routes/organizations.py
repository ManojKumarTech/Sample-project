from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from backend.app.api.dependencies import (
    get_org_service,
    get_app_discovery_service,
    get_dashboard_service,
    get_app_repo,
)
from backend.app.schemas.organization import (
    OrganizationDiscoverRequest,
    OrganizationDiscoverResponse,
    OrganizationResponse,
)
from backend.app.schemas.app import AppResponse
from backend.app.schemas.dashboard import OrganizationDashboardResponse
from backend.app.services.organization_service import OrganizationService
from backend.app.services.app_discovery_service import AppDiscoveryService
from backend.app.services.dashboard_service import DashboardService
from backend.app.repositories.app_repository import AppRepository
from backend.app.core.exceptions import OrganizationNotFound, InvalidOrganization

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.post("/discover", response_model=OrganizationDiscoverResponse)
async def discover_organization_apps(
    request: OrganizationDiscoverRequest,
    discovery_service: AppDiscoveryService = Depends(get_app_discovery_service),
):
    """Discover and validate mobile apps across Apple and Google Play stores for an organization."""
    if not request.name or not request.name.strip():
        raise HTTPException(status_code=400, detail="Organization name cannot be empty.")

    org, apps = await discovery_service.discover_for_organization(request.name.strip())
    return OrganizationDiscoverResponse(
        organization_id=org.id,
        name=org.name,
        apps_found=len(apps),
    )


@router.get("", response_model=List[OrganizationResponse])
def list_organizations(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    org_service: OrganizationService = Depends(get_org_service),
):
    """List all previously discovered organizations."""
    return org_service.get_all_organizations(skip=skip, limit=limit)


@router.get("/{organization_id}", response_model=OrganizationResponse)
def get_organization(
    organization_id: int,
    org_service: OrganizationService = Depends(get_org_service),
):
    """Get organization details by ID."""
    org = org_service.get_organization(organization_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization could not be found.")
    return org


@router.get("/{organization_id}/apps", response_model=List[AppResponse])
def get_organization_apps(
    organization_id: int,
    org_service: OrganizationService = Depends(get_org_service),
    app_repo: AppRepository = Depends(get_app_repo),
):
    """Get all discovered applications belonging to the organization."""
    org = org_service.get_organization(organization_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization could not be found.")
    return app_repo.get_by_organization(organization_id)


@router.get("/{organization_id}/dashboard", response_model=OrganizationDashboardResponse)
def get_organization_dashboard(
    organization_id: int,
    dashboard_service: DashboardService = Depends(get_dashboard_service),
):
    """Get high-level organization executive dashboard metrics, app comparison, themes, and actionable insights."""
    try:
        return dashboard_service.get_organization_dashboard(organization_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
