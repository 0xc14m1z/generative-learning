# Content Pipeline Architecture

Parallel, wave-based content generation with streaming event support.

---

## Overview

```
Wave 0: Structure      →  1 agent (sequential)
Wave 1: Content         →  N × 4 agents (parallel)
Wave 2: Enrichment      →  N agents (parallel)
Wave 3: Coherence       →  1 agent (sequential)
Wave 4: Inject          →  1 script (sequential)
```

For a 12-section explorer: Wave 1 runs 48 agents in parallel. Total agents: ~62.

---

## Wave 0: Structure Agent

**Input:** Topic from user.
**Output:** `structure.json` + `research-notes.md`

### Process

1. Web search the topic (5-15 searches, fetch key pages)
2. Map the concept tree, identify dependencies
3. Decompose into sections following the learning arc
4. For each section, write a detailed outline with per-level angles
5. Assign vizType, colors, icons, concepts

### Enhanced structure.json

This schema is defined in `template/src/schemas/structure.ts`.

Each section now includes an `outline` object that guides all downstream agents:

```json
{
  "topic": "The Art of Sourdough Bread",
  "coreQuestion": "...",
  "coreTension": "...",
  "sections": [
    {
      "id": "fermentation",
      "index": 3,
      "title": "Fermentation",
      "subtitle": "Where flavor and rise are born",
      "phase": "core",
      "color": "#22c55e",
      "icon": "🫧",
      "vizType": "cycle",
      "bridgeTo": "...",
      "concepts": ["wild-yeast", "lactic-acid", "autolyse"],
      "outline": {
        "core": "Yeast and bacteria convert sugars into CO2, alcohol, and organic acids. Temperature, time, and hydration control the balance between rise and flavor.",
        "keyPoints": [
          "Wild yeast (Saccharomyces) produces CO2 for rise",
          "Lactobacillus produces lactic acid (mild) and acetic acid (sharp)",
          "Temperature controls the yeast-to-bacteria ratio",
          "Bulk ferment, shaping, and cold proof are the three phases"
        ],
        "L1_angle": "Analogy: fermentation is a tiny factory — yeast workers produce gas (rise) while bacteria workers produce acid (flavor). Temperature is the thermostat.",
        "L2_angle": "The three variables a baker controls: temperature (warm=more yeast, cool=more bacteria), time (longer=more flavor), hydration (wetter=more open crumb). Practical timelines for each.",
        "L3_angle": "Bulk ferment timing tables by temperature. The poke test and aliquot jar method. Autolyse technique and its effect on gluten development. Common failure modes.",
        "L4_angle": "Gänzle (2014) on sourdough microbiology. Strain diversity across starters worldwide. The debate on starter vs commercial yeast flavor complexity. Open questions on flour microbiome."
      }
    }
  ],
  "phases": [...]
}
```

### Key principles for outline writing

- `core`: one sentence summary of the section's essential truth
- `keyPoints`: 3-5 factual points that ALL levels should be aware of
- `L1_angle` through `L4_angle`: the SPECIFIC direction each level takes
- Angles must be **mutually exclusive** — no overlap in what they cover
- Research notes should tag which sources are relevant to which section

---

## Wave 1: Content Agents (N × 4 parallel)

**Input per agent:** `structure.json` (full, for context) + `research-notes.md` + section outline
**Output per agent:** `sections/{id}/level-{N}.json`

### Output format

```json
{
  "sectionId": "fermentation",
  "level": 1,
  "html": "<p>Imagine a tiny factory inside your dough...</p>"
}
```

### Level constraints

Each level has strict scope boundaries to prevent overlap:

#### Level 1 — Intuition (~150-250 words)

**Audience:** Curious person who knows nothing about this.
**Must include:** One clear analogy or mental model. Why this matters. The core takeaway.
**Must NOT include:** Technical details, how-to steps, code, tables, citations, benchmarks.
**Allowed HTML:** `<p>`, `<strong>`, `<em>`, concept triggers.
**Tone:** Conversational, visual, engaging.

#### Level 2 — Practitioner (~200-400 words)

**Audience:** Someone who needs to use/apply this knowledge.
**Must include:** Step-by-step mechanism, trade-offs ("gain X but lose Y"), practical implications. Citations for factual claims.
**Must NOT include:** Implementation specifics, benchmarks, code, research papers, analogies.
**Allowed HTML:** `<p>`, `<h3>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<li>`, concept triggers, citations, callout (tip or warning), do-dont blocks.
**Tone:** Clear, practical, action-oriented.

