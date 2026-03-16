# Wave 2: Enrichment (Parallel)

**Input:** `structure.json` + `analysis-notes.md` + all level JSONs per section
**Output:** `sections/{id}/enrichment.json` for every section

Same architecture as `interactive-learning-explorer/references/skill-2-enrichment.md` with these adaptations:

## Visualization guidance for code

Choose viz types that best represent the code structure:

- **Module dependencies** → `concept-map` (nodes = modules, edges = imports)
- **Request/data flow** → `flowchart` (with decision nodes for conditionals)
- **Architecture layers** → `tiered-hierarchy` (presentation → business → data)
- **Dependency composition** → `composition-stack` (what % of deps are X)
- **API surface** → `comparison-cards` (endpoints side by side)
- **Test coverage / metrics** → `bar-chart` or `utilization-bars`
- **Build pipeline** → `pipeline` (stages with arrows)
- **Config complexity** → `heatmap` (features × environments)

## Concepts for code

Concepts should represent **actual abstractions** from the codebase:
- Class names, interfaces, types
- Design patterns in use (Observer, Factory, Middleware, etc.)
- Domain-specific terms from the project
- Framework concepts (hooks, middleware, resolvers, etc.)

Each concept `linkedSectionId` should point to the section that covers it most deeply.

## References for code

Instead of academic sources, references point to code:

```json
{
  "id": 1,
  "text": "src/middleware/auth.ts — verifyToken()",
  "url": "https://github.com/org/repo/blob/main/src/middleware/auth.ts"
}
```

For design decisions, reference PRs or issues:
```json
{
  "id": 2,
  "text": "PR #142 — Migrate from REST to GraphQL",
  "url": "https://github.com/org/repo/pull/142"
}
```

## Output format

Same as learning explorer:
```json
{
  "sectionId": "...",
  "visualization": { "type": "...", "data": { ... } },
  "concepts": { ... },
  "deepDives": [ ... ],
  "references": [ ... ]
}
```

Save to: `/tmp/repo-explorer-data/sections/{id}/enrichment.json`
