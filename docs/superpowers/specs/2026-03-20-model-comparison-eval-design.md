# Model Comparison Eval — Design Spec

## Context

The learning experience pipeline uses LLM calls across 4 waves (Wave 0: structure, Wave 1: level content, Wave 2: enrichment, Wave 3: coherence). Different waves have different complexity — Wave 0 requires high judgment while Wave 1 is constrained writing. Using cheaper/faster models for simpler waves could reduce cost without sacrificing quality.

This spec describes a local evaluation tool that generates the same topic with different model configurations and produces a quality comparison report.

## Goal

Given a topic and two or more model configurations, generate content with each configuration and produce a scored comparison report — enabling data-driven decisions about model routing per wave.

## Architecture

```
eval/
├── compare.py          # Main CLI script
├── judge.py            # LLM-as-judge evaluation logic
├── generate.py         # Wraps the wave pipeline for a given model config
├── configs/            # Model configuration YAML files
│   ├── all-sonnet.yaml
│   ├── haiku-wave1.yaml
│   ├── opus-premium.yaml
│   ├── opus-haiku-mix.yaml
│   └── budget.yaml
└── results/            # Generated comparison reports (gitignored)
```

## Model configurations

YAML files in `eval/configs/`. Each defines which model to use per wave:

```yaml
name: opus-haiku-mix
description: Opus for structure, Haiku for content, Sonnet for enrichment and coherence
models:
  wave0: opus
  wave1: haiku
  wave2: sonnet
  wave3: sonnet
```

Model names map to concrete model IDs via environment variables or a lookup table in the script (e.g., `opus` → `anthropic/claude-opus-4`, `sonnet` → `anthropic/claude-sonnet-4`, `haiku` → `anthropic/claude-haiku-4`). All calls go through OpenRouter, same as the existing API.

### Starter configs

| Config | Wave 0 | Wave 1 | Wave 2 | Wave 3 | Hypothesis |
|--------|--------|--------|--------|--------|------------|
| all-sonnet | Sonnet | Sonnet | Sonnet | Sonnet | Baseline |
| haiku-wave1 | Sonnet | Haiku | Sonnet | Sonnet | Wave 1 is constrained enough for Haiku |
| opus-premium | Opus | Sonnet | Sonnet | Sonnet | Better structure → better everything |
| opus-haiku-mix | Opus | Haiku | Sonnet | Sonnet | Best of both: Opus judgment + Haiku speed |
| budget | Sonnet | Haiku | Haiku | Sonnet | Minimum viable quality |

## CLI interface

```bash
# Compare two configs
python eval/compare.py "How the Web Works" \
  --config-a all-sonnet \
  --config-b haiku-wave1

# Compare multiple configs (round-robin)
python eval/compare.py "How the Web Works" \
  --configs all-sonnet haiku-wave1 opus-premium opus-haiku-mix

# Use a specific topic product
python eval/compare.py "https://arxiv.org/abs/2401.12345" \
  --product paper-explainer \
  --configs all-sonnet opus-haiku-mix
```

Default product is `topic-explorer`. The `--product` flag selects which product's Wave 0 to use.

## Generation pipeline

`eval/generate.py` wraps the existing wave pipeline logic from `api/generator.py`. For each config:

1. Create a work directory: `/tmp/eval/{config-name}/`
2. Run Wave 0 with `config.models.wave0` model
3. Run Wave 1 with `config.models.wave1` model (all sections × 4 levels)
4. Run Wave 2 with `config.models.wave2` model (all sections)
5. Run Wave 3 with `config.models.wave3` model
6. Skip Wave 4 (inject) — eval only needs `content.json`, not the HTML
7. Save `structure.json` and `content.json` in the work directory

Each config generates independently from scratch (including Wave 0). This means:
- Configs with different Wave 0 models produce different structures
- The judge evaluates each output holistically, not section-by-section matching
- This measures the full pipeline impact of each config

### Reuse from api/generator.py

The eval script reuses the pure utility functions from `api/generator.py`: `call_llm_json`, `read_schema_files`, `read_catalog`. However, two issues must be addressed:

1. **Model override:** `call_llm` and `call_llm_json` use a module-level `MODEL` constant. The eval script must NOT monkey-patch this global. Instead, `eval/generate.py` should have its own `call_llm(system, prompt, model)` wrapper that accepts a model parameter and creates the OpenAI client directly. This avoids modifying `api/generator.py` and keeps the API unchanged.

