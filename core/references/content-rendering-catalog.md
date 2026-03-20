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

| vizType | Best for | DO NOT use when | Limits |
|---------|----------|----------------|--------|
| `pipeline` | Sequential stages, lifecycles, workflows | Process has branching/decisions. Use flowchart instead. | **2-8 stages** (≤5 renders horizontal, >5 vertical). Keep labels 1-3 words. |
| `flowchart` | Decision trees, branching logic, troubleshooting | Process is purely linear with no decisions. Use pipeline instead. | **3-10 nodes, 2-12 edges**. Keep labels 1-4 words. More than 10 nodes becomes unreadable. |
| `cycle` | Feedback loops, iterative processes, habit loops | Process doesn't loop back. Use pipeline instead. | **3-6 nodes**. More than 6 crowds the circle. |
| `routing-diagram` | Fan-in/fan-out, routing, load balancing, triage | There's no central routing/decision point. | **2-5 inputs, 2-5 outputs**. Keep labels short. |

- Linear process → `pipeline`
- Process with choices/branching → `flowchart`
- Process that repeats/cycles → `cycle`
- Multiple inputs merging to outputs → `routing-diagram`

### Data & Metrics

| vizType | Best for | DO NOT use when | Limits |
|---------|----------|----------------|--------|
| `stat-cards` | Key metrics, KPIs, headline numbers | You have more than 6 numbers. Summarize or use bar-chart. | **2-4 cards ideal**, 6 max. Values should be short (e.g., "2.5K", not long sentences). |
| `bar-chart` | Quantities, distributions, comparisons over categories | Data is percentages (use utilization-bars) or trends over time (use xy-plot). | **3-8 bars ideal**, 12 max. Labels must be short (1-3 words). |
| `utilization-bars` | Percentages, resource usage, progress toward goals | Values aren't percentages (0-100). Use bar-chart for arbitrary quantities. | **3-6 bars ideal**, 8 max. |
| `heatmap` | Schedules, correlations, frequency/intensity data | Grid would be larger than 8×8 — becomes unreadable. Simplify or aggregate. | **3-8 columns, 3-8 rows**. All values 0-1. |
| `xy-plot` | Continuous trends, curves, correlations, growth | Data is categorical (use bar-chart) or there's only 2-3 data points (use stat-cards). | **5-30 points per series**, 1-3 series. Too many points clutter the chart. |
| `composition-stack` | Part-of-whole: budgets, nutrition, portfolio, time | Segments don't represent parts of a meaningful whole. | **2-6 segments ideal**, 10 max. More than 6 segments become thin slivers. |

- 2-4 key numbers → `stat-cards`
- Comparing quantities across categories → `bar-chart`
- Showing percentages/completion → `utilization-bars`
- 2D grid of intensity values → `heatmap`
- Continuous trend/curve over time → `xy-plot`
- How a total is divided into parts → `composition-stack`

### Comparison & Analysis

| vizType | Best for | DO NOT use when | Limits |
|---------|----------|----------------|--------|
| `comparison-cards` | Side-by-side specs, feature comparison | Comparing more than 4 things. Summarize or use tabbed-view. | **2-3 cards ideal**, 4 max. **3-6 rows per card**. |
| `pros-cons` | Trade-off analysis, option evaluation | There's only one option (no comparison). Use callout instead. | **2-3 options**. **3-5 pros, 3-5 cons** per option. |
| `tabbed-view` | Multi-perspective content, approach comparison | There are only 2 short items. Use comparison-cards instead. | **2-4 tabs ideal**, 5 max. Tab content can be longer (HTML). |
| `quadrant` | 2×2 categorization, prioritization matrices | Items can't be meaningfully plotted on 2 axes. | **2-5 items per quadrant**. Keep item labels short. |

- Comparing features/specs → `comparison-cards`
- Evaluating pros and cons → `pros-cons`
- Different perspectives → `tabbed-view`
- Categorize by 2 axes → `quadrant`

### Structure & Hierarchy

| vizType | Best for | DO NOT use when | Limits |
|---------|----------|----------------|--------|
| `tiered-hierarchy` | Layers, stacks, hierarchies | Structure isn't layered top-to-bottom. Use concept-map for networks. | **2-5 tiers ideal**, 8 max. |
| `timeline` | Historical events, milestones, evolution | Events aren't chronological. Use pipeline for process steps. | **3-10 events ideal**, 20 max. Keep labels short, detail optional. |
| `continuum-scale` | Spectrums, scales, ranges (pH, ideology, risk) | Data isn't a continuous ordered range. | **2-5 bands**, **2-8 markers**. |

