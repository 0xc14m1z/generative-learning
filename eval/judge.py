"""
LLM-as-judge for pairwise section comparison.

Uses Opus to evaluate two generated learning explorers side-by-side,
scoring each section across 7 quality criteria.
"""
import asyncio
import json
from pathlib import Path

from llm import call_llm_json


# ─── Evaluation Criteria ────────────────────────────────────────

CRITERIA: list[tuple[str, str, str]] = [
    ("l1_clarity", "L1 Clarity",
     "How clear and accessible is the Level 1 (Intuition) content? Does it use plain language, effective analogies, and build genuine understanding?"),
    ("l2_practicality", "L2 Practicality",
     "How practical and actionable is the Level 2 (Practitioner) content? Does it provide useful guidance, tips, and real-world applicability?"),
    ("l3_depth", "L3 Technical Depth",
     "How thorough and technically accurate is the Level 3 (Builder) content? Does it include implementation details, tables, and concrete steps?"),
    ("l4_analysis", "L4 Research Quality",
     "How well does the Level 4 (Researcher) content cite real papers, present nuanced analysis, and engage with the academic landscape?"),
    ("viz_quality", "Visualization Quality",
     "How appropriate is the chosen visualization type? Is the viz data well-structured, meaningful, and does it genuinely aid understanding?"),
    ("concepts", "Concept Definitions",
     "Are concept definitions accurate, well-scoped, and useful? Do they link to relevant sections and provide helpful context?"),
    ("references", "References & Citations",
     "Are references real, relevant, and properly formatted? Do citations in the text match the reference list?"),
]


# ─── Section-level Judging ──────────────────────────────────────

async def judge_section_pair(
    section_a: dict,
    section_b: dict,
    structure_a_section: dict,
    structure_b_section: dict,
    config_a_name: str,
    config_b_name: str,
) -> dict:
    """Compare two sections and score each on the 7 criteria.

    Returns a dict with per-criterion scores and justifications for both A and B.
    """
    criteria_block = "\n".join(
        f"- **{display}** (`{key}`): {desc}"
        for key, display, desc in CRITERIA
    )

    criteria_keys = [c[0] for c in CRITERIA]

    system = """You are an expert educational content evaluator. You compare two versions of a learning section and score each on multiple criteria.
You must output ONLY valid JSON — no markdown, no explanation, no code fences. Just the raw JSON object."""

    prompt = f"""Compare these two versions of a learning section and score each on quality criteria.

## Section Title
A ({config_a_name}): {structure_a_section.get('title', 'Unknown')}
B ({config_b_name}): {structure_b_section.get('title', 'Unknown')}

## Version A — {config_a_name}
Structure: {json.dumps(structure_a_section, indent=2)[:1000]}

L1: {section_a.get('levels', {}).get('1', '')[:600]}
L2: {section_a.get('levels', {}).get('2', '')[:600]}
L3: {section_a.get('levels', {}).get('3', '')[:600]}
L4: {section_a.get('levels', {}).get('4', '')[:600]}

Visualization: {json.dumps(section_a.get('visualization', {}))[:500]}
Concepts: {json.dumps(section_a.get('concepts', {}))[:500]}
References: {json.dumps(section_a.get('references', []))[:500]}

## Version B — {config_b_name}
Structure: {json.dumps(structure_b_section, indent=2)[:1000]}

L1: {section_b.get('levels', {}).get('1', '')[:600]}
L2: {section_b.get('levels', {}).get('2', '')[:600]}
L3: {section_b.get('levels', {}).get('3', '')[:600]}
L4: {section_b.get('levels', {}).get('4', '')[:600]}

Visualization: {json.dumps(section_b.get('visualization', {}))[:500]}
Concepts: {json.dumps(section_b.get('concepts', {}))[:500]}
References: {json.dumps(section_b.get('references', []))[:500]}

## Criteria
{criteria_block}

## Instructions
Score each version (A and B) on each criterion from 1 (poor) to 5 (excellent).
Provide a brief justification for each score.

Output ONLY this JSON:
{{
  "section_id_a": "{section_a.get('id', '')}",
  "section_id_b": "{section_b.get('id', '')}",
  "criteria": {{
    "{criteria_keys[0]}": {{
      "a_score": 1-5,
      "b_score": 1-5,
      "a_justification": "...",
      "b_justification": "..."
    }},
    ... (repeat for all 7 criteria)
  }}
}}"""

    result, _tokens = await call_llm_json(system, prompt, model="opus")
    return result


# ─── Full Evaluation ────────────────────────────────────────────

async def judge(
    run_a_path: Path,
    run_b_path: Path,
    config_a_name: str,
    config_b_name: str,
) -> dict:
    """Compare two full runs section-by-section.

    Reads content.json and structure.json from both run directories,
    compares sections by index, and returns full evaluation results.
    """
    # Load data from both runs
    content_a = json.loads((run_a_path / "content.json").read_text())
    content_b = json.loads((run_b_path / "content.json").read_text())
    structure_a = json.loads((run_a_path / "structure.json").read_text())
    structure_b = json.loads((run_b_path / "structure.json").read_text())

    sections_a = content_a["sections"]
    sections_b = content_b["sections"]
    struct_sections_a = structure_a["sections"]
    struct_sections_b = structure_b["sections"]

    num_sections = min(len(sections_a), len(sections_b))
    print(f"Judging {num_sections} section pairs ({config_a_name} vs {config_b_name})...")

    # Compare sections by index
    section_results = []
    for i in range(num_sections):
        print(f"  Judging section {i + 1}/{num_sections}...")
        result = await judge_section_pair(
            section_a=sections_a[i],
            section_b=sections_b[i],
            structure_a_section=struct_sections_a[i],
            structure_b_section=struct_sections_b[i],
            config_a_name=config_a_name,
            config_b_name=config_b_name,
        )
        section_results.append(result)

    # Compute aggregate scores
    criteria_keys = [c[0] for c in CRITERIA]
    aggregates = {}
    for key in criteria_keys:
        a_scores = []
        b_scores = []
        for sr in section_results:
            criterion = sr.get("criteria", {}).get(key, {})
            if isinstance(criterion.get("a_score"), (int, float)):
                a_scores.append(criterion["a_score"])
            if isinstance(criterion.get("b_score"), (int, float)):
                b_scores.append(criterion["b_score"])
        aggregates[key] = {
            "a_mean": sum(a_scores) / len(a_scores) if a_scores else 0,
            "b_mean": sum(b_scores) / len(b_scores) if b_scores else 0,
            "a_scores": a_scores,
            "b_scores": b_scores,
        }

    evaluation = {
        "config_a": config_a_name,
        "config_b": config_b_name,
        "num_sections": num_sections,
        "section_results": section_results,
        "aggregates": aggregates,
    }

    print(f"Judging complete. Aggregates:")
    for key in criteria_keys:
        agg = aggregates[key]
        print(f"  {key}: A={agg['a_mean']:.2f}  B={agg['b_mean']:.2f}")

    return evaluation
