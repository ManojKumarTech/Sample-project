from backend.app.services.theme_service import ThemeService
from backend.app.models.review import Review
from backend.app.models.review_analysis import ReviewAnalysis


def test_theme_extraction():
    theme_service = ThemeService()

    r1 = Review(
        id=1,
        rating=1,
        review_text="Login keeps failing with error 500 and password reset does not work.",
        analysis=ReviewAnalysis(id=1, review_id=1, sentiment="NEGATIVE", sentiment_score=-0.7, confidence=0.9),
    )
    r2 = Review(
        id=2,
        rating=1,
        review_text="App crashes every time I open the camera to record a video.",
        analysis=ReviewAnalysis(id=2, review_id=2, sentiment="NEGATIVE", sentiment_score=-0.6, confidence=0.85),
    )
    r3 = Review(
        id=3,
        rating=5,
        review_text="Sleek UI and beautiful dark mode theme. Really snappy navigation.",
        analysis=ReviewAnalysis(id=3, review_id=3, sentiment="POSITIVE", sentiment_score=0.8, confidence=0.95),
    )

    themes = theme_service.extract_themes([r1, r2, r3])
    theme_names = [t["theme_name"] for t in themes]

    assert "Login & Auth" in theme_names
    assert "Crashes & Stability" in theme_names
    assert "UI / UX Design" in theme_names