2. **DB/SSE decoupling:** The wave functions in `generator.py` (`wave_0_structure`, `wave_1_content`, etc.) call `emit()` which writes to the database. The eval script should NOT reuse these wave functions. Instead, `eval/generate.py` reimplements the wave orchestration using only the pure utilities (`call_llm_json`, `read_schema_files`, `read_catalog`) and the same prompt templates, but without any DB/event dependencies. This is a clean separation — the eval pipeline is independent from the web API.

## LLM-as-judge evaluation

`eval/judge.py` takes two (or more) `content.json` + `structure.json` pairs and produces a comparison.

### Evaluation criteria (per section)

| Criterion | What it measures | Score |
|-----------|-----------------|-------|
| **L1 Clarity** | Is the analogy clear? Would a non-expert understand? | 1-5 |
| **L2 Practicality** | Are there concrete steps? Trade-offs explicit? | 1-5 |
| **L3 Depth** | Specific technical details (numbers, equations, code)? | 1-5 |
| **L4 Analysis** | Real citations? Critical analysis present? | 1-5 |
| **Viz Quality** | Viz data coherent with content, schema valid? | 1-5 |
| **Concepts** | Definitions accurate, useful, well-linked? | 1-5 |
| **References** | Real and verifiable citations? | 1-5 |

### Judge prompt structure

The judge is a single Opus call per section-pair. It receives:
- The section's structure (title, outline, vizType) from both configs
- All 4 levels of HTML content from both configs
- The viz data, concepts, deep dives, and references from both configs
- The scoring rubric

It outputs a JSON object with scores and a brief justification for each criterion.

For configs with different structures (different Wave 0 models), the judge evaluates each config's sections independently (absolute scoring), then compares aggregate scores.

### Judge model

Always Opus — the judge must be the most capable model to produce reliable evaluations. This is a small cost (1 call per section comparison) relative to the generation cost.

## Output report

Saved to `eval/results/YYYY-MM-DD-{topic-slug}-{config-a}-vs-{config-b}.md`

```markdown
# Comparison: all-sonnet vs haiku-wave1
**Topic:** How the Web Works
**Date:** 2026-03-20

## Summary

| Criterion | A (all-sonnet) | B (haiku-wave1) | Winner |
|-----------|---------------|-----------------|--------|
| L1 Clarity | 4.2 | 3.8 | A |
| L2 Practicality | 4.0 | 3.9 | ≈ |
| L3 Depth | 4.1 | 3.5 | A |
| L4 Analysis | 4.3 | 4.1 | ≈ |
| Viz Quality | 3.8 | 3.7 | ≈ |
| Concepts | 4.0 | 3.6 | A |
| References | 4.2 | 3.9 | A |
| **Overall** | **4.09** | **3.79** | **A** |

## Verdict

A (all-sonnet) wins 4-2 with 1 tie. The main quality drop with Haiku on Wave 1
is in L3 Depth and Concepts — Haiku produces less specific technical content and
thinner concept definitions.

## Cost comparison

| Config | Wave 0 | Wave 1 (×40) | Wave 2 (×10) | Wave 3 | Judge | Total |
|--------|--------|-------------|-------------|--------|-------|-------|
| A | $X | $Y | $Z | $W | — | $total_a |
| B | $X | $Y | $Z | $W | — | $total_b |
| Savings | | | | | | X% |

## Per-section breakdown

### Section 1: "What is the Internet?"

| Criterion | A | B | Notes |
|-----------|---|---|-------|
| L1 Clarity | 5 | 4 | B's analogy is vaguer |
| ... | | | |

[continues for all sections]
```

## Constraints and non-goals

- **Local only.** No API integration, no web UI. CLI script run manually.
- **No persistent database.** Results are markdown files in `eval/results/`.
- **No automated re-runs.** Manual invocation only.
- **No statistical significance.** Single run per config. If needed, run multiple times and average manually.
- **No Wave 4.** Eval works on content.json, not the final HTML. The shell rendering is identical regardless of model config.

## Dependencies

- Reuses `api/generator.py` core functions (call_llm, call_llm_json, read_schema_files, read_catalog)
- Requires OpenRouter API key (same as existing API)
- Requires PyYAML for config parsing
- Judge calls use Opus via OpenRouter

## Success criteria

1. Running `python eval/compare.py "topic" --config-a X --config-b Y` produces a complete comparison report
2. The report includes per-section scores on all 7 criteria
3. Cost estimates are included so cost/quality tradeoffs are visible
4. Different configs produce measurably different scores (the tool can detect quality differences)
