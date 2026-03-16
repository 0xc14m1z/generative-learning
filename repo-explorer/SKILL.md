---
name: repo-explorer
description: Generate an interactive learning experience that teaches how a GitHub repository works — its architecture, patterns, data flow, and key decisions. Use this skill when the user provides a GitHub URL and wants to understand, onboard onto, or document a codebase. Triggers on phrases like "explain this repo", "help me understand this codebase", "generate docs for this repo", "onboard me onto this project", "how does this repo work?", or any request to create an interactive walkthrough of a GitHub project.
---

# Repo Explorer

Generate an interactive, multi-depth learning experience that explains how a GitHub repository works — delivered as a single self-contained HTML file.

## How it works

This skill **reuses the Interactive Learning Explorer UI** (same shell, same 21 viz types, same content patterns) but replaces web research with **codebase analysis**. Instead of searching the web, it reads the actual code to produce a learning experience tailored to a specific repository.

```
Wave 0: Analysis     →  structure.json + analysis-notes.md
Wave 1: Content      →  sections/{id}/level-{1,2,3,4}.json  (N×4 parallel)
Wave 2: Enrichment   →  sections/{id}/enrichment.json       (N parallel)
Wave 3: Coherence    →  content.json                        (merge + verify)
Wave 4: Inject       →  output.html
```

## Shared infrastructure

This skill uses the pre-built shell from `interactive-learning-explorer`:
- **Shell:** `interactive-learning-explorer/prebuild/shell.html`
- **Inject script:** `interactive-learning-explorer/prebuild/inject.py`
- **Zod schemas:** `interactive-learning-explorer/template/src/schemas/`
- **Content catalog:** `interactive-learning-explorer/references/content-rendering-catalog.md`
- **Validate script:** `cd interactive-learning-explorer/template && npm run validate`

## Reference files

- `references/skill-0-analysis.md` — Wave 0: Clone, analyze, produce structure.json
- `references/skill-1-content.md` — Wave 1: Write level content (same constraints as learning explorer)
- `references/skill-2-enrichment.md` — Wave 2: Viz, concepts, deep dives, references
- `references/skill-3-coherence.md` — Wave 3: Merge, verify, produce content.json
- `references/skill-4-inject.md` — Wave 4: Inject into shell

Waves 1-4 follow the same architecture as `interactive-learning-explorer`. The key difference is **Wave 0**: instead of web research, it performs codebase analysis.

## Workflow (fully autonomous)

### Setup

```bash
mkdir -p /tmp/repo-explorer-data/sections
```

### Wave 0: Codebase Analysis & Structure

Follow `references/skill-0-analysis.md`:
1. Clone the repository (or use `gh` CLI if already available)
2. Read key files: README, package.json/Cargo.toml/go.mod/etc.
3. Map the directory structure and identify key modules
4. Analyze the tech stack, framework, patterns
5. Decompose into sections following the repo learning arc
6. Write per-section outlines with L1-L4 angles
7. Write `/tmp/repo-explorer-data/structure.json`
8. Write `/tmp/repo-explorer-data/analysis-notes.md`

### Wave 1: Level Content (PARALLEL — N×4 agents)

Follow `references/skill-1-content.md`:
- Same constraints as interactive-learning-explorer
- Content references actual code paths, functions, and patterns
- Citations reference specific files and line numbers instead of URLs

### Wave 2: Enrichment (PARALLEL — N agents)

Follow `references/skill-2-enrichment.md`:
- Viz types chosen based on what best represents each aspect of the codebase
- Concepts reference actual abstractions from the code
- Deep dives go into specific implementation details

### Wave 3: Coherence & Merge

Follow `references/skill-3-coherence.md` (same as learning explorer)

### Wave 4: Inject & Deliver

Follow `references/skill-4-inject.md`:
```bash
python3 [interactive-learning-explorer-path]/prebuild/inject.py \
  [interactive-learning-explorer-path]/prebuild/shell.html \
  /tmp/repo-explorer-data/structure.json \
  /tmp/repo-explorer-data/content.json \
  /mnt/user-data/outputs/[repo-name]-explorer.html
```

## Operating principles

1. **Fully autonomous.** Never ask for confirmation. Deliver a complete explorer.
2. **Read the code.** Don't guess — read actual files, imports, types, tests.
3. **Explain the WHY, not just the WHAT.** Don't just list files — explain why the architecture is structured this way.
4. **Four levels always.** L1=intuition (what does this do?), L2=practical (how do I use it?), L3=builder (how is it implemented?), L4=researcher (design decisions, trade-offs, history).
5. **Every concept is expandable.** Key abstractions, patterns, and domain terms become expandable inline concepts.
6. **Reference real code.** Citations point to actual files and functions, not external URLs.
7. **Code-specific viz types preferred.** Use flowchart for control flow, concept-map for module relationships, pipeline for data flow, tiered-hierarchy for architecture layers.

## Section template for repositories

The learning arc for a repo explorer:

| Phase | Section template | Viz type suggestion |
|-------|-----------------|-------------------|
| orientation | What is this? Problem, users, value proposition | pipeline (user journey) |
| prerequisites | Tech stack & dependencies | composition-stack (dependency breakdown) |
| prerequisites | Project structure & conventions | tiered-hierarchy (directory layers) |
| core | Architecture overview | concept-map (module relationships) |
| core | Data models & key abstractions | comparison-cards (model comparison) |
| core | Main flow (request/pipeline/workflow) | flowchart (flow with decision points) |
| core | Core module deep dive (most important) | bar-chart, heatmap, or stat-cards |
| scale | Patterns & conventions | pros-cons (pattern trade-offs) |
| optimization | Performance & optimization | xy-plot or utilization-bars |
| ecosystem | Testing & CI/CD | pipeline (test pipeline) |
| ecosystem | Configuration & deployment | flowchart (deploy flow) |
| synthesis | Contributing & next steps | timeline (roadmap) or pros-cons |

Adapt based on the actual repository. Not all sections apply to every repo. A small library might have 6 sections; a large framework might have 14.
