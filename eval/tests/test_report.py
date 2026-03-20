from report import compute_summary, format_winner


def test_compute_summary():
    section_results = [
        {
            "scores": {
                "l1_clarity": {"a": 4, "b": 3, "justification": "A is better"},
                "l2_practicality": {"a": 3, "b": 4, "justification": "B is better"},
                "l3_depth": {"a": 4, "b": 4, "justification": "Tie"},
                "l4_analysis": {"a": 5, "b": 3, "justification": "A is much better"},
                "viz_quality": {"a": 3, "b": 3, "justification": "Tie"},
                "concepts": {"a": 4, "b": 3, "justification": "A is better"},
                "references": {"a": 4, "b": 4, "justification": "Tie"},
            }
        }
    ]
    summary = compute_summary(section_results)
    assert summary["l1_clarity"]["avg_a"] == 4.0
    assert summary["l1_clarity"]["avg_b"] == 3.0


def test_format_winner():
    assert format_winner(4.2, 3.8) == "A"
    assert format_winner(3.8, 4.2) == "B"
    assert format_winner(4.0, 3.9) == "≈"
    assert format_winner(4.0, 4.0) == "≈"
