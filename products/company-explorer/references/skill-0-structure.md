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
