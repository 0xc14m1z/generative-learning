---
name: interactive-learning-explorer
description: Build comprehensive, multi-layered interactive learning experiences on any technical topic, delivered as a single self-contained HTML file. Use this skill whenever the user wants to create an educational app, interactive explainer, learning module, step-by-step technical tutorial, progressive-disclosure walkthrough, or deep-dive learning platform — especially if they mention terms like "explorer", "learning experience", "interactive guide", "explain X to me interactively", "teach me about Y", "build a course on Z", or want to turn a complex topic into a navigable educational resource. Also triggers when the user wants a presentation-ready technical breakdown with citations and multiple depth levels. Always use this skill even for casual requests like "help me understand X deeply" or "build something that teaches Y".
---

# Interactive Learning Explorer

Build comprehensive, citation-backed, multi-depth interactive learning experiences on any topic — delivered as a single self-contained HTML file.

## Architecture

The skill ships a **pre-compiled HTML shell** (in `prebuild/shell.html`) that contains the entire React app — UI components, 10 visualization types, depth slider, expandable concepts, dark/light theme, sidebar, animations. All pre-built, pre-tested, never modified during content generation.

Content generation produces **two JSON files** (`structure.json` and `content.json`). A Python script injects them into the shell. No npm, no Vite, no TypeScript, no build step at content time.

```
[Skill 1: Research]  →  structure.json + research-notes.md
[Skill 2: Content]   →  content.json
[Skill 3: Inject]    →  python3 inject.py shell.html structure.json content.json output.html
```

## Reference files

Read before starting:
- `references/schema.md` — Data contract for both JSON files and all visualization data shapes. **Read first.**
- `references/skill-1-research.md` — Research the topic, produce structure.json
- `references/skill-2-content.md` — Write content at four depth levels, produce content.json
- `references/skill-3-build.md` — Inject data into shell, deliver HTML

## Workflow (fully autonomous)

### Phase 1: Setup

```bash
mkdir -p /tmp/explorer-data /tmp/explorer-sections
```

### Phase 2: Research & Structure

Follow `references/skill-1-research.md`:
1. Web search the topic (5-15 searches, fetch full pages)
2. Map the concept tree, identify dependencies
3. Decompose into sections following the learning arc
4. Assign visualization types, colors, icons
5. Write `/tmp/explorer-data/structure.json`
6. Write `/tmp/explorer-data/research-notes.md`

### Phase 3: Content Writing (PARALLEL SUBAGENTS)

Follow `references/skill-2-content.md`:
1. Spawn one subagent per section — each writes its content as JSON
2. Merge all into `/tmp/explorer-data/content.json`
3. Run a coherence pass (forward/backward refs, concept links, narrative arc)

### Phase 4: Inject & Deliver

Follow `references/skill-3-build.md`:
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
5. **Every concept is expandable.** Significant terms become expandable nodes.
6. **Citations are mandatory.** Every factual claim at Level 2+ needs a source.
7. **Prerequisites are explicit.** Include prerequisite sections for concepts the learner may not know.
8. **Never modify the shell.** Only produce JSON data. The UI is pre-built.

## What the pre-built shell provides

- **Dark/light theme toggle** (shadcn-style with Tailwind CSS)
- **4-level depth slider** (Intuition → Practitioner → Builder → Researcher)
- **Expandable inline concepts** with cross-section links
- **10 parametric visualizations:** Pipeline, ComparisonCards, UtilizationBars, TokenStream, AnimatedGrid, TieredHierarchy, RoutingDiagram, StatCards, TabbedView, ComputeWave (+ InlineSvg escape hatch)
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

### Previewing generated content

To preview specific generated JSON files without rebuilding:

```bash
# Option A: use the preview script
npm run preview:data -- /tmp/explorer-data
npm run dev

# Option B: manually copy files
cp /tmp/explorer-data/structure.json public/dev-data/
cp /tmp/explorer-data/content.json public/dev-data/
npm run dev
```

The app auto-detects files in `public/dev-data/` during development and loads them instead of the built-in sample data. When `dev-data/` files change, the page auto-reloads.

### Rebuilding the shell (after UI changes)

```bash
cd [this-skill-path]/template
npm install
npx vite build
cp dist/index.html [this-skill-path]/prebuild/shell.html
```

This is a skill maintenance task. Content generation never rebuilds the shell.
