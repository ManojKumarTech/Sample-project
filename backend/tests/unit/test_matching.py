from backend.app.utils.normalization import calculate_match_confidence


def test_confidence_matching():
    # Exact / normalized match
    assert calculate_match_confidence("Meta", "Meta Platforms, Inc.") == "HIGH"
    assert calculate_match_confidence("Google", "Google LLC") == "HIGH"
    assert calculate_match_confidence("Spotify", "Spotify AB") == "HIGH"

    # Known alias match
    assert calculate_match_confidence("Meta", "Instagram, Inc.") == "HIGH"
    assert calculate_match_confidence("Meta", "WhatsApp LLC") == "HIGH"

    # Word overlap match
    assert calculate_match_confidence("Uber Technologies", "Uber") == "HIGH"

    # Unrelated match
    assert calculate_match_confidence("Meta", "Random Developer LLC") == "LOW"
