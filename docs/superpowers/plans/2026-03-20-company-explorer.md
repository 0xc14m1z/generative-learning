# Company Explorer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the company-explorer product that generates interactive learning websites about companies from their website URL.

**Architecture:** New product in `products/company-explorer/` with SKILL.md (orchestrator + overrides) and Wave 0 reference (company research). Reuses `core/` for Waves 1-4. Follows the exact same pattern as paper-explainer and repo-explorer.

**Tech Stack:** Markdown (skill files)

**Spec:** `docs/superpowers/specs/2026-03-20-company-explorer-design.md`

---

## File Structure

```
products/company-explorer/
├── SKILL.md                        # Orchestrator with overrides
└── references/
    └── skill-0-structure.md        # Wave 0: company research guide
```

---

### Task 1: Create company-explorer SKILL.md

**Files:**
- Create: `products/company-explorer/SKILL.md`

- [ ] **Step 1: Create directory**

```bash
mkdir -p products/company-explorer/references
```

- [ ] **Step 2: Write SKILL.md**

Create `products/company-explorer/SKILL.md` with the full content below:

```markdown
---
name: company-explorer
description: Generate an interactive learning experience that profiles a company for sales and BD preparation. Use this skill when the user provides a company website URL and wants to understand the company before a meeting, call, or partnership discussion. Triggers on phrases like "research this company", "tell me about this company", "prep me for a meeting with", "analyze this company", "who is this company", or any request to create a company briefing or profile from a website URL.
---

# Company Explorer

Generate an interactive, multi-depth learning experience that profiles a company — delivered as a single self-contained HTML file. Designed for sales/BD preparation.

## How it works

This skill takes a company website URL, crawls key pages, researches external sources, and generates a learning website that covers the company at 4 depth levels. It reuses the shared core UI (same shell, same 21 viz types, same content patterns).

```
Input:       Company URL (e.g. https://acme.com)
Wave 0: Company Research  →  structure.json + source-notes.md
Wave 1: Content           →  sections/{id}/level-{1,2,3,4}.json  (N×4 parallel)
Wave 2: Enrichment        →  sections/{id}/enrichment.json       (N parallel)
Wave 3: Coherence         →  content.json                        (merge + verify)
Wave 4: Inject            →  output.html
```

## Shared infrastructure (from core/)

- **Shell:** `core/prebuild/shell.html`
- **Inject script:** `core/prebuild/inject.py`
- **Zod schemas:** `core/template/src/schemas/`
- **Content catalog:** `core/references/content-rendering-catalog.md`
- **Validate script:** `cd [core-path]/template && npm run validate`

## Reference files

- `references/skill-0-structure.md` — Wave 0: Crawl website, research, produce structure.json
- `core/references/skill-1-content.md` — Wave 1: Write level content
- `core/references/skill-2-enrichment.md` — Wave 2: Viz, concepts, deep dives, references
- `core/references/skill-3-coherence.md` — Wave 3: Merge, verify, produce content.json
- `core/references/skill-4-inject.md` — Wave 4: Inject into shell

## Workflow (fully autonomous)

### Setup

```bash
mkdir -p /tmp/company-explorer-data/sections
```

### Input: Parse company URL

1. Extract domain and company name from the URL
2. Normalize: `https://www.acme.com/about` → domain `acme.com`, name `Acme`

### Wave 0: Company Research & Structure

Follow `references/skill-0-structure.md`.

### Wave 1: Level Content (PARALLEL — N×4 agents)

Follow `core/references/skill-1-content.md` with these overrides:
- Source notes = crawled website + external research (passed as `source-notes.md`)
- L2 should focus on practical meeting-prep information
- L3 should include specific numbers, dates, and data tables
- L4 should compare to competitors and assess strategic position
- Work dir: `/tmp/company-explorer-data/`

### Wave 2: Enrichment (PARALLEL — N agents)

Follow `core/references/skill-2-enrichment.md` with these overrides:
- The company website is always reference #1
- Additional references from external sources (Crunchbase, news, reviews)
- Concepts should capture company-specific terminology, product names, industry terms
- Viz data should use real numbers where available (funding amounts, team size, review scores)

### Wave 3: Coherence & Merge

Follow `core/references/skill-3-coherence.md`. No additional quality checks beyond core.
- Work dir: `/tmp/company-explorer-data/`

### Wave 4: Inject & Deliver

Follow `core/references/skill-4-inject.md`:
```bash
python3 [core-path]/prebuild/inject.py \
  [core-path]/prebuild/shell.html \
  /tmp/company-explorer-data/structure.json \
  /tmp/company-explorer-data/content.json \
  ~/Desktop/{company-slug}-explorer.html
```

## Model routing (opus-premium)

Use different models per wave for optimal quality/cost:

| Wave | Model | Why |
|------|-------|-----|
| Wave 0 (Company Research) | **Opus** | High judgment — research synthesis, section mapping |
| Wave 1 (Content) | **Sonnet** | Constrained writing |
| Wave 2 (Enrichment) | **Sonnet** | Schema-aware data generation |
| Wave 3 (Merge) | No LLM | Pure file I/O |

## Product-specific overrides

### Level angle guidance for companies

- **L1 (Intuition):** What does this company do? Elevator pitch. Who are they for? Zero jargon.
- **L2 (Practical):** How do they work concretely? Products, pricing, business model. Meeting-prep essentials.
- **L3 (Technical):** Numbers and details. Funding, revenue estimates, team size, growth metrics. Data tables.
- **L4 (Research):** Critical analysis. Positioning vs competitors, strategic risks, growth trajectory, industry trends.

### Visualization guidance for companies

| Company aspect | Recommended viz type |
|---------------|---------------------|
| Key metrics (founded, HQ, size) | StatCards |
| Product lineup | ComparisonCards or TabbedView |
| Org structure / key people | TieredHierarchy |
| Funding history | Timeline |
| Market positioning | QuadrantMatrix |
| Culture strengths/weaknesses | ProsCons |
| Social/review metrics | BarChart |
| Recent events | Timeline |
| Risks vs opportunities | ProsCons |

### Citation format

References combine company pages with external sources:
```json
{ "id": 1, "text": "Acme — About Us", "url": "https://acme.com/about" }
{ "id": 2, "text": "Crunchbase — Acme Profile", "url": "https://www.crunchbase.com/organization/acme" }
```

## Operating principles

1. **Fully autonomous.** Never ask for confirmation. Deliver a complete website.
2. **The company website is the primary source.** External research adds context and verification.
3. **Depth is the product.** Content quality over everything.
4. **Four levels always.** Every section, all four depth levels.
5. **Objective and factual.** Not marketing copy — report what you find.
6. **Distinguish self-reported vs external.** "The company claims..." vs "According to Crunchbase..."
7. **Date everything.** "As of Q1 2026", "Founded in 2019".
8. **Flag estimates.** "Revenue estimated at ~$10M ARR (Crunchbase)" vs confirmed figures.
9. **No personal data.** No emails, phone numbers, or personal social handles.
10. **Never modify the shell.** Only produce JSON data. The UI is pre-built.

## Writing voice

Inherits core writing voice (technically accurate, no marketing, explain jargon, honest about trade-offs), plus:
- Objective and factual — not marketing copy
- Clearly distinguish what the company says about itself vs external sources
- Date every piece of information
- Flag estimated vs confirmed data
- For Key People, include role and brief professional background only
- For Red Flags, be honest but fair — present both risks and mitigating factors
```

- [ ] **Step 3: Commit**

```bash
git add products/company-explorer/SKILL.md
git commit -m "feat: create company-explorer SKILL.md"
```

---

### Task 2: Create company-explorer Wave 0 reference

**Files:**
- Create: `products/company-explorer/references/skill-0-structure.md`

- [ ] **Step 1: Write skill-0-structure.md**

Create `products/company-explorer/references/skill-0-structure.md` with the full content below:

```markdown
# Wave 0: Company Research & Structure

**Input:** Company website URL
**Output:** `structure.json` + `source-notes.md`

## Phase 1 — Crawl the company website

Fetch key pages from the site. Target these paths (adapt based on what exists):

- Homepage (`/`)
- About (`/about`, `/about-us`, `/company`)
- Team/People (`/team`, `/people`, `/leadership`, `/about/team`)
- Products/Services (`/products`, `/services`, `/solutions`, `/platform`)
- Pricing (`/pricing`)
- Blog/News (`/blog`, `/news` — latest 3-5 posts only)
- Careers (`/careers`, `/jobs`)

Maximum 10-15 pages total. Skip paths that return 404. If the site blocks automated fetching (Cloudflare, JS-rendered SPA), fall back to web search cached/indexed versions of those pages.

Extract the company name from the homepage `<title>` or `<meta>` tags.

Write crawled content to `/tmp/company-explorer-data/source-notes.md`:

```
# Source Notes: {Company Name}

## Metadata
- **Company:** {name}
- **Domain:** {domain}
- **URL:** {input URL}

## Website Content

### Homepage
{key value proposition, tagline, main messaging}

### About
{company description, mission, history, team size if mentioned}

### Team / Leadership
{names, titles, bios — from the team page}

### Products / Services
{product names, descriptions, target customer, pricing if public}

### Blog (recent posts)
- {date}: {title} — {1-line summary}
...

### Careers
{number of open positions, departments hiring, office locations}
```

## Phase 2 — External research

Perform 5-8 web searches to build a complete picture:

1. `"{company name}" company overview` — general info, Wikipedia, press
2. `"{company name}" crunchbase OR funding OR series` — funding history
3. `"{company name}" competitor OR alternative OR vs` — competitive landscape
4. `"{company name}" glassdoor OR employee reviews` — culture signals
5. `"{company name}" site:linkedin.com` — company page, key people (best effort — LinkedIn often blocks fetching; use search snippets)
6. `"{company name}" news {current_year}` — recent developments
7. `"{company name}" G2 OR trustpilot OR reviews` — customer reviews
8. `"{company name}" revenue OR ARR OR valuation` — financial estimates (if available)

Fetch 3-5 key pages from results (Crunchbase profile, review pages, news articles).

Add findings to source-notes.md under `## External Research`:

```
## External Research

### Crunchbase
- Founded: {year}
- HQ: {location}
- Employees: {range}
- Total funding: ${amount}
- Last round: {type} — ${amount} ({date})
- Key investors: {names}

### Glassdoor / Reviews
- Rating: {X}/5 ({N} reviews)
- Pros: {common themes}
- Cons: {common themes}

### Customer Reviews (G2/Trustpilot)
- Rating: {X}/5
- Key praise: {themes}
- Key complaints: {themes}

### News (last 12 months)
- {date}: {headline} — {1-line summary}
...

### Competitive Landscape
- Direct competitors: {list}
- Positioning: {how they differentiate}

### LinkedIn
- Company size: {range}
- Key people found: {names and titles from search snippets}
```

## Phase 3 — Section decomposition

Decompose into 9 sections using this template:

| Phase | Section | When to include | Viz type |
|-------|---------|----------------|:--------:|
| orientation | Company Overview | Always | stat-cards |
| core | Products & Services | Always | comparison-cards or tabbed-view |
| core | Key People | Always | tiered-hierarchy |
| core | Funding & Financials | When data available | timeline |
| core | Market & Competitors | Always | quadrant-matrix |
| advanced | Culture & Values | When Glassdoor/career data available | pros-cons |
| advanced | Online Presence | Always | bar-chart |
| ecosystem | Recent News | When news found | timeline |
| synthesis | Red Flags & Opportunities | Always | pros-cons |

**Adaptive sizing:**
- If no funding data exists, merge financial info into Company Overview and drop the dedicated section
- If no Glassdoor data, make Culture & Values lighter (focus on careers page and self-reported values)
- If very little data overall (small/stealth company), reduce to 6-7 sections
- If the company is large and well-documented, expand to the full 9

## Phase 4 — Outline with per-level angles

For each section, write the outline following the core format:

```json
{
  "core": "One paragraph summarizing what this section covers",
  "keyPoints": ["3-5 key points"],
  "L1_angle": "What does [company] do? Simple explanation for someone who's never heard of them",
  "L2_angle": "Products, pricing, business model — what you need to know before a meeting",
  "L3_angle": "Specific numbers: funding ${X}M, {N} employees, {growth}% YoY. Tables and data.",
  "L4_angle": "Compare to [competitor A] and [competitor B]. Strategic risks. Market trends."
}
```

**Critical:** L3 and L4 angles MUST reference specific data points found during research (funding amounts, review scores, competitor names). This ensures content agents produce grounded, factual content.

## Phase 5 — Visualization assignment

Use the viz types from the section template. Rules:
- **stat-cards** for Company Overview (founded, HQ, size, industry, key metric)
- **comparison-cards** or **tabbed-view** for Products (side-by-side product comparison)
- **tiered-hierarchy** for Key People (CEO → C-level → VP/Director)
- **timeline** for Funding (seed → series A → series B → ...) and News
- **quadrant-matrix** for Market Positioning (axes: e.g., enterprise vs SMB, horizontal vs vertical)
- **pros-cons** for Culture and Red Flags/Opportunities
- **bar-chart** for Online Presence (social followers, review scores, blog frequency)

## Phase 6 — Write structure.json

Follow the standard structure.json schema from `core/template/src/schemas/structure.ts`.

Read the schema before writing.

Assign colors from the standard palette, cycling through:
`#3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #06B6D4, #F97316, #6366F1, #14B8A6, #EF4444`

Write to `/tmp/company-explorer-data/structure.json`.
```

- [ ] **Step 2: Commit**

```bash
git add products/company-explorer/references/
git commit -m "feat: create company-explorer Wave 0 reference"
```

---

### Task 3: Verify and push

- [ ] **Step 1: Verify directory structure**

```bash
ls products/company-explorer/
ls products/company-explorer/references/
```

Expected:
```
SKILL.md
skill-0-structure.md
```

- [ ] **Step 2: Verify no broken references in SKILL.md**

```bash
grep "core/" products/company-explorer/SKILL.md | head -10
```

All paths should reference existing `core/` files.

- [ ] **Step 3: Push**

```bash
git push
```
