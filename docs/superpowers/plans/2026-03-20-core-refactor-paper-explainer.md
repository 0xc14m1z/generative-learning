# Core Refactoring & Paper Explainer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract shared infrastructure into `core/`, migrate existing products, and create the paper-explainer product.

**Architecture:** Move shared template, prebuild, and Wave 1-4 references into `core/`. Each product gets its own `SKILL.md` (orchestrator + overrides) and Wave 0 reference. Products reference `core/` for everything else.

**Tech Stack:** Git (file moves), Markdown (skill files), Python (api path fix)

**Spec:** `docs/superpowers/specs/2026-03-20-core-refactor-paper-explainer-design.md`

---

### Task 1: Create core/ directory and move shared template + prebuild

Move the React app, shell, and inject script to their new home.

**Files:**
- Move: `learning-website/template/` → `core/template/`
- Move: `learning-website/prebuild/` → `core/prebuild/`

- [ ] **Step 1: Create core directory**

```bash
mkdir -p core/references
```

- [ ] **Step 2: Move template to core**

```bash
git mv learning-website/template core/template
```

- [ ] **Step 3: Move prebuild to core**

```bash
git mv learning-website/prebuild core/prebuild
```

- [ ] **Step 4: Verify template still works**

```bash
cd core/template && npm install && npm run validate -- src/data/structure.json src/data/content.json
```

