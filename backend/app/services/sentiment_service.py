from abc import ABC, abstractmethod
from typing import Dict, Any, List
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from backend.app.core.logging import logger
from backend.app.models.review import Review
from backend.app.repositories.review_repository import ReviewRepository


class SentimentAnalyzer(ABC):
    """Abstract Strategy interface for Sentiment Analysis."""

    @abstractmethod
    def analyze(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of text.
        
        Returns:
        {
            "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "sentiment_score": float (-1.0 to 1.0),
            "confidence": float (0.0 to 1.0)
        }
        """
        pass


class VaderSentimentAnalyzer(SentimentAnalyzer):
    """VADER sentiment analyzer implementation."""

    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()

    def analyze(self, text: str) -> Dict[str, Any]:
        if not text or not text.strip():
            return {
                "sentiment": "NEUTRAL",
                "sentiment_score": 0.0,
                "confidence": 0.5,
            }

        scores = self.analyzer.polarity_scores(text)
        compound = scores["compound"]

        # Classification thresholds
        if compound >= 0.05:
            sentiment = "POSITIVE"
            confidence = min(0.99, max(0.6, 0.5 + abs(compound) * 0.5))
        elif compound <= -0.05:
            sentiment = "NEGATIVE"
            confidence = min(0.99, max(0.6, 0.5 + abs(compound) * 0.5))
        else:
            sentiment = "NEUTRAL"
            confidence = min(0.95, max(0.5, 0.5 + (1.0 - abs(compound)) * 0.3))

        return {
            "sentiment": sentiment,
            "sentiment_score": round(compound, 3),
            "confidence": round(confidence, 3),
        }


class SentimentService:
    """Service for managing review sentiment analysis pipeline."""

    def __init__(self, review_repo: ReviewRepository, analyzer: SentimentAnalyzer = None):
        self.review_repo = review_repo
        self.analyzer = analyzer or VaderSentimentAnalyzer()

    def analyze_review_text(self, text: str) -> Dict[str, Any]:
        return self.analyzer.analyze(text)

    def analyze_pending_reviews(self, limit: int = 500) -> int:
        """Analyze all unanalyzed reviews in the database."""
        unanalyzed = self.review_repo.get_unanalyzed_reviews(limit=limit)
        analyzed_count = 0
        for review in unanalyzed:
            result = self.analyzer.analyze(review.review_text)
            self.review_repo.save_analysis(
                review_id=review.id,
                sentiment=result["sentiment"],
                sentiment_score=result["sentiment_score"],
                confidence=result["confidence"],
            )
            analyzed_count += 1
        logger.info(f"Sentiment analysis completed for {analyzed_count} reviews")
        return analyzed_count
