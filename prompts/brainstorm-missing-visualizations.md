# Brainstorm: Missing Visualizations and Content Patterns

Use this prompt with Codex, Gemini, or any AI assistant to identify gaps in our visualization and content pattern library.

---

## The Prompt

```
I'm building a system that generates interactive learning experiences on ANY topic — technical, practical, creative, scientific, historical, or personal development. The system renders content as a single-page web app with:

1. A per-section VISUALIZATION (one per section, parametric, data-driven)
2. CONTENT PATTERNS inside the text (HTML elements styled via CSS)

Here are the 21 visualization types we currently support:

FLOW & PROCESS:
- pipeline: linear sequential stages (A → B → C)
- flowchart: decision trees with branching (if/then/else nodes)
- cycle: circular repeating processes (A → B → C → A)
- routing-diagram: fan-in → router → fan-out

DATA & METRICS:
- stat-cards: 2-6 key numbers with units
- bar-chart: categorical bar chart with values
- utilization-bars: horizontal progress bars (0-100%)
- heatmap: 2D grid with intensity values (rows × columns)
- xy-plot: continuous line/scatter/area chart with series and annotations
- composition-stack: horizontal stacked bar for part-of-whole breakdowns

COMPARISON & ANALYSIS:
- comparison-cards: side-by-side feature/spec comparison
- pros-cons: pro/con lists per option
- tabbed-view: multiple perspectives as tabs
- quadrant: 2×2 matrix with labeled axes

STRUCTURE & HIERARCHY:
- tiered-hierarchy: stacked layers (wide → narrow)
- timeline: events on a vertical timeline with dates
- continuum-scale: ordered spectrum with colored bands and point markers

RELATIONSHIPS:
- concept-map: node-edge graph for concept relationships (via React Flow)
- sankey-flow: weighted 2-column flow diagram

SPECIALIZED:
- token-stream: sequence of labeled tokens
- inline-svg: escape hatch for custom SVG diagrams

Content patterns (inline HTML):
- callout boxes (insight, tip, warning, quote)
- key takeaway box
- do/don't two-column blocks
- numbered steps with time estimates
- vocabulary term grid
- expandable concept triggers
- citation references

---

TASK: Think about topics across ALL domains — not just tech. Consider:

- Cooking, food science, nutrition
- Music theory, instrument learning, composition
- History, philosophy, political science
- Psychology, cognitive science, behavioral economics
- Fitness, sports training, physical therapy
- Language learning, linguistics
- Visual art, design, photography
- Business strategy, marketing, finance
- Medicine, biology, chemistry
- Law, ethics, public policy
- Crafts, DIY, home improvement
- Parenting, education theory
- Geography, travel, cultural studies
- Mathematics, statistics

For each domain, think: "What kind of visual or content element would I NEED to teach this effectively that ISN'T covered by the 21 viz types and content patterns above?"

Give me:
1. A list of MISSING visualization types, each with:
   - Name and description
   - What topics/domains need it
   - A proposed JSON data shape
   - Why existing types can't substitute

2. A list of MISSING content patterns, each with:
   - Name and description
   - What learning scenarios need it
   - Proposed HTML markup
   - Why existing patterns can't substitute

Be specific and practical. Don't suggest things that can be achieved with existing types. Focus on genuinely missing capabilities that would unlock new categories of learning experiences.
```

---

## How to Use

1. Copy the prompt above
2. Paste it into Codex (`codex "paste prompt"`) or Gemini CLI
3. Review the suggestions
4. For each suggestion, evaluate:
   - Does it genuinely cover a gap? Or can an existing type handle it?
   - How many different topics would benefit?
   - How complex is the implementation?
5. Bring the best suggestions back to this project for implementation
