from fastapi import Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.repositories import (
    OrganizationRepository,
    AppRepository,
    ReviewRepository,
    MetricRepository,
)
from backend.app.services import (
    OrganizationService,
    AppDiscoveryService,
    ReviewService,
    SentimentService,
    ThemeService,
    DashboardService,
)


def get_org_repo(db: Session = Depends(get_db)) -> OrganizationRepository:
    return OrganizationRepository(db)


def get_app_repo(db: Session = Depends(get_db)) -> AppRepository:
    return AppRepository(db)


def get_review_repo(db: Session = Depends(get_db)) -> ReviewRepository:
    return ReviewRepository(db)


def get_metric_repo(db: Session = Depends(get_db)) -> MetricRepository:
    return MetricRepository(db)


def get_theme_service() -> ThemeService:
    return ThemeService()


def get_sentiment_service(
    review_repo: ReviewRepository = Depends(get_review_repo)
) -> SentimentService:
    return SentimentService(review_repo)


def get_org_service(
    org_repo: OrganizationRepository = Depends(get_org_repo)
) -> OrganizationService:
    return OrganizationService(org_repo)


def get_app_discovery_service(
    org_repo: OrganizationRepository = Depends(get_org_repo),
    app_repo: AppRepository = Depends(get_app_repo),
) -> AppDiscoveryService:
    return AppDiscoveryService(org_repo, app_repo)


def get_review_service(
    app_repo: AppRepository = Depends(get_app_repo),
    review_repo: ReviewRepository = Depends(get_review_repo),
    metric_repo: MetricRepository = Depends(get_metric_repo),
    sentiment_service: SentimentService = Depends(get_sentiment_service),
    theme_service: ThemeService = Depends(get_theme_service),
) -> ReviewService:
    return ReviewService(
        app_repo, review_repo, metric_repo, sentiment_service, theme_service
    )


def get_dashboard_service(
    org_repo: OrganizationRepository = Depends(get_org_repo),
    app_repo: AppRepository = Depends(get_app_repo),
    review_repo: ReviewRepository = Depends(get_review_repo),
    metric_repo: MetricRepository = Depends(get_metric_repo),
    theme_service: ThemeService = Depends(get_theme_service),
) -> DashboardService:
    return DashboardService(
        org_repo, app_repo, review_repo, metric_repo, theme_service
    )
