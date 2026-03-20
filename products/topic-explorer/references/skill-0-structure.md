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

#### Learning arc phases

Every topic follows a learning arc from "what is this?" to "putting it all together". The phases are the same whether the topic is technical or not — what changes is the content inside them.

| Phase | Purpose | Examples (technical) | Examples (non-technical) |
|-------|---------|---------------------|------------------------|
| `orientation` | What is this? Why should I care? Core tension. | "The GPU bottleneck in LLM serving" | "Why sourdough tastes different from store bread" |
| `prerequisites` | Concepts the reader needs before diving in. | "Attention mechanism basics", "GPU memory hierarchy" | "Gluten 101", "Yeast vs bacteria" |
| `core` | The heart of the topic. Main mechanisms, processes, ideas. | "KV-cache", "Continuous batching", "PagedAttention" | "Mixing", "Fermentation", "Shaping", "Baking" |
| `advanced` | Complexity that builds on the core. Nuances, edge cases, scaling. | "Multi-GPU parallelism", "Speculative decoding" | "Hydration extremes", "Ancient grains", "Altitude baking" |
| `ecosystem` | Real-world context: tools, systems, culture, community. | "vLLM vs TGI vs TensorRT-LLM" | "Flour brands", "Oven types", "Baker communities" |
| `synthesis` | Tie it all together. What to do next. | "Choosing your stack" | "Your first bake plan" |

**Rules:**
- `orientation` and `synthesis` are always present (1 section each)
- `prerequisites`: 0-4 sections. Skip only if the topic is truly self-contained.
- `core`: 2-8 sections. This is where most sections live.
- `advanced`: 0-4 sections. Skip for introductory topics.
- `ecosystem`: 0-3 sections. Skip if the topic has no tooling/community dimension.

#### Sizing guide

The number of sections depends on topic complexity, not a fixed range.

| Topic type | Sections | Example |
|-----------|----------|---------|
| Focused concept | 6-8 | "How HTTPS works", "The Pomodoro technique" |
| Broad discipline | 10-14 | "LLM inference optimization", "Sourdough from scratch" |
| Deep specialization | 12-16 | "Kubernetes networking", "Wine fermentation chemistry" |

When in doubt: more sections, more prerequisites, more depth.

### 4. Write per-section outlines

**This is critical.** Each section needs an `outline` object that guides ALL downstream agents. The outline prevents content overlap between levels by giving each level a specific, exclusive angle.

See `core/template/src/schemas/structure.ts` → `SectionOutline` for exact field requirements.

For each section, write:

- `core`: One sentence — the essential truth of this section
- `keyPoints`: 3-5 factual bullets that ALL levels should be aware of
- `L1_angle`: What the intuition/analogy level should cover. NO technical detail.
- `L2_angle`: What the practitioner level should cover. Practical, step-by-step.
- `L3_angle`: What the builder level should cover. Implementation, benchmarks, tables.
- `L4_angle`: What the researcher level should cover. Papers, history, open problems.

**The angles MUST be mutually exclusive.** If L2 covers "the three variables a baker controls", L3 should NOT re-explain them — it should cover "timing tables and failure modes" instead.

**Writing voice in outlines:** The outline sets the tone for all downstream content. Use precise, jargon-free language. If a term is technical, include a parenthetical gloss — agents inherit whatever terminology you use here.

### 5. Assign visualization types

Pick from the 21 types defined in `core/template/src/schemas/viz-types.ts`. Read `core/references/content-rendering-catalog.md` for the decision guide and all data shapes.

Viz types work for any domain:

