# Model Comparison Eval — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** CLI tool that generates the same topic with different model configs and produces a quality comparison report via LLM-as-judge.

**Architecture:** `eval/` directory with its own generation pipeline (reuses prompts from `api/generator.py` but decoupled from DB/SSE), YAML config for model routing, Opus-based judge, markdown report output.

**Tech Stack:** Python 3.12+, asyncio, openai SDK (via OpenRouter), PyYAML, argparse

**Spec:** `docs/superpowers/specs/2026-03-20-model-comparison-eval-design.md`

---

## File Structure

```
eval/
├── __init__.py
├── compare.py      # CLI entry point (argparse, orchestration)
├── config.py       # Load and validate YAML configs
├── generate.py     # Wave pipeline (decoupled from API, accepts model per wave)
├── judge.py        # LLM-as-judge evaluation logic
├── report.py       # Generate markdown comparison report
├── llm.py          # OpenRouter client with model parameter
├── configs/        # Model configuration YAML files
│   ├── all-sonnet.yaml
│   ├── haiku-wave1.yaml
│   ├── opus-premium.yaml
│   ├── opus-haiku-mix.yaml
│   └── budget.yaml
├── results/        # Generated reports (gitignored)
└── tests/
    ├── __init__.py
    ├── test_config.py
    └── test_report.py
```

---

### Task 1: Project setup

Create the eval directory structure, dependencies, and gitignore entry.

**Files:**
- Create: `eval/__init__.py`
- Create: `eval/tests/__init__.py`
- Create: `eval/configs/` (directory)
- Create: `eval/results/` (directory)
- Modify: `.gitignore`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p eval/configs eval/results eval/tests
touch eval/__init__.py eval/tests/__init__.py
```

- [ ] **Step 2: Add gitignore entry for results**

Add to `.gitignore`:
```
eval/results/
```

- [ ] **Step 3: Commit**

```bash
git add eval/__init__.py eval/tests/__init__.py .gitignore
git commit -m "chore: scaffold eval/ directory structure"
```

---

### Task 2: Model configs

Create YAML config files and the loader.

**Files:**
- Create: `eval/configs/all-sonnet.yaml`
- Create: `eval/configs/haiku-wave1.yaml`
- Create: `eval/configs/opus-premium.yaml`
- Create: `eval/configs/opus-haiku-mix.yaml`
- Create: `eval/configs/budget.yaml`
- Create: `eval/tests/test_config.py`
- Create: `eval/config.py`

- [ ] **Step 1: Create all config YAML files**

`eval/configs/all-sonnet.yaml`:
```yaml
name: all-sonnet
description: Baseline — Sonnet for all waves
models:
  wave0: sonnet
  wave1: sonnet
  wave2: sonnet
  wave3: sonnet
```

`eval/configs/haiku-wave1.yaml`:
```yaml
name: haiku-wave1
description: Haiku for constrained Wave 1 writing, Sonnet for everything else
models:
  wave0: sonnet
  wave1: haiku
  wave2: sonnet
  wave3: sonnet
```

`eval/configs/opus-premium.yaml`:
```yaml
name: opus-premium
description: Opus for structure (Wave 0), Sonnet for execution
models:
  wave0: opus
  wave1: sonnet
  wave2: sonnet
  wave3: sonnet
```

`eval/configs/opus-haiku-mix.yaml`:
```yaml
name: opus-haiku-mix
description: Opus judgment + Haiku speed — best of both
models:
  wave0: opus
  wave1: haiku
  wave2: sonnet
  wave3: sonnet
```

`eval/configs/budget.yaml`:
```yaml
name: budget
description: Minimum cost — Haiku where possible
models:
  wave0: sonnet
  wave1: haiku
  wave2: haiku
  wave3: sonnet
```

- [ ] **Step 2: Write test for config loading**

`eval/tests/test_config.py`:
```python
import pytest
from pathlib import Path

from eval.config import load_config, ConfigError

CONFIGS_DIR = Path(__file__).parent.parent / "configs"


def test_load_valid_config():
    cfg = load_config("all-sonnet", CONFIGS_DIR)
    assert cfg["name"] == "all-sonnet"
    assert cfg["models"]["wave0"] == "sonnet"
    assert cfg["models"]["wave1"] == "sonnet"
    assert cfg["models"]["wave2"] == "sonnet"
    assert cfg["models"]["wave3"] == "sonnet"


