# Wave 0: Paper Analysis & Structure

**Input:** arXiv paper URL
**Output:** `structure.json` + `source-notes.md`

## Phase 1 — Fetch and parse the paper

The paper HTML has already been fetched during input handling. Now parse it:

1. **Title and metadata:** Extract paper title, authors, date, arXiv ID
2. **Abstract:** Full abstract text
3. **Sections:** Walk the HTML structure, extract each section heading and its content
4. **Equations:** Extract equation text (MathML or text fallback)
5. **Figures and tables:** Extract captions (not the images themselves)
6. **Bibliography:** Extract all bibliography entries with their citation keys

Write everything to `/tmp/paper-explainer-data/source-notes.md` in this format:

```
# Source Notes: {Paper Title}

## Metadata
- **Title:** ...
- **Authors:** ...
- **Date:** ...
- **arXiv ID:** ...
- **URL:** https://arxiv.org/abs/{id}

## Abstract
{full abstract}

## Paper Sections
### {Section 1 heading}
{content summary — key points, not full text}

### {Section 2 heading}
{content summary}

...

## Key Equations
1. {equation description}: {equation text}
...

## Figures and Tables
- Figure 1: {caption}
- Table 1: {caption}
...

## Bibliography
1. {Author et al. — Title (Year)}
...
```

## Phase 2 — Context research

Perform 3-5 web searches to contextualize the paper:

1. **The field:** What research area is this? Why does this problem matter?
2. **Prior work:** What are the key papers this builds on? (Check the paper's own "Related Work" section for guidance)
3. **Impact:** Has this paper been cited? Any notable follow-up work or adoption?
4. **Alternatives:** What competing approaches exist?

Fetch 2-3 key pages for deeper context. Add findings to source-notes.md under a `## Context Research` section.

## Phase 3 — Section decomposition

Decompose the paper into 8-12 learning sections. Adapt to the paper's actual content — not every type applies to every paper.

### Section types

| Type | When to use | Maps to paper section |
|------|------------|----------------------|
| Problem & Motivation | Always | Introduction (first half) |
| Background & Prior Work | When paper builds on non-obvious prior concepts | Related Work / Background |
| Key Insight | Always | Introduction (contributions) or Method (core idea) |
| Method — Overview | Always | Method/Approach (high-level) |
| Method — Details | For papers with complex methods | Method subsections |
| Method — Training/Learning | For ML papers with training procedures | Training details |
| Experimental Setup | When paper has experiments | Experiments (setup portion) |
| Main Results | When paper has experiments | Results / Evaluation |
| Analysis & Ablation | When paper includes analysis | Ablation studies, analysis sections |
| Theoretical Contribution | For theory papers | Theorems, proofs |
| Limitations & Future Work | Always | Discussion / Conclusion |
| Broader Impact | When relevant | Impact statement, applications |

### Learning arc mapping

Follow the standard 6-phase learning arc:

| Phase | Paper section types |
|-------|-------------------|
| orientation | Problem & Motivation |
| prerequisites | Background & Prior Work |
| core | Key Insight, Method — Overview, Method — Details, Method — Training/Learning |
| advanced | Results, Analysis, Ablation |
| ecosystem | Experimental Setup (if separate from results) |
| synthesis | Limitations & Future Work, Broader Impact |

## Phase 4 — Outline with per-level angles

For each section, write the outline:

```json
{
  "core": "One paragraph summarizing what this section covers",
  "keyPoints": ["3-5 key points"],
  "L1_angle": "Explain [X] using analogy of [Y] — zero field knowledge assumed",
  "L2_angle": "Step-by-step: how [method] works in practice, with simplified examples",
  "L3_angle": "Equations [N]-[M], architecture details from Fig [X], training specifics from Table [Y]",
  "L4_angle": "Compare to [prior work], discuss assumption [Z], connect to [research trend]"
}
```

**Critical:** L3 and L4 angles MUST reference specific parts of the paper (section numbers, figure numbers, equation numbers, table numbers). This ensures the content agents produce grounded, accurate content.

## Phase 5 — Visualization assignment

Choose viz types based on what the paper presents. See the "Visualization guidance for papers" table in the SKILL.md.

General rules:
- Every section needs exactly one viz
- The viz should illustrate the section's core concept, not just decorate
- For method sections, prefer flowcharts/pipelines that show how the method works
- For results sections, prefer bar-charts/comparison-cards that show key findings
- For background sections, prefer timelines/concept-maps that show the landscape

## Phase 6 — Write structure.json

Follow the standard structure.json schema from `core/template/src/schemas/structure.ts`.

Assign colors from the standard palette, cycling through:
`#3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #06B6D4, #F97316, #6366F1, #14B8A6, #EF4444`

Read `core/template/src/schemas/structure.ts` to understand the exact structure.json format before writing.

Write to `/tmp/paper-explainer-data/structure.json`.
