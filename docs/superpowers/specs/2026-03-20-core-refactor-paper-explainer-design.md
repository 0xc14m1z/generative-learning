# Core Refactoring & Paper Explainer — Design Spec

## Context

The `generative-learning-experiences` repo contains two working skills that generate interactive learning websites:

- **learning-website** (topic-explorer): takes a topic, does web research, produces a self-contained HTML learning experience
- **repo-explorer**: takes a GitHub repo, analyzes the codebase, produces the same kind of HTML output

Both share the same pre-compiled React shell, 21 visualization types, Zod schemas, inject script, and a nearly identical 5-wave content pipeline. The only meaningful differences are in Wave 0 (how source material is gathered) and minor domain-specific tweaks in Waves 1-3.

A third product is needed: **paper-explainer**, which takes an arXiv link and produces an interactive learning website explaining the paper.

This spec covers two changes:

1. **Refactor** the shared infrastructure into a `core/` directory, so products share code instead of duplicating it
2. **Create** the `paper-explainer` product in the new structure

## Part 1: Core Extraction

### Goal

Extract shared infrastructure from `learning-website/` into `core/`, so all products reference a single source of truth for Waves 1-4, schemas, template, prebuild, and content catalog.

### Directory structure (target)

```
generative-learning-experiences/
├── core/
│   ├── template/                           # React app, 21 viz components, schemas
│   │   ├── .storybook/
│   │   ├── scripts/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── data/
│   │   │   ├── schemas/                    # Zod schemas (single source of truth)
│   │   │   ├── lib/
│   │   │   ├── types.ts
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── styles.css
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── prebuild/
│   │   ├── shell.html                      # Pre-compiled React app
│   │   └── inject.py                       # JSON → HTML injection script
│   └── references/
│       ├── architecture-content-pipeline.md
│       ├── content-rendering-catalog.md
│       ├── skill-1-content.md              # Wave 1: shared base
│       ├── skill-2-enrichment.md           # Wave 2: shared base
│       ├── skill-3-coherence.md            # Wave 3: shared base
│       └── skill-4-inject.md               # Wave 4: shared base
│
├── products/
│   ├── topic-explorer/                     # ← from learning-website/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── skill-0-structure.md        # Wave 0: web research
│   │
│   ├── repo-explorer/                      # ← from repo-explorer/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── skill-0-analysis.md         # Wave 0: codebase analysis
│   │
│   └── paper-explainer/                    # NEW
│       ├── SKILL.md
│       └── references/
│           └── skill-0-structure.md        # Wave 0: arXiv paper analysis
│
├── api/                                    # unchanged
├── prompts/                                # unchanged
└── docs/
```

### What moves where

| Source | Destination | Action |
|--------|-------------|--------|
| `learning-website/template/` | `core/template/` | git mv |
| `learning-website/prebuild/` | `core/prebuild/` | git mv |
| `learning-website/references/architecture-content-pipeline.md` | `core/references/` | git mv |
| `learning-website/references/content-rendering-catalog.md` | `core/references/` | git mv |
| `learning-website/references/skill-1-content.md` | `core/references/` | git mv |
| `learning-website/references/skill-2-enrichment.md` | `core/references/` | git mv |
| `learning-website/references/skill-3-coherence.md` | `core/references/` | git mv |
| `learning-website/references/skill-4-inject.md` | `core/references/` | git mv |
| `learning-website/references/skill-0-structure.md` | `products/topic-explorer/references/` | git mv |
| `learning-website/SKILL.md` | `products/topic-explorer/SKILL.md` | git mv + update paths |
| `repo-explorer/SKILL.md` | `products/repo-explorer/SKILL.md` | git mv + update paths |
| `repo-explorer/references/skill-0-analysis.md` | `products/repo-explorer/references/` | git mv |
| `repo-explorer/references/skill-{1,2,3,4}*.md` | migrate overrides → `products/repo-explorer/SKILL.md`, then delete | These files contain ~200 lines of product-specific guidance (code-oriented level adjustments, viz-to-code mapping, file-path citation format, agent prompt modifications). Extract all product-specific content into the SKILL.md overrides section before deleting. |

### Core reference files: what they contain

The existing `learning-website` Wave 1-4 reference files become the core versions. Before moving them, review each file and extract any topic-explorer-specific content (e.g., web-research prompt templates, URL-based citation examples) into `products/topic-explorer/SKILL.md` overrides. The core versions must be product-neutral.

