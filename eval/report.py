"""Generate markdown comparison reports from judge results."""
from datetime import date

from judge import CRITERIA


def format_winner(avg_a: float, avg_b: float, tolerance: float = 0.2) -> str:
    """Determine winner. Returns 'A', 'B', or '≈' for tie."""
    if abs(avg_a - avg_b) <= tolerance:
        return "≈"
    return "A" if avg_a > avg_b else "B"


def compute_summary(judge_results: dict) -> dict:
    """Extract summary from judge aggregates."""
    aggregates = judge_results.get("aggregates", {})
    summary = {}
    for key, name, _ in CRITERIA:
        agg = aggregates.get(key, {})
        summary[key] = {
            "name": name,
            "avg_a": agg.get("a_mean", 0),
            "avg_b": agg.get("b_mean", 0),
        }
    return summary


def generate_report(
    topic: str,
    judge_results: dict,
    stats_a: dict,
    stats_b: dict,
) -> str:
    """Generate a full markdown comparison report."""
    config_a = judge_results["config_a"]
    config_b = judge_results["config_b"]
    section_results = judge_results["section_results"]
    summary = compute_summary(judge_results)

    wins_a, wins_b, ties = 0, 0, 0
    for key in summary:
        w = format_winner(summary[key]["avg_a"], summary[key]["avg_b"])
        if w == "A":
            wins_a += 1
        elif w == "B":
            wins_b += 1
        else:
            ties += 1

    overall_a = sum(s["avg_a"] for s in summary.values()) / len(summary) if summary else 0
    overall_b = sum(s["avg_b"] for s in summary.values()) / len(summary) if summary else 0

    lines = [
        f"# Comparison: {config_a} vs {config_b}",
        f"**Topic:** {topic}",
        f"**Date:** {date.today().isoformat()}",
        "",
        "## Summary",
        "",
        f"| Criterion | A ({config_a}) | B ({config_b}) | Winner |",
        "|-----------|" + "-" * (len(config_a) + 5) + "|" + "-" * (len(config_b) + 5) + "|--------|",
    ]

    for key, name, _ in CRITERIA:
        s = summary[key]
        w = format_winner(s["avg_a"], s["avg_b"])
        lines.append(f"| {name} | {s['avg_a']:.1f} | {s['avg_b']:.1f} | {w} |")

    lines.append(f"| **Overall** | **{overall_a:.2f}** | **{overall_b:.2f}** | **{format_winner(overall_a, overall_b)}** |")
    lines.append("")

    overall_winner = format_winner(overall_a, overall_b)
    if overall_winner == "≈":
        lines.append(f"## Verdict: Tie ({wins_a} wins each, {ties} ties)")
    else:
        winner_name = config_a if overall_winner == "A" else config_b
        lines.append(f"## Verdict: {winner_name} wins {max(wins_a, wins_b)}-{min(wins_a, wins_b)} ({ties} ties)")

    lines.append("")

    # Token usage
    lines.append("## Token usage")
    lines.append("")
    lines.append("| Wave | A tokens (in/out) | B tokens (in/out) |")
    lines.append("|------|-------------------|-------------------|")
    for wave in ["wave_0", "wave_1", "wave_2"]:
        ta = stats_a.get(wave, {})
        tb = stats_b.get(wave, {})
        lines.append(
            f"| {wave} | {ta.get('input', 0):,}/{ta.get('output', 0):,} "
            f"| {tb.get('input', 0):,}/{tb.get('output', 0):,} |"
        )
    lines.append("")

    # Per-section breakdown
    lines.append("## Per-section breakdown")
    lines.append("")

    for i, result in enumerate(section_results):
        title_a = result.get("section_id_a", "?")
        title_b = result.get("section_id_b", "?")
        title = title_a if title_a == title_b else f"{title_a} / {title_b}"
        lines.append(f"### Section {i + 1}: {title}")
        lines.append("")
        lines.append("| Criterion | A | B | A notes | B notes |")
        lines.append("|-----------|---|---|---------|---------|")
        criteria = result.get("criteria", {})
        for key, name, _ in CRITERIA:
            if key in criteria:
                c = criteria[key]
                a_score = c.get("a_score", "?")
                b_score = c.get("b_score", "?")
                a_just = c.get("a_justification", "")[:60]
                b_just = c.get("b_justification", "")[:60]
                lines.append(f"| {name} | {a_score} | {b_score} | {a_just} | {b_just} |")
        lines.append("")

    return "\n".join(lines)
