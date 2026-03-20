"""
Wave-based content generation pipeline using OpenRouter API.

Emits events to the database for SSE streaming to the frontend.
"""
import asyncio
import json
import os
import subprocess
import tempfile
from pathlib import Path

import logging
import time

from openai import AsyncOpenAI

from db import add_event, update_topic

log = logging.getLogger("generator")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
)

CORE_PATH = Path(__file__).parent.parent / "core"
SHELL_PATH = CORE_PATH / "prebuild" / "shell.html"
INJECT_SCRIPT = CORE_PATH / "prebuild" / "inject.py"
OUTPUTS_DIR = Path(__file__).parent / "outputs"
MODEL_OPUS = os.getenv("LLM_MODEL_OPUS", "anthropic/claude-opus-4")
MODEL_SONNET = os.getenv("LLM_MODEL_SONNET", "anthropic/claude-sonnet-4")
MODEL = MODEL_SONNET  # default for backward compat


def _get_client() -> AsyncOpenAI:
    return AsyncOpenAI(
        base_url=os.getenv("LLM_BASE_URL", "https://openrouter.ai/api/v1"),
        api_key=os.getenv("LLM_API_KEY", os.getenv("OPENROUTER_API_KEY", "")),
    )


async def emit(topic_id: str, wave: int | None, event_type: str, data: dict | None = None):
    await add_event(topic_id, wave, event_type, data)


async def call_llm(system: str, prompt: str, model: str = MODEL) -> str:
    client = _get_client()
    t0 = time.monotonic()
    response = await client.chat.completions.create(
        model=model,
        max_tokens=8192,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
    )
    elapsed = time.monotonic() - t0
    usage = response.usage
    tokens_in = usage.prompt_tokens if usage else 0
    tokens_out = usage.completion_tokens if usage else 0
    log.info(f"LLM call: model={model} tokens={tokens_in}/{tokens_out} time={elapsed:.1f}s")
    return response.choices[0].message.content or ""


