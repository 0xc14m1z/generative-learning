"""
Wave-based content generation pipeline for eval runs.

Replicates the prompts from api/generator.py but decoupled from
database, SSE events, and the web API. Each function accepts a
model parameter and tracks token usage.
"""
import asyncio
import json
from pathlib import Path

from llm import call_llm_json

CORE_PATH = Path(__file__).parent.parent / "core"


# ─── Helpers ────────────────────────────────────────────────────

def read_schema_files() -> str:
    """Read Zod schemas as context for the LLM."""
    schemas = []
    for name in ["viz-types.ts", "structure.ts", "content.ts"]:
        path = CORE_PATH / "template" / "src" / "schemas" / name
        if path.exists():
            schemas.append(f"=== {name} ===\n{path.read_text()}")
    return "\n\n".join(schemas)


def read_catalog() -> str:
    path = CORE_PATH / "references" / "content-rendering-catalog.md"
    return path.read_text() if path.exists() else ""


def _merge_tokens(totals: dict, new: dict) -> dict:
    """Accumulate token counts."""
    return {
        "input": totals.get("input", 0) + new.get("input", 0),
        "output": totals.get("output", 0) + new.get("output", 0),
    }


# ─── Wave 0: Structure ─────────────────────────────────────────

async def wave_0(topic: str, work_dir: Path, model: str) -> tuple[dict, dict]:
    """Generate structure.json. Returns (structure, tokens)."""
    print(f"  [wave 0] Generating structure with {model}...")

    catalog = read_catalog()
    schemas = read_schema_files()

    system = """You are a learning experience architect. You create structure.json files for learning websites.
You must output ONLY valid JSON — no markdown, no explanation, no code fences. Just the raw JSON object."""

    prompt = f"""Create a structure.json for a learning website about: "{topic}"

Use 6-16 sections following the learning arc: orientation → prerequisites → core → advanced → ecosystem → synthesis. Not all phases are required — only orientation and synthesis are mandatory. Size the number of sections to the topic complexity.

For each section include an outline with core, keyPoints, L1_angle through L4_angle.
Choose vizType from: pipeline, flowchart, cycle, routing-diagram, stat-cards, bar-chart, utilization-bars, heatmap, xy-plot, composition-stack, comparison-cards, pros-cons, tabbed-view, quadrant, tiered-hierarchy, timeline, continuum-scale, concept-map, sankey-flow, token-stream, inline-svg.

Refer to this catalog for viz type selection:
{catalog}

The JSON must match this Zod schema (structure.ts):
{schemas}

Output the complete structure.json. ONLY valid JSON, nothing else."""

    structure, tokens = await call_llm_json(system, prompt, model)

    structure_path = work_dir / "structure.json"
    structure_path.write_text(json.dumps(structure, ensure_ascii=False, indent=2))

    section_count = len(structure.get("sections", []))
    print(f"  [wave 0] Structure complete: {section_count} sections")

    return structure, tokens


# ─── Wave 1: Level Content ──────────────────────────────────────

