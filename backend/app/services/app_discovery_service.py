import asyncio
from typing import List, Dict, Any, Tuple
from backend.app.collectors.factory import CollectorFactory
from backend.app.core.logging import logger
from backend.app.models.organization import Organization
from backend.app.models.app import App
from backend.app.repositories.organization_repository import OrganizationRepository
from backend.app.repositories.app_repository import AppRepository
from backend.app.utils.normalization import normalize_organization_name, calculate_match_confidence
from backend.app.utils.deduplication import deduplicate_apps


class AppDiscoveryService:
    """Service to discover and validate mobile applications for an organization across app stores."""

    def __init__(self, org_repo: OrganizationRepository, app_repo: AppRepository):
        self.org_repo = org_repo
        self.app_repo = app_repo

    async def discover_for_organization(self, org_name: str) -> Tuple[Organization, List[App]]:
        """Run multi-store discovery for the organization name."""
        clean_name = org_name.strip()
        norm_name = normalize_organization_name(clean_name)

        # 1. Get or create organization
        org = self.org_repo.get_or_create(name=clean_name, normalized_name=norm_name)
        logger.info(f"Starting app discovery for organization '{org.name}' (id: {org.id})")

        # 2. Run collectors concurrently across stores
        collectors = CollectorFactory.get_all_collectors()
        tasks = [collector.discover_apps(clean_name, limit=15) for collector in collectors]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        raw_apps: List[Dict[str, Any]] = []
        for i, res in enumerate(results):
            if isinstance(res, list):
                raw_apps.extend(res)
            elif isinstance(res, Exception):
                logger.error(f"Collector error in app discovery: {res}")

        # 3. Filter and validate with confidence matching
        validated_apps: List[Dict[str, Any]] = []
        for app_data in raw_apps:
            dev_name = app_data.get("developer_name") or ""
            app_title = app_data.get("name") or ""
            confidence = calculate_match_confidence(clean_name, dev_name, app_title)

            # Accept HIGH and MEDIUM confidence, or if dev name has partial match
            if confidence in ["HIGH", "MEDIUM"]:
                validated_apps.append(app_data)
            else:
                logger.debug(f"Skipping low confidence match: {app_title} by {dev_name}")

        # 4. Deduplicate
        unique_apps = deduplicate_apps(validated_apps)
        logger.info(f"Discovered {len(unique_apps)} validated unique applications for '{org.name}'")

        # 5. Persist or update in database
        saved_apps: List[App] = []
        for app_dict in unique_apps:
            existing = self.app_repo.find_existing(
                organization_id=org.id,
                platform=app_dict["platform"],
                app_store_id=app_dict.get("app_store_id"),
                package_name=app_dict.get("package_name"),
            )
            if existing:
                updated = self.app_repo.update(
                    existing,
                    name=app_dict["name"],
                    developer_name=app_dict.get("developer_name"),
                    store_url=app_dict.get("store_url"),
                    icon_url=app_dict.get("icon_url"),
                    current_rating=app_dict.get("current_rating"),
                    review_count=app_dict.get("review_count", 0),
                )
                saved_apps.append(updated)
            else:
                new_app = self.app_repo.create(
                    organization_id=org.id,
                    name=app_dict["name"],
                    platform=app_dict["platform"],
                    app_store_id=app_dict.get("app_store_id"),
                    package_name=app_dict.get("package_name"),
                    developer_name=app_dict.get("developer_name"),
                    store_url=app_dict.get("store_url"),
                    icon_url=app_dict.get("icon_url"),
                    current_rating=app_dict.get("current_rating"),
                    review_count=app_dict.get("review_count", 0),
                )
                saved_apps.append(new_app)

        return org, saved_apps
