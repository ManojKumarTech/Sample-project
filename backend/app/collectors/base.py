from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class BaseCollector(ABC):
    """Abstract interface for App Store and Google Play Store data collectors."""

    @property
    @abstractmethod
    def platform_name(self) -> str:
        """Return platform identifier: APPLE or GOOGLE_PLAY."""
        pass

    @abstractmethod
    async def discover_apps(self, query: str, limit: int = 25) -> List[Dict[str, Any]]:
        """Search store for apps matching query/organization name.
        
        Returns list of standardized app dicts:
        [
            {
                "name": str,
                "platform": "APPLE" | "GOOGLE_PLAY",
                "app_store_id": Optional[str],
                "package_name": Optional[str],
                "developer_name": str,
                "store_url": str,
                "icon_url": str,
                "current_rating": float,
                "review_count": int,
            }
        ]
        """
        pass

    @abstractmethod
    async def fetch_reviews(self, store_identifier: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Fetch recent reviews for an application.
        
        Returns list of standardized review dicts:
        [
            {
                "external_review_id": str,
                "author_name": str,
                "rating": int,
                "review_text": str,
                "review_date": datetime,
                "review_version": str,
                "language": str,
            }
        ]
        """
        pass