def test_load_missing_config():
    with pytest.raises(ConfigError, match="not found"):
        load_config("nonexistent", CONFIGS_DIR)


def test_all_configs_valid():
    """Every YAML file in configs/ must load successfully."""
    for path in CONFIGS_DIR.glob("*.yaml"):
        cfg = load_config(path.stem, CONFIGS_DIR)
        assert "name" in cfg
        assert "models" in cfg
        for wave in ["wave0", "wave1", "wave2", "wave3"]:
            assert wave in cfg["models"], f"{path.name} missing {wave}"
            assert cfg["models"][wave] in ("opus", "sonnet", "haiku"), \
                f"{path.name} has invalid model for {wave}: {cfg['models'][wave]}"
```

- [ ] **Step 3: Run test to verify it fails**

```bash
cd eval && python -m pytest tests/test_config.py -v
```

Expected: FAIL — `eval.config` module does not exist yet.

- [ ] **Step 4: Write config.py**

`eval/config.py`:
```python
"""Load and validate model configuration YAML files."""
import yaml
from pathlib import Path


class ConfigError(Exception):
    pass


VALID_MODELS = {"opus", "sonnet", "haiku"}
REQUIRED_WAVES = {"wave0", "wave1", "wave2", "wave3"}


def load_config(name: str, configs_dir: Path) -> dict:
    """Load a model config by name from the configs directory."""
    path = configs_dir / f"{name}.yaml"
    if not path.exists():
        raise ConfigError(f"Config '{name}' not found at {path}")

    with open(path) as f:
        cfg = yaml.safe_load(f)

    if not isinstance(cfg, dict) or "name" not in cfg or "models" not in cfg:
        raise ConfigError(f"Config '{name}' must have 'name' and 'models' keys")

    models = cfg["models"]
    for wave in REQUIRED_WAVES:
        if wave not in models:
            raise ConfigError(f"Config '{name}' missing '{wave}' in models")
        if models[wave] not in VALID_MODELS:
            raise ConfigError(f"Config '{name}' has invalid model '{models[wave]}' for {wave}")

    return cfg
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd eval && python -m pytest tests/test_config.py -v
```

Expected: all 3 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add eval/configs/ eval/config.py eval/tests/test_config.py
git commit -m "feat(eval): add model config loading with YAML files"
```

---

### Task 3: LLM client with model parameter

Create a standalone LLM client that accepts a model name per call.

**Files:**
- Create: `eval/llm.py`

- [ ] **Step 1: Write llm.py**

`eval/llm.py`:
```python
"""OpenRouter LLM client with per-call model selection."""
import json
import os

from openai import AsyncOpenAI


# Map short names to OpenRouter model IDs
MODEL_MAP = {
    "opus": "anthropic/claude-opus-4",
    "sonnet": "anthropic/claude-sonnet-4",
    "haiku": "anthropic/claude-haiku-4",
}


def _get_client() -> AsyncOpenAI:
    return AsyncOpenAI(
        base_url=os.getenv("LLM_BASE_URL", "https://openrouter.ai/api/v1"),
        api_key=os.getenv("LLM_API_KEY", os.getenv("OPENROUTER_API_KEY", "")),
    )


async def call_llm(system: str, prompt: str, model: str = "sonnet") -> str:
    """Call LLM with a specific model. Returns raw text response."""
    client = _get_client()
    model_id = MODEL_MAP.get(model, model)
    response = await client.chat.completions.create(
        model=model_id,
        max_tokens=8192,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
    )
    usage = response.usage
    tokens = {
        "input": usage.prompt_tokens if usage else 0,
        "output": usage.completion_tokens if usage else 0,
    }
    return response.choices[0].message.content or "", tokens


async def call_llm_json(system: str, prompt: str, model: str = "sonnet") -> tuple[dict, dict]:
    """Call LLM and parse JSON from response. Returns (parsed_json, token_usage)."""
    text, tokens = await call_llm(system, prompt, model)
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines[1:] if l.strip() != "```"]
        text = "\n".join(lines)
    return json.loads(text), tokens
```

Note: `call_llm` returns a tuple `(text, tokens)` — this enables cost tracking later.

- [ ] **Step 2: Commit**

```bash
git add eval/llm.py
git commit -m "feat(eval): add LLM client with per-call model selection and token tracking"
```

---

### Task 4: Generation pipeline

Reimplement wave orchestration without DB/SSE dependencies, using the per-model LLM client.

**Files:**
- Create: `eval/generate.py`

- [ ] **Step 1: Write generate.py**

`eval/generate.py`:
```python
"""Wave-based generation pipeline for eval — decoupled from API/DB."""
import asyncio
import json
from pathlib import Path

