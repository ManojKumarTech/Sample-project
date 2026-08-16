from typing import Dict, Any, List
from backend.app.collectors.factory import CollectorFactory
from backend.app.core.logging import logger
from backend.app.models.app import App
from backend.app.repositories.app_repository import AppRepository
from backend.app.repositories.review_repository import ReviewRepository
from backend.app.repositories.metric_repository import MetricRepository
from backend.app.services.sentiment_service import SentimentService
from backend.app.services.theme_service import ThemeService
from backend.app.utils.deduplication import deduplicate_reviews


class ReviewService:
    """
    Service Layer: Coordinates review harvesting, incremental synchronization,
    NLP sentiment scoring, and application-level metric aggregation.
    """

    def __init__(
        self,
        app_repo: AppRepository,
        review_repo: ReviewRepository,
        metric_repo: MetricRepository,
        sentiment_service: SentimentService,
        theme_service: ThemeService,
    ):
        """Inject all required repositories and domain services."""
        self.app_repo = app_repo
        self.review_repo = review_repo
        self.metric_repo = metric_repo
        self.sentiment_service = sentiment_service
        self.theme_service = theme_service

    async def sync_app_reviews(self, app_id: int, limit: int = 100) -> Dict[str, Any]:
        """
        Incremental Review Sync Pipeline:
        1. Identifies the app and appropriate store collector.
        2. Fetches raw review feeds from external store APIs.
        3. Sanitizes review text and formats external review identifiers.
        4. Diffs incoming IDs against existing MySQL database records.
        5. Bulk-inserts only new reviews (zero duplicate insertion).
        6. Runs NLP sentiment analysis on newly inserted reviews.
        7. Recalculates and persists updated metric snapshots and theme distributions.
        
        Args:
            app_id: Primary key of target application in MySQL.
            limit: Maximum count of reviews to fetch per sync.
        """
        app = self.app_repo.get_by_id(app_id)
        if not app:
            raise ValueError(f"App with ID {app_id} not found.")

        logger.info(f"Syncing reviews for '{app.name}' ({app.platform}, ID: {app.id})")
        collector = CollectorFactory.get_collector(app.platform)
        store_id = app.app_store_id if app.platform == "APPLE" else app.package_name

        if not store_id:
            store_id = app.name

        # 1. Fetch raw reviews from external store APIs
        raw_reviews = await collector.fetch_reviews(store_id, limit=limit)
        fetched_count = len(raw_reviews)
        logger.info(f"Fetched {fetched_count} raw reviews for app {app.id}")

        # 2. In-memory deduplication of the fetched review batch
        unique_incoming = deduplicate_reviews(raw_reviews)

        # 3. Incremental Diffing: Query database for existing review IDs to prevent duplicates
        incoming_ids = [r["external_review_id"] for r in unique_incoming if r.get("external_review_id")]
        existing_ids = self.review_repo.get_existing_external_ids(app.id, incoming_ids)

        new_reviews_data = []
        skipped_count = 0
        for r in unique_incoming:
            if r["external_review_id"] in existing_ids:
                skipped_count += 1
            else:
                new_reviews_data.append({
                    "app_id": app.id,
                    "external_review_id": r["external_review_id"],
                    "author_name": r.get("author_name"),
                    "rating": r.get("rating", 3),
                    "review_text": r.get("review_text", ""),
                    "review_date": r.get("review_date"),
                    "review_version": r.get("review_version"),
                    "language": r.get("language", "en"),
                })

        # 4. Insert new reviews into MySQL
        inserted_reviews = []
        if new_reviews_data:
            inserted_reviews = self.review_repo.bulk_create(new_reviews_data)
            logger.info(f"Inserted {len(inserted_reviews)} new reviews for app {app.id}")

        # 5. Execute VADER sentiment analysis on unanalyzed reviews in batch
        analyzed_count = self.sentiment_service.analyze_pending_reviews()

        # 6. Recalculate metrics and theme statistics for this app
        self.recalculate_app_metrics(app.id)

        return {
            "app_id": app.id,
            "name": app.name,
            "platform": app.platform,
            "reviews_fetched": fetched_count,
            "reviews_inserted": len(inserted_reviews),
            "reviews_skipped_duplicates": skipped_count,
            "analysis_completed": analyzed_count,
            "message": f"Successfully synchronized {len(inserted_reviews)} new reviews for {app.name}.",
        }

    def recalculate_app_metrics(self, app_id: int):
        """
        Aggregates review statistics (average rating, review volume, positive/neutral/negative counts,
        and compound sentiment score) and stores snapshots into app_metrics and app_themes.
        """
        reviews = self.review_repo.get_all_by_app(app_id)
        if not reviews:
            return

        total_count = len(reviews)
        avg_rating = round(sum(r.rating for r in reviews) / total_count, 2)

        pos_count = 0
        neu_count = 0
        neg_count = 0
        total_score = 0.0

        for r in reviews:
            if r.analysis:
                total_score += r.analysis.sentiment_score
                if r.analysis.sentiment == "POSITIVE":
                    pos_count += 1
                elif r.analysis.sentiment == "NEGATIVE":
                    neg_count += 1
                else:
                    neu_count += 1
            else:
                # Heuristic fallback if analysis is not yet present
                if r.rating >= 4:
                    pos_count += 1
                    total_score += 0.5
                elif r.rating <= 2:
                    neg_count += 1
                    total_score -= 0.5
                else:
                    neu_count += 1

        avg_sentiment = round(total_score / total_count, 3)

        # Persist metric snapshot into app_metrics table
        self.metric_repo.save_metric(
            app_id=app_id,
            period="all_time",
            review_count=total_count,
            average_rating=avg_rating,
            positive_count=pos_count,
            neutral_count=neu_count,
            negative_count=neg_count,
            sentiment_score=avg_sentiment,
        )

        # Categorize review themes and persist into app_themes table
        themes_data = self.theme_service.extract_themes(reviews)
        self.metric_repo.save_themes(app_id=app_id, themes_data=themes_data)
        logger.info(f"Updated metrics and themes for app ID {app_id}")
