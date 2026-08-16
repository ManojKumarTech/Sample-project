import re
import unicodedata
from typing import Optional


def normalize_organization_name(name: str) -> str:
    """Normalize organization name for matching and deduplication.
    
    Examples:
    'Meta Platforms, Inc.' -> 'meta'
    'Google LLC' -> 'google'
    'Spotify AB' -> 'spotify'
    '  Microsoft Corporation  ' -> 'microsoft'
    """
    if not name:
        return ""

    # Convert to lowercase and normalize unicode
    text = unicodedata.normalize("NFKD", name).lower()

    # Remove common business suffixes
    suffixes = [
        r"\bplatforms\b",
        r"\btechnologies\b",
        r"\btechnology\b",
        r"\bcorporation\b",
        r"\bcorp\b",
        r"\binc\b",
        r"\bincorporated\b",
        r"\bllc\b",
        r"\bltd\b",
        r"\blimited\b",
        r"\bco\b",
        r"\bcompany\b",
        r"\bgmbh\b",
        r"\bsa\b",
        r"\bsarl\b",
        r"\bab\b",
        r"\bplc\b",
        r"\bse\b",
        r"\bholding\b",
        r"\bholdings\b",
        r"\bgroup\b",
    ]
    for suffix in suffixes:
        text = re.sub(suffix, "", text)

    # Remove non-alphanumeric characters (except spaces)
    text = re.sub(r"[^\w\s]", "", text)

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text


def clean_text(text: Optional[str]) -> str:
    """Clean user review text or titles."""
    if not text:
        return ""
    # Normalize unicode
    text = unicodedata.normalize("NFKC", text)
    # Strip excessive newlines and spaces
    text = re.sub(r"\r\n|\r|\n", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def calculate_match_confidence(org_name: str, developer_name: Optional[str], app_name: Optional[str] = None) -> str:
    """Calculate confidence level (HIGH, MEDIUM, LOW) that a developer matches an organization."""
    if not developer_name:
        return "LOW"

    norm_org = normalize_organization_name(org_name)
    norm_dev = normalize_organization_name(developer_name)

    if not norm_org or not norm_dev:
        return "LOW"

    # Exact normalized match
    if norm_org == norm_dev:
        return "HIGH"

    # Known parent-child mappings
    org_aliases = {
        "meta": ["meta platforms", "facebook", "instagram", "whatsapp", "meta apps"],
        "google": ["google llc", "google inc", "google commerce ltd", "google ireland"],
        "microsoft": ["microsoft corporation", "microsoft mobile", "mojang"],
        "spotify": ["spotify ab", "spotify ltd", "spotify music"],
        "apple": ["apple inc", "apple distribution international"],
        "amazon": ["amazon mobile llc", "amazon.com services llc", "amazon digital services"],
        "bytedance": ["bytedance ltd", "tiktok pte. ltd.", "tiktok ltd"],
        "netflix": ["netflix, inc.", "netflix", "netflix worldwide"],
        "uber": ["uber technologies, inc.", "uber technologies", "uber b.v."],
        "airbnb": ["airbnb, inc.", "airbnb"],
        "twitter": ["x corp.", "twitter, inc.", "x corp"],
        "x": ["x corp.", "twitter, inc.", "x corp", "x"],
    }

    aliases = org_aliases.get(norm_org, [])
    for alias in aliases:
        if normalize_organization_name(alias) in norm_dev or norm_dev in normalize_organization_name(alias):
            return "HIGH"

    # Substring match
    if norm_org in norm_dev or norm_dev in norm_org:
        return "HIGH"

    # Word intersection match
    org_words = set(norm_org.split())
    dev_words = set(norm_dev.split())
    if org_words.intersection(dev_words):
        return "MEDIUM"

    return "LOW"
