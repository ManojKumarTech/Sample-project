from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class OrganizationBase(BaseModel):
    name: str


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationDiscoverRequest(BaseModel):
    name: str


class OrganizationDiscoverResponse(BaseModel):
    organization_id: int
    name: str
    apps_found: int


class OrganizationResponse(OrganizationBase):
    id: int
    normalized_name: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