from eval.llm import call_llm_json

# Reuse schema/catalog reading from core
CORE_PATH = Path(__file__).parent.parent / "core"


def read_schema_files() -> str:
    schemas = []
    for name in ["viz-types.ts", "structure.ts", "content.ts"]:
        path = CORE_PATH / "template" / "src" / "schemas" / name
        if path.exists():
            schemas.append(f"=== {name} ===\n{path.read_text()}")
    return "\n\n".join(schemas)


def read_catalog() -> str:
    path = CORE_PATH / "references" / "content-rendering-catalog.md"
    return path.read_text() if path.exists() else ""


async def wave_0(topic: str, work_dir: Path, model: str) -> tuple[dict, dict]:
    """Generate structure.json. Returns (structure, token_usage)."""
    catalog = read_catalog()
    schemas = read_schema_files()

    system = (
        "You are a learning experience architect. You create structure.json files "
        "for learning websites.\nYou must output ONLY valid JSON — no markdown, "
        "no explanation, no code fences. Just the raw JSON object."
    )
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
    (work_dir / "structure.json").write_text(json.dumps(structure, ensure_ascii=False, indent=2))
    print(f"  Wave 0: {len(structure.get('sections', []))} sections ({model})")
    return structure, tokens


async def _wave_1_section(topic: str, structure: dict, section: dict, work_dir: Path, model: str) -> dict:
    """Generate all 4 levels for one section. Returns aggregated token usage."""
    sid = section["id"]
    section_dir = work_dir / "sections" / sid
    section_dir.mkdir(parents=True, exist_ok=True)

    outline = section.get("outline", {})
    all_sections_list = "\n".join(
        f'{s["index"]}. {s["id"]} ({s["phase"]}) — {s["title"]}'
        for s in structure["sections"]
    )

    level_configs = [
        (1, "Intuition", "150-250", outline.get("L1_angle", ""),
         "ONLY <p>, <strong>, <em>, concept triggers. One insight callout. NO tables, citations, code."),
        (2, "Practitioner", "200-400", outline.get("L2_angle", ""),
         "<p>, <h3>, <strong>, <em>, <ul>, <ol>, <li>, citations required. Callout (tip or warning). Do-dont allowed. NO analogies."),
        (3, "Builder", "300-500", outline.get("L3_angle", ""),
         "<p>, <h3>, <h4>, <strong>, <em>, <code>, <table>, <ul>, <ol>. Citations required. Steps with time. Tables required. NO analogies."),
        (4, "Researcher", "300-600", outline.get("L4_angle", ""),
         "<p>, <h3>, <strong>, <em>, <code>, <ul>. Citations required. Named authors/papers with years. Quote callout. Key takeaway box. NO how-to."),
    ]

    system = "You write educational content as HTML for learning websites. Output ONLY valid JSON — no markdown fences, no explanation."
    total_tokens = {"input": 0, "output": 0}

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
        total_tokens["input"] += tokens["input"]
        total_tokens["output"] += tokens["output"]

    return total_tokens


async def wave_1(topic: str, structure: dict, work_dir: Path, model: str) -> dict:
    """Generate all level content. Returns aggregated token usage."""
    sections = structure["sections"]
    total_tokens = {"input": 0, "output": 0}

    batch_size = 4
    for i in range(0, len(sections), batch_size):
        batch = sections[i:i + batch_size]
        results = await asyncio.gather(*[
            _wave_1_section(topic, structure, sec, work_dir, model)
            for sec in batch
        ])
        for t in results:
            total_tokens["input"] += t["input"]
            total_tokens["output"] += t["output"]

    print(f"  Wave 1: {len(sections)} sections × 4 levels ({model})")
    return total_tokens


async def _wave_2_section(topic: str, structure: dict, section: dict, work_dir: Path, model: str) -> dict:
    """Generate enrichment for one section. Returns token usage."""
    sid = section["id"]
    section_dir = work_dir / "sections" / sid

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
    return tokens


