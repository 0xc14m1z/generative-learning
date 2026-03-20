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
- **The viz data schema for this section's vizType** — extracted from `template/src/schemas/viz-types.ts` and passed inline in the prompt. Agents cannot read files from disk; the schema MUST be included in the prompt text.

### Preparing the viz schema for the prompt

Before spawning agents, read `template/src/schemas/viz-types.ts` and extract the Zod schema for each section's `vizType`. Include ONLY the relevant schema in each agent's prompt — not all 21.

Example: if `vizType` is `"cycle"`, include:
```
CycleData = z.object({
  nodes: z.array(z.object({
    label: z.string(),
    detail: z.string().optional(),
    color: hexColor,
  })).min(3).max(8),
  centerLabel: z.string().optional(),
})
```

### Collecting citations from level HTML

The enrichment agent must compile the reference list by scanning all 4 level HTMLs for citation anchors. The process:

1. Parse all `<a class="citation" href="#ref-{sectionId}-{N}">[N]</a>` from level 1-4 HTML
2. Collect every unique citation number `N` used
3. For each `N`, create a reference entry with the matching source from research notes
4. Ensure sequential numbering (1, 2, 3...) — if levels skip numbers, renumber and note the mapping

If a level references `[3]` but there's no `[1]` or `[2]`, that's a Wave 1 error. The enrichment agent should still produce valid sequential references and flag the gap.

### Agent prompt template

```
You are the enrichment agent for Section {INDEX}: "{title}" in a learning website about "{TOPIC}".

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
   Data schema for "{vizType}":
   {extracted Zod schema for this vizType — see "Preparing the viz schema" above}
   The visualization should illustrate the section's core concept visually.
   Use the section color ({color}) as the primary color.

2. CONCEPTS
   For each concept ID in [{concepts list}]:
   - title: Full name of the concept
   - body: 50-150 word explanation
   - context: Why it matters in this section (1-2 sentences)
   - linkedSectionId: ID of a section that covers this in depth, or null

3. DEEP DIVES
   Collapsible panels that go deeper on a specific aspect.
   Each: { "id": "dd-{sectionId}-N", "title": "Deep Dive: ...", "content": "<p>HTML, 100-200 words</p>" }
   Deep dives may use content patterns: callouts, steps, do-dont.
   Include as many as the section warrants — typically 1-3, up to the schema max of 3.
   Only add a deep dive if it provides value beyond what's in the levels.

4. REFERENCES
   Compile ALL sources cited across the 4 levels.
   Scan the level HTML for citation anchors: <a class="citation" href="#ref-{sectionId}-N">[N]</a>
   For each citation number N found, create a reference entry.
   Also add sources for the visualization data if they aren't already cited.
   Format: { "id": N, "text": "Author — \"Title\" (Year)", "url": "https://..." }
   IDs must be sequential starting from 1 and must match the citation numbers in the level HTML.

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
- [ ] Visualization data matches the Zod schema for that vizType (verified by reading the schema before spawning)
- [ ] Reference IDs are sequential starting from 1
- [ ] Every citation `[N]` in the levels has a matching reference
- [ ] Deep dives add value beyond what's in the levels (not repetition)
