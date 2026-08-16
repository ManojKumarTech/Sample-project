from fastapi import APIRouter, Depends, HTTPException
from backend.app.api.dependencies import get_dashboard_service
from backend.app.schemas.dashboard import OrganizationDashboardResponse
from backend.app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/organization/{organization_id}", response_model=OrganizationDashboardResponse)
def get_org_dashboard_alias(
    organization_id: int,
    dashboard_service: DashboardService = Depends(get_dashboard_service),
):
    """Direct alias endpoint for organization dashboard."""
    try:
        return dashboard_service.get_organization_dashboard(organization_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
