from typing import Optional, List
from backend.app.models.organization import Organization
from backend.app.repositories.organization_repository import OrganizationRepository
from backend.app.utils.normalization import normalize_organization_name


class OrganizationService:
    def __init__(self, org_repo: OrganizationRepository):
        self.org_repo = org_repo

    def get_organization(self, org_id: int) -> Optional[Organization]:
        return self.org_repo.get_by_id(org_id)

    def get_all_organizations(self, skip: int = 0, limit: int = 50) -> List[Organization]:
        return self.org_repo.get_all(skip=skip, limit=limit)

    def find_by_name(self, name: str) -> Optional[Organization]:
        norm = normalize_organization_name(name)
        return self.org_repo.get_by_normalized_name(norm)