async def wave_2(topic: str, structure: dict, work_dir: Path, model: str) -> dict:
    """Generate all enrichment data. Returns aggregated token usage."""
    sections = structure["sections"]
    total_tokens = {"input": 0, "output": 0}

    batch_size = 4
    for i in range(0, len(sections), batch_size):
        batch = sections[i:i + batch_size]
        results = await asyncio.gather(*[
            _wave_2_section(topic, structure, sec, work_dir, model)
            for sec in batch
        ])
        for t in results:
            total_tokens["input"] += t["input"]
            total_tokens["output"] += t["output"]

    print(f"  Wave 2: {len(sections)} sections ({model})")
    return total_tokens


def wave_3(structure: dict, work_dir: Path) -> None:
    """Merge all section files into content.json. Pure file I/O, no LLM."""
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
    (work_dir / "content.json").write_text(json.dumps(content, ensure_ascii=False, indent=2))
    print(f"  Wave 3: merged {len(sections)} sections")


async def generate(topic: str, config: dict, work_dir: Path) -> dict:
    """Run full generation pipeline. Returns usage stats per wave."""
    models = config["models"]
    stats = {"config": config["name"], "waves": {}}

    stats["waves"]["wave0"] = (await wave_0(topic, work_dir, models["wave0"]))[1]
    structure = json.loads((work_dir / "structure.json").read_text())

    stats["waves"]["wave1"] = await wave_1(topic, structure, work_dir, models["wave1"])
    stats["waves"]["wave2"] = await wave_2(topic, structure, work_dir, models["wave2"])

    wave_3(structure, work_dir)
    stats["waves"]["wave3"] = {"input": 0, "output": 0}  # no LLM calls

    stats["section_count"] = len(structure.get("sections", []))
    return stats
```

- [ ] **Step 2: Commit**

```bash
git add eval/generate.py
git commit -m "feat(eval): add generation pipeline decoupled from API"
```

---

### Task 5: LLM-as-judge

Implement the judge that evaluates and compares two content.json outputs.

**Files:**
- Create: `eval/judge.py`

- [ ] **Step 1: Write judge.py**

`eval/judge.py`:
```python
"""LLM-as-judge for comparing two generated outputs."""
import json
from pathlib import Path

from eval.llm import call_llm_json

CRITERIA = [
    ("l1_clarity", "L1 Clarity", "Is the Level 1 analogy clear? Would a non-expert understand the concept?"),
    ("l2_practicality", "L2 Practicality", "Are there concrete steps? Are trade-offs explicitly stated?"),
    ("l3_depth", "L3 Depth", "Are there specific technical details — numbers, equations, code, tables?"),
    ("l4_analysis", "L4 Analysis", "Are real papers/works cited? Is there genuine critical analysis?"),
    ("viz_quality", "Viz Quality", "Is the visualization data coherent with the content and structurally valid?"),
    ("concepts", "Concepts", "Are concept definitions accurate, useful, and well-linked to sections?"),
    ("references", "References", "Are citations real, verifiable, and properly formatted?"),
]


async def judge_section_pair(
    section_a: dict,
    section_b: dict,
    structure_a_section: dict,
    structure_b_section: dict,
    config_a_name: str,
    config_b_name: str,
) -> dict:
    """Judge one section from each config. Returns scores and justifications."""
    criteria_text = "\n".join(
        f"- **{name}**: {desc} (score 1-5)"
        for _, name, desc in CRITERIA
    )

    system = (
        "You are an expert evaluator of educational content. You compare two versions "
        "of the same learning section and score each on specific quality criteria. "
        "Be rigorous and specific in your justifications. Output ONLY valid JSON."
    )

    prompt = f"""Compare these two versions of a learning section and score each on the criteria below.

## Config A: {config_a_name}
**Section:** {structure_a_section.get('title', 'Unknown')}
**Outline:** {json.dumps(structure_a_section.get('outline', {}), indent=2)[:500]}

Level 1: {section_a['levels'].get('1', '')[:400]}
Level 2: {section_a['levels'].get('2', '')[:400]}
Level 3: {section_a['levels'].get('3', '')[:400]}
Level 4: {section_a['levels'].get('4', '')[:400]}

Visualization: {json.dumps(section_a.get('visualization', {}))[:300]}
Concepts: {json.dumps(section_a.get('concepts', {}))[:300]}
References: {json.dumps(section_a.get('references', []))[:300]}

## Config B: {config_b_name}
**Section:** {structure_b_section.get('title', 'Unknown')}
**Outline:** {json.dumps(structure_b_section.get('outline', {}), indent=2)[:500]}

Level 1: {section_b['levels'].get('1', '')[:400]}
Level 2: {section_b['levels'].get('2', '')[:400]}
Level 3: {section_b['levels'].get('3', '')[:400]}
Level 4: {section_b['levels'].get('4', '')[:400]}

Visualization: {json.dumps(section_b.get('visualization', {}))[:300]}
Concepts: {json.dumps(section_b.get('concepts', {}))[:300]}
References: {json.dumps(section_b.get('references', []))[:300]}

## Criteria
{criteria_text}

## Output format
Output ONLY this JSON:
{{
  "scores": {{
    "l1_clarity": {{"a": <1-5>, "b": <1-5>, "justification": "..."}},
    "l2_practicality": {{"a": <1-5>, "b": <1-5>, "justification": "..."}},
    "l3_depth": {{"a": <1-5>, "b": <1-5>, "justification": "..."}},
    "l4_analysis": {{"a": <1-5>, "b": <1-5>, "justification": "..."}},
    "viz_quality": {{"a": <1-5>, "b": <1-5>, "justification": "..."}},
    "concepts": {{"a": <1-5>, "b": <1-5>, "justification": "..."}},
    "references": {{"a": <1-5>, "b": <1-5>, "justification": "..."}}
  }}
}}"""

    result, _ = await call_llm_json(system, prompt, "opus")
    return result


