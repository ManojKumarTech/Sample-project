from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from backend.app.api.dependencies import (
    get_app_repo,
    get_review_service,
    get_dashboard_service,
    get_metric_repo,
    get_theme_service,
)
from backend.app.schemas.app import AppResponse, AppSyncResponse
from backend.app.schemas.dashboard import (
    AppDashboardResponse,
    AppMetricResponse,
    AppThemeResponse,
    TrendPoint,
)
from backend.app.repositories.app_repository import AppRepository
from backend.app.repositories.metric_repository import MetricRepository
from backend.app.services.review_service import ReviewService
from backend.app.services.dashboard_service import DashboardService
from backend.app.services.theme_service import ThemeService

router = APIRouter(prefix="/apps", tags=["Applications"])


@router.get("/{app_id}", response_model=AppDashboardResponse)
def get_app_details(
    app_id: int,
    dashboard_service: DashboardService = Depends(get_dashboard_service),
):
    """Get full dashboard for an application including metrics, sentiment distribution, themes, trends, and sibling platform comparison."""
    try:
        return dashboard_service.get_app_dashboard(app_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{app_id}/sync", response_model=AppSyncResponse)
async def sync_app_reviews(
    app_id: int,
    limit: int = Query(50, ge=10, le=200),
    review_service: ReviewService = Depends(get_review_service),
):
    """Manually synchronize reviews from the respective app store with deduplication and automated sentiment analysis."""
    try:
        result = await review_service.sync_app_reviews(app_id, limit=limit)
        return AppSyncResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")


@router.get("/{app_id}/sentiment")
def get_app_sentiment(
    app_id: int,
    dashboard_service: DashboardService = Depends(get_dashboard_service),
):
    """Get sentiment distribution and aggregate score for an application."""
    try:
        dash = dashboard_service.get_app_dashboard(app_id)
        return {
            "app_id": app_id,
            "sentiment_distribution": dash.sentiment_distribution,
            "metrics": dash.metrics,
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{app_id}/themes", response_model=List[AppThemeResponse])
def get_app_themes(
    app_id: int,
    metric_repo: MetricRepository = Depends(get_metric_repo),
    app_repo: AppRepository = Depends(get_app_repo),
):
    """Get categorized positive and negative themes detected in app reviews."""
    app = app_repo.get_by_id(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")
    themes = metric_repo.get_themes_by_app(app_id)
    return [AppThemeResponse.model_validate(t) for t in themes]


@router.get("/{app_id}/trends", response_model=List[TrendPoint])
def get_app_trends(
    app_id: int,
    dashboard_service: DashboardService = Depends(get_dashboard_service),
):
    """Get historical sentiment and review volume trends over time."""
    try:
        dash = dashboard_service.get_app_dashboard(app_id)
        return dash.trends
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
