# Skill 2: Content Writing

**Input:** `structure.json` + `research-notes.md`
**Output:** `content.json`

## Process

### 1. Spawn subagents (one per section)

Each subagent writes ONE section. Spawn all in the same turn. Each receives:
- The structure.json (full outline for context)
- Relevant research notes
- The schema reference for its vizType

**Subagent prompt template:**

```
Write content for Section [INDEX] of [TOTAL] in an explorer about "[TOPIC]".

Section: [id] — [title] — [subtitle]
Phase: [phase] | vizType: [vizType] | Concepts to define: [list]
Bridge to next: [bridgeTo]

Full outline: [all sections with index, title, phase]
Research: [relevant notes]

Write and output JSON matching the content.json schema:

LEVEL 1 (~200 words HTML): Why this matters, anchor analogy, broad mechanism, key takeaway.
Use <span class="concept-trigger" data-concept="ID">term</span> for expandable concepts.

LEVEL 2 (~200-400 words HTML): Step-by-step mechanism, trade-offs, practical implications.
Cite with <a class="citation" href="#ref-SECTIONID-N">[N]</a>

LEVEL 3 (~300-600 words HTML): Implementation, real benchmarks [cited], tuning, failure modes.

LEVEL 4 (~300-800 words HTML): Papers [cited], open problems, competing approaches, history.

VISUALIZATION DATA: matching the [vizType] schema.
CONCEPTS: for each assigned concept ID — title, body, context, linkedSectionId.
DEEP DIVES: 1-2 collapsible panels.
REFERENCES: every source cited.

Save to /tmp/explorer-sections/[section-id].json
```

### 2. Merge
Read all section JSONs, merge into content.json ordered by structure.json index.

### 3. Coherence pass
Spawn a final subagent to verify:
- Forward/backward references between sections
- Concept linkedSectionId values point to real IDs
- Overview states core tension, synthesis ties back
- No undefined technical terms

### 4. Save
Write to `/tmp/explorer-data/content.json`.

## Content rules
- Level 1: ~200 words, one analogy, define jargon inline or as expandable concept
- Level 2: trade-offs always "gain X but lose Y", cite facts
- Level 3: real benchmarks with hardware/config context, all cited
- Level 4: name papers, note limitations, "as of [year]" qualifiers
- HTML only — no markdown, no backticks, no script tags, no onclick

## Fallback (no subagents)
Write sections sequentially, save each to /tmp/explorer-sections/[id].json. Merge at the end.