- Stacked layers → `tiered-hierarchy`
- Events over time → `timeline`
- Ordered spectrum with regions → `continuum-scale`

### Relationships

| vizType | Best for | DO NOT use when | Limits |
|---------|----------|----------------|--------|
| `concept-map` | Concept relationships, ecosystems, taxonomies | Relationships have weighted flows (use sankey-flow) or it's a decision tree (use flowchart). | **3-8 nodes, 3-12 edges**. More than 8 nodes creates a hairball. Keep labels 1-3 words. |
| `sankey-flow` | Weighted flows: budgets, energy, calories | Flows aren't weighted/proportional. Use flowchart for unweighted process flows. Flows don't go left-to-right between 2 columns. | **2-5 source nodes, 2-5 target nodes, 3-8 links**. More links = overlapping spaghetti. Keep labels short. |

- How concepts relate → `concept-map`
- How quantities flow left→right → `sankey-flow`

**IMPORTANT sankey-flow constraint:** Sankey is a 2-column diagram (sources → targets). It is NOT suitable for multi-stage processes or architectures with many-to-many connections. If you need to show an architecture (e.g., Q,K,V → attention heads → concat → output), use `flowchart` or `pipeline` instead.

### Specialized

| vizType | Best for | DO NOT use when | Limits |
|---------|----------|----------------|--------|
| `token-stream` | Sequences, tokenization, step-by-step parsing | Sequence has more than 15 items. Truncate or summarize. | **5-15 tokens**, 20 max. |
| `inline-svg` | Custom diagrams (escape hatch) | A typed visualization can do the job. Always prefer typed viz. | SVG must use `viewBox` for responsive sizing. Use `currentColor` for theme-aware text. |

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
├── Linear (no branching)? → pipeline (2-8 stages)
├── Has decisions/branching? → flowchart (3-10 nodes)
│   ⚠ NOT sankey-flow — sankey is for weighted quantities, not logic flow
├── Repeats cyclically? → cycle (3-6 nodes)
└── Multiple inputs → router → outputs? → routing-diagram (2-5 in, 2-5 out)

Is it quantitative data?
├── 2-4 key numbers? → stat-cards (2-4 cards)
├── Comparing values across categories? → bar-chart (3-8 bars)
├── Percentages (0-100%)? → utilization-bars (3-6 bars)
├── 2D grid of values? → heatmap (max 8×8)
├── Continuous trend/curve? → xy-plot (5-30 points)
└── How a total divides into parts? → composition-stack (2-6 segments)

Is it a comparison?
├── Feature-by-feature specs? → comparison-cards (2-3 cards)
├── Pros vs cons? → pros-cons (2-3 options)
├── Different perspectives? → tabbed-view (2-4 tabs)
└── Categorize by 2 axes? → quadrant (2-5 items per quadrant)

Is it structural?
├── Layered hierarchy? → tiered-hierarchy (2-5 tiers)
├── Events over time? → timeline (3-10 events)
└── Ordered spectrum with regions? → continuum-scale (2-5 bands)

Is it about relationships?
├── How concepts relate (unweighted)? → concept-map (3-8 nodes)
└── How quantities flow left→right (weighted)? → sankey-flow (2-5 sources, 2-5 targets, 3-8 links)
    ⚠ NOT for architectures or multi-stage flows — use flowchart or pipeline instead

Sequence of discrete items? → token-stream (5-15 tokens)
Nothing fits? → inline-svg (escape hatch, typed viz preferred)
```

### Common Mistakes to Avoid

| Mistake | Why it fails | Use instead |
|---------|-------------|-------------|
| sankey-flow for architecture diagrams | Too many crossing flows, labels overlap | flowchart or pipeline |
| concept-map with 10+ nodes | Becomes an unreadable hairball | Simplify to 5-7 key concepts |
| flowchart with 15+ nodes | Dagre layout can't handle it cleanly | Split into 2 diagrams or simplify |
| heatmap larger than 8×8 | Cells become too small, labels unreadable | Aggregate or filter data |
| bar-chart with 12+ bars | Labels overlap, bars too thin | Top 6-8 categories, group rest as "Other" |
| stat-cards for narrative info | Cards are for numbers, not paragraphs | Use callout or tabbed-view |
| composition-stack with 8+ segments | Thin slivers are meaningless | Top 4-5, group rest as "Other" |

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