| What you're showing | Viz type | Works for |
|--------------------|---------|----|
| Sequential process | `pipeline` | Baking stages, CI/CD, HTTP lifecycle |
| Decision logic | `flowchart` | Troubleshooting bread, debugging, choosing a framework |
| Repeating process | `cycle` | Feedback loops, fermentation cycle, sprint planning |
| Fan-in/fan-out | `routing-diagram` | Request routing, ingredient substitutions |
| Key numbers | `stat-cards` | Nutritional facts, latency benchmarks |
| Category comparison | `bar-chart` | Flour protein %, framework popularity |
| Percentage bars | `utilization-bars` | Resource usage, hydration levels |
| 2D intensity | `heatmap` | Schedule, correlation matrix, flavor pairing |
| Trends | `xy-plot` | Fermentation curve, growth over time |
| Part-of-whole | `composition-stack` | Budget, ingredient ratios, time allocation |
| Feature comparison | `comparison-cards` | Tools, plans, versions |
| Trade-offs | `pros-cons` | Architecture choices, technique trade-offs |
| Multiple angles | `tabbed-view` | Perspectives, config variants |
| 2×2 matrix | `quadrant` | Prioritization, effort/impact |
| Hierarchy | `tiered-hierarchy` | Memory layers, abstraction levels, taxonomy |
| Chronological | `timeline` | History, milestones, roadmap |
| Spectrum | `continuum-scale` | pH, risk, roast level, difficulty |
| Concept relationships | `concept-map` | Module deps, taxonomy, philosophical schools |
| Weighted flow | `sankey-flow` | Energy flow, budget allocation, calorie breakdown |
| Token/step sequence | `token-stream` | Parsing, step-by-step processing |
| Custom | `inline-svg` | Escape hatch for anything else |

### 6. Assign colors

Use this palette sequentially. For topics with more than 14 sections, cycle back to the start with lighter variants.

```
#3b82f6 #8b5cf6 #a855f7 #6366f1 #06b6d4 #14b8a6 #22c55e #84cc16 #eab308 #f97316 #ef4444 #ec4899 #d946ef #64748b
```

### 7. Write structure.json

Save to `/tmp/explorer-data/structure.json`.

> **Note:** The structure.json must conform to the Zod schema in `core/template/src/schemas/structure.ts`. Read it for exact field constraints.

Every section needs: `id`, `index`, `title`, `subtitle`, `phase`, `color`, `icon`, `concepts` (list of concept IDs), `vizType`, `bridgeTo`, `outline` (with `core`, `keyPoints`, `L1_angle`, `L2_angle`, `L3_angle`, `L4_angle`).

Example section (non-technical):

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

Example section (technical):

```json
{
  "id": "paged-attention",
  "index": 5,
  "title": "PagedAttention",
  "subtitle": "Virtual memory for the KV-cache",
  "phase": "core",
  "color": "#06b6d4",
  "icon": "📄",
  "vizType": "concept-map",
  "bridgeTo": "With memory managed efficiently, we can now batch many requests together.",
  "concepts": ["kv-cache", "memory-fragmentation", "copy-on-write"],
  "outline": {
    "core": "PagedAttention applies OS-style virtual memory to the KV-cache, eliminating fragmentation and enabling memory sharing across requests.",
    "keyPoints": [
      "KV-cache grows linearly with sequence length and batch size",
      "Naive allocation wastes 60-80% of GPU memory to fragmentation",
      "Paging splits the cache into fixed-size blocks mapped via a block table",
      "Copy-on-write enables zero-copy beam search and parallel sampling"
    ],
    "L1_angle": "Analogy: a library with fixed-size shelves. Instead of reserving a whole bookcase per reader, books go on any free shelf and a card catalog tracks where they are.",
    "L2_angle": "What changes for the practitioner: memory utilization jumps from ~20% to ~95%. How to configure block size. When paging helps most (long sequences, large batches).",
    "L3_angle": "Block table data structure. Memory allocation algorithm. Benchmark tables: throughput vs batch size with/without paging. Debugging OOM with paged vs unpaged.",
    "L4_angle": "Kwon et al. (2023) PagedAttention paper. Comparison with RadixAttention (SGLang). Open problem: optimal block size selection. Interaction with tensor parallelism."
  }
}
```

### 8. Write research notes

Save to `/tmp/explorer-data/research-notes.md` with:
- Key findings per section (tagged with section ID)
- Citation inventory (URLs + titles + relevance)
- Source quality notes