def _extract_json(text: str) -> dict:
    """Extract the first valid JSON object from text."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines[1:] if l.strip() != "```"]
        text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    start = text.find("{")
    if start == -1:
        raise json.JSONDecodeError("No JSON object found", text, 0)
    decoder = json.JSONDecoder()
    obj, _ = decoder.raw_decode(text, start)
    return obj


async def call_llm_json(system: str, prompt: str, model: str = MODEL, max_retries: int = 3) -> dict:
    """Call LLM and parse JSON. Retries on malformed JSON."""
    last_error = None
    for attempt in range(max_retries):
        text = await call_llm(system, prompt, model)
        try:
            return _extract_json(text)
        except (json.JSONDecodeError, ValueError) as e:
            last_error = e
            if attempt < max_retries - 1:
                log.warning(f"JSON parse failed (attempt {attempt + 1}/{max_retries}): {e}")
    log.error(f"JSON parse failed after {max_retries} attempts")
    raise last_error


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


# ─── Wave 0: Structure ─────────────────────────────────────────

async def wave_0_structure(topic_id: str, topic: str, work_dir: Path) -> dict:
    log.info(f"Wave 0: starting structure for '{topic}'")
    await emit(topic_id, 0, "wave_started", {"wave": 0, "description": "Research & Structure"})

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

    log.info(f"Wave 0: using {MODEL_OPUS}")
    structure = await call_llm_json(system, prompt, model=MODEL_OPUS)

    structure_path = work_dir / "structure.json"
    structure_path.write_text(json.dumps(structure, ensure_ascii=False, indent=2))

    section_count = len(structure.get("sections", []))
    log.info(f"Wave 0: {section_count} sections")
    await emit(topic_id, 0, "structure_complete", {
        "sectionCount": section_count,
        "sections": [{"id": s["id"], "title": s["title"]} for s in structure["sections"]],
    })

    return structure


# ─── Wave 1: Level Content ──────────────────────────────────────

async def wave_1_section_levels(topic_id: str, topic: str, structure: dict, section: dict, work_dir: Path):
    """Generate all 4 levels for one section."""
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

        data = await call_llm_json(system, prompt)
        (section_dir / f"level-{level}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2))

        await emit(topic_id, 1, "level_complete", {"sectionId": sid, "level": level})


async def wave_1_content(topic_id: str, topic: str, structure: dict, work_dir: Path):
    await emit(topic_id, 1, "wave_started", {"wave": 1, "description": "Content Generation"})

    # Run all sections in parallel (batched to avoid rate limits)
    sections = structure["sections"]
    log.info(f"Wave 1: generating {len(sections)} sections × 4 levels")
    batch_size = 4
    for i in range(0, len(sections), batch_size):
        batch = sections[i:i + batch_size]
        await asyncio.gather(*[
            wave_1_section_levels(topic_id, topic, structure, sec, work_dir)
            for sec in batch
        ])

    log.info(f"Wave 1: complete")
    await emit(topic_id, 1, "wave_complete", {"sectionsCompleted": len(sections)})


# ─── Wave 2: Enrichment ─────────────────────────────────────────

async def wave_2_section_enrichment(topic_id: str, topic: str, structure: dict, section: dict, work_dir: Path):
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

    data = await call_llm_json(system, prompt)
    (section_dir / "enrichment.json").write_text(json.dumps(data, ensure_ascii=False, indent=2))

    await emit(topic_id, 2, "enrichment_complete", {
        "sectionId": sid,
        "vizType": section["vizType"],
    })


async def wave_2_enrichment(topic_id: str, topic: str, structure: dict, work_dir: Path):
    await emit(topic_id, 2, "wave_started", {"wave": 2, "description": "Enrichment"})

    sections = structure["sections"]
    log.info(f"Wave 2: enriching {len(sections)} sections")
    batch_size = 4
    for i in range(0, len(sections), batch_size):
        batch = sections[i:i + batch_size]
        await asyncio.gather(*[
            wave_2_section_enrichment(topic_id, topic, structure, sec, work_dir)
            for sec in batch
        ])

    log.info(f"Wave 2: complete")
    await emit(topic_id, 2, "wave_complete", {"sectionsCompleted": len(sections)})


# ─── Wave 3: Merge ──────────────────────────────────────────────

async def wave_3_merge(topic_id: str, structure: dict, work_dir: Path):
    await emit(topic_id, 3, "wave_started", {"wave": 3, "description": "Merge & Coherence"})

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

    log.info(f"Wave 3: merging {len(sections)} sections, {total_words} words")
    await emit(topic_id, 3, "coherence_complete", {
        "totalSections": len(sections),
        "totalWords": total_words,
        "totalConcepts": total_concepts,
        "totalRefs": total_refs,
    })


# ─── Wave 4: Inject ─────────────────────────────────────────────

async def wave_4_inject(topic_id: str, structure: dict, work_dir: Path) -> str:
    await emit(topic_id, 4, "wave_started", {"wave": 4, "description": "Building HTML"})

    slug = structure.get("topic", "explorer").lower().replace(" ", "-")[:40]
    output_filename = f"{topic_id}-{slug}.html"
    output_path = OUTPUTS_DIR / output_filename

    structure_path = work_dir / "structure.json"
    content_path = work_dir / "content.json"

    result = subprocess.run(
        ["python3", str(INJECT_SCRIPT), str(SHELL_PATH), str(structure_path), str(content_path), str(output_path)],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        raise RuntimeError(f"Injection failed: {result.stderr}")

    file_size = output_path.stat().st_size
    log.info(f"Wave 4: injected {file_size} bytes → {output_filename}")
    await emit(topic_id, 4, "inject_complete", {
        "outputPath": output_filename,
        "fileSize": file_size,
    })

    return output_filename


# ─── Main Pipeline ───────────────────────────────────────────────

async def generate_explorer(topic_id: str, topic: str, product: str = "topic-explorer"):
    """Run the full generation pipeline for a topic."""
    log.info(f"Pipeline started: '{topic}' (product={product})")
    work_dir = Path(tempfile.mkdtemp(prefix="explorer-"))

    try:
        await update_topic(topic_id, status="generating")
        await emit(topic_id, None, "generation_started", {"topic": topic, "product": product})

        # Wave 0
        structure = await wave_0_structure(topic_id, topic, work_dir)

        # Wave 1
        await wave_1_content(topic_id, topic, structure, work_dir)

        # Wave 2
        await wave_2_enrichment(topic_id, topic, structure, work_dir)

        # Wave 3
        await wave_3_merge(topic_id, structure, work_dir)

        # Wave 4
        output_filename = await wave_4_inject(topic_id, structure, work_dir)

        await update_topic(
            topic_id,
            status="completed",
            output_path=output_filename,
            completed_at=__import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        )
        log.info(f"Pipeline complete: {output_filename}")
        await emit(topic_id, None, "generation_complete", {"outputPath": output_filename})

    except Exception as e:
        log.exception(f"Pipeline failed: {e}")
        await update_topic(topic_id, status="failed", error=str(e))
        await emit(topic_id, None, "error", {"message": str(e)})
        raise
