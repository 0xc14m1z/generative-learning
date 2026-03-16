# Wave 0: Codebase Analysis & Structure

**Input:** A GitHub repository URL (or local path).
**Output:** `structure.json` + `analysis-notes.md`

## Process

### 1. Access the repository

```bash
# Option A: clone
git clone --depth 1 <repo-url> /tmp/repo-explorer-clone
cd /tmp/repo-explorer-clone

# Option B: if already local
cd <local-path>
```

### 2. Quick scan (build the mental model)

Read these files first (in order):
1. **README.md** — purpose, install, usage
2. **Package manifest** — `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `pom.xml`, etc.
3. **Directory listing** — `find . -type f -name "*.ts" -o -name "*.py" -o -name "*.go" -o -name "*.rs" | head -100` (adapt to language)
4. **Entry point** — `src/index.ts`, `main.go`, `src/main.rs`, `app.py`, etc.
5. **Config files** — `.env.example`, `docker-compose.yml`, CI config (`.github/workflows/`)
6. **Test structure** — `__tests__/`, `test/`, `*_test.go`, etc.

### 3. Deep analysis

For each major module/directory:
1. Read the main file (index, mod, __init__)
2. Identify exports, key functions, types/interfaces
3. Trace imports to understand dependencies between modules
4. Read 2-3 representative test files to understand expected behavior
5. Note patterns: dependency injection, middleware, hooks, plugins, etc.

Record everything in analysis-notes.md.

### 4. Map the architecture

1. **Modules**: List every top-level module with its purpose
2. **Dependencies**: Which modules depend on which (import graph)
3. **Data models**: Key types, interfaces, database schemas
4. **Flows**: Main execution paths (request→response, input→output, event→handler)
5. **Patterns**: Architecture patterns used (MVC, layered, hexagonal, event-driven, etc.)
6. **External deps**: Key third-party libraries and what they provide

### 5. Decompose into sections

Follow the repo learning arc:

| Phase | Purpose | When to include |
|-------|---------|-----------------|
| orientation | What is this? Who is it for? | Always (1 section) |
| prerequisites | Tech stack, dependencies, project structure | Always (1-2 sections) |
| core | Architecture, data models, main flows, key modules | Always (2-5 sections) |
| scale | Patterns, conventions, error handling | If repo is complex (1-2 sections) |
| optimization | Performance, caching, optimization patterns | If relevant (0-1 sections) |
| ecosystem | Testing, CI/CD, deployment, configuration | If present (1-2 sections) |
| synthesis | Contributing guide, roadmap, how to start | Always (1 section) |

**Sizing guide:**
- Small library (< 5K LOC): 6-8 sections
- Medium project (5K-50K LOC): 8-12 sections
- Large framework (> 50K LOC): 10-14 sections

### 6. Write per-section outlines

For each section, write an `outline` object. The key difference from the learning explorer: **L3 and L4 reference actual code**.

- `core`: One sentence — what this section covers
- `keyPoints`: 3-5 facts, referencing specific files/modules
- `L1_angle`: **Intuition** — What does this part do? Analogy to explain the concept.
- `L2_angle`: **Practical** — How do I use it? API surface, common patterns.
- `L3_angle`: **Implementation** — How is it built? Key files, functions, data structures. Include file paths.
- `L4_angle`: **Design decisions** — Why was it built this way? Trade-offs, alternatives considered, historical context from git blame/PR history.

### 7. Choose visualization types

Recommended mappings for code:

| Aspect | Viz type | Why |
|--------|----------|-----|
| Module relationships | `concept-map` | Shows how parts connect |
| Request/data flow | `flowchart` or `pipeline` | Shows execution path |
| Architecture layers | `tiered-hierarchy` | Shows abstraction levels |
| Dependency breakdown | `composition-stack` | Shows what makes up the project |
| API endpoints | `comparison-cards` | Side-by-side route comparison |
| Performance metrics | `bar-chart` or `stat-cards` | Quantitative data |
| Config options | `tabbed-view` | Different configurations |
| Pattern trade-offs | `pros-cons` | Design decision analysis |
| File activity | `heatmap` | Which files change most |
| Complexity spectrum | `continuum-scale` | Simple→complex scale |
| Test pipeline | `pipeline` | Test stages |
| Version history | `timeline` | Major versions/changes |
| Error handling | `flowchart` | Error flow with decisions |
| Feature comparison | `comparison-cards` | Comparing approaches |

### 8. Write structure.json

Same format as interactive-learning-explorer. Save to `/tmp/repo-explorer-data/structure.json`.

The `outline` field is critical — it's what guides all Wave 1 agents. Every L3_angle and L4_angle should reference specific files and functions.

### 9. Write analysis-notes.md

Save to `/tmp/repo-explorer-data/analysis-notes.md` with:

```markdown
# Analysis Notes: [repo-name]

## Repository Overview
- URL: ...
- Language: ...
- Framework: ...
- LOC: ...
- Stars/Activity: ...

## Directory Structure
(key directories with purpose)

## Key Files
(most important files with one-line description)

## Architecture Pattern
(description of how the code is organized)

## Module Map
(for each module: purpose, key exports, dependencies)

## Data Models
(key types/interfaces/schemas)

## Main Flows
(primary execution paths traced through the code)

## Patterns & Conventions
(coding patterns, naming conventions, error handling approach)

## Testing
(test framework, coverage approach, how to run)

## Per-Section Notes
### [section-id]
(specific findings relevant to this section)
```

## Special considerations for repo analysis

### Citations format

Instead of web URLs, use file references:

```html
<a class="citation" href="#ref-SECTIONID-N">[N]</a>
```

References in enrichment:
```json
{ "id": 1, "text": "src/handlers/auth.ts — handleLogin()", "url": "https://github.com/org/repo/blob/main/src/handlers/auth.ts" }
```

### Code in content

Level 3 content should include actual code snippets using `<code>` for inline and `<table>` or styled blocks for multi-line code. Do NOT include full file contents — extract the relevant 5-15 lines.

### Handling large repos

For repos > 50K LOC:
1. Focus on the most important 20% of files (entry points, models, core logic)
2. Skip generated files, vendor directories, and boilerplate
3. Use `git log --oneline -20` to understand recent activity focus
4. Use `wc -l` on key files to gauge complexity
