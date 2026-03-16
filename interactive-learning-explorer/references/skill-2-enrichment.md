# Wave 2: Enrichment (Parallel)

**Input:** `structure.json` + `research-notes.md` + all level JSONs per section
**Output:** `sections/{id}/enrichment.json` for every section

## Process

### 1. Spawn enrichment agents (N parallel, one per section)

Each agent receives:
- The full `structure.json` (for cross-section context)
- The section's metadata (vizType, concepts list, color)
- All 4 level JSONs for its section (to read, NOT rewrite)
- Relevant research notes
- The viz data shape from `content-rendering-catalog.md`

### Agent prompt template

```
You are the enrichment agent for Section {INDEX}: "{title}" in a learning explorer about "{TOPIC}".

Your job: create the visualization data, expandable concepts, deep dives, and reference list for this section. You do NOT write level content — that's already done.

SECTION METADATA:
id: {id}
vizType: {vizType}
color: {color}
Concepts to define: {concepts list}
Bridge to next: {bridgeTo}

LEVEL CONTENT (read for context, do NOT rewrite):
Level 1: {level-1.json html}
Level 2: {level-2.json html}
Level 3: {level-3.json html}
Level 4: {level-4.json html}

RESEARCH NOTES:
{filtered research notes}

=== TASKS ===

1. VISUALIZATION
   Create data matching the "{vizType}" type.
   Data shape: Read `template/src/schemas/viz-types.ts` for the exact Zod schema of the "{vizType}" type.
   The visualization should illustrate the section's core concept visually.
   Use the section color ({color}) as the primary color.

2. CONCEPTS
   For each concept ID in [{concepts list}]:
   - title: Full name of the concept
   - body: 50-150 word explanation
   - context: Why it matters in this section (1-2 sentences)
   - linkedSectionId: ID of a section that covers this in depth, or null

3. DEEP DIVES
   1-2 collapsible panels that go deeper on a specific aspect.
   Each: { "id": "dd-{sectionId}-N", "title": "Deep Dive: ...", "content": "<p>HTML, 100-200 words</p>" }
   Deep dives may use content patterns: callouts, steps, do-dont.

4. REFERENCES
   Every source cited in the 4 levels, plus sources for the visualization data.
   Format: { "id": N, "text": "Author — \"Title\" (Year)", "url": "https://..." }
   IDs must match citation numbers used in level HTML: [1], [2], etc.

=== OUTPUT ===

Output ONLY valid JSON:
{
  "sectionId": "{id}",
  "visualization": { "type": "{vizType}", "data": { ... } },
  "concepts": { "concept-id": { "title": "...", "body": "...", "context": "...", "linkedSectionId": "..." }, ... },
  "deepDives": [ { "id": "...", "title": "...", "content": "..." } ],
  "references": [ { "id": 1, "text": "...", "url": "..." } ]
}

Save to: /tmp/explorer-data/sections/{id}/enrichment.json
```

### 2. Verify outputs

```bash
for id in $(python3 -c "import json; [print(s['id']) for s in json.load(open('/tmp/explorer-data/structure.json'))['sections']]"); do
  FILE="/tmp/explorer-data/sections/$id/enrichment.json"
  python3 -c "import json; d=json.load(open('$FILE')); print(f'✓ $id — viz:{d[\"visualization\"][\"type\"]}, concepts:{len(d[\"concepts\"])}, refs:{len(d[\"references\"])}')" 2>/dev/null || echo "✗ MISSING: $id/enrichment"
done
```

Retry any failed agents individually.

## Quality checklist

- [ ] Every concept ID from structure.json has a definition in enrichment.json
- [ ] Visualization type matches the vizType in structure.json
- [ ] Visualization data matches the expected shape (see content-rendering-catalog.md)
- [ ] Reference IDs are sequential starting from 1
- [ ] Every citation `[N]` in the levels has a matching reference
- [ ] Deep dives add value beyond what's in the levels (not repetition)
- [ ] Visualization data validates against the Zod schema in `template/src/schemas/viz-types.ts`
