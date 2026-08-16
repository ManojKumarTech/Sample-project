from typing import Optional, List
from sqlalchemy.orm import Session
from backend.app.models.app_metric import AppMetric
from backend.app.models.app_theme import AppTheme


class MetricRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_latest_metric(self, app_id: int, period: str = "all_time") -> Optional[AppMetric]:
        return (
            self.db.query(AppMetric)
            .filter(AppMetric.app_id == app_id, AppMetric.period == period)
            .order_by(AppMetric.created_at.desc())
            .first()
        )

    def save_metric(
        self,
        app_id: int,
        period: str,
        review_count: int,
        average_rating: float,
        positive_count: int,
        neutral_count: int,
        negative_count: int,
        sentiment_score: float,
    ) -> AppMetric:
        # Delete old metric for this period to keep fresh
        self.db.query(AppMetric).filter(AppMetric.app_id == app_id, AppMetric.period == period).delete()
        metric = AppMetric(
            app_id=app_id,
            period=period,
            review_count=review_count,
            average_rating=average_rating,
            positive_count=positive_count,
            neutral_count=neutral_count,
            negative_count=negative_count,
            sentiment_score=sentiment_score,
        )
        self.db.add(metric)
        self.db.commit()
        self.db.refresh(metric)
        return metric

    def get_themes_by_app(self, app_id: int) -> List[AppTheme]:
        return (
            self.db.query(AppTheme)
            .filter(AppTheme.app_id == app_id)
            .order_by(AppTheme.review_count.desc())
            .all()
        )

    def save_themes(self, app_id: int, themes_data: List[dict]) -> List[AppTheme]:
        # Clear existing themes for this app
        self.db.query(AppTheme).filter(AppTheme.app_id == app_id).delete()
        themes = [AppTheme(app_id=app_id, **data) for data in themes_data]
        self.db.add_all(themes)
        self.db.commit()
        for t in themes:
            self.db.refresh(t)
        return themes
