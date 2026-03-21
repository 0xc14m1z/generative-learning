---
name: paper-explainer
description: Generate an interactive learning experience that explains a scientific paper from arXiv. Use this skill when the user provides an arXiv URL and wants to deeply understand a research paper. Triggers on phrases like "explain this paper", "help me understand this paper", "break down this arXiv paper", or any request to create an interactive walkthrough of a scientific publication.
---

# Paper Explainer

Generate an interactive, multi-depth learning experience that explains a scientific paper — delivered as a single self-contained HTML file.

## How it works

This skill takes an arXiv paper link, fetches its HTML version from ar5iv, and generates a learning website that explains the paper at 4 depth levels. It reuses the shared core UI (same shell, same 21 viz types, same content patterns).

```
Input:       arXiv URL (e.g. https://arxiv.org/abs/2401.12345)
Wave 0: Paper Analysis  →  structure.json + source-notes.md
Wave 1: Content         →  sections/{id}/level-{1,2,3,4}.json  (N×4 parallel)
Wave 2: Enrichment      →  sections/{id}/enrichment.json       (N parallel)
Wave 3: Coherence       →  content.json                        (merge + verify)
Wave 4: Inject          →  output.html
```

## Shared infrastructure (from core/)

- **Shell:** `core/prebuild/shell.html`
- **Inject script:** `core/prebuild/inject.py`
- **Zod schemas:** `core/template/src/schemas/`
- **Content catalog:** `core/references/content-rendering-catalog.md`
- **Validate script:** `cd [core-path]/template && npm run validate`

## Reference files

- `references/skill-0-structure.md` — Wave 0: Fetch paper, analyze, produce structure.json
- `core/references/skill-1-content.md` — Wave 1: Write level content
- `core/references/skill-2-enrichment.md` — Wave 2: Viz, concepts, deep dives, references
- `core/references/skill-3-coherence.md` — Wave 3: Merge, verify, produce content.json
- `core/references/skill-4-inject.md` — Wave 4: Inject into shell

## Workflow (fully autonomous)

### Setup

```bash
mkdir -p /tmp/paper-explainer-data/sections
```

### Input: Fetch paper from ar5iv

1. Extract paper ID from the arXiv URL (handle `arxiv.org/abs/`, `arxiv.org/pdf/`, `ar5iv.labs.arxiv.org/html/` formats)
2. Construct ar5iv URL: `https://ar5iv.labs.arxiv.org/html/{paper_id}`
3. Web fetch the full HTML page
4. Parse and extract: title, authors, date, abstract, all sections with content, equation text, figure/table captions, bibliography entries
5. If ar5iv returns an error, stop with a clear message: "This paper is not available on ar5iv. Only papers with ar5iv HTML versions are supported."

### Wave 0: Paper Analysis & Structure

Follow `references/skill-0-structure.md`.

### Wave 1: Level Content (PARALLEL — N×4 agents)

Follow `core/references/skill-1-content.md` with these overrides:
- Source notes = the paper's extracted text + context research (passed as `source-notes.md`)
- L3 agents should reference specific paper sections, figures, tables, equations by number
- L4 agents should cite related work from the paper's bibliography plus external context
- Work dir: `/tmp/paper-explainer-data/`

### Wave 2: Enrichment (PARALLEL — N agents)

Follow `core/references/skill-2-enrichment.md` with these overrides:
- The paper itself is always reference #1: `"Author et al. — Title (Year). arXiv:XXXX.XXXXX"`
- Additional references from both the paper's bibliography and external context
- Concepts should capture the paper's key terminology and acronyms

### Wave 3: Coherence & Merge

Follow `core/references/skill-3-coherence.md`. No additional quality checks beyond core.
- Work dir: `/tmp/paper-explainer-data/`

### Wave 4: Inject & Deliver

Follow `core/references/skill-4-inject.md`:
```bash
python3 [core-path]/prebuild/inject.py \
  [core-path]/prebuild/shell.html \
  /tmp/paper-explainer-data/structure.json \
  /tmp/paper-explainer-data/content.json \
  ~/Desktop/{paper-id}-explained.html
```

## Product-specific overrides

### Level angle guidance for papers

- **L1 (Intuition):** Explain as if the reader has zero background in this field. No math, no jargon. Answer "what" and "why it matters." Explain directly — no "Imagine..." openings.
- **L2 (Practitioner):** How the method works concretely. Simplified diagrams, step-by-step process, practical implications. Light math where it helps.
- **L3 (Technical):** Full technical detail. Key equations, architecture specifics, algorithm pseudocode, training details. Reference specific sections/figures/tables from the paper.
- **L4 (Research):** Critical analysis. Compare to related work, discuss assumptions and limitations, identify open questions, connect to broader research trends.

### Visualization guidance for papers

| Paper element | Recommended viz type |
|--------------|---------------------|
| Model architecture | Flowchart or Pipeline |
| Training/inference process | Pipeline or CycleDiagram |
| Performance comparison | BarChart or ComparisonCards |
| Ablation study | BarChart or StatCards |
| Feature importance | Heatmap or UtilizationBars |
| Dataset statistics | StatCards or BarChart |
| Method taxonomy | TieredHierarchy |
| Concept relationships | ConceptMap |
| Historical progression | Timeline |
| Trade-off analysis | QuadrantMatrix or ProsCons |
| Data flow | SankeyFlow or RoutingDiagram |
| Mathematical relationships | InlineSvg |

### Citation format

References combine the paper's own bibliography with external context:
```json
{ "id": 1, "text": "Vaswani et al. — \"Attention Is All You Need\" (2017)", "url": "https://arxiv.org/abs/1706.03762" }
```

## Model routing (opus-premium)

Use different models per wave for optimal quality/cost:

| Wave | Model | Why |
|------|-------|-----|
| Wave 0 (Paper Analysis) | **Opus** | High judgment — paper decomposition, section mapping, viz selection |
| Wave 1 (Content) | **Sonnet** | Constrained writing with good technical depth |
| Wave 2 (Enrichment) | **Sonnet** | Schema-aware data generation |
| Wave 3 (Merge) | No LLM | Pure file I/O |

## Operating principles

1. **Fully autonomous.** Never ask for confirmation. Deliver a complete website.
2. **The paper is the primary source.** Web research adds context, but the paper's content drives the structure.
3. **Depth is the product.** Content quality over everything.
4. **Four levels always.** Every section, all four depth levels.
5. **Explain fairly.** Don't oversell or undersell the paper's contributions.
6. **Attribute claims.** "The authors show that..." or "According to their experiments..."
7. **Distinguish proven from unproven.** Clearly separate what the paper demonstrates from speculation.
8. **Define before using.** Use the paper's terminology consistently, but always define it first.
9. **L1 is for outsiders.** Pretend the reader just heard about this field for the first time.
10. **Never modify the shell.** Only produce JSON data. The UI is pre-built.

## Writing voice

Inherits core writing voice (technically accurate, no marketing, explain jargon, honest about trade-offs), plus:
- When the paper makes a claim, attribute it explicitly
- Clearly distinguish demonstrated results from open questions
- For L1, assume zero field knowledge — explain the problem before the solution
