# Content Rendering Catalog

Complete reference for all available visualization types and content patterns. Use this when deciding how to render each section and each piece of content.

---

## Visualization Types (16 total)

Each section has exactly ONE visualization. Choose based on what the section explains.

### Flow & Process

| vizType | Best for | Data shape |
|---------|----------|------------|
| `pipeline` | Sequential stages, lifecycles, workflows | `{ "stages": [{ "label": str, "color": "#hex", "active?": bool }] }` |
| `flowchart` | Decision trees, branching logic, troubleshooting | `{ "nodes": [{ "id": str, "label": str, "type": "decision"\|"outcome"\|"step", "color?": "#hex" }], "edges": [{ "from": str, "to": str, "label?": str }] }` |
| `cycle` | Feedback loops, iterative processes, habit loops | `{ "nodes": [{ "label": str, "detail?": str, "color": "#hex" }], "centerLabel?": str }` |
| `routing-diagram` | Fan-in/fan-out, routing, load balancing, triage | `{ "inputs": [{ "label": str, "color": "#hex" }], "router": { "label": str, "sublabel?": str }, "outputs": [{ "label": str, "active": bool }], "color": "#hex" }` |

**Choosing between them:**
- Linear process → `pipeline`
- Process with choices/branching → `flowchart`
- Process that repeats/cycles → `cycle`
- Multiple inputs merging to outputs → `routing-diagram`

### Data & Metrics

| vizType | Best for | Data shape |
|---------|----------|------------|
| `stat-cards` | Key metrics, KPIs, headline numbers | `{ "cards": [{ "value": str, "unit": str, "color": "#hex" }] }` |
| `bar-chart` | Quantities, distributions, comparisons over categories | `{ "bars": [{ "label": str, "value": number, "color?": "#hex" }], "unit?": str, "maxValue?": number }` |
| `utilization-bars` | Percentages, resource usage, progress toward goals | `{ "bars": [{ "label": str, "value": number (0-100), "color": "#hex" }], "legend?": str }` |
| `heatmap` | Schedules, correlations, frequency/intensity data | `{ "xLabels": [str], "yLabels": [str], "cells": [[number 0-1]], "color": "#hex", "legend?": str }` |

**Choosing between them:**
- 2-4 key numbers → `stat-cards`
- Comparing quantities across categories → `bar-chart`
- Showing percentages/completion → `utilization-bars`
- 2D grid of intensity values → `heatmap`

### Comparison & Analysis

| vizType | Best for | Data shape |
|---------|----------|------------|
| `comparison-cards` | Side-by-side specs, feature comparison | `{ "cards": [{ "title": str, "color": "#hex", "rows": [{ "label": str, "value": str, "badge?": str }] }] }` |
| `pros-cons` | Trade-off analysis, option evaluation | `{ "options": [{ "title": str, "color": "#hex", "pros": [str], "cons": [str] }] }` |
| `tabbed-view` | Multi-perspective content, approach comparison | `{ "tabs": [{ "label": str, "content": "HTML str" }], "color": "#hex" }` |
| `quadrant` | 2×2 categorization, prioritization matrices | `{ "axisX": { "low": str, "high": str }, "axisY": { "low": str, "high": str }, "quadrants": [{ "label": str, "items": [str], "color": "#hex" }] }` |

**Choosing between them:**
- Comparing features/specs → `comparison-cards`
- Evaluating pros and cons → `pros-cons`
- Different perspectives on same topic → `tabbed-view`
- Categorizing by two dimensions → `quadrant`

**Quadrant order:** [top-left, top-right, bottom-left, bottom-right]

### Structure & Hierarchy

| vizType | Best for | Data shape |
|---------|----------|------------|
| `tiered-hierarchy` | Layers, stacks, hierarchies (fast→slow, abstract→concrete) | `{ "tiers": [{ "label": str, "detail": str, "color": "#hex", "width": number (100→40) }] }` |
| `timeline` | Historical events, milestones, evolution | `{ "events": [{ "date": str, "label": str, "detail?": str, "color": "#hex" }] }` |

### Specialized

| vizType | Best for | Data shape |
|---------|----------|------------|
| `token-stream` | Sequences, tokenization, step-by-step parsing | `{ "tokens": [str], "activeIndex": number, "color": "#hex" }` |
| `inline-svg` | Custom diagrams when no viz type fits (escape hatch) | `{ "svg": "<svg>...</svg>" }` |

