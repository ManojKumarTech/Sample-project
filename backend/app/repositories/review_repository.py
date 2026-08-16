from typing import Optional, List, Tuple
from sqlalchemy.orm import Session, joinedload
from backend.app.models.review import Review
from backend.app.models.review_analysis import ReviewAnalysis


class ReviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, review_id: int) -> Optional[Review]:
        return (
            self.db.query(Review)
            .options(joinedload(Review.analysis))
            .filter(Review.id == review_id)
            .first()
        )

    def find_by_external_id(self, app_id: int, external_review_id: str) -> Optional[Review]:
        return (
            self.db.query(Review)
            .filter(
                Review.app_id == app_id,
                Review.external_review_id == external_review_id,
            )
            .first()
        )

    def get_existing_external_ids(self, app_id: int, external_ids: List[str]) -> set:
        if not external_ids:
            return set()
        results = (
            self.db.query(Review.external_review_id)
            .filter(
                Review.app_id == app_id,
                Review.external_review_id.in_(external_ids),
            )
            .all()
        )
        return {r[0] for r in results}

    def bulk_create(self, reviews_data: List[dict]) -> List[Review]:
        reviews = [Review(**d) for d in reviews_data]
        self.db.add_all(reviews)
        self.db.commit()
        for r in reviews:
            self.db.refresh(r)
        return reviews

    def get_paginated_by_app(
        self,
        app_id: int,
        page: int = 1,
        page_size: int = 50,
        sentiment: Optional[str] = None,
        min_rating: Optional[int] = None,
        max_rating: Optional[int] = None,
    ) -> Tuple[List[Review], int]:
        query = (
            self.db.query(Review)
            .options(joinedload(Review.analysis))
            .filter(Review.app_id == app_id)
        )

        if sentiment:
            query = query.join(Review.analysis).filter(ReviewAnalysis.sentiment == sentiment.upper())
        if min_rating is not None:
            query = query.filter(Review.rating >= min_rating)
        if max_rating is not None:
            query = query.filter(Review.rating <= max_rating)

        total = query.count()
        items = (
            query.order_by(Review.review_date.desc(), Review.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        return items, total

    def get_all_by_app(self, app_id: int) -> List[Review]:
        return (
            self.db.query(Review)
            .options(joinedload(Review.analysis))
            .filter(Review.app_id == app_id)
            .order_by(Review.review_date.desc(), Review.id.desc())
            .all()
        )

    def get_all_by_org(self, org_id: int) -> List[Review]:
        from backend.app.models.app import App
        return (
            self.db.query(Review)
            .join(App, Review.app_id == App.id)
            .options(joinedload(Review.analysis))
            .filter(App.organization_id == org_id)
            .order_by(Review.review_date.desc(), Review.id.desc())
            .all()
        )

    def get_unanalyzed_reviews(self, limit: int = 500) -> List[Review]:
        return (
            self.db.query(Review)
            .outerjoin(ReviewAnalysis)
            .filter(ReviewAnalysis.id == None)
            .limit(limit)
            .all()
        )

    def save_analysis(self, review_id: int, sentiment: str, sentiment_score: float, confidence: float) -> ReviewAnalysis:
        analysis = ReviewAnalysis(
            review_id=review_id,
            sentiment=sentiment,
            sentiment_score=sentiment_score,
            confidence=confidence,
        )
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        return analysis
