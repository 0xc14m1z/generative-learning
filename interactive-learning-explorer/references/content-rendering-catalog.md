# Content Rendering Catalog

Quick reference for choosing visualizations and content patterns.

For **exact data shapes and field constraints**, read the Zod schemas:
- `template/src/schemas/viz-types.ts` — All 21 viz type data shapes with descriptions
- `template/src/schemas/structure.ts` — structure.json schema (including section outlines)
- `template/src/schemas/content.ts` — content.json schema (levels, concepts, references)

---

## Visualization Types (21 total)

Each section has exactly ONE visualization.

### Flow & Process

| vizType | Best for |
|---------|----------|
| `pipeline` | Sequential stages, lifecycles, workflows |
| `flowchart` | Decision trees, branching logic, troubleshooting |
| `cycle` | Feedback loops, iterative processes, habit loops |
| `routing-diagram` | Fan-in/fan-out, routing, load balancing, triage |

- Linear process → `pipeline`
- Process with choices/branching → `flowchart`
- Process that repeats/cycles → `cycle`
- Multiple inputs merging to outputs → `routing-diagram`

### Data & Metrics

| vizType | Best for |
|---------|----------|
| `stat-cards` | Key metrics, KPIs, headline numbers |
| `bar-chart` | Quantities, distributions, comparisons over categories |
| `utilization-bars` | Percentages, resource usage, progress toward goals |
| `heatmap` | Schedules, correlations, frequency/intensity data |
| `xy-plot` | Continuous trends, curves, correlations, growth |
| `composition-stack` | Part-of-whole: budgets, nutrition, portfolio, time |

- 2-4 key numbers → `stat-cards`
- Comparing quantities across categories → `bar-chart`
- Showing percentages/completion → `utilization-bars`
- 2D grid of intensity values → `heatmap`
- Continuous trend/curve over time → `xy-plot`
- How a total is divided into parts → `composition-stack`

### Comparison & Analysis

| vizType | Best for |
|---------|----------|
| `comparison-cards` | Side-by-side specs, feature comparison |
| `pros-cons` | Trade-off analysis, option evaluation |
| `tabbed-view` | Multi-perspective content, approach comparison |
| `quadrant` | 2×2 categorization, prioritization matrices |

- Comparing features/specs → `comparison-cards`
- Evaluating pros and cons → `pros-cons`
- Different perspectives → `tabbed-view`
- Categorize by 2 axes → `quadrant`

### Structure & Hierarchy

| vizType | Best for |
|---------|----------|
| `tiered-hierarchy` | Layers, stacks, hierarchies |
| `timeline` | Historical events, milestones, evolution |
| `continuum-scale` | Spectrums, scales, ranges (pH, ideology, risk) |

- Stacked layers → `tiered-hierarchy`
- Events over time → `timeline`
- Ordered spectrum with regions → `continuum-scale`

### Relationships

| vizType | Best for |
|---------|----------|
| `concept-map` | Concept relationships, ecosystems, taxonomies |
| `sankey-flow` | Weighted flows: budgets, energy, calories |

- How concepts relate → `concept-map`
- How quantities flow → `sankey-flow`

### Specialized

| vizType | Best for |
|---------|----------|
| `token-stream` | Sequences, tokenization, step-by-step parsing |
| `inline-svg` | Custom diagrams (escape hatch) |

---

## Content Patterns (in HTML)

These are styled via CSS inside the level HTML. No JavaScript needed. Full markup examples in the Zod schema descriptions (`content.ts` → `htmlContent`).

| Pattern | HTML | When to use |
|---------|------|-------------|
| **Callout** | `<div class="callout" data-type="insight\|tip\|warning\|quote">` | Key insights, practical tips, pitfalls, authoritative quotes |
| **Key Takeaway** | `<div class="takeaway">` | End-of-section summary, 1-3 bullet points |
| **Do / Don't** | `<div class="do-dont"><div class="do">…</div><div class="dont">…</div></div>` | Best practice vs anti-pattern |
| **Styled Steps** | `<div class="steps"><div class="step" data-time="5 min">…</div></div>` | Numbered process with optional time |
| **Vocab Grid** | `<div class="vocab-grid"><div class="vocab-term" data-term="TERM">…</div></div>` | 4+ new terms in one section |
| **Practice Block** | `<section class="practice-block"><p class="prompt">…</p><details class="solution">…</details></section>` | Self-check question with hidden answer |
| **Worked Example** | `<section class="worked-example"><div class="problem">…</div><ol class="steps">…</ol><div class="answer">…</div></section>` | Problem → steps → answer |
| **Formula Card** | `<figure class="formula-card"><div class="formula">…</div><dl class="symbols">…</dl></figure>` | Key equation with symbol definitions |
| **Misconception** | `<section class="misconception"><div class="wrong">…</div><div class="why-wrong">…</div><div class="fix">…</div></section>` | Common error → diagnosis → correction |
| **Reference Matrix** | `<table class="reference-matrix">` | 2D lookup: conjugations, conversions, specs |
| **Concept Trigger** | `<span class="concept-trigger" data-concept="id">term</span>` | Inline expandable term |
| **Citation** | `<a class="citation" href="#ref-SECTIONID-N">[N]</a>` | Source reference |

---

## Decision Guide: Picking the Right Visualization

```
Is it a process/workflow?
├── Linear? → pipeline
├── Has decisions/branching? → flowchart
├── Repeats cyclically? → cycle
└── Multiple inputs → router → outputs? → routing-diagram

Is it quantitative data?
├── 2-4 key numbers? → stat-cards
├── Comparing values across categories? → bar-chart
├── Percentages (0-100%)? → utilization-bars
├── 2D grid of values? → heatmap
├── Continuous trend/curve? → xy-plot
└── How a total divides into parts? → composition-stack

Is it a comparison?
├── Feature-by-feature specs? → comparison-cards
├── Pros vs cons? → pros-cons
├── Different perspectives? → tabbed-view
└── Categorize by 2 axes? → quadrant

Is it structural?
├── Layered hierarchy? → tiered-hierarchy
├── Events over time? → timeline
└── Ordered spectrum with regions? → continuum-scale

Is it about relationships?
├── How concepts relate? → concept-map
└── How quantities flow? → sankey-flow

Sequence of discrete items? → token-stream
Nothing fits? → inline-svg
```

## Decision Guide: Picking Content Patterns

```
Level 1 (Intuition):
  - 1-2 concept triggers
  - 1 callout (insight or tip)
  - 1 practice-block for self-check

Level 2 (Practitioner):
  - Citations for factual claims
  - 1 callout (tip or warning)
  - 1 do-dont if applicable
  - 1 misconception if common errors exist
  - formula-card for key equations

Level 3 (Builder):
  - reference-matrix or tables for benchmarks/specs
  - Steps for practical processes
  - vocab-grid if 4+ new terms
  - worked-example for calculations

Level 4 (Researcher):
  - Quote callout for notable figures
  - Key takeaway box summarizing the section

All levels:
  - Concept triggers for technical terms
  - Citations for sourced claims
```
