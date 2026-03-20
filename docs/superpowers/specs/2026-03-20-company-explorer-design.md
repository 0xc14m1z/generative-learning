# Company Explorer — Design Spec

## Context

The `generative-learning-experiences` repo has a plugin architecture with shared `core/` infrastructure and product-specific skills in `products/`. Existing products: topic-explorer, repo-explorer, paper-explainer.

This spec adds a fourth product: **company-explorer**, which takes a company website URL and generates an interactive learning experience about that company — designed for sales/BD preparation.

## Goal

Given a company website URL, research the company from public sources and generate a multi-depth interactive learning website covering overview, products, key people, funding, market, culture, online presence, news, and opportunities.

## Architecture

Same as all other products:
- `products/company-explorer/SKILL.md` — orchestrator + overrides
- `products/company-explorer/references/skill-0-structure.md` — Wave 0: company research
- Waves 1-4: reuse `core/references/`

## Input handling

1. User provides a company URL (e.g., `https://acme.com`)
2. Extract the domain/company name from the URL
3. Crawl key pages from the website (see Wave 0 below)
4. Supplement with web search for external sources

## Wave 0: Company Research

### Phase 1 — Crawl the company website

Fetch key pages from the site. Target these paths (adapt based on what exists):

- Homepage (`/`)
- About (`/about`, `/about-us`, `/company`)
- Team/People (`/team`, `/people`, `/leadership`, `/about/team`)
- Products/Services (`/products`, `/services`, `/solutions`, `/platform`)
- Pricing (`/pricing`)
- Blog/News (`/blog`, `/news` — latest 3-5 posts only)
- Careers (`/careers`, `/jobs`)

Maximum 10-15 pages total. Stop if a path returns 404.

Write everything to `source-notes.md`:

```
# Source Notes: {Company Name}

## Website Content
### Homepage
{key points from homepage}

### About
{extracted content}

### Team
{names, titles, bios if available}

### Products
{product descriptions, features, pricing}

### Blog (recent)
{latest 3-5 post titles and summaries}
```

### Phase 2 — External research

Perform 5-8 web searches:

1. `"{company name}" company overview` — general info, Wikipedia, press
2. `"{company name}" crunchbase OR funding OR series` — funding history
3. `"{company name}" competitor OR alternative OR vs` — competitive landscape
4. `"{company name}" glassdoor OR employee reviews` — culture signals
5. `"{company name}" site:linkedin.com` — company page, key people
6. `"{company name}" news {current_year}` — recent developments
7. `"{company name}" G2 OR trustpilot OR reviews` — customer reviews
8. `"{company name}" revenue OR ARR OR valuation` — financial estimates (if available)

Fetch 3-5 key pages from results (Crunchbase profile, LinkedIn company page, review sites).

Add findings to source-notes.md under `## External Research` with subsections per source.

### Phase 3 — Section decomposition

Decompose into 9 sections following this template:

| Phase | Section | When to include | Viz suggestion |
|-------|---------|----------------|:-------------:|
| orientation | Company Overview | Always | stat-cards (key metrics: founded, HQ, size, industry) |
| core | Products & Services | Always | comparison-cards (product lineup) or tabbed-view |
| core | Key People | Always | tiered-hierarchy (org structure) |
| core | Funding & Financials | When data available | timeline (funding rounds) |
| core | Market & Competitors | Always | quadrant-matrix (market positioning) |
| advanced | Culture & Values | When Glassdoor/career data available | pros-cons (strengths/weaknesses) |
| advanced | Online Presence | Always | bar-chart (social metrics, review scores) |
| ecosystem | Recent News | When news found | timeline (recent events) |
| synthesis | Red Flags & Opportunities | Always | pros-cons (risks vs opportunities) |

Adapt based on available data: if no funding data exists, merge into Company Overview. If no Glassdoor data, make Culture & Values lighter.

### Phase 4 — Outline with per-level angles

For each section, write the outline following core format. Level angle guidance specific to company analysis:

- **L1 (Intuition):** What does this company do? One-paragraph elevator pitch. Who are they for? Zero jargon.
- **L2 (Practical):** How do they work concretely? Products, pricing, business model, team structure. What you need to know before a meeting.
- **L3 (Technical):** Numbers and details. Funding amounts, revenue estimates, team size, tech stack, growth metrics. Data tables.
- **L4 (Research):** Critical analysis. Market positioning vs competitors, strategic risks, growth trajectory, acquisition signals, industry trends.

### Phase 5 — Visualization assignment

Use the viz suggestions from the section template. General rules:
- stat-cards for key metrics and KPIs
- timeline for chronological data (funding, news)
- comparison-cards or tabbed-view for product lineups
- tiered-hierarchy for org charts
- quadrant-matrix for competitive positioning
- pros-cons for balanced assessments
- bar-chart for quantitative comparisons

### Phase 6 — Write structure.json

Follow the standard structure.json schema from `core/template/src/schemas/structure.ts`.

Standard color palette. Write to `{work-dir}/structure.json`.

## Waves 1-3: Core pipeline

Uses `core/references/skill-{1,2,3}-*.md` with these overrides:

### Wave 1 overrides
- Source notes = crawled website content + external research (passed as `source-notes.md`)
- L2 should focus on practical meeting-prep information
- L3 should include specific numbers, dates, and data tables
- L4 should compare to competitors and assess strategic position
- Work dir: `/tmp/company-explorer-data/`

### Wave 2 overrides
- References include both the company's own pages and external sources
- The company website is always reference #1
- Concepts should capture company-specific terminology, product names, and industry terms
- Viz data should use real numbers where available (funding amounts, team size, review scores)

### Wave 3 overrides
- No additional quality checks beyond core

## Wave 4: Output

Standard core inject process. Output file: `~/Desktop/{company-slug}-explorer.html`

## Model routing

opus-premium config (same as all products):

| Wave | Model | Why |
|------|-------|-----|
| Wave 0 (Company Research) | Opus | High judgment — research synthesis, section mapping |
| Wave 1 (Content) | Sonnet | Constrained writing |
| Wave 2 (Enrichment) | Sonnet | Schema-aware data generation |
| Wave 3 (Merge) | No LLM | Pure file I/O |

## Writing voice (company-explorer specific)

Inherits core writing voice, plus:
- Objective and factual — not marketing copy
- Clearly distinguish what the company says about itself vs what external sources say
- Date every piece of information: "As of Q1 2026", "Founded in 2019"
- Flag when data is estimated vs confirmed: "Revenue estimated at ~$10M ARR (Crunchbase)"
- For Key People, include role and brief background but not personal information
- For Red Flags, be honest but fair — present both risks and mitigating factors

## Constraints and non-goals

- **No LinkedIn scraping.** Use web search results and public LinkedIn company pages only. Don't attempt to scrape individual profiles.
- **No paid data sources.** Only freely accessible public information (web search, public pages).
- **No financial analysis.** Report available numbers but don't attempt DCF, valuation models, etc.
- **No contact information.** Don't include email addresses, phone numbers, or personal social media handles.
- **Public data only.** Everything in the output must be from publicly available sources.

## Success criteria

1. Given a company URL, the skill produces a complete HTML learning website without user interaction
2. All 9 sections are populated (with graceful degradation when data is scarce)
3. Key People section identifies at least founder(s) and C-level from public sources
4. Funding timeline is accurate when Crunchbase data is available
5. Competitive positioning reflects actual market dynamics
6. L1 level gives a genuinely useful 30-second company briefing
7. Red Flags & Opportunities section provides actionable sales prep insights
8. Zod validation passes with zero errors
