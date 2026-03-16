# Wave 0: Research & Structure

**Input:** A topic from the user.
**Output:** `structure.json` + `research-notes.md`

## Process

### 1. Research the topic

Use web search extensively (5-15 searches). Fetch full pages from the best sources.
- Breadth search: map the landscape, major subtopics, phases, debates
- Depth search: authoritative sources per subtopic — docs, papers, eng blogs
- Citation inventory: record URLs and titles for every major claim/number

Save findings to `/tmp/explorer-data/research-notes.md`.

### 2. Map the concept tree

1. List every concept, mechanism, subsystem, phase, tool, technique
2. Identify dependencies (what must be understood first)
3. Separate prerequisites (not part of main topic, but needed) from core concepts
4. Identify expandable terms (50-300 word inline explanation) vs. section-worthy concepts

### 3. Decompose into sections

Follow the universal learning arc:

| Phase | Purpose | Count |
|-------|---------|-------|
| orientation | What is this? Core tension. | 1 |
| prerequisites | Concepts needed before the core. | 1-4 |
| core | The heart of the topic. | 2-6 |
| scale | Real-world complexity. | 1-4 |
| optimization | Cutting-edge techniques. | 1-3 |
| ecosystem | Real tools, systems, hardware. | 1-3 |
| synthesis | Tie it together. | 1 |

When in doubt: more sections, more prerequisites, more depth.

### 4. Write per-section outlines

**This is critical.** Each section needs an `outline` object that guides ALL downstream agents. The outline prevents content overlap between levels by giving each level a specific, exclusive angle.

For each section, write:

- `core`: One sentence — the essential truth of this section
- `keyPoints`: 3-5 factual bullets that ALL levels should be aware of
- `L1_angle`: What the intuition/analogy level should cover. NO technical detail.
- `L2_angle`: What the practitioner level should cover. Practical, step-by-step.
- `L3_angle`: What the builder level should cover. Implementation, benchmarks, tables.
- `L4_angle`: What the researcher level should cover. Papers, history, open problems.

**The angles MUST be mutually exclusive.** If L2 covers "the three variables a baker controls", L3 should NOT re-explain them — it should cover "timing tables and failure modes" instead.

### 5. Assign visualization types

Pick from the 16 types. Read `references/content-rendering-catalog.md` for the decision guide and all data shapes.

### 6. Assign colors

Use this palette sequentially: `#3b82f6 #8b5cf6 #a855f7 #6366f1 #06b6d4 #14b8a6 #22c55e #84cc16 #eab308 #f97316 #ef4444 #ec4899 #d946ef #64748b`

### 7. Write structure.json

Save to `/tmp/explorer-data/structure.json`.

Every section needs: `id`, `index`, `title`, `subtitle`, `phase`, `color`, `icon`, `concepts` (list of concept IDs), `vizType`, `bridgeTo`, `outline` (with `core`, `keyPoints`, `L1_angle`, `L2_angle`, `L3_angle`, `L4_angle`).

Example section:

```json
{
  "id": "fermentation",
  "index": 3,
  "title": "Fermentation",
  "subtitle": "Where flavor and rise are born",
  "phase": "core",
  "color": "#22c55e",
  "icon": "🫧",
  "vizType": "cycle",
  "bridgeTo": "With the dough risen, shaping gives it structure.",
  "concepts": ["wild-yeast", "lactic-acid", "autolyse"],
  "outline": {
    "core": "Yeast and bacteria convert sugars into CO2, alcohol, and organic acids.",
    "keyPoints": [
      "Wild yeast produces CO2 for rise",
      "Lactobacillus produces lactic and acetic acid for flavor",
      "Temperature controls yeast-to-bacteria ratio",
      "Three phases: bulk ferment, shaping, cold proof"
    ],
    "L1_angle": "Analogy: tiny factory — yeast workers produce gas, bacteria produce acid. Temperature is the thermostat.",
    "L2_angle": "The three variables: temperature, time, hydration. Practical timelines for warm vs cold fermentation.",
    "L3_angle": "Bulk ferment timing tables by temperature. Poke test and aliquot jar. Autolyse effect on gluten. Common failure modes and fixes.",
    "L4_angle": "Gänzle (2014) on sourdough microbiology. Strain diversity across starters. Commercial vs wild yeast flavor debate. Open questions on flour microbiome."
  }
}
```

### 8. Write research notes

Save to `/tmp/explorer-data/research-notes.md` with:
- Key findings per section (tagged with section ID)
- Citation inventory (URLs + titles + relevance)
- Source quality notes
