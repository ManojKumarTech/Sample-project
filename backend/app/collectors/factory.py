from typing import Dict
from backend.app.collectors.base import BaseCollector
from backend.app.collectors.app_store import AppleAppStoreCollector
from backend.app.collectors.play_store import GooglePlayCollector
from backend.app.core.exceptions import CollectorError


class CollectorFactory:
    """Factory for creating platform-specific app store collectors."""

    _collectors: Dict[str, BaseCollector] = {
        "APPLE": AppleAppStoreCollector(),
        "GOOGLE_PLAY": GooglePlayCollector(),
    }

    @classmethod
    def get_collector(cls, platform: str) -> BaseCollector:
        platform_key = platform.upper()
        collector = cls._collectors.get(platform_key)
        if not collector:
            raise CollectorError(f"Unsupported platform collector: '{platform}'")
        return collector

    @classmethod
    def get_all_collectors(cls) -> list[BaseCollector]:
        return list(cls._collectors.values())
