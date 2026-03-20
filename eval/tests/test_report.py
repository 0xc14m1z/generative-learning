from report import compute_summary, format_winner


def test_compute_summary():
    judge_results = {
        "config_a": "all-sonnet",
        "config_b": "haiku-wave1",
        "aggregates": {
            "l1_clarity": {"a_mean": 4.0, "b_mean": 3.0},
            "l2_practicality": {"a_mean": 3.0, "b_mean": 4.0},
            "l3_depth": {"a_mean": 4.0, "b_mean": 4.0},
            "l4_analysis": {"a_mean": 5.0, "b_mean": 3.0},
            "viz_quality": {"a_mean": 3.0, "b_mean": 3.0},
            "concepts": {"a_mean": 4.0, "b_mean": 3.0},
            "references": {"a_mean": 4.0, "b_mean": 4.0},
        },
    }
    summary = compute_summary(judge_results)
    assert summary["l1_clarity"]["avg_a"] == 4.0
    assert summary["l1_clarity"]["avg_b"] == 3.0


def test_format_winner():
    assert format_winner(4.2, 3.8) == "A"
    assert format_winner(3.8, 4.2) == "B"
    assert format_winner(4.0, 3.9) == "≈"
    assert format_winner(4.0, 4.0) == "≈"