#### Level 3 — Builder (~300-500 words)

**Audience:** Someone who needs to implement/build/execute this.
**Must include:** Concrete numbers, benchmarks, tables, techniques. All claims cited. Failure modes and how to debug.
**Must NOT include:** Basic explanations, analogies, research history, paper references.
**Allowed HTML:** `<p>`, `<h3>`, `<h4>`, `<strong>`, `<em>`, `<code>`, `<table>`, `<ul>`, `<ol>`, concept triggers, citations, steps, callout (tip), vocab-grid if introducing 4+ terms.
**Tone:** Precise, technical, reference-like.

#### Level 4 — Researcher (~300-600 words)

**Audience:** Expert who wants the frontier and historical context.
**Must include:** Named papers with authors and years. Historical evolution. Open problems and debates. "As of [year]" qualifiers.
**Must NOT include:** Basic explanations, how-to, analogies, practical advice.
**Allowed HTML:** `<p>`, `<h3>`, `<strong>`, `<em>`, `<code>`, `<ul>`, concept triggers, citations, callout (quote from notable figure), key takeaway box.
**Tone:** Academic, nuanced, forward-looking.

### Agent prompt template

```
You are writing Level {LEVEL} content for Section {INDEX} of {TOTAL} in a learning explorer about "{TOPIC}".

Section: {id} — {title} — {subtitle}
Phase: {phase}

OUTLINE:
Core: {outline.core}
Key points: {outline.keyPoints}
Your angle: {outline.L{LEVEL}_angle}

Full section list (for context):
{all sections with index, title, phase}

Research notes (relevant to this section):
{filtered research notes}

CONSTRAINTS:
{level-specific constraints from above}

OUTPUT:
Write ONLY the HTML content for this level. Output valid JSON:
{
  "sectionId": "{id}",
  "level": {LEVEL},
  "html": "<p>Your content here...</p>"
}

Save to: /tmp/explorer-data/sections/{id}/level-{LEVEL}.json
```

---

## Wave 2: Enrichment Agents (N parallel)

**Input per agent:** `structure.json` + all 4 level JSONs for the section + `research-notes.md`
**Output per agent:** `sections/{id}/enrichment.json`

### Output format

```json
{
  "sectionId": "fermentation",
  "visualization": {
    "type": "cycle",
    "data": {
      "nodes": [
        { "label": "Mixing", "detail": "Flour + water + starter", "color": "#22c55e" },
        { "label": "Bulk Ferment", "detail": "4-6 hours at room temp", "color": "#84cc16" },
        { "label": "Shaping", "detail": "Build surface tension", "color": "#eab308" },
        { "label": "Cold Proof", "detail": "12-18 hours in fridge", "color": "#06b6d4" }
      ],
      "centerLabel": "Bread Cycle"
    }
  },
  "concepts": {
    "wild-yeast": {
      "title": "Wild Yeast (Saccharomyces)",
      "body": "...",
      "context": "...",
      "linkedSectionId": null
    }
  },
  "deepDives": [
    {
      "id": "dd-fermentation-1",
      "title": "Deep Dive: Temperature and Flavor",
      "content": "<p>...</p>"
    }
  ],
  "references": [
    { "id": 1, "text": "Gänzle — \"Sourdough Microbiome\" (2014)", "url": "https://..." }
  ]
}
```

### Agent prompt template

```
You are the enrichment agent for Section {INDEX}: "{title}" in a learning explorer about "{TOPIC}".

Your job is to create the visualization, expandable concepts, deep dives, and reference list for this section.

SECTION METADATA:
{section from structure.json, including vizType and concepts list}

CONTENT ALREADY WRITTEN (read for context, do NOT rewrite):
Level 1: {level-1.json html}
Level 2: {level-2.json html}
Level 3: {level-3.json html}
Level 4: {level-4.json html}

RESEARCH NOTES:
{filtered research notes}

TASKS:
1. VISUALIZATION: Create data matching the "{vizType}" schema.
   Schema: {viz data shape from content-rendering-catalog.md}

2. CONCEPTS: For each concept ID in [{concepts list}], write:
   - title: full name
   - body: 50-150 words explanation
   - context: why it matters in this section
   - linkedSectionId: ID of related section, or null

3. DEEP DIVES: 1-2 collapsible panels going deeper on a specific aspect.

4. REFERENCES: Every source cited in the levels, formatted as:
   { "id": N, "text": "Author — \"Title\" (Year)", "url": "https://..." }

OUTPUT: Valid JSON matching the enrichment schema.
Save to: /tmp/explorer-data/sections/{id}/enrichment.json
```

