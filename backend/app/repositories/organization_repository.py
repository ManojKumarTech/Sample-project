from typing import Optional, List
from sqlalchemy.orm import Session
from backend.app.models.organization import Organization


class OrganizationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, org_id: int) -> Optional[Organization]:
        return self.db.query(Organization).filter(Organization.id == org_id).first()

    def get_by_normalized_name(self, normalized_name: str) -> Optional[Organization]:
        return self.db.query(Organization).filter(Organization.normalized_name == normalized_name).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Organization]:
        return self.db.query(Organization).offset(skip).limit(limit).all()

    def create(self, name: str, normalized_name: str) -> Organization:
        org = Organization(name=name, normalized_name=normalized_name)
        self.db.add(org)
        self.db.commit()
        self.db.refresh(org)
        return org

    def get_or_create(self, name: str, normalized_name: str) -> Organization:
        existing = self.get_by_normalized_name(normalized_name)
        if existing:
            return existing
        return self.create(name=name, normalized_name=normalized_name)