async def _wave_1_section(topic: str, structure: dict, section: dict, work_dir: Path, model: str) -> dict:
    """Generate all 4 levels for one section. Returns tokens used."""
    sid = section["id"]
    section_dir = work_dir / "sections" / sid
    section_dir.mkdir(parents=True, exist_ok=True)

    outline = section.get("outline", {})
    all_sections_list = "\n".join(
        f'{s["index"]}. {s["id"]} ({s["phase"]}) — {s["title"]}'
        for s in structure["sections"]
    )

    level_configs = [
        (1, "Intuition", "150-250", outline.get("L1_angle", ""), "ONLY <p>, <strong>, <em>, concept triggers. One insight callout. NO tables, citations, code."),
        (2, "Practitioner", "200-400", outline.get("L2_angle", ""), "<p>, <h3>, <strong>, <em>, <ul>, <ol>, <li>, citations required. Callout (tip or warning). Do-dont allowed. NO analogies."),
        (3, "Builder", "300-500", outline.get("L3_angle", ""), "<p>, <h3>, <h4>, <strong>, <em>, <code>, <table>, <ul>, <ol>. Citations required. Steps with time. Tables required. NO analogies."),
        (4, "Researcher", "300-600", outline.get("L4_angle", ""), "<p>, <h3>, <strong>, <em>, <code>, <ul>. Citations required. Named authors/papers with years. Quote callout. Key takeaway box. NO how-to."),
    ]

    system = "You write educational content as HTML for learning websites. Output ONLY valid JSON — no markdown fences, no explanation."

    section_tokens = {"input": 0, "output": 0}

    for level, label, word_range, angle, constraints in level_configs:
        prompt = f"""Write Level {level} ({label}) content for section "{section['title']}" in a learning explorer about "{topic}".

Section: {sid} — {section['title']} — {section['subtitle']}
Phase: {section['phase']}

Outline core: {outline.get('core', '')}
Key points: {json.dumps(outline.get('keyPoints', []))}
Your angle: {angle}

Concepts to reference: {json.dumps(section.get('concepts', []))}
All sections: {all_sections_list}

Word count: {word_range} words.
Constraints: {constraints}

Concept triggers format: <span class="concept-trigger" data-concept="CONCEPT_ID">visible term</span>
Citation format: <a class="citation" href="#ref-{sid}-N">[N]</a>

Output ONLY this JSON (no fences):
{{"sectionId": "{sid}", "level": {level}, "html": "<p>Your HTML content here...</p>"}}"""

        data, tokens = await call_llm_json(system, prompt, model)
        (section_dir / f"level-{level}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2))
        section_tokens = _merge_tokens(section_tokens, tokens)

    print(f"  [wave 1] Section {sid}: 4 levels complete")
    return section_tokens


async def wave_1(topic: str, structure: dict, work_dir: Path, model: str) -> dict:
    """Generate level content for all sections. Returns tokens used."""
    print(f"  [wave 1] Generating content for {len(structure['sections'])} sections with {model}...")

    sections = structure["sections"]
    batch_size = 4
    total_tokens = {"input": 0, "output": 0}

    for i in range(0, len(sections), batch_size):
        batch = sections[i:i + batch_size]
        results = await asyncio.gather(*[
            _wave_1_section(topic, structure, sec, work_dir, model)
            for sec in batch
        ])
        for t in results:
            total_tokens = _merge_tokens(total_tokens, t)

    print(f"  [wave 1] Content complete: {len(sections)} sections")
    return total_tokens


# ─── Wave 2: Enrichment ─────────────────────────────────────────

async def _wave_2_section(topic: str, structure: dict, section: dict, work_dir: Path, model: str) -> dict:
    """Generate enrichment for one section. Returns tokens used."""
    sid = section["id"]
    section_dir = work_dir / "sections" / sid

    # Read all levels
    levels_content = {}
    for lvl in [1, 2, 3, 4]:
        path = section_dir / f"level-{lvl}.json"
        if path.exists():
            levels_content[str(lvl)] = json.loads(path.read_text()).get("html", "")

    schemas = read_schema_files()

    system = "You create visualization data, concepts, deep dives, and references for learning explorer sections. Output ONLY valid JSON — no markdown fences."

    prompt = f"""Create enrichment data for section "{section['title']}" in a learning explorer about "{topic}".

Section ID: {sid}
vizType: {section['vizType']}
color: {section['color']}
Concepts to define: {json.dumps(section.get('concepts', []))}

Level content already written:
L1: {levels_content.get('1', '')[:500]}
L2: {levels_content.get('2', '')[:500]}
L3: {levels_content.get('3', '')[:500]}
L4: {levels_content.get('4', '')[:500]}

Viz data schemas (use the one matching vizType "{section['vizType']}"):
{schemas}

Output ONLY this JSON structure:
{{
  "sectionId": "{sid}",
  "visualization": {{ "type": "{section['vizType']}", "data": {{ ... }} }},
  "concepts": {{ "concept-id": {{ "title": "...", "body": "50-150 word explanation", "context": "...", "linkedSectionId": "other-id or null" }} }},
  "deepDives": [{{ "id": "dd-{sid}-1", "title": "Deep Dive: ...", "content": "<p>100-200 words HTML</p>" }}],
  "references": [{{ "id": 1, "text": "Author — Title (Year)", "url": "https://..." }}]
}}"""

    data, tokens = await call_llm_json(system, prompt, model)
    (section_dir / "enrichment.json").write_text(json.dumps(data, ensure_ascii=False, indent=2))

    print(f"  [wave 2] Section {sid}: enrichment complete")
    return tokens


async def wave_2(topic: str, structure: dict, work_dir: Path, model: str) -> dict:
    """Generate enrichment for all sections. Returns tokens used."""
    print(f"  [wave 2] Generating enrichment for {len(structure['sections'])} sections with {model}...")

    sections = structure["sections"]
    batch_size = 4
    total_tokens = {"input": 0, "output": 0}

    for i in range(0, len(sections), batch_size):
        batch = sections[i:i + batch_size]
        results = await asyncio.gather(*[
            _wave_2_section(topic, structure, sec, work_dir, model)
            for sec in batch
        ])
        for t in results:
            total_tokens = _merge_tokens(total_tokens, t)

    print(f"  [wave 2] Enrichment complete: {len(sections)} sections")
    return total_tokens


# ─── Wave 3: Merge ──────────────────────────────────────────────

async def wave_3(structure: dict, work_dir: Path) -> None:
    """Merge section files into content.json. Pure file merge, no LLM calls."""
    print("  [wave 3] Merging content...")

    sections = []
    for sec in structure["sections"]:
        sid = sec["id"]
        section_dir = work_dir / "sections" / sid

        levels = {}
        for lvl in [1, 2, 3, 4]:
            path = section_dir / f"level-{lvl}.json"
            if path.exists():
                levels[str(lvl)] = json.loads(path.read_text())["html"]
            else:
                levels[str(lvl)] = f"<p>Content for level {lvl} pending.</p>"

        enr_path = section_dir / "enrichment.json"
        if enr_path.exists():
            enr = json.loads(enr_path.read_text())
        else:
            enr = {
                "visualization": {"type": "stat-cards", "data": {"cards": []}},
                "concepts": {},
                "deepDives": [],
                "references": [],
            }

        sections.append({
            "id": sid,
            "levels": levels,
            "visualization": enr["visualization"],
            "concepts": enr.get("concepts", {}),
            "deepDives": enr.get("deepDives", []),
            "references": enr.get("references", []),
        })

    content = {"sections": sections}
    content_path = work_dir / "content.json"
    content_path.write_text(json.dumps(content, ensure_ascii=False, indent=2))

    total_words = sum(len(s["levels"][l].split()) for s in sections for l in ["1", "2", "3", "4"])
    total_concepts = sum(len(s["concepts"]) for s in sections)
    total_refs = sum(len(s["references"]) for s in sections)

    print(f"  [wave 3] Merge complete: {len(sections)} sections, {total_words} words, {total_concepts} concepts, {total_refs} refs")


# ─── Main Pipeline ───────────────────────────────────────────────

async def generate(topic: str, config: dict, work_dir: Path) -> dict:
    """Orchestrate all waves. Returns usage stats dict."""
    models = config["models"]
    print(f"Generating explorer for '{topic}' with models={models}")

    usage = {"wave_0": {}, "wave_1": {}, "wave_2": {}}

    # Wave 0: Structure
    structure, tokens_0 = await wave_0(topic, work_dir, models["wave0"])
    usage["wave_0"] = tokens_0

    # Wave 1: Level content
    tokens_1 = await wave_1(topic, structure, work_dir, models["wave1"])
    usage["wave_1"] = tokens_1

    # Wave 2: Enrichment
    tokens_2 = await wave_2(topic, structure, work_dir, models["wave2"])
    usage["wave_2"] = tokens_2

    # Wave 3: Merge (no LLM)
    await wave_3(structure, work_dir)

    # Totals
    usage["total"] = {
        "input": sum(usage[w].get("input", 0) for w in ["wave_0", "wave_1", "wave_2"]),
        "output": sum(usage[w].get("output", 0) for w in ["wave_0", "wave_1", "wave_2"]),
    }

    print(f"Generation complete. Tokens: {usage['total']}")
    return usage