async def judge(
    run_a: Path,
    run_b: Path,
    config_a_name: str,
    config_b_name: str,
) -> dict:
    """Compare two complete runs. Returns full evaluation results."""
    content_a = json.loads((run_a / "content.json").read_text())
    content_b = json.loads((run_b / "content.json").read_text())
    structure_a = json.loads((run_a / "structure.json").read_text())
    structure_b = json.loads((run_b / "structure.json").read_text())

    # Build section lookup by index (not ID — different configs may produce different IDs)
    sections_a = content_a["sections"]
    sections_b = content_b["sections"]
    struct_sections_a = structure_a["sections"]
    struct_sections_b = structure_b["sections"]

    # Compare min(len_a, len_b) sections by index
    n = min(len(sections_a), len(sections_b))
    results = []

    print(f"Judging {n} section pairs...")
    for i in range(n):
        print(f"  Section {i+1}/{n}: {struct_sections_a[i].get('title', '?')} vs {struct_sections_b[i].get('title', '?')}")
        result = await judge_section_pair(
            sections_a[i], sections_b[i],
            struct_sections_a[i], struct_sections_b[i],
            config_a_name, config_b_name,
        )
        result["section_index"] = i
        result["title_a"] = struct_sections_a[i].get("title", "?")
        result["title_b"] = struct_sections_b[i].get("title", "?")
        results.append(result)

    return {
        "config_a": config_a_name,
        "config_b": config_b_name,
        "sections_compared": n,
        "sections_a_total": len(sections_a),
        "sections_b_total": len(sections_b),
        "section_results": results,
    }
