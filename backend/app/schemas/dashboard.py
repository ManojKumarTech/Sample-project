from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from backend.app.schemas.app import AppResponse
from backend.app.schemas.review import ReviewResponse


class AppMetricResponse(BaseModel):
    id: Optional[int] = None
    app_id: int
    period: str
    review_count: int
    average_rating: float
    positive_count: int
    neutral_count: int
    negative_count: int
    positive_pct: float
    neutral_pct: float
    negative_pct: float
    sentiment_score: float

    model_config = ConfigDict(from_attributes=True)


class AppThemeResponse(BaseModel):
    id: Optional[int] = None
    app_id: Optional[int] = None
    theme_name: str
    theme_type: str
    review_count: int
    percentage: float
    sentiment: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class TrendPoint(BaseModel):
    date: str
    sentiment_score: float
    average_rating: float
    review_count: int
    positive_count: int
    neutral_count: int
    negative_count: int


class PlatformComparisonItem(BaseModel):
    platform: str
    app_id: int
    rating: float
    review_count: int
    positive_pct: float
    neutral_pct: float
    negative_pct: float
    sentiment_score: float
    top_negative_themes: List[str]


class ActionableInsight(BaseModel):
    id: str
    category: str  # PLATFORM, SENTIMENT, THEME, RATING, ANOMALY
    severity: str  # HIGH, MEDIUM, LOW, POSITIVE
    title: str
    description: str
    recommendation: str


class OrganizationDashboardResponse(BaseModel):
    organization_id: int
    organization_name: str
    total_apps: int
    total_reviews: int
    average_rating: float
    positive_pct: float
    neutral_pct: float
    negative_pct: float
    sentiment_score: float
    apps_comparison: List[Dict[str, Any]]
    top_positive_themes: List[AppThemeResponse]
    top_negative_themes: List[AppThemeResponse]
    trends: List[TrendPoint]
    insights: List[ActionableInsight]


class AppDashboardResponse(BaseModel):
    app: AppResponse
    metrics: AppMetricResponse
    sentiment_distribution: Dict[str, Any]
    trends: List[TrendPoint]
    top_positive_themes: List[AppThemeResponse]
    top_negative_themes: List[AppThemeResponse]
    recent_reviews: List[ReviewResponse]
    platform_comparison: Optional[List[PlatformComparisonItem]] = None
    insights: List[ActionableInsight]
