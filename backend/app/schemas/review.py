from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class ReviewAnalysisResponse(BaseModel):
    id: int
    review_id: int
    sentiment: str
    sentiment_score: float
    confidence: float
    analyzed_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewBase(BaseModel):
    app_id: int
    external_review_id: str
    author_name: Optional[str] = None
    rating: int
    review_text: str
    review_date: Optional[datetime] = None
    review_version: Optional[str] = None
    language: Optional[str] = "en"


class ReviewCreate(ReviewBase):
    pass


class ReviewResponse(ReviewBase):
    id: int
    created_at: datetime
    updated_at: datetime
    analysis: Optional[ReviewAnalysisResponse] = None

    model_config = ConfigDict(from_attributes=True)


class PaginatedReviewsResponse(BaseModel):
    items: List[ReviewResponse]
    page: int
    page_size: int
    total: int
    total_pages: int
