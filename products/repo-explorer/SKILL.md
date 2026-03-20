---
name: repo-explorer
description: Generate an interactive learning experience that teaches how a GitHub repository works — its architecture, patterns, data flow, and key decisions. Use this skill when the user provides a GitHub URL and wants to understand, onboard onto, or document a codebase. Triggers on phrases like "explain this repo", "help me understand this codebase", "generate docs for this repo", "onboard me onto this project", "how does this repo work?", or any request to create an interactive walkthrough of a GitHub project.
---

# Repo Explorer

Generate an interactive, multi-depth learning experience that explains how a GitHub repository works — delivered as a single self-contained HTML file.

## How it works

This skill **reuses the Learning Website UI** (same shell, same 21 viz types, same content patterns) but replaces web research with **codebase analysis**. Instead of searching the web, it reads the actual code to produce a learning experience tailored to a specific repository.

```
Wave 0: Analysis     →  structure.json + analysis-notes.md
Wave 1: Content      →  sections/{id}/level-{1,2,3,4}.json  (N×4 parallel)
Wave 2: Enrichment   →  sections/{id}/enrichment.json       (N parallel)
Wave 3: Coherence    →  content.json                        (merge + verify)
Wave 4: Inject       →  output.html
```

## Shared infrastructure

This skill uses the pre-built shell from `core/`:
- **Shell:** `core/prebuild/shell.html`
- **Inject script:** `core/prebuild/inject.py`
- **Zod schemas:** `core/template/src/schemas/`
- **Content catalog:** `core/references/content-rendering-catalog.md`
- **Validate script:** `cd core/template && npm run validate`

## Conventions

- **Work dir:** `/tmp/repo-explorer-data/`
- **Output:** `~/Desktop/{repo-name}-explorer.html`

## Reference files

- `references/skill-0-analysis.md` — Wave 0: Clone, analyze, produce structure.json
- `core/references/skill-1-content.md` — Wave 1: Write level content (+ overrides below)
- `core/references/skill-2-enrichment.md` — Wave 2: Viz, concepts, deep dives, references (+ overrides below)
- `core/references/skill-3-coherence.md` — Wave 3: Merge, verify, produce content.json (+ overrides below)
- `core/references/skill-4-inject.md` — Wave 4: Inject into shell (+ overrides below)

Waves 1-4 follow the same architecture as `core/`. The key difference is **Wave 0**: instead of web research, it performs codebase analysis.

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

Follow `core/references/skill-1-content.md` with overrides below:
- Same constraints as core
- Content references actual code paths, functions, and patterns
- Citations reference specific files and line numbers instead of URLs

### Wave 2: Enrichment (PARALLEL — N agents)

Follow `core/references/skill-2-enrichment.md` with overrides below:
- Viz types chosen based on what best represents each aspect of the codebase
- Concepts reference actual abstractions from the code
- Deep dives go into specific implementation details

### Wave 3: Coherence & Merge

Follow `core/references/skill-3-coherence.md` with overrides below

### Wave 4: Inject & Deliver

Follow `core/references/skill-4-inject.md`:
```bash
python3 [core-path]/prebuild/inject.py \
  [core-path]/prebuild/shell.html \
  /tmp/repo-explorer-data/structure.json \
  /tmp/repo-explorer-data/content.json \
  ~/Desktop/[repo-name]-explorer.html
```

## Product-specific overrides

### Wave 1 — Level adjustments for code

**Level 1 — Intuition (150-250 words):**
- What does this part of the codebase DO? (not how)
- Analogy that maps to the reader's existing mental model
- Why does this matter for someone using/contributing to the project?

**Level 2 — Practical (200-400 words):**
- How do I USE this part? (API surface, configuration, commands)
- Common patterns and workflows
- What to do and what to avoid (do-dont blocks are great here)
- Reference actual function names, CLI commands, config keys

