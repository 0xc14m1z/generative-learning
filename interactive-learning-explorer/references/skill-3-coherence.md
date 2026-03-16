# Wave 3: Coherence & Merge

**Input:** All files from Waves 0-2
**Output:** `content.json` (final, ready for injection)

## Process

### 1. Read all section files

For each section directory in `/tmp/explorer-data/sections/{id}/`:
- `level-1.json`, `level-2.json`, `level-3.json`, `level-4.json`
- `enrichment.json`

### 2. Merge into content.json format

Assemble the standard content.json structure:

```json
{
  "sections": [
    {
      "id": "section-id",
      "levels": {
        "1": "<html from level-1.json>",
        "2": "<html from level-2.json>",
        "3": "<html from level-3.json>",
        "4": "<html from level-4.json>"
      },
      "visualization": { "from enrichment.json" },
      "concepts": { "from enrichment.json" },
      "deepDives": [ "from enrichment.json" ],
      "references": [ "from enrichment.json" ]
    }
  ]
}
```

Order sections by `index` from structure.json.

### 3. Insert concept triggers

The level agents may have already included `<span class="concept-trigger">` tags. But the coherence agent MUST verify and add missing ones:

For each section, for each concept defined in its `enrichment.json`:
1. Find occurrences of the concept term in all 4 levels' HTML
2. Ensure at least the FIRST occurrence is wrapped:
   `<span class="concept-trigger" data-concept="{concept-id}">{term}</span>`
3. Do NOT wrap terms inside headings, table headers, or other concept triggers
4. Do NOT wrap every occurrence — only the first in each level

### 4. Verify cross-references

- Every `linkedSectionId` in concepts points to a real section ID
- Every citation `<a class="citation" href="#ref-{sectionId}-{N}">` has a matching reference with that ID
- Every `bridgeTo` in structure.json is narratively consistent with the next section's Level 1

### 5. Quality gates

Check each section against these rules:

| Check | Rule | Action if fails |
|-------|------|-----------------|
| Level 1 format | No `<table>`, no `<code>`, no `<a class="citation">` | Remove offending elements |
| Level 2 citations | At least 1 citation | Flag as warning |
| Level 3 detail | At least 1 `<table>` OR `<code>` block | Flag as warning |
| Level 4 papers | At least 1 named paper (Author, Year) | Flag as warning |
| Concepts complete | Every concept ID from structure has a definition | Flag as error |
| Viz type match | enrichment vizType matches structure vizType | Flag as error |
| References valid | No duplicate IDs, sequential numbering | Fix numbering |
| HTML valid | No unclosed tags, no `<script>`, no `onclick` | Fix or strip |

### 6. Terminology consistency

Verify that the same concept is referred to consistently across levels:
- If Level 1 calls it "wild yeast" and Level 3 calls it "Saccharomyces cerevisiae", that's fine (different audiences)
- If Level 2 calls it "lactic acid" and Level 3 calls it "lactate" inconsistently, normalize

### 7. Save

Write the final merged and verified file to `/tmp/explorer-data/content.json`.

Report a summary:
```
✓ content.json written
  Sections: 12
  Total words: ~15,000
  Citations: 48
  Concepts: 36
  Deep dives: 18
  Warnings: 2 (list them)
  Errors: 0
```

## Fallback (no subagent)

If running as the main agent (not a subagent), perform the merge and checks directly. Read each file, assemble the JSON, run the checks, and write the output.
