# Skill 1: Research & Structure

**Input:** A topic from the user.
**Output:** `structure.json` + `research-notes.md`

## Process

### 1. Research the topic
Use web search extensively (5-15 searches). Fetch full pages from the best sources.
- Breadth search: map the landscape, major subtopics, phases, debates
- Depth search: authoritative sources per subtopic — docs, papers, eng blogs
- Citation inventory: record URLs and titles for every major claim/number

Save findings to `/tmp/explorer-data/research-notes.md`.

### 2. Map the concept tree
1. List every concept, mechanism, subsystem, phase, tool, technique
2. Identify dependencies (what must be understood first)
3. Separate prerequisites (not part of main topic, but needed) from core concepts
4. Identify expandable terms (50-300 word inline explanation) vs. section-worthy concepts

### 3. Decompose into sections

Follow the universal learning arc:

| Phase | Purpose | Count |
|-------|---------|-------|
| orientation | What is this? Core tension. | 1 |
| prerequisites | Concepts needed before the core. | 1-4 |
| core | The heart of the topic. | 2-6 |
| scale | Real-world complexity. | 1-4 |
| optimization | Cutting-edge techniques. | 1-3 |
| ecosystem | Real tools, systems, hardware. | 1-3 |
| synthesis | Tie it together. | 1 |

When in doubt: more sections, more prerequisites, more depth.

### 4. Assign visualization types
Pick from the 10 standard types based on what the section explains (see schema.md).

### 5. Assign colors
Use this palette sequentially: `#3b82f6 #8b5cf6 #a855f7 #6366f1 #06b6d4 #14b8a6 #22c55e #84cc16 #eab308 #f97316 #ef4444 #ec4899 #d946ef #64748b`

### 6. Write structure.json
Save to `/tmp/explorer-data/structure.json`. Every section needs: id, index, title, subtitle, phase, color, icon, concepts list, vizType, bridgeTo.

### 7. Write research notes
Save to `/tmp/explorer-data/research-notes.md` with key findings per section and the citation inventory.
