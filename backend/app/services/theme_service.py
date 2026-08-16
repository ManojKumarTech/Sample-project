import re
from typing import List, Dict, Any, Optional
from collections import defaultdict
from backend.app.models.review import Review


THEME_KEYWORDS = {
    "Login & Auth": [
        "login", "log in", "sign in", "signin", "password", "2fa", "otp", "code",
        "verification", "account locked", "authenticat", "credentials", "logged out"
    ],
    "Crashes & Stability": [
        "crash", "crashes", "crashed", "crashing", "freeze", "freezes", "frozen",
        "force close", "black screen", "glitch", "buggy", "bugs", "broken"
    ],
    "Performance & Speed": [
        "slow", "lag", "laggy", "sluggish", "stutter", "loading", "buffer",
        "responsive", "snappy", "fast", "speed", "smooth", "fps", "overheat"
    ],
    "Ads & Monetization": [
        "ads", "ad ", "advert", "popup", "pop-up", "commercial", "subscription",
        "paywall", "expensive", "premium", "unskip", "price"
    ],
    "Notifications & Alerts": [
        "notification", "notifications", "notify", "alert", "alerts", "badge",
        "sound", "push notification", "delayed notice"
    ],
    "UI / UX Design": [
        "interface", "ui", "ux", "layout", "dark mode", "design", "theme",
        "navigation", "button", "buttons", "icon", "confusing", "aesthetic", "clean"
    ],
    "Camera & Media": [
        "camera", "video", "photo", "filter", "filters", "reels", "story",
        "stories", "audio", "mic", "microphone", "sound", "upload", "download"
    ],
    "Payments & Billing": [
        "payment", "pay", "billing", "charged", "refund", "receipt", "in-app",
        "apple pay", "card", "transaction"
    ],
    "Battery & Resource": [
        "battery", "drain", "draining", "power", "heat", "hot", "ram", "memory"
    ],
    "Privacy & Security": [
        "privacy", "security", "permission", "permissions", "spy", "tracking",
        "spam", "scam", "hacked", "safe"
    ],
}


class ThemeService:
    """Service to detect recurring themes and topics from reviews."""

    def extract_themes(self, reviews: List[Review]) -> List[Dict[str, Any]]:
        """Extract and categorize themes across a list of reviews with sentiment weighting."""
        if not reviews:
            return []

        total_reviews = len(reviews)
        theme_counts = defaultdict(int)
        theme_sentiments = defaultdict(list)

        for review in reviews:
            text = (review.review_text or "").lower()
            analysis = review.analysis
            sentiment_score = analysis.sentiment_score if analysis else (1.0 if review.rating >= 4 else (-1.0 if review.rating <= 2 else 0.0))
            sentiment_label = analysis.sentiment if analysis else ("POSITIVE" if review.rating >= 4 else ("NEGATIVE" if review.rating <= 2 else "NEUTRAL"))

            for theme_name, keywords in THEME_KEYWORDS.items():
                matched = False
                for kw in keywords:
                    if re.search(r"\b" + re.escape(kw), text):
                        matched = True
                        break
                if matched:
                    theme_counts[theme_name] += 1
                    theme_sentiments[theme_name].append((sentiment_score, sentiment_label))

        results = []
        for theme_name, count in theme_counts.items():
            pct = round((count / total_reviews) * 100, 1)
            sentiments = theme_sentiments[theme_name]
            avg_score = sum(s[0] for s in sentiments) / len(sentiments) if sentiments else 0.0
            
            # Determine overall theme sentiment
            if avg_score >= 0.1:
                theme_type = "POSITIVE"
                sentiment_str = "POSITIVE"
            elif avg_score <= -0.1:
                theme_type = "NEGATIVE"
                sentiment_str = "NEGATIVE"
            else:
                theme_type = "GENERAL"
                sentiment_str = "NEUTRAL"

            results.append({
                "theme_name": theme_name,
                "theme_type": theme_type,
                "review_count": count,
                "percentage": pct,
                "sentiment": sentiment_str,
            })

        # Sort by review count descending
        results.sort(key=lambda x: x["review_count"], reverse=True)
        return results
