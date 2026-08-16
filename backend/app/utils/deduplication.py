import hashlib
from typing import List, Dict, Any


def generate_review_hash(author: str, text: str, date_str: str) -> str:
    """Generate deterministic hash for review deduplication when no ID is provided."""
    payload = f"{author}_{text}_{date_str}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()[:32]


def deduplicate_reviews(reviews: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Deduplicate in-memory review objects by external_review_id."""
    seen_ids = set()
    unique_reviews = []
    for r in reviews:
        ext_id = r.get("external_review_id")
        if not ext_id:
            ext_id = generate_review_hash(
                r.get("author_name") or "anonymous",
                r.get("review_text") or "",
                str(r.get("review_date") or ""),
            )
            r["external_review_id"] = ext_id

        if ext_id not in seen_ids:
            seen_ids.add(ext_id)
            unique_reviews.append(r)
    return unique_reviews


def deduplicate_apps(apps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Deduplicate discovered apps by platform + store_id / package_name."""
    seen = set()
    unique_apps = []
    for app in apps:
        platform = app.get("platform")
        store_id = app.get("app_store_id") or app.get("package_name") or app.get("name", "").lower()
        key = f"{platform}:{store_id}"
        if key not in seen:
            seen.add(key)
            unique_apps.append(app)
    return unique_apps
