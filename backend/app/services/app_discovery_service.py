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
    """
    Service Layer: Coordinates multi-store application discovery and organization matching.
    
    Responsibilities:
    1. Normalizes user-supplied organization names to canonical search tokens.
    2. Retrieves or registers the organization entity in the database.
    3. Asynchronously orchestrates collectors (Apple App Store & Google Play) in parallel.
    4. Evaluates publisher-to-organization confidence scoring (HIGH, MEDIUM, LOW).
    5. Deduplicates cross-store search results to avoid redundant records.
    6. Persists validated application metadata into MySQL via AppRepository.
    """

    def __init__(self, org_repo: OrganizationRepository, app_repo: AppRepository):
        """
        Dependency Injection: Injects repository instances for clean data layer separation.
        """
        self.org_repo = org_repo
        self.app_repo = app_repo

    async def discover_for_organization(self, org_name: str) -> Tuple[Organization, List[App]]:
        """
        Main Business Logic Pipeline for Organization Discovery:
        
        Args:
            org_name: Raw organization input (e.g. "Meta", "Google", "Spotify AB").
            
        Returns:
            Tuple of (Organization model instance, List of persisted App model instances).
        """
        # Step 1: Clean and normalize the organization query string
        clean_name = org_name.strip()
        norm_name = normalize_organization_name(clean_name)

        # Step 2: Retrieve existing or create a new organization in MySQL
        org = self.org_repo.get_or_create(name=clean_name, normalized_name=norm_name)
        logger.info(f"Starting app discovery for organization '{org.name}' (id: {org.id})")

        # Step 3: Run all store collectors concurrently via asyncio.gather
        # This prevents Apple Store latency from blocking Google Play queries and vice-versa
        collectors = CollectorFactory.get_all_collectors()
        tasks = [collector.discover_apps(clean_name, limit=15) for collector in collectors]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Step 4: Aggregate raw results from all successful collector responses
        raw_apps: List[Dict[str, Any]] = []
        for i, res in enumerate(results):
            if isinstance(res, list):
                raw_apps.extend(res)
            elif isinstance(res, Exception):
                logger.error(f"Collector error in app discovery: {res}")

        # Step 5: Validate and filter search results using confidence heuristics
        # Rejects unrelated apps that coincidentally matched search keywords
        validated_apps: List[Dict[str, Any]] = []
        for app_data in raw_apps:
            dev_name = app_data.get("developer_name") or ""
            app_title = app_data.get("name") or ""
            confidence = calculate_match_confidence(clean_name, dev_name, app_title)

            # Accept HIGH and MEDIUM confidence matches
            if confidence in ["HIGH", "MEDIUM"]:
                validated_apps.append(app_data)
            else:
                logger.debug(f"Skipping low confidence match: {app_title} by {dev_name}")

        # Step 6: In-memory deduplication across platform and store IDs
        unique_apps = deduplicate_apps(validated_apps)
        logger.info(f"Discovered {len(unique_apps)} validated unique applications for '{org.name}'")

        # Step 7: Persist or update records in MySQL database via Repository
        saved_apps: List[App] = []
        for app_dict in unique_apps:
            existing = self.app_repo.find_existing(
                organization_id=org.id,
                platform=app_dict["platform"],
                app_store_id=app_dict.get("app_store_id"),
                package_name=app_dict.get("package_name"),
            )
            if existing:
                # If app already exists, update store metadata (e.g. latest ratings)
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
                # Insert brand new application under this organization
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