---

## Wave 3: Coherence Agent

**Input:** All files from all waves.
**Output:** `content.json` (final merged file)

### Process

1. **Merge** all section files into content.json format
2. **Insert concept triggers** into level HTML where concept terms appear
3. **Verify cross-references:**
   - Every `linkedSectionId` in concepts points to a real section
   - Every citation `[N]` has a matching reference
   - bridgeTo narratives are consistent
4. **Terminology check:** same concept is called the same thing across all levels
5. **Completeness check:** every section has all 4 levels, viz, concepts, references
6. **Quality gates:**
   - Level 1 has NO tables, NO code, NO citations
   - Level 2 has at least 1 citation
   - Level 3 has at least 1 table OR code block
   - Level 4 references at least 1 paper by name

### Output

Final `content.json` matching the standard schema, ready for injection.

---

## File System Layout

```
/tmp/explorer-data/
├── structure.json                  ← Wave 0
├── research-notes.md               ← Wave 0
├── sections/
│   ├── overview/
│   │   ├── level-1.json            ← Wave 1
│   │   ├── level-2.json            ← Wave 1
│   │   ├── level-3.json            ← Wave 1
│   │   ├── level-4.json            ← Wave 1
│   │   └── enrichment.json         ← Wave 2
│   ├── fermentation/
│   │   ├── level-1.json
│   │   ├── level-2.json
│   │   ├── level-3.json
│   │   ├── level-4.json
│   │   └── enrichment.json
│   └── ... (one dir per section)
└── content.json                    ← Wave 3 (final output)
```

---

## Streaming Event Protocol

For FastAPI / WebSocket streaming to the UI.

### Event format

```json
{
  "wave": 0,
  "event": "structure_complete",
  "data": { "sectionCount": 12 },
  "timestamp": "2026-03-16T10:00:01Z"
}
```

### Event types

| Wave | Event | Data | Description |
|------|-------|------|-------------|
| 0 | `research_started` | `{ topic }` | Research phase begins |
| 0 | `structure_complete` | `{ sectionCount, sections: [{ id, title }] }` | structure.json ready |
| 1 | `level_started` | `{ sectionId, level }` | Agent spawned for this level |
| 1 | `level_complete` | `{ sectionId, level, wordCount }` | Level content written |
| 1 | `wave_1_complete` | `{ sectionsCompleted }` | All level content ready |
| 2 | `enrichment_started` | `{ sectionId }` | Enrichment agent spawned |
| 2 | `enrichment_complete` | `{ sectionId, vizType, conceptCount, refCount }` | Section enrichment ready |
| 2 | `wave_2_complete` | `{ sectionsCompleted }` | All enrichments ready |
| 3 | `coherence_started` | `{}` | Merge and verification begins |
| 3 | `coherence_issue` | `{ sectionId, issue, severity }` | Problem found (info only) |
| 3 | `coherence_complete` | `{ totalSections, totalWords, totalRefs }` | content.json ready |
| 4 | `inject_complete` | `{ outputPath, fileSize }` | HTML file ready |
| - | `error` | `{ wave, sectionId?, message }` | Agent failure |

### UI rendering from events

The UI shows a matrix that fills in real-time:

```
Section              L1   L2   L3   L4   Enrich
─────────────────────────────────────────────────
§1 Origins           ✓    ✓    ✓    ✓    ✓
§2 Ingredients       ✓    ✓    ✓    ◌    ◌
§3 Fermentation      ✓    ✓    ◌    ◌    ◌
§4 Shaping           ✓    ◌    ◌    ◌    ◌
§5 Baking            ◌    ◌    ◌    ◌    ◌
...
─────────────────────────────────────────────────
◌ = in progress / queued    ✓ = complete
```

---

## Error Handling & Retry

- Each agent produces one small, independent file
- If an agent fails, only that file is missing
- The orchestrator can retry individual agents without re-running the wave
- The coherence agent reports missing files as `coherence_issue` events
- Max retries per agent: 2 (then report error and continue)

---

## Concurrency Limits

- Wave 1 spawns up to N×4 agents. For 12 sections = 48 agents.
- Depending on the platform, limit concurrent agents:
  - Claude Code: limited by available subagent slots
  - FastAPI + API calls: configurable, recommended max 10-20 concurrent
- If limited, process in batches within the wave (e.g., 4 sections at a time × 4 levels = 16 agents)