Similarly, `repo-explorer`'s Wave 1-4 files contain product-specific overrides (~200 lines total: code-oriented level adjustments, viz-to-code-concept mapping, file-path citation examples, agent prompt modifications). Extract all of this into `products/repo-explorer/SKILL.md` overrides before deleting those files.

Each product's SKILL.md will specify product-specific overrides (see "Product SKILL.md structure" below).

**Shared in core references:**
- Prompt templates and agent spawning instructions
- Output JSON schemas and file naming conventions
- Writing voice and content constraints (word counts, HTML tags, etc.)
- The 6 learning-arc phase definitions (Orientation → Synthesis)
- Concept trigger insertion algorithm
- Merge and cross-reference verification logic
- Quality gates (base set)
- Validation script path and usage
- Inject script usage and shell rebuild instructions

**NOT in core (stays product-specific):**
- Wave 0 research/analysis methodology
- Domain-specific L3/L4 angle examples (code paths vs URLs vs paper sections)
- Domain-specific citation format examples
- Additional quality checks (e.g., repo-explorer's file-path accuracy checks)

### Product SKILL.md structure

Each product SKILL.md follows this pattern:

```markdown
# Product Name

## Input
How this product receives its source material.

## Wave 0: [Product-specific name]
Product-specific research/analysis instructions.
Points to: `references/skill-0-*.md`

## Waves 1-4: Core Pipeline
Points to: `core/references/skill-{1,2,3,4}-*.md`

## Product-specific overrides
- Citation format examples
- L3/L4 angle guidance
- Additional quality checks (if any)
- Output filename convention

## Operating principles
Same core principles + any product additions.

## Writing voice
Same core voice + any product-specific adjustments.
```

### Skill packaging (.skill files)

The repo root contains `learning-website.skill`, a zip bundle of the `learning-website/` directory. After refactoring:
- Delete `learning-website.skill` — it references a directory that no longer exists
- Create new `.skill` bundles per product if needed (e.g., `topic-explorer.skill`). Each bundle must include both `core/` and the product's `products/{name}/` directory, since the product depends on core.
- Alternatively, defer `.skill` packaging until the packaging approach is clarified. The skills work fine without bundles when used locally.

### Path updates required

All references to paths must be updated in:
1. **SKILL.md files** — `template/src/schemas/` → `core/template/src/schemas/`, `prebuild/` → `core/prebuild/`, etc.
2. **Wave 0 reference files** — any cross-references to other waves
3. **Wave 3 validation command** — `cd [this-skill-path]/template` → `cd [core-path]/template`
4. **Wave 4 inject command** — shell and inject.py paths → `core/prebuild/`
5. **api/generator.py** — contains `SKILL_PATH = Path(__file__).parent.parent / "learning-website"` (line ~17). This **will break** after the rename. Update to point to the new structure: `CORE_PATH = Path(__file__).parent.parent / "core"` and `PRODUCT_PATH = Path(__file__).parent.parent / "products" / product_name`. The API currently only supports topic-explorer generation; multi-product API support is out of scope for this spec but the path must not be broken.

### What does NOT change

- The React app, its components, schemas, and build process — only the directory location changes
- The inject.py script — only its location changes
- The shell.html — only its location changes
- The Zod schemas — only their location changes
- The content pipeline logic — Waves 1-4 work identically
- The API — needs path updates (`SKILL_PATH` → `CORE_PATH` + `PRODUCT_PATH`) but generation logic is unchanged

---

## Part 2: Paper Explainer

### Goal

Create a new product that takes an arXiv paper link and generates an interactive learning website explaining the paper. Fully autonomous — no user interaction after the initial link.

### Input handling

1. User provides an arXiv URL (any format: `arxiv.org/abs/XXXX.XXXXX`, `arxiv.org/pdf/XXXX.XXXXX`, etc.)
2. Extract the paper ID from the URL
3. Construct the ar5iv HTML URL: `https://ar5iv.labs.arxiv.org/html/{paper_id}`
4. Web fetch the HTML page
5. Parse and extract:
   - Title, authors, date
   - Abstract
   - All sections with their content
   - Equations/formulas (as text or MathML)
   - Figure/table captions
   - Bibliography entries

If ar5iv returns an error (not all papers are available), log a clear error and stop.

### Wave 0: Paper Structure

**Phase 1 — Paper analysis:**
- Parse the ar5iv HTML to understand the paper's structure and content
- Identify: problem statement, key contributions, methodology, experimental setup, results, limitations
- Extract key terms, acronyms, and domain-specific vocabulary

**Phase 2 — Context research:**
- 3-5 web searches to contextualize the paper:
  - The research field and why this problem matters
  - Key related/prior work the paper builds on
  - Impact and reception (citations, follow-up work, if available)
- Fetch 2-3 key pages for deeper context

**Phase 3 — Section decomposition:**

Decompose into 8-12 sections using paper-oriented templates. Not every paper needs every section type — adapt to the paper's actual content.

Typical section types:

| Section type | When to use | Example |
|-------------|------------|---------|
| Problem & Motivation | Always | "Why existing approaches fail" |
| Background & Prior Work | When paper builds heavily on prior concepts | "From attention to transformers" |
| Key Insight | Always | "The core idea in one section" |
| Method (can be 1-3 sections) | Always | Architecture, training, inference |
| Experimental Setup | When paper has experiments | Datasets, baselines, metrics |
| Main Results | When paper has experiments | Tables, comparisons, key numbers |
| Analysis & Ablation | When paper includes ablation/analysis | "What each component contributes" |
| Theoretical Contribution | For theory papers | Proofs, bounds, guarantees |
| Limitations & Future Work | Always | Honest assessment |
| Broader Impact | When relevant | Applications, societal implications |

**Phase 4 — Outline with per-level angles:**

For each section, write the outline following the core format. Level angle guidance specific to papers:

- **L1 (Intuition):** Explain as if the reader has zero background in this field. Use analogies. No math, no jargon. Answer "what" and "why it matters."
- **L2 (Practitioner):** How the method works concretely. Simplified diagrams, step-by-step process, practical implications. Light math where it helps.
- **L3 (Technical):** Full technical detail. Key equations, architecture specifics, algorithm pseudocode, training details. Reference specific sections/figures/tables from the paper.
- **L4 (Research):** Critical analysis. Compare to related work, discuss assumptions and limitations, identify open questions, connect to broader research trends.

**Phase 5 — Visualization assignment:**

Use the core's 21 viz types. Paper-specific guidance for matching:

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

**Output:** `structure.json` (same schema as core) + `research-notes.md`

### Waves 1-3: Core pipeline

Uses `core/references/skill-{1,2,3}-*.md` with these overrides specified in SKILL.md:

**Wave 1 overrides:**
- The agent prompt includes the paper's extracted text as primary source material (in addition to structure.json and research-notes.md)
- L3 content should reference specific paper sections, figures, tables, and equations by number
- L4 content should cite related work from the paper's bibliography plus external context

**Wave 2 overrides:**
- References include both the paper's own bibliography entries and external context sources
- The paper itself is always reference #1: `"Author et al. — Title (Year). arXiv:XXXX.XXXXX"`
- Concepts should capture the paper's key terminology and acronyms

**Wave 3 overrides:**
- No additional quality checks beyond core (paper content is sourced, not generated)

### Wave 4: Output

Standard core inject process. Output file: `~/Desktop/{paper-id}-explained.html`

### Writing voice (paper-explainer specific)

Inherits core writing voice, plus:
- Explain the paper's contributions fairly — don't oversell or undersell
- When the paper makes a claim, attribute it: "The authors show that..." or "According to their experiments..."
- Clearly distinguish between what the paper demonstrates and what remains unproven
- Use the paper's own terminology consistently, but always define it first
- For L1, pretend the reader just heard about this field for the first time

---

## Constraints and non-goals

- **No PDF parsing.** ar5iv HTML only. If a paper isn't on ar5iv, the skill cannot process it.
- **No figure extraction.** The skill explains concepts using its own parametric visualizations, not the paper's original figures.
- **No LaTeX rendering.** Equations are described in text or simplified notation, not rendered as LaTeX. InlineSvg can be used for key formulas if needed.
- **No multi-paper comparison.** One paper per run. Comparing papers is a different product.
- **No modifications to core template or shell.** Paper-explainer is a data-generation skill only.

## Success criteria

1. Given an arXiv link, the skill produces a complete, valid HTML learning website without user interaction
2. All 4 depth levels are populated for every section
3. Visualizations accurately represent the paper's methods and results
4. The L1 level is genuinely accessible to someone outside the field
5. The L4 level adds critical analysis beyond what the paper itself says
6. Citations trace back to the paper and legitimate external sources
7. Zod validation passes with zero errors
