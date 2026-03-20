---
name: company-explorer
description: Generate an interactive learning experience that profiles a company for sales and BD preparation. Use this skill when the user provides a company website URL and wants to understand the company before a meeting, call, or partnership discussion. Triggers on phrases like "research this company", "tell me about this company", "prep me for a meeting with", "analyze this company", "who is this company", or any request to create a company briefing or profile from a website URL.
---

# Company Explorer

Generate an interactive, multi-depth learning experience that profiles a company — delivered as a single self-contained HTML file. Designed for sales/BD preparation.

## How it works

This skill takes a company website URL, crawls key pages, researches external sources, and generates a learning website that covers the company at 4 depth levels. It reuses the shared core UI (same shell, same 21 viz types, same content patterns).

```
Input:       Company URL (e.g. https://acme.com)
Wave 0: Company Research  →  structure.json + source-notes.md
Wave 1: Content           →  sections/{id}/level-{1,2,3,4}.json  (N×4 parallel)
Wave 2: Enrichment        →  sections/{id}/enrichment.json       (N parallel)
Wave 3: Coherence         →  content.json                        (merge + verify)
Wave 4: Inject            →  output.html
```

## Shared infrastructure (from core/)

- **Shell:** `core/prebuild/shell.html`
- **Inject script:** `core/prebuild/inject.py`
- **Zod schemas:** `core/template/src/schemas/`
- **Content catalog:** `core/references/content-rendering-catalog.md`
- **Validate script:** `cd [core-path]/template && npm run validate`

## Reference files

- `references/skill-0-structure.md` — Wave 0: Crawl website, research, produce structure.json
- `core/references/skill-1-content.md` — Wave 1: Write level content
- `core/references/skill-2-enrichment.md` — Wave 2: Viz, concepts, deep dives, references
- `core/references/skill-3-coherence.md` — Wave 3: Merge, verify, produce content.json
- `core/references/skill-4-inject.md` — Wave 4: Inject into shell

## Workflow (fully autonomous)

### Setup

```bash
mkdir -p /tmp/company-explorer-data/sections
```

### Input: Parse company URL

1. Extract domain and company name from the URL
2. Normalize: `https://www.acme.com/about` → domain `acme.com`, name `Acme`

### Wave 0: Company Research & Structure

Follow `references/skill-0-structure.md`.

### Wave 1: Level Content (PARALLEL — N×4 agents)

Follow `core/references/skill-1-content.md` with these overrides:
- Source notes = crawled website + external research (passed as `source-notes.md`)
- L2 should focus on practical meeting-prep information
- L3 should include specific numbers, dates, and data tables
- L4 should compare to competitors and assess strategic position
- Work dir: `/tmp/company-explorer-data/`

### Wave 2: Enrichment (PARALLEL — N agents)

Follow `core/references/skill-2-enrichment.md` with these overrides:
- The company website is always reference #1
- Additional references from external sources (Crunchbase, news, reviews)
- Concepts should capture company-specific terminology, product names, industry terms
- Viz data should use real numbers where available (funding amounts, team size, review scores)

### Wave 3: Coherence & Merge

Follow `core/references/skill-3-coherence.md`. No additional quality checks beyond core.
- Work dir: `/tmp/company-explorer-data/`

### Wave 4: Inject & Deliver

Follow `core/references/skill-4-inject.md`:
```bash
python3 [core-path]/prebuild/inject.py \
  [core-path]/prebuild/shell.html \
  /tmp/company-explorer-data/structure.json \
  /tmp/company-explorer-data/content.json \
  ~/Desktop/{company-slug}-explorer.html
```

## Model routing (opus-premium)

Use different models per wave for optimal quality/cost:

| Wave | Model | Why |
|------|-------|-----|
| Wave 0 (Company Research) | **Opus** | High judgment — research synthesis, section mapping |
| Wave 1 (Content) | **Sonnet** | Constrained writing |
| Wave 2 (Enrichment) | **Sonnet** | Schema-aware data generation |
| Wave 3 (Merge) | No LLM | Pure file I/O |

## Product-specific overrides

### Level angle guidance for companies

- **L1 (Intuition):** What does this company do? Elevator pitch. Who are they for? Zero jargon.
- **L2 (Practical):** How do they work concretely? Products, pricing, business model. Meeting-prep essentials.
- **L3 (Technical):** Numbers and details. Funding, revenue estimates, team size, growth metrics. Data tables.
- **L4 (Research):** Critical analysis. Positioning vs competitors, strategic risks, growth trajectory, industry trends.

### Visualization guidance for companies

| Company aspect | Recommended viz type |
|---------------|---------------------|
| Key metrics (founded, HQ, size) | StatCards |
| Product lineup | ComparisonCards or TabbedView |
| Org structure / key people | TieredHierarchy |
| Funding history | Timeline |
| Market positioning | QuadrantMatrix |
| Culture strengths/weaknesses | ProsCons |
| Social/review metrics | BarChart |
| Recent events | Timeline |
| Risks vs opportunities | ProsCons |

### Citation format

References combine company pages with external sources:
```json
{ "id": 1, "text": "Acme — About Us", "url": "https://acme.com/about" }
{ "id": 2, "text": "Crunchbase — Acme Profile", "url": "https://www.crunchbase.com/organization/acme" }
```

## Operating principles

1. **Fully autonomous.** Never ask for confirmation. Deliver a complete website.
2. **The company website is the primary source.** External research adds context and verification.
3. **Depth is the product.** Content quality over everything.
4. **Four levels always.** Every section, all four depth levels.
5. **Objective and factual.** Not marketing copy — report what you find.
6. **Distinguish self-reported vs external.** "The company claims..." vs "According to Crunchbase..."
7. **Date everything.** "As of Q1 2026", "Founded in 2019".
8. **Flag estimates.** "Revenue estimated at ~$10M ARR (Crunchbase)" vs confirmed figures.
9. **No personal data.** No emails, phone numbers, or personal social handles.
10. **Never modify the shell.** Only produce JSON data. The UI is pre-built.

## Writing voice

Inherits core writing voice (technically accurate, no marketing, explain jargon, honest about trade-offs), plus:
- Objective and factual — not marketing copy
- Clearly distinguish what the company says about itself vs external sources
- Date every piece of information
- Flag estimated vs confirmed data
- For Key People, include role and brief professional background only
- For Red Flags, be honest but fair — present both risks and mitigating factors
