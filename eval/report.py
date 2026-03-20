"""Generate markdown comparison reports from judge results."""
from datetime import date

from eval.judge import CRITERIA


def compute_summary(section_results: list[dict]) -> dict:
    """Compute average scores per criterion across all sections."""
    summary = {}
    for key, name, _ in CRITERIA:
        scores_a = [r["scores"][key]["a"] for r in section_results if key in r.get("scores", {})]
        scores_b = [r["scores"][key]["b"] for r in section_results if key in r.get("scores", {})]
        summary[key] = {
            "name": name,
            "avg_a": sum(scores_a) / len(scores_a) if scores_a else 0,
            "avg_b": sum(scores_b) / len(scores_b) if scores_b else 0,
        }
    return summary


def format_winner(avg_a: float, avg_b: float, tolerance: float = 0.2) -> str:
    """Determine winner. Returns 'A', 'B', or '≈' for tie."""
    if abs(avg_a - avg_b) <= tolerance:
        return "≈"
    return "A" if avg_a > avg_b else "B"


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
    summary = compute_summary(section_results)

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
    for wave in ["wave0", "wave1", "wave2", "wave3"]:
        ta = stats_a.get("waves", {}).get(wave, {})
        tb = stats_b.get("waves", {}).get(wave, {})
        lines.append(
            f"| {wave} | {ta.get('input', 0):,}/{ta.get('output', 0):,} "
            f"| {tb.get('input', 0):,}/{tb.get('output', 0):,} |"
        )
    lines.append("")

    # Per-section breakdown
    lines.append("## Per-section breakdown")
    lines.append("")

    for result in section_results:
        idx = result.get("section_index", "?")
        title_a = result.get("title_a", "?")
        title_b = result.get("title_b", "?")
        title = title_a if title_a == title_b else f"{title_a} / {title_b}"
        lines.append(f"### Section {idx + 1}: {title}")
        lines.append("")
        lines.append("| Criterion | A | B | Notes |")
        lines.append("|-----------|---|---|-------|")
        for key, name, _ in CRITERIA:
            if key in result.get("scores", {}):
                s = result["scores"][key]
                lines.append(f"| {name} | {s['a']} | {s['b']} | {s.get('justification', '')[:80]} |")
        lines.append("")

    return "\n".join(lines)
