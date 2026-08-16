from backend.app.utils.normalization import normalize_organization_name, clean_text
from backend.app.utils.deduplication import generate_review_hash, deduplicate_reviews, deduplicate_apps


def test_normalize_organization_name():
    assert normalize_organization_name("Meta Platforms, Inc.") == "meta"
    assert normalize_organization_name("Google LLC") == "google"
    assert normalize_organization_name("Spotify AB") == "spotify"
    assert normalize_organization_name("  Microsoft Corporation  ") == "microsoft"
    assert normalize_organization_name("Netflix, Inc.") == "netflix"


def test_clean_text():
    raw = "Great app!\r\n\r\n   Worked flawlessly.  \n"
    assert clean_text(raw) == "Great app! Worked flawlessly."


def test_deduplicate_reviews():
    reviews = [
        {"external_review_id": "rev_1", "review_text": "Great"},
        {"external_review_id": "rev_1", "review_text": "Duplicate"},
        {"external_review_id": "rev_2", "review_text": "Awesome"},
    ]
    unique = deduplicate_reviews(reviews)
    assert len(unique) == 2
    assert unique[0]["external_review_id"] == "rev_1"
    assert unique[1]["external_review_id"] == "rev_2"


def test_deduplicate_apps():
    apps = [
        {"platform": "APPLE", "app_store_id": "123", "name": "Insta"},
        {"platform": "APPLE", "app_store_id": "123", "name": "Insta duplicate"},
        {"platform": "GOOGLE_PLAY", "package_name": "com.insta", "name": "Insta Android"},
    ]
    unique = deduplicate_apps(apps)
    assert len(unique) == 2
