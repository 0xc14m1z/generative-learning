# Wave 1: Level Content (Parallel)

**Input:** `structure.json` + `{source-notes}`
**Output:** `sections/{id}/level-{1,2,3,4}.json` for every section

## Process

### 1. Create section directories

```bash
# For each section in structure.json
for id in $(python3 -c "import json; [print(s['id']) for s in json.load(open('{work-dir}/structure.json'))['sections']]"); do
  mkdir -p {work-dir}/sections/$id
done
```

### 2. Spawn all level agents (N × 4, all parallel)

For each section and each level, spawn ONE agent. All agents run in the same turn.

### Agent prompt template

```
You are writing Level {LEVEL} content for Section {INDEX} of {TOTAL}
in a learning website about "{TOPIC}".

Section: {id} — {title} — {subtitle}
Phase: {phase}

OUTLINE:
Core: {outline.core}
Key points:
{outline.keyPoints, one per line}

Your specific angle for this level:
{outline.L{LEVEL}_angle}

Full section list (for cross-reference context only):
{all sections: index, title, phase — one per line}

Relevant source notes:
{{source-notes} filtered to this section}

=== WRITING VOICE ===

- Technically accurate, no marketing fluff
- Explain jargon before using it — never assume the reader already knows a term
- Explain concepts directly — do NOT open with "Imagine..." or forced analogies. A brief comparison is OK mid-paragraph if it genuinely clarifies, but never as the opening or structure of a section.
- Honest about trade-offs — state what you gain AND what you lose
- Concise but substantive — every sentence should teach something

=== LEVEL {LEVEL} CONSTRAINTS ===

HTML content must conform to the allowed tags and patterns defined in `template/src/schemas/content.ts` → `htmlContent`.

{insert level-specific constraints from below}

=== OUTPUT ===

Output ONLY valid JSON:
{
  "sectionId": "{id}",
  "level": {LEVEL},
  "html": "<p>Your content here...</p>"
}

Save to: {work-dir}/sections/{id}/level-{LEVEL}.json
```

### Level-specific constraints

#### Level 1 — Intuition (150-250 words)

**You are writing for:** A curious person who knows nothing about this.
**You MUST include:** Why this matters. A core takeaway. A clear, direct explanation.
**You MUST NOT include:** Technical details, how-to steps, code, tables, citations, benchmarks, numbered steps.
**You MUST NOT open with:** "Imagine...", "Think of...", "Picture this...", or any forced analogy. Start with what the thing IS, not what it's like.
**Allowed HTML:** `<p>`, `<strong>`, `<em>`, `<span class="concept-trigger">`.
**Allowed content patterns:** 1 callout (insight type only).
**Tone:** Clear, professional, engaging. Make the reader curious to learn more. Explain directly — a brief comparison is fine mid-paragraph if it genuinely helps, but the section should lead with substance, not metaphor.
**Note on citations:** Level 1 is intentionally citation-free. Its purpose is to build intuition through direct explanation, not to make verifiable claims. Factual precision comes at Level 2+.

#### Level 2 — Practitioner (200-400 words)

**You are writing for:** Someone who needs to use/apply this knowledge.
**You MUST include:** Step-by-step mechanism, trade-offs ("gain X but lose Y"), practical implications. At least 1 citation.
**You MUST NOT include:** Implementation specifics, benchmarks, code, research papers.
**Analogies:** Do NOT repeat the analogy from Level 1. You may use a *different, brief* analogy if it clarifies a mechanism, but prefer direct explanation. L2 is about practical understanding, not metaphor.
**Allowed HTML:** `<p>`, `<h3>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<li>`, `<span class="concept-trigger">`, `<a class="citation">`.
**Allowed content patterns:** Callout (tip or warning), do-dont blocks.
**Tone:** Clear, practical, action-oriented.

#### Level 3 — Builder (300-500 words)

**You are writing for:** Someone who needs to implement/build/execute this.
**You MUST include:** Concrete numbers, benchmarks, tables, techniques. All claims cited. Failure modes and how to debug/fix.
**You MUST NOT include:** Basic explanations, analogies, research history, paper discussions.
**Allowed HTML:** `<p>`, `<h3>`, `<h4>`, `<strong>`, `<em>`, `<code>`, `<table>` (with `<th>`, `<tr>`, `<td>`), `<ul>`, `<ol>`, `<li>`, `<span class="concept-trigger">`, `<a class="citation">`.
**Allowed content patterns:** Callout (tip), steps (with time estimates), vocab-grid (if introducing 4+ new terms).
**Tone:** Precise, technical, reference-like.

#### Level 4 — Researcher (300-600 words)

**You are writing for:** An expert who wants the frontier and historical context.
**You MUST include:** Named papers with authors and years. Historical evolution. Open problems and debates. "As of [year]" qualifiers.
**You MUST NOT include:** Basic explanations, how-to instructions, analogies, practical advice.
**Allowed HTML:** `<p>`, `<h3>`, `<strong>`, `<em>`, `<code>`, `<ul>`, `<span class="concept-trigger">`, `<a class="citation">`.
**Allowed content patterns:** Callout (quote from notable figure), key takeaway box.
**Tone:** Academic, nuanced, forward-looking.

For the complete list of allowed HTML content patterns (callouts, practice-blocks, worked-examples, etc.), read `template/src/schemas/content.ts`.

### 3. Verify outputs

After all agents complete, verify each file exists and is valid JSON:

```bash
for id in $(python3 -c "import json; [print(s['id']) for s in json.load(open('{work-dir}/structure.json'))['sections']]"); do
  for level in 1 2 3 4; do
    FILE="{work-dir}/sections/$id/level-$level.json"
    python3 -c "import json; json.load(open('$FILE')); print('✓ $id/level-$level')" 2>/dev/null || echo "✗ MISSING: $id/level-$level"
  done
done
```

Retry any failed agents individually.

## Fallback (no subagents)

If the platform doesn't support parallel subagents, write levels sequentially:
- For each section: write level 1, then 2, then 3, then 4
- Save each to the same file paths
- The key constraint: even sequentially, each level agent should ONLY read the outline, NOT the previous level's output
