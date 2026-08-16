from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from backend.app.api.dependencies import get_review_repo, get_app_repo
from backend.app.schemas.review import PaginatedReviewsResponse, ReviewResponse
from backend.app.repositories.review_repository import ReviewRepository
from backend.app.repositories.app_repository import AppRepository

router = APIRouter(prefix="/apps/{app_id}/reviews", tags=["Reviews"])


@router.get("", response_model=PaginatedReviewsResponse)
def get_app_reviews(
    app_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sentiment: Optional[str] = Query(None, description="Filter by sentiment: POSITIVE, NEUTRAL, or NEGATIVE"),
    min_rating: Optional[int] = Query(None, ge=1, le=5),
    max_rating: Optional[int] = Query(None, ge=1, le=5),
    app_repo: AppRepository = Depends(get_app_repo),
    review_repo: ReviewRepository = Depends(get_review_repo),
):
    """Retrieve paginated reviews for an application with optional sentiment and star-rating filters."""
    app = app_repo.get_by_id(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")

    items, total = review_repo.get_paginated_by_app(
        app_id=app_id,
        page=page,
        page_size=page_size,
        sentiment=sentiment,
        min_rating=min_rating,
        max_rating=max_rating,
    )
    total_pages = max(1, (total + page_size - 1) // page_size) if total > 0 else 1

    return PaginatedReviewsResponse(
        items=[ReviewResponse.model_validate(r) for r in items],
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
    )
