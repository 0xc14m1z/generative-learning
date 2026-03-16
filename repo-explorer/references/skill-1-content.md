# Wave 1: Level Content (Parallel)

**Input:** `structure.json` + `analysis-notes.md`
**Output:** `sections/{id}/level-{1,2,3,4}.json` for every section

Same architecture as `interactive-learning-explorer/references/skill-1-content.md` with these adaptations for codebase content:

## Level adjustments for code

### Level 1 — Intuition (150-250 words)

Same constraints as learning explorer. Focus on:
- What does this part of the codebase DO? (not how)
- Analogy that maps to the reader's existing mental model
- Why does this matter for someone using/contributing to the project?

### Level 2 — Practical (200-400 words)

Same constraints. Focus on:
- How do I USE this part? (API surface, configuration, commands)
- Common patterns and workflows
- What to do and what to avoid (do-dont blocks are great here)
- Reference actual function names, CLI commands, config keys

### Level 3 — Implementation (300-500 words)

Same constraints. Focus on:
- How is it BUILT? (actual code structure, key functions, data flow)
- Reference specific file paths: `src/handlers/auth.ts:42`
- Include small code snippets (5-15 lines) in `<code>` blocks
- Tables for API endpoints, config options, data schemas
- Common errors and how to debug them

### Level 4 — Design Decisions (300-600 words)

Same constraints, adapted:
- Instead of academic papers, reference: git history, PR discussions, ADRs, CHANGELOG
- WHY was it built this way? What alternatives were considered?
- Architecture trade-offs and technical debt
- Historical evolution: how the code changed over time
- Future direction from issues/roadmap

## Agent prompt template

Same as learning explorer (`interactive-learning-explorer/references/skill-1-content.md`) with:
- Replace "research notes" with "analysis notes"
- Replace "citations" with "code references"
- L3 agents should read actual source files to produce accurate content
- L4 agents should use `git log` context when available

## Output format

Same JSON format:
```json
{
  "sectionId": "{id}",
  "level": N,
  "html": "<p>HTML content...</p>"
}
```

Save to: `/tmp/repo-explorer-data/sections/{id}/level-{N}.json`
