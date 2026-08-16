from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class AppBase(BaseModel):
    name: str
    platform: str
    app_store_id: Optional[str] = None
    package_name: Optional[str] = None
    developer_name: Optional[str] = None
    store_url: Optional[str] = None
    icon_url: Optional[str] = None
    current_rating: Optional[float] = None
    review_count: int = 0


class AppCreate(AppBase):
    organization_id: int


class AppResponse(AppBase):
    id: int
    organization_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AppSyncResponse(BaseModel):
    app_id: int
    name: str
    platform: str
    reviews_fetched: int
    reviews_inserted: int
    reviews_skipped_duplicates: int
    analysis_completed: int
    message: str