---

## Content Patterns (in HTML)

These are used INSIDE the level content HTML. They are styled via CSS — no JavaScript needed.

### Callout Boxes

Highlight key information with typed callout boxes.

```html
<div class="callout" data-type="insight">Key insight or principle.</div>
<div class="callout" data-type="tip">Practical actionable advice.</div>
<div class="callout" data-type="warning">Common mistake or danger to avoid.</div>
<div class="callout" data-type="quote">"Quoted text." — Author</div>
```

**When to use:** Every section should have at least one callout. Use `insight` for the core takeaway, `tip` for practical advice, `warning` for pitfalls, `quote` for authoritative voices.

### Key Takeaway Box

Prominent summary box. Use at the end of a section or complex level to distill the most important points.

```html
<div class="takeaway">
  <ul>
    <li>Most important point from this section</li>
    <li>Second key point</li>
    <li>Third key point (optional)</li>
  </ul>
</div>
```

Or for a single-point takeaway:
```html
<div class="takeaway">
  The single most important idea: <strong>bold the key phrase</strong>.
</div>
```

### Do / Don't Blocks

Two-column best practice / anti-pattern comparison.

```html
<div class="do-dont">
  <div class="do">Best practice description. What to do and why.</div>
  <div class="dont">Anti-pattern description. What to avoid and why.</div>
</div>
```

### Styled Steps

Numbered process with optional time estimates. Distinct from `<ol>`.

```html
<div class="steps">
  <div class="step" data-time="5 min">First step description.</div>
  <div class="step" data-time="10 min">Second step description.</div>
  <div class="step">Third step (no time).</div>
</div>
```

### Vocabulary Grid

Compact term-definition grid for terminology-heavy sections.

```html
<div class="vocab-grid">
  <div class="vocab-term" data-term="TERM">Definition of the term.</div>
  <div class="vocab-term" data-term="ANOTHER">Another definition.</div>
</div>
```

### Expandable Concepts (inline)

Inline terms that expand to show definitions. Defined in the section's `concepts` JSON.

```html
<span class="concept-trigger" data-concept="concept-id">visible term</span>
```

### Citations

Inline references linked to the section's reference list.

```html
<a class="citation" href="#ref-SECTIONID-N">[N]</a>
```

### Standard HTML

Also available: `<p>`, `<h3>`, `<h4>`, `<strong>`, `<em>`, `<code>`, `<table>` (with `<th>`, `<tr>`, `<td>`), `<ul>`, `<ol>`, `<li>`.

**Never use:** `<script>`, `onclick`, `<style>`, or any JavaScript.

---

## Decision Guide: Picking the Right Visualization

```
Is it a process/workflow?
├── Linear? → pipeline
├── Has decisions/branching? → flowchart
├── Repeats cyclically? → cycle
└── Multiple inputs → single router → multiple outputs? → routing-diagram

Is it quantitative data?
├── 2-4 key numbers? → stat-cards
├── Comparing values across categories? → bar-chart
├── Showing percentages (0-100%)? → utilization-bars
└── 2D grid of values? → heatmap

Is it a comparison?
├── Feature-by-feature specs? → comparison-cards
├── Pros vs cons? → pros-cons
├── Different perspectives/approaches? → tabbed-view
└── Categorize by 2 axes? → quadrant

Is it structural?
├── Layered hierarchy (top→bottom)? → tiered-hierarchy
└── Events over time? → timeline

Is it a sequence of discrete items? → token-stream
Nothing fits? → inline-svg (escape hatch)
```

---

## Decision Guide: Picking Content Patterns

```
For each section, aim to include:

Level 1:
  - 1-2 concept triggers (expandable terms)
  - 1 callout (insight or tip)

Level 2:
  - Citations for factual claims
  - 1 callout (tip or warning)
  - 1 do-dont if applicable

Level 3:
  - Tables for benchmarks/specs
  - Steps for practical processes
  - Vocab grid if introducing 4+ new terms

Level 4:
  - Quote callout for notable researcher/paper
  - Key takeaway box summarizing the section

All levels:
  - Concept triggers for technical terms
  - Citations for sourced claims
```