**Level 3 — Implementation (300-500 words):**
- How is it BUILT? (actual code structure, key functions, data flow)
- Reference specific file paths: `src/handlers/auth.ts:42`
- Include small code snippets (5-15 lines) in `<code>` blocks
- Tables for API endpoints, config options, data schemas
- Common errors and how to debug them

**Level 4 — Design Decisions (300-600 words):**
- Instead of academic papers, reference: git history, PR discussions, ADRs, CHANGELOG
- WHY was it built this way? What alternatives were considered?
- Architecture trade-offs and technical debt
- Historical evolution: how the code changed over time
- Future direction from issues/roadmap

**Agent prompt adjustments:**
- Replace "research notes" with "analysis notes"
- Replace "citations" with "code references"
- L3 agents should read actual source files to produce accurate content
- L4 agents should use `git log` context when available

### Wave 2 — Viz & enrichment for code

**Visualization guidance:**
- Module dependencies → `concept-map` (nodes = modules, edges = imports)
- Request/data flow → `flowchart` (with decision nodes for conditionals)
- Architecture layers → `tiered-hierarchy` (presentation → business → data)
- Dependency composition → `composition-stack` (what % of deps are X)
- API surface → `comparison-cards` (endpoints side by side)
- Test coverage / metrics → `bar-chart` or `utilization-bars`
- Build pipeline → `pipeline` (stages with arrows)
- Config complexity → `heatmap` (features × environments)

**Concepts for code:**
Concepts should represent actual abstractions from the codebase:
- Class names, interfaces, types
- Design patterns in use (Observer, Factory, Middleware, etc.)
- Domain-specific terms from the project
- Framework concepts (hooks, middleware, resolvers, etc.)

Each concept `linkedSectionId` should point to the section that covers it most deeply.

**References for code:**
Instead of academic sources, references point to code:

```json
{
  "id": 1,
  "text": "src/middleware/auth.ts — verifyToken()",
  "url": "https://github.com/org/repo/blob/main/src/middleware/auth.ts"
}
```

For design decisions, reference PRs or issues:
```json
{
  "id": 2,
  "text": "PR #142 — Migrate from REST to GraphQL",
  "url": "https://github.com/org/repo/pull/142"
}
```

### Wave 3 — Additional quality checks for code

Beyond the standard coherence checks:

1. **File path consistency** — If Level 3 references `src/auth/handler.ts`, verify the path is consistent across all levels and concepts.
2. **Function name accuracy** — Function names mentioned in content should match what's in the actual code.
3. **Import graph consistency** — If the concept-map viz shows module A depending on B, the content should reflect that.
4. **No stale references** — If a file was renamed or a function signature changed, the content should use the current name.

**Validate:**
```bash
cd [core-path]/template
npm run validate -- /tmp/repo-explorer-data/structure.json /tmp/repo-explorer-data/content.json
```

### Wave 4 — Output

Uses `[core-path]/prebuild/` shell and inject script. Output to `~/Desktop/{repo-name}-explorer.html`.

## Model routing (opus-premium)

Use different models per wave for optimal quality/cost:

| Wave | Model | Why |
|------|-------|-----|
| Wave 0 (Codebase Analysis) | **Opus** | High judgment — architecture decomposition, module mapping |
| Wave 1 (Content) | **Sonnet** | Constrained writing with good technical depth |
| Wave 2 (Enrichment) | **Sonnet** | Schema-aware data generation |
| Wave 3 (Merge) | No LLM | Pure file I/O |

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
| advanced | Patterns & conventions | pros-cons (pattern trade-offs) |
| advanced | Performance & optimization | xy-plot or utilization-bars |
| ecosystem | Testing & CI/CD | pipeline (test pipeline) |
| ecosystem | Configuration & deployment | flowchart (deploy flow) |
| synthesis | Contributing & next steps | timeline (roadmap) or pros-cons |

Adapt based on the actual repository. Not all sections apply to every repo. A small library might have 6 sections; a large framework might have 14.
