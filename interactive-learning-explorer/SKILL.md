---
name: interactive-learning-explorer
description: Build comprehensive, multi-layered interactive learning experiences on any topic, delivered as a single self-contained HTML file. Use this skill whenever the user wants to create an educational app, interactive explainer, learning module, step-by-step tutorial, progressive-disclosure walkthrough, or deep-dive learning platform — especially if they mention terms like "explorer", "learning experience", "interactive guide", "explain X to me interactively", "teach me about Y", "build a course on Z", or want to turn a complex topic into a navigable educational resource. Also triggers when the user wants a presentation-ready breakdown with citations and multiple depth levels. Always use this skill even for casual requests like "help me understand X deeply" or "build something that teaches Y".
---

# Interactive Learning Explorer

Build comprehensive, citation-backed, multi-depth interactive learning experiences on any topic — delivered as a single self-contained HTML file.

## Architecture

The skill ships a **pre-compiled HTML shell** (`prebuild/shell.html`) containing the entire React app — UI components, 16 visualization types, depth slider, expandable concepts, dark/light theme, sidebar, animations. Pre-built, never modified during content generation.

Content generation produces **two JSON files** (`structure.json` and `content.json`) via a **wave-based parallel pipeline**. A Python script injects them into the shell.

```
Wave 0: Structure    →  structure.json + research-notes.md
Wave 1: Content      →  sections/{id}/level-{1,2,3,4}.json  (N×4 parallel)
Wave 2: Enrichment   →  sections/{id}/enrichment.json       (N parallel)
Wave 3: Coherence    →  content.json                        (merge + verify)
Wave 4: Inject       →  output.html
```

## Reference files

Read before starting:
- `references/content-rendering-catalog.md` — All 16 viz types, all content patterns, data shapes, decision guides. **Read first.**
- `references/schema.md` — JSON schema contract for structure.json and content.json
- `references/architecture-content-pipeline.md` — Detailed wave architecture, prompt templates, event protocol

Sub-skill guides:
- `references/skill-0-structure.md` — Wave 0: Research & produce structure.json
- `references/skill-1-content.md` — Wave 1: Parallel level content agents
- `references/skill-2-enrichment.md` — Wave 2: Viz, concepts, deep dives, references
- `references/skill-3-coherence.md` — Wave 3: Merge, verify, produce content.json
- `references/skill-4-inject.md` — Wave 4: Inject into shell, deliver HTML

## Workflow (fully autonomous)

### Setup

```bash
mkdir -p /tmp/explorer-data/sections
```

### Wave 0: Research & Structure

Follow `references/skill-0-structure.md`:
1. Web search the topic (5-15 searches, fetch full pages)
2. Map the concept tree, identify dependencies
3. Decompose into sections following the learning arc
4. For each section, write a detailed **outline with per-level angles**
5. Assign visualization types, colors, icons
6. Write `/tmp/explorer-data/structure.json`
7. Write `/tmp/explorer-data/research-notes.md`

### Wave 1: Level Content (PARALLEL — N×4 agents)

Follow `references/skill-1-content.md`:
1. For each section, spawn 4 agents in parallel (one per level)
2. Each agent writes ONLY its level's HTML content
3. Output: `/tmp/explorer-data/sections/{id}/level-{1,2,3,4}.json`

All N×4 agents run in the same turn. For 12 sections = 48 parallel agents.

### Wave 2: Enrichment (PARALLEL — N agents)

Follow `references/skill-2-enrichment.md`:
1. For each section, spawn 1 agent
2. Each reads all 4 levels + structure to produce viz, concepts, deep dives, references
3. Output: `/tmp/explorer-data/sections/{id}/enrichment.json`

### Wave 3: Coherence & Merge

Follow `references/skill-3-coherence.md`:
1. Merge all section files into content.json
2. Insert concept triggers into level HTML
3. Verify cross-references, terminology, quality gates
4. Output: `/tmp/explorer-data/content.json`

### Wave 4: Inject & Deliver

Follow `references/skill-4-inject.md`:
```bash
python3 [this-skill-path]/prebuild/inject.py \
  [this-skill-path]/prebuild/shell.html \
  /tmp/explorer-data/structure.json \
  /tmp/explorer-data/content.json \
  /mnt/user-data/outputs/[topic]-explorer.html
```

Present the file to the user. Done.

## Operating principles

1. **Fully autonomous.** Never ask for confirmation. Deliver a complete explorer.
2. **When in doubt, more.** More sections, more depth, more prerequisites, more expandable concepts, more citations.
3. **Depth is the product.** Content quality over everything.
4. **Four levels always.** Every section, all four depth levels.
5. **Levels are parallel perspectives.** L1=intuition, L2=practical, L3=technical, L4=research. They derive from the same outline, not from each other.
6. **Every concept is expandable.** Significant terms become expandable nodes.
7. **Citations are mandatory.** Every factual claim at Level 2+ needs a source.
8. **Prerequisites are explicit.** Include prerequisite sections for concepts the learner may not know.
9. **Never modify the shell.** Only produce JSON data. The UI is pre-built.
10. **Small agents, clear scope.** Each agent writes one small file. Failure is isolated and retryable.

## What the pre-built shell provides

- **Dark/light theme toggle** (shadcn-style with Tailwind CSS)
- **4-level depth slider** (Intuition → Practitioner → Builder → Researcher)
- **Expandable inline concepts** with cross-section links
- **16 parametric visualizations:** Pipeline, Flowchart, Cycle, RoutingDiagram, StatCards, BarChart, UtilizationBars, Heatmap, ComparisonCards, ProsCons, TabbedView, Quadrant, TieredHierarchy, Timeline, TokenStream, InlineSvg
- **Content patterns:** Callout boxes (insight/tip/warning/quote), Key Takeaway, Do/Don't, Styled Steps, Vocabulary Grid
- **Sidebar** with phase grouping and progress indicators
- **Keyboard navigation** (arrows + number keys) and auto-play
- **Collapsible deep-dive panels** and per-section citation references
- **Responsive layout** (sidebar collapses on mobile)

## Developing the UI

The `template/` directory contains the full TypeScript React source.

### Quick start (dev server with sample data)

```bash
cd [this-skill-path]/template
npm install
npm run dev
```

Opens at `http://localhost:5173` with comprehensive sample data (12 sections, all viz types). Vite HMR reloads the page instantly when you edit components or sample data.

### Storybook (component isolation)

```bash
npm run storybook
```

Opens at `http://localhost:6006`. Stories for all 16 viz types and all content patterns, with dark/light mode toggle.

### Previewing generated content

```bash
npm run preview:data -- /tmp/explorer-data
npm run dev
```

### Rebuilding the shell (after UI changes)

```bash
cd [this-skill-path]/template
npm install
npx vite build
cp dist/index.html [this-skill-path]/prebuild/shell.html
```

This is a skill maintenance task. Content generation never rebuilds the shell.