```

- [ ] **Step 2: Commit**

```bash
git add eval/judge.py
git commit -m "feat(eval): add LLM-as-judge for pairwise comparison"
```

---

### Task 6: Report generation

Generate a markdown comparison report from judge results.

**Files:**
- Create: `eval/report.py`
- Create: `eval/tests/test_report.py`

- [ ] **Step 1: Write test for report generation**

`eval/tests/test_report.py`:
```python
from eval.report import compute_summary, format_winner
from eval.judge import CRITERIA


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
    assert format_winner(4.0, 3.9) == "≈"  # within 0.2 tolerance
    assert format_winner(4.0, 4.0) == "≈"
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd eval && python -m pytest tests/test_report.py -v
```

Expected: FAIL — `eval.report` does not exist.

- [ ] **Step 3: Write report.py**

`eval/report.py`:
```python
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

    # Count wins
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

    # Token usage / cost
    lines.append("## Token usage")
    lines.append("")
    lines.append("| Wave | A model | A tokens (in/out) | B model | B tokens (in/out) |")
    lines.append("|------|---------|-------------------|---------|-------------------|")
    for wave in ["wave0", "wave1", "wave2", "wave3"]:
        ta = stats_a.get("waves", {}).get(wave, {})
        tb = stats_b.get("waves", {}).get(wave, {})
        ma = stats_a.get("config", "?")
        mb = stats_b.get("config", "?")
        lines.append(
            f"| {wave} | — | {ta.get('input', 0):,}/{ta.get('output', 0):,} "
            f"| — | {tb.get('input', 0):,}/{tb.get('output', 0):,} |"
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd eval && python -m pytest tests/test_report.py -v
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add eval/report.py eval/tests/test_report.py
git commit -m "feat(eval): add markdown report generation with summary and per-section breakdown"
```

---

### Task 7: CLI entry point

Wire everything together in the CLI script.

**Files:**
- Create: `eval/compare.py`

- [ ] **Step 1: Write compare.py**

`eval/compare.py`:
```python
#!/usr/bin/env python3
"""CLI tool to compare model configurations for learning website generation."""
import argparse
import asyncio
import sys
import tempfile
from datetime import date
from pathlib import Path

from eval.config import load_config, ConfigError
from eval.generate import generate
from eval.judge import judge
from eval.report import generate_report

CONFIGS_DIR = Path(__file__).parent / "configs"
RESULTS_DIR = Path(__file__).parent / "results"


async def run_comparison(topic: str, config_a_name: str, config_b_name: str):
    """Generate with both configs, judge, and write report."""
    # Load configs
    config_a = load_config(config_a_name, CONFIGS_DIR)
    config_b = load_config(config_b_name, CONFIGS_DIR)

    print(f"Topic: {topic}")
    print(f"Config A: {config_a['name']} — {config_a.get('description', '')}")
    print(f"Config B: {config_b['name']} — {config_b.get('description', '')}")
    print()

    # Generate with config A
    work_dir_a = Path(tempfile.mkdtemp(prefix=f"eval-{config_a_name}-"))
    print(f"Generating with {config_a_name}...")
    stats_a = await generate(topic, config_a, work_dir_a)
    print()

    # Generate with config B
    work_dir_b = Path(tempfile.mkdtemp(prefix=f"eval-{config_b_name}-"))
    print(f"Generating with {config_b_name}...")
    stats_b = await generate(topic, config_b, work_dir_b)
    print()

    # Judge
    print("Running LLM-as-judge (Opus)...")
    judge_results = await judge(work_dir_a, work_dir_b, config_a_name, config_b_name)
    print()

    # Generate report
    report = generate_report(topic, judge_results, stats_a, stats_b)

    # Save report
    RESULTS_DIR.mkdir(exist_ok=True)
    slug = topic.lower().replace(" ", "-")[:30]
    filename = f"{date.today().isoformat()}-{slug}-{config_a_name}-vs-{config_b_name}.md"
    report_path = RESULTS_DIR / filename
    report_path.write_text(report)

    print(f"Report saved to: {report_path}")
    print()
    # Print summary to stdout
    for line in report.split("\n")[:25]:
        print(line)


def main():
    parser = argparse.ArgumentParser(description="Compare model configurations for learning website generation")
    parser.add_argument("topic", help="Topic to generate (or arXiv URL for paper-explainer)")
    parser.add_argument("--config-a", required=True, help="First model config name (without .yaml)")
    parser.add_argument("--config-b", required=True, help="Second model config name (without .yaml)")
    args = parser.parse_args()

    try:
        asyncio.run(run_comparison(args.topic, args.config_a, args.config_b))
    except ConfigError as e:
        print(f"Config error: {e}", file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nAborted.")
        sys.exit(1)


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Make executable**

```bash
chmod +x eval/compare.py
```

- [ ] **Step 3: Verify CLI help works**

```bash
cd eval && python compare.py --help
```

Expected: shows argparse help with topic, --config-a, --config-b.

- [ ] **Step 4: Commit**

```bash
git add eval/compare.py
git commit -m "feat(eval): add CLI entry point for model comparison"
```

---

### Task 8: Install dependencies and verify

Ensure PyYAML is available and run all tests.

**Files:**
- None new — just verify existing code works together

- [ ] **Step 1: Install PyYAML**

```bash
pip install pyyaml
```

- [ ] **Step 2: Run all eval tests**

```bash
cd eval && python -m pytest tests/ -v
```

Expected: all tests pass (test_config.py: 3 tests, test_report.py: 2 tests).

- [ ] **Step 3: Verify CLI dry-run (help only)**

```bash
cd eval && python compare.py --help
```

Expected: help output with usage info.

- [ ] **Step 4: Commit (if any fixes needed)**

```bash
git add -A && git status
# Only commit if there are changes
```