Expected: validation passes (schemas + sample data haven't changed, only location).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "refactor: move template and prebuild to core/"
```

---

### Task 2: Move shared Wave 1-4 references to core/

Move the learning-website reference files that become the shared core.

**Files:**
- Move: `learning-website/references/skill-1-content.md` → `core/references/skill-1-content.md`
- Move: `learning-website/references/skill-2-enrichment.md` → `core/references/skill-2-enrichment.md`
- Move: `learning-website/references/skill-3-coherence.md` → `core/references/skill-3-coherence.md`
- Move: `learning-website/references/skill-4-inject.md` → `core/references/skill-4-inject.md`
- Move: `learning-website/references/architecture-content-pipeline.md` → `core/references/architecture-content-pipeline.md`
- Move: `learning-website/references/content-rendering-catalog.md` → `core/references/content-rendering-catalog.md`

- [ ] **Step 1: Move all shared references**

```bash
git mv learning-website/references/skill-1-content.md core/references/
git mv learning-website/references/skill-2-enrichment.md core/references/
git mv learning-website/references/skill-3-coherence.md core/references/
git mv learning-website/references/skill-4-inject.md core/references/
git mv learning-website/references/architecture-content-pipeline.md core/references/
git mv learning-website/references/content-rendering-catalog.md core/references/
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "refactor: move shared Wave 1-4 references to core/"
```

---

### Task 3: Generalize core reference files

Make the core references product-neutral: replace topic-specific terminology and update paths.

**Files:**
- Modify: `core/references/skill-1-content.md`
- Modify: `core/references/skill-2-enrichment.md`
- Modify: `core/references/skill-3-coherence.md`
- Modify: `core/references/skill-4-inject.md`

- [ ] **Step 1: Update skill-1-content.md**

Changes:
- Line 3: `research-notes.md` → `{source-notes}` (generic placeholder — each product specifies its own filename: topic-explorer uses `research-notes.md`, repo-explorer uses `analysis-notes.md`, paper-explainer uses `source-notes.md`)
- Line 12: `/tmp/explorer-data/` → `{work-dir}/` (product decides)
- Line 42: `research-notes.md filtered to this section` → `{source-notes} filtered to this section`
- Line 67: `/tmp/explorer-data/sections/` → `{work-dir}/sections/`
- Lines 117, 121: Same path updates in verify scripts

The level constraints (L1-L4) stay exactly as-is — they are already product-neutral. Products add domain-specific guidance in their own SKILL.md overrides.

**Important:** While generalizing, identify any topic-explorer-specific content (URL citation examples, web-research-specific prompt wording) and note it — this content needs to be extracted into `products/topic-explorer/SKILL.md` overrides in Task 4.

- [ ] **Step 2: Update skill-2-enrichment.md**

Changes:
- Line 3: `research-notes.md` → `{source-notes}`
- Line 15: `template/src/schemas/viz-types.ts` → `Read from [core-path]/template/src/schemas/viz-types.ts`
- Line 64: `/tmp/explorer-data/` → `{work-dir}/`
- Line 109: Same path
- Lines 115-118: Same path updates in verify scripts

- [ ] **Step 3: Update skill-3-coherence.md**

Changes:
- Line 10: `/tmp/explorer-data/` → `{work-dir}/`
- Lines 97-98: `[this-skill-path]/template` → `[core-path]/template`
- Line 111: `/tmp/explorer-data/content.json` → `{work-dir}/content.json`

Quality gates and concept trigger logic stay exactly as-is.

- [ ] **Step 4: Update skill-4-inject.md**

Changes:
- Lines 13-17: `[this-skill-path]/prebuild/` → `[core-path]/prebuild/`
- Lines 47-50: Same for shell rebuild instructions

- [ ] **Step 5: Commit**

```bash
git add core/references/ && git commit -m "refactor: generalize core references (product-neutral paths and terminology)"
```

---

### Task 4: Create products/topic-explorer/

Migrate learning-website into its product directory with overrides.

**Files:**
- Move: `learning-website/references/skill-0-structure.md` → `products/topic-explorer/references/skill-0-structure.md`
- Move: `learning-website/SKILL.md` → `products/topic-explorer/SKILL.md`
- Create: (none — SKILL.md is modified in place after move)

- [ ] **Step 1: Create directory and move files**

```bash
mkdir -p products/topic-explorer/references
git mv learning-website/references/skill-0-structure.md products/topic-explorer/references/
git mv learning-website/SKILL.md products/topic-explorer/SKILL.md
```

- [ ] **Step 2: Remove now-empty learning-website directory**

```bash
# Check it's empty (only references/ dir should remain, now empty)
ls learning-website/
# Remove
rm -rf learning-website/references
rmdir learning-website
```

- [ ] **Step 3: Extract topic-specific content from core references**

Before updating the SKILL.md, re-read the core references (now generalized in Task 3) and identify any topic-explorer-specific content that was removed during generalization. Specifically look for:
- Web-research-specific prompt wording (e.g., "research notes" usage patterns)
- URL-based citation format examples (e.g., `"Author — Title (Year)", "url": "https://..."`)
- Topic-research-specific examples or guidance
- Any L4 guidance mentioning "named papers with authors and years" specifically

This content must be included in the SKILL.md overrides section below.

- [ ] **Step 4: Update products/topic-explorer/SKILL.md**

Update the SKILL.md to reflect new paths and reference core/. Key changes:

1. Update frontmatter name to `topic-explorer`
2. Update "Architecture" section — paths now reference `core/`
3. Update "Reference files" section:
   - `references/skill-0-structure.md` stays local (own directory)
   - Wave 1-4 now point to `core/references/skill-{1,2,3,4}-*.md`
   - Schemas: `core/template/src/schemas/`
   - Content catalog: `core/references/content-rendering-catalog.md`
4. Update Wave 3 validate command: `cd [core-path]/template`
5. Update Wave 4 inject command: `[core-path]/prebuild/inject.py` and `[core-path]/prebuild/shell.html`
6. Update "Developing the UI" section: `cd [core-path]/template`
7. Add a "Product-specific overrides" section with topic-explorer specifics (including content extracted in Step 3):
   - Source notes filename: `research-notes.md`
   - Work dir: `/tmp/explorer-data/`
   - Output: `~/Desktop/{topic-slug}-explorer.html`
   - Wave 1 L4: "Named papers with authors and years, historical evolution"
   - Citations: web URLs (`"Author — Title (Year)", "url": "https://..."`)
   - Any additional topic-specific content identified in Step 3

- [ ] **Step 5: Update skill-0-structure.md paths**

Update any references to `template/src/schemas/` to `core/template/src/schemas/` and similar.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "refactor: migrate topic-explorer to products/ directory"
```

---

### Task 5: Migrate products/repo-explorer/

Move repo-explorer, extract Wave 1-4 overrides into SKILL.md, delete redundant files.

**Files:**
- Move: `repo-explorer/SKILL.md` → `products/repo-explorer/SKILL.md`
- Move: `repo-explorer/references/skill-0-analysis.md` → `products/repo-explorer/references/skill-0-analysis.md`
- Delete: `repo-explorer/references/skill-{1,2,3,4}-*.md` (after extracting overrides)

- [ ] **Step 1: Create directory and move files**

```bash
mkdir -p products/repo-explorer/references
git mv repo-explorer/references/skill-0-analysis.md products/repo-explorer/references/
git mv repo-explorer/SKILL.md products/repo-explorer/SKILL.md
```

- [ ] **Step 2: Extract overrides from Wave 1-4 files into SKILL.md**

Read `repo-explorer/references/skill-{1,2,3,4}-*.md` and extract all product-specific content. Add it to `products/repo-explorer/SKILL.md` as a new "## Product-specific overrides" section.

Content to extract and add:

**From skill-1-content.md (Wave 1 overrides):**
```markdown
### Wave 1 overrides

Level adjustments for code content:

- **L1 (Intuition):** Focus on "what does this part DO?" Analogy maps to reader's existing mental model.
- **L2 (Practical):** API surface, configuration, commands. Common patterns. Do-dont blocks for usage.
- **L3 (Implementation):** File paths (`src/handlers/auth.ts:42`), small code snippets (5-15 lines) in `<code>` blocks, tables for API endpoints/config/schemas, common errors.
- **L4 (Design Decisions):** Git history, PR discussions, ADRs, CHANGELOG. Why it was built this way, alternatives considered, architecture trade-offs, historical evolution.

Agent prompt adjustments:
- Replace "research notes" with "analysis notes"
- Replace "citations" with "code references"
- L3 agents should read actual source files to produce accurate content
- L4 agents should use `git log` context when available
```

**From skill-2-enrichment.md (Wave 2 overrides):**
```markdown
### Wave 2 overrides

**Viz guidance for code:**
- Module dependencies → concept-map (nodes = modules, edges = imports)
- Request/data flow → flowchart (with decision nodes)
- Architecture layers → tiered-hierarchy
- API surface → comparison-cards (endpoints side by side)
- Test coverage/metrics → bar-chart or utilization-bars
- Build pipeline → pipeline
- Config complexity → heatmap (features x environments)

**Concepts:** Actual abstractions from the codebase — class names, interfaces, design patterns, framework concepts.

**References:** Point to code, not academic sources:
- `{ "text": "src/middleware/auth.ts — verifyToken()", "url": "https://github.com/org/repo/blob/main/src/middleware/auth.ts" }`
- `{ "text": "PR #142 — Migrate from REST to GraphQL", "url": "https://github.com/org/repo/pull/142" }`
```

**From skill-3-coherence.md (Wave 3 overrides):**
```markdown
### Wave 3 overrides

Additional quality checks for code content:
1. **File path consistency** — If Level 3 references `src/auth/handler.ts`, verify consistent across all levels.
2. **Function name accuracy** — Function names must match actual code.
3. **Import graph consistency** — Concept-map viz must match content descriptions.
4. **No stale references** — Use current file/function names, not renamed/deleted ones.
```

- [ ] **Step 3: Update SKILL.md paths**

Same pattern as topic-explorer:
1. Update "Shared infrastructure" section: all paths now `core/prebuild/`, `core/template/`, `core/references/`
2. Update Wave 3 validate command: `cd [core-path]/template`
3. Update Wave 4 inject command: `[core-path]/prebuild/inject.py` and `[core-path]/prebuild/shell.html`
4. Add work dir specification: `/tmp/repo-explorer-data/`
5. Add output convention: `~/Desktop/{repo-name}-explorer.html`

- [ ] **Step 4: Delete redundant Wave 1-4 files and empty directory**

```bash
git rm repo-explorer/references/skill-1-content.md
git rm repo-explorer/references/skill-2-enrichment.md
git rm repo-explorer/references/skill-3-coherence.md
git rm repo-explorer/references/skill-4-inject.md
rm -rf repo-explorer/references
rmdir repo-explorer
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "refactor: migrate repo-explorer to products/, extract overrides into SKILL.md"
```

---

### Task 6: Update api/generator.py paths

Fix the breaking path references in the API.

**Files:**
- Modify: `api/generator.py` (lines 17-19, 65, 72)

- [ ] **Step 1: Update path constants**

Change lines 17-19 from:
```python
SKILL_PATH = Path(__file__).parent.parent / "learning-website"
SHELL_PATH = SKILL_PATH / "prebuild" / "shell.html"
INJECT_SCRIPT = SKILL_PATH / "prebuild" / "inject.py"
```

To:
```python
CORE_PATH = Path(__file__).parent.parent / "core"
SHELL_PATH = CORE_PATH / "prebuild" / "shell.html"
INJECT_SCRIPT = CORE_PATH / "prebuild" / "inject.py"
```

- [ ] **Step 2: Update read_schema_files()**

Change line 65 from:
```python
path = SKILL_PATH / "template" / "src" / "schemas" / name
```

To:
```python
path = CORE_PATH / "template" / "src" / "schemas" / name
```

- [ ] **Step 3: Update read_catalog()**

Change line 72 from:
```python
path = SKILL_PATH / "references" / "content-rendering-catalog.md"
```

To:
```python
path = CORE_PATH / "references" / "content-rendering-catalog.md"
```

- [ ] **Step 4: Verify API starts**

```bash
cd api && uv run python -c "from generator import CORE_PATH, SHELL_PATH, INJECT_SCRIPT; print(f'Core: {CORE_PATH.exists()}, Shell: {SHELL_PATH.exists()}, Inject: {INJECT_SCRIPT.exists()}')"
```

Expected: `Core: True, Shell: True, Inject: True`

- [ ] **Step 5: Commit**

```bash
git add api/generator.py && git commit -m "fix: update api/generator.py paths for core/ refactor"
```

---

### Task 7: Update .gitignore and clean up

Fix gitignore paths and delete the stale .skill file.

**Files:**
- Modify: `.gitignore`
- Delete: `learning-website.skill`

- [ ] **Step 1: Update .gitignore**

Change line 8 from:
```
learning-website/template/public/dev-data/*.json
```

To:
```
core/template/public/dev-data/*.json
```

- [ ] **Step 2: Delete stale .skill file**

```bash
git rm learning-website.skill
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: update gitignore paths, remove stale learning-website.skill"
```

---

### Task 8: Create products/paper-explainer/ — SKILL.md

Create the paper-explainer product orchestrator.

**Files:**
- Create: `products/paper-explainer/SKILL.md`
- Create: `products/paper-explainer/references/skill-0-structure.md`

- [ ] **Step 1: Create directory**

```bash
mkdir -p products/paper-explainer/references
```

- [ ] **Step 2: Write SKILL.md**

```markdown
---
name: paper-explainer
description: Generate an interactive learning experience that explains a scientific paper from arXiv. Use this skill when the user provides an arXiv URL and wants to deeply understand a research paper. Triggers on phrases like "explain this paper", "help me understand this paper", "break down this arXiv paper", or any request to create an interactive walkthrough of a scientific publication.
---

# Paper Explainer

Generate an interactive, multi-depth learning experience that explains a scientific paper — delivered as a single self-contained HTML file.

## How it works

This skill takes an arXiv paper link, fetches its HTML version from ar5iv, and generates a learning website that explains the paper at 4 depth levels. It reuses the shared core UI (same shell, same 21 viz types, same content patterns).

```
Input:       arXiv URL (e.g. https://arxiv.org/abs/2401.12345)
Wave 0: Paper Analysis  →  structure.json + source-notes.md
Wave 1: Content         →  sections/{id}/level-{1,2,3,4}.json  (N×4 parallel)
Wave 2: Enrichment      →  sections/{id}/enrichment.json       (N parallel)
Wave 3: Coherence       →  content.json                        (merge + verify)
Wave 4: Inject          →  output.html
```

## Shared infrastructure (from core/)

- **Shell:** `core/prebuild/shell.html`
- **Inject script:** `core/prebuild/inject.py`
- **Zod schemas:** `core/template/src/schemas/`
- **Content catalog:** `core/references/content-rendering-catalog.md`
- **Validate script:** `cd [core-path]/template && npm run validate`

## Reference files

- `references/skill-0-structure.md` — Wave 0: Fetch paper, analyze, produce structure.json
- `core/references/skill-1-content.md` — Wave 1: Write level content
- `core/references/skill-2-enrichment.md` — Wave 2: Viz, concepts, deep dives, references
- `core/references/skill-3-coherence.md` — Wave 3: Merge, verify, produce content.json
- `core/references/skill-4-inject.md` — Wave 4: Inject into shell

## Workflow (fully autonomous)

### Setup

```bash
mkdir -p /tmp/paper-explainer-data/sections
```

### Input: Fetch paper from ar5iv

1. Extract paper ID from the arXiv URL (handle `arxiv.org/abs/`, `arxiv.org/pdf/`, `ar5iv.labs.arxiv.org/html/` formats)
2. Construct ar5iv URL: `https://ar5iv.labs.arxiv.org/html/{paper_id}`
3. Web fetch the full HTML page
4. Parse and extract: title, authors, date, abstract, all sections with content, equation text, figure/table captions, bibliography entries
5. If ar5iv returns an error, stop with a clear message: "This paper is not available on ar5iv. Only papers with ar5iv HTML versions are supported."

### Wave 0: Paper Analysis & Structure

Follow `references/skill-0-structure.md`.

### Wave 1: Level Content (PARALLEL — N×4 agents)

Follow `core/references/skill-1-content.md` with these overrides:
- Source notes = the paper's extracted text + context research (passed as `source-notes.md`)
- L3 agents should reference specific paper sections, figures, tables, equations by number
- L4 agents should cite related work from the paper's bibliography plus external context
- Work dir: `/tmp/paper-explainer-data/`

### Wave 2: Enrichment (PARALLEL — N agents)

Follow `core/references/skill-2-enrichment.md` with these overrides:
- The paper itself is always reference #1: `"Author et al. — Title (Year). arXiv:XXXX.XXXXX"`
- Additional references from both the paper's bibliography and external context
- Concepts should capture the paper's key terminology and acronyms

### Wave 3: Coherence & Merge

Follow `core/references/skill-3-coherence.md`. No additional quality checks beyond core.
- Work dir: `/tmp/paper-explainer-data/`

### Wave 4: Inject & Deliver

Follow `core/references/skill-4-inject.md`:
```bash
python3 [core-path]/prebuild/inject.py \
  [core-path]/prebuild/shell.html \
  /tmp/paper-explainer-data/structure.json \
  /tmp/paper-explainer-data/content.json \
  ~/Desktop/{paper-id}-explained.html
```

## Product-specific overrides

### Level angle guidance for papers

- **L1 (Intuition):** Explain as if the reader has zero background in this field. Use analogies. No math, no jargon. Answer "what" and "why it matters."
- **L2 (Practitioner):** How the method works concretely. Simplified diagrams, step-by-step process, practical implications. Light math where it helps.
- **L3 (Technical):** Full technical detail. Key equations, architecture specifics, algorithm pseudocode, training details. Reference specific sections/figures/tables from the paper.
- **L4 (Research):** Critical analysis. Compare to related work, discuss assumptions and limitations, identify open questions, connect to broader research trends.

### Visualization guidance for papers

| Paper element | Recommended viz type |
|--------------|---------------------|
| Model architecture | Flowchart or Pipeline |
| Training/inference process | Pipeline or CycleDiagram |
| Performance comparison | BarChart or ComparisonCards |
| Ablation study | BarChart or StatCards |
| Feature importance | Heatmap or UtilizationBars |
| Dataset statistics | StatCards or BarChart |
| Method taxonomy | TieredHierarchy |
| Concept relationships | ConceptMap |
| Historical progression | Timeline |
| Trade-off analysis | QuadrantMatrix or ProsCons |
| Data flow | SankeyFlow or RoutingDiagram |
| Mathematical relationships | InlineSvg |

### Citation format

References combine the paper's own bibliography with external context:
```json
{ "id": 1, "text": "Vaswani et al. — \"Attention Is All You Need\" (2017)", "url": "https://arxiv.org/abs/1706.03762" }
```

## Operating principles

1. **Fully autonomous.** Never ask for confirmation. Deliver a complete website.
2. **The paper is the primary source.** Web research adds context, but the paper's content drives the structure.
3. **Depth is the product.** Content quality over everything.
4. **Four levels always.** Every section, all four depth levels.
5. **Explain fairly.** Don't oversell or undersell the paper's contributions.
6. **Attribute claims.** "The authors show that..." or "According to their experiments..."
7. **Distinguish proven from unproven.** Clearly separate what the paper demonstrates from speculation.
8. **Define before using.** Use the paper's terminology consistently, but always define it first.
9. **L1 is for outsiders.** Pretend the reader just heard about this field for the first time.
10. **Never modify the shell.** Only produce JSON data. The UI is pre-built.

## Writing voice

Inherits core writing voice (technically accurate, no marketing, explain jargon, honest about trade-offs), plus:
- When the paper makes a claim, attribute it explicitly
- Clearly distinguish demonstrated results from open questions
- For L1, assume zero field knowledge — explain the problem before the solution
```

- [ ] **Step 3: Commit**

```bash
git add products/paper-explainer/SKILL.md && git commit -m "feat: create paper-explainer SKILL.md"
```

---

### Task 9: Create paper-explainer Wave 0 reference

Write the Wave 0 guide specific to arXiv paper analysis.

**Files:**
- Create: `products/paper-explainer/references/skill-0-structure.md`

- [ ] **Step 1: Write skill-0-structure.md**

```markdown
# Wave 0: Paper Analysis & Structure

**Input:** arXiv paper URL
**Output:** `structure.json` + `source-notes.md`

## Phase 1 — Fetch and parse the paper

The paper HTML has already been fetched during input handling. Now parse it:

1. **Title and metadata:** Extract paper title, authors, date, arXiv ID
2. **Abstract:** Full abstract text
3. **Sections:** Walk the HTML structure, extract each section heading and its content
4. **Equations:** Extract equation text (MathML or text fallback)
5. **Figures and tables:** Extract captions (not the images themselves)
6. **Bibliography:** Extract all bibliography entries with their citation keys

Write everything to `/tmp/paper-explainer-data/source-notes.md` in this format:

```
# Source Notes: {Paper Title}

## Metadata
- **Title:** ...
- **Authors:** ...
- **Date:** ...
- **arXiv ID:** ...
- **URL:** https://arxiv.org/abs/{id}

## Abstract
{full abstract}

## Paper Sections
### {Section 1 heading}
{content summary — key points, not full text}

### {Section 2 heading}
{content summary}

...

## Key Equations
1. {equation description}: {equation text}
...

## Figures and Tables
- Figure 1: {caption}
- Table 1: {caption}
...

## Bibliography
1. {Author et al. — Title (Year)}
...
```

## Phase 2 — Context research

Perform 3-5 web searches to contextualize the paper:

1. **The field:** What research area is this? Why does this problem matter?
2. **Prior work:** What are the key papers this builds on? (Check the paper's own "Related Work" section for guidance)
3. **Impact:** Has this paper been cited? Any notable follow-up work or adoption?
4. **Alternatives:** What competing approaches exist?

Fetch 2-3 key pages for deeper context. Add findings to source-notes.md under a `## Context Research` section.

## Phase 3 — Section decomposition

Decompose the paper into 8-12 learning sections. Adapt to the paper's actual content — not every type applies to every paper.

### Section types

| Type | When to use | Maps to paper section |
|------|------------|----------------------|
| Problem & Motivation | Always | Introduction (first half) |
| Background & Prior Work | When paper builds on non-obvious prior concepts | Related Work / Background |
| Key Insight | Always | Introduction (contributions) or Method (core idea) |
| Method — Overview | Always | Method/Approach (high-level) |
| Method — Details | For papers with complex methods | Method subsections |
| Method — Training/Learning | For ML papers with training procedures | Training details |
| Experimental Setup | When paper has experiments | Experiments (setup portion) |
| Main Results | When paper has experiments | Results / Evaluation |
| Analysis & Ablation | When paper includes analysis | Ablation studies, analysis sections |
| Theoretical Contribution | For theory papers | Theorems, proofs |
| Limitations & Future Work | Always | Discussion / Conclusion |
| Broader Impact | When relevant | Impact statement, applications |

### Learning arc mapping

Follow the standard 6-phase learning arc:

| Phase | Paper section types |
|-------|-------------------|
| orientation | Problem & Motivation |
| prerequisites | Background & Prior Work |
| core | Key Insight, Method — Overview, Method — Details, Method — Training/Learning |
| advanced | Results, Analysis, Ablation |
| ecosystem | Experimental Setup (if separate from results) |
| synthesis | Limitations & Future Work, Broader Impact |

## Phase 4 — Outline with per-level angles

For each section, write the outline:

```json
{
  "core": "One paragraph summarizing what this section covers",
  "keyPoints": ["3-5 key points"],
  "L1_angle": "Explain [X] using analogy of [Y] — zero field knowledge assumed",
  "L2_angle": "Step-by-step: how [method] works in practice, with simplified examples",
  "L3_angle": "Equations [N]-[M], architecture details from Fig [X], training specifics from Table [Y]",
  "L4_angle": "Compare to [prior work], discuss assumption [Z], connect to [research trend]"
}
```

**Critical:** L3 and L4 angles MUST reference specific parts of the paper (section numbers, figure numbers, equation numbers, table numbers). This ensures the content agents produce grounded, accurate content.

## Phase 5 — Visualization assignment

Choose viz types based on what the paper presents. See the "Visualization guidance for papers" table in the SKILL.md.

General rules:
- Every section needs exactly one viz
- The viz should illustrate the section's core concept, not just decorate
- For method sections, prefer flowcharts/pipelines that show how the method works
- For results sections, prefer bar-charts/comparison-cards that show key findings
- For background sections, prefer timelines/concept-maps that show the landscape

## Phase 6 — Write structure.json

Follow the standard structure.json schema from `core/template/src/schemas/structure.ts`.

Assign colors from the standard palette, cycling through:
`#3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #06B6D4, #F97316, #6366F1, #14B8A6, #EF4444`

Read `core/template/src/schemas/structure.ts` to understand the exact structure.json format before writing.

Write to `/tmp/paper-explainer-data/structure.json`.
```

- [ ] **Step 2: Commit**

```bash
git add products/paper-explainer/references/ && git commit -m "feat: create paper-explainer Wave 0 reference"
```

---

### Task 10: Verify end-to-end and final cleanup

Verify the full refactoring is consistent.

**Files:**
- Verify all products reference correct paths
- Verify core/template validates
- Verify api starts

- [ ] **Step 1: Verify directory structure**

```bash
# Expected structure
ls core/references/          # 6 files: architecture, catalog, skill-{1,2,3,4}
ls core/template/src/schemas/ # 4 files: content.ts, structure.ts, viz-types.ts, index.ts
ls core/prebuild/             # 2 files: shell.html, inject.py
ls products/topic-explorer/references/    # 1 file: skill-0-structure.md
ls products/repo-explorer/references/     # 1 file: skill-0-analysis.md
ls products/paper-explainer/references/   # 1 file: skill-0-structure.md
```

- [ ] **Step 2: Verify no stale paths remain**

```bash
# Should find NO references to old paths (except in git history and specs/plans)
grep -r "learning-website/" --include="*.md" --include="*.py" --include="*.ts" . | grep -v node_modules | grep -v docs/superpowers | grep -v .git
```

Expected: no results (or only the spec/plan documents which are historical).

- [ ] **Step 3: Verify old directories are gone**

```bash
test -d learning-website && echo "ERROR: learning-website/ still exists" || echo "OK: removed"
test -d repo-explorer && echo "ERROR: repo-explorer/ still exists" || echo "OK: removed"
```

- [ ] **Step 4: Verify template validates**

```bash
cd core/template && npm run validate -- src/data/structure.json src/data/content.json
```

- [ ] **Step 5: Verify API paths resolve**

```bash
cd api && uv run python -c "from generator import CORE_PATH, SHELL_PATH, INJECT_SCRIPT; assert CORE_PATH.exists(); assert SHELL_PATH.exists(); assert INJECT_SCRIPT.exists(); print('All paths OK')"
```

- [ ] **Step 6: Final commit if any fixes were needed**

```bash
git add -A && git status
# If there are changes:
git commit -m "chore: fix remaining path references after refactoring"
```
