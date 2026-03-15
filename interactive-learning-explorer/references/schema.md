# Data Schemas

The contract between Skills 1, 2, and 3. Both JSON files must conform exactly.

## structure.json

```json
{
  "topic": "How LLM Inference Works at Scale",
  "coreQuestion": "How do large language models serve millions of requests?",
  "coreTension": "Prefill is compute-bound; decode is memory-bandwidth-bound.",
  "sections": [
    {
      "id": "overview",
      "index": 0,
      "title": "Overview",
      "subtitle": "The inference pipeline and core tensions",
      "phase": "orientation",
      "color": "#3b82f6",
      "icon": "◎",
      "concepts": ["prefill", "decode", "kv-cache"],
      "vizType": "pipeline",
      "bridgeTo": "What transformers are and why their architecture matters"
    }
  ],
  "phases": [
    { "id": "orientation", "label": "Orientation" },
    { "id": "prerequisites", "label": "Prerequisites" },
    { "id": "core", "label": "Core Mechanism" },
    { "id": "scale", "label": "Scale & Complexity" },
    { "id": "optimization", "label": "Optimization" },
    { "id": "ecosystem", "label": "Ecosystem" },
    { "id": "synthesis", "label": "Synthesis" }
  ]
}
```

### Visualization types (vizType values)

| vizType | Best for |
|---------|----------|
| `pipeline` | Sequential processes, lifecycles |
| `comparison-cards` | Hardware generations, before/after |
| `utilization-bars` | Resource usage, bottlenecks |
| `token-stream` | Tokenization, sequences, generation |
| `heatmap` | Schedules, correlations, frequency data |
| `tiered-hierarchy` | Hierarchies, stacks, layers |
| `routing-diagram` | Fan-in/fan-out routing, load balancing |
| `stat-cards` | Key metrics, specs, KPIs |
| `tabbed-view` | Comparing approaches, multi-perspective |
| `bar-chart` | Quantities, comparisons, distributions |
| `inline-svg` | Custom diagrams (escape hatch) |
| `timeline` | Historical events, milestones, evolution |
| `flowchart` | Decision trees, branching processes, troubleshooting |
| `pros-cons` | Trade-off analysis, option comparison with +/- |

## content.json

```json
{
  "sections": [
    {
      "id": "overview",
      "levels": {
        "1": "<p>HTML content for Level 1...</p>",
        "2": "<h3>Heading</h3><p>Level 2 content...</p>",
        "3": "<h3>Heading</h3><p>Level 3 content...</p>",
        "4": "<h3>Heading</h3><p>Level 4 content...</p>"
      },
      "visualization": {
        "type": "pipeline",
        "data": { "stages": [{ "label": "Step", "color": "#3b82f6", "active": true }] }
      },
      "concepts": {
        "concept-id": {
          "title": "Full Name",
          "body": "50-200 word explanation.",
          "context": "Why it matters here.",
          "linkedSectionId": "other-section-id"
        }
      },
      "deepDives": [
        { "id": "dd-id", "title": "Deep Dive: Topic", "content": "<p>HTML...</p>" }
      ],
      "references": [
        { "id": 1, "text": "Author — \"Title\" (Year)", "url": "https://..." }
      ]
    }
  ]
}
```

### HTML content rules

- Use: `<p>`, `<h3>`, `<h4>`, `<strong>`, `<em>`, `<code>`, `<table>`, `<ul>`, `<ol>`
- Expandable concepts: `<span class="concept-trigger" data-concept="id">term</span>`
- Citations: `<a class="citation" href="#ref-SECTIONID-N">[N]</a>`
- No `<script>`, no `onclick`, no JavaScript

#### Callout boxes (styled via CSS)

```html
<div class="callout" data-type="insight">Key insight text here.</div>
<div class="callout" data-type="tip">Practical tip text here.</div>
<div class="callout" data-type="warning">Warning or common mistake.</div>
<div class="callout" data-type="quote">"Quoted text here." — Author</div>
```

#### Do / Don't blocks

```html
<div class="do-dont">
  <div class="do">Best practice text here.</div>
  <div class="dont">Anti-pattern or mistake to avoid.</div>
</div>
```

#### Styled steps (numbered, with optional time)

```html
<div class="steps">
  <div class="step" data-time="5 min">First step description.</div>
  <div class="step" data-time="10 min">Second step description.</div>
  <div class="step">Third step (no time estimate).</div>
</div>
```

### Visualization data shapes

**pipeline:** `{ "stages": [{ "label": "str", "color": "#hex", "active?": bool }] }`
**comparison-cards:** `{ "cards": [{ "title": "str", "color": "#hex", "rows": [{ "label": "str", "value": "str", "badge?": "str" }] }] }`
**utilization-bars:** `{ "bars": [{ "label": "str", "value": number, "color": "#hex" }], "legend?": "str" }`
**token-stream:** `{ "tokens": ["str"], "activeIndex": number, "color": "#hex" }`
**heatmap:** `{ "xLabels": ["str"], "yLabels": ["str"], "cells": [[number 0-1]], "color": "#hex", "legend?": "str" }`
**tiered-hierarchy:** `{ "tiers": [{ "label": "str", "detail": "str", "color": "#hex", "width": n }] }`
**routing-diagram:** `{ "inputs": [{ "label": "str", "color": "#hex" }], "router": { "label": "str", "sublabel?": "str" }, "outputs": [{ "label": "str", "active": bool }], "color": "#hex" }`
**stat-cards:** `{ "cards": [{ "value": "str", "unit": "str", "color": "#hex" }] }`
**tabbed-view:** `{ "tabs": [{ "label": "str", "content": "HTML str" }], "color": "#hex" }`
**bar-chart:** `{ "bars": [{ "label": "str", "value": number, "color?": "#hex" }], "unit?": "str", "maxValue?": number }`
**inline-svg:** `{ "svg": "<svg>...</svg>" }`
**timeline:** `{ "events": [{ "date": "str", "label": "str", "detail?": "str", "color": "#hex" }] }`
**flowchart:** `{ "nodes": [{ "id": "str", "label": "str", "type": "decision"|"outcome"|"step", "color?": "#hex" }], "edges": [{ "from": "str", "to": "str", "label?": "str" }] }`
**pros-cons:** `{ "options": [{ "title": "str", "color": "#hex", "pros": ["str"], "cons": ["str"] }] }`
