from backend.app.services.sentiment_service import VaderSentimentAnalyzer


def test_vader_sentiment_analyzer():
    analyzer = VaderSentimentAnalyzer()

    pos_result = analyzer.analyze("This app is amazing! Super fast and reliable, I love the new interface.")
    assert pos_result["sentiment"] == "POSITIVE"
    assert pos_result["sentiment_score"] > 0.05
    assert pos_result["confidence"] > 0.5

    neg_result = analyzer.analyze("App constantly crashes on startup. Terrible update, worst experience ever.")
    assert neg_result["sentiment"] == "NEGATIVE"
    assert neg_result["sentiment_score"] < -0.05
    assert neg_result["confidence"] > 0.5

    neutral_result = analyzer.analyze("The app was updated on Tuesday.")
    assert neutral_result["sentiment"] in ["NEUTRAL", "POSITIVE"]
