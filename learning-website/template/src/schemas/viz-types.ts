import { z } from 'zod'

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/).describe('Hex color, e.g. "#3b82f6"')

// ─── Flow & Process ─────────────────────────────────────────────

export const PipelineData = z.object({
  stages: z.array(z.object({
    label: z.string().describe('Stage name, keep short (1-3 words)'),
    color: hexColor,
    active: z.boolean().optional().describe('If true, shows a pulse indicator below the stage'),
  })).min(2).max(12).describe('Sequential stages. ≤5 renders horizontal (LR), >5 switches to vertical (TB). Animated directional arrows between stages.'),
}).describe('Linear sequential process. Use for: workflows, lifecycles, pipelines, step-by-step procedures.')

export const FlowchartData = z.object({
  nodes: z.array(z.object({
    id: z.string().describe('Unique node identifier, used in edges'),
    label: z.string().describe('Node text, keep short (1-4 words)'),
    type: z.enum(['decision', 'outcome', 'step']).describe('decision = diamond shape (yes/no questions), outcome = dashed pill (end states), step = rectangle (actions)'),
    color: hexColor.optional().describe('Falls back to section color if omitted'),
  })).min(2).describe('All nodes in the graph'),
  edges: z.array(z.object({
    from: z.string().describe('Source node id'),
    to: z.string().describe('Target node id'),
    label: z.string().optional().describe('Edge label, e.g. "Yes", "No", condition text'),
  })).min(1).describe('Connections between nodes. Static edges, no animation.'),
}).describe('Decision tree / branching logic. Rendered via React Flow with dagre auto-layout (top-to-bottom). Use for: if/then logic, troubleshooting, decision guides.')

export const CycleData = z.object({
  nodes: z.array(z.object({
    label: z.string().describe('Stage name in the cycle'),
    detail: z.string().optional().describe('Short description shown below the diagram'),
    color: hexColor.describe('Falls back to section color if omitted'),
  })).min(3).max(8).describe('Stages arranged in a circle. Arrows connect each stage to the next, and the last connects back to the first.'),
  centerLabel: z.string().optional().describe('Text shown in the center of the cycle, e.g. "Habit Loop", "PDCA"'),
}).describe('Circular repeating process. Use for: feedback loops, habit loops, iterative cycles, seasonal processes.')

export const RoutingDiagramData = z.object({
  inputs: z.array(z.object({
    label: z.string().describe('Input source name'),
    color: hexColor,
  })).min(1).describe('Input nodes on the left'),
  router: z.object({
    label: z.string().describe('Router/hub name'),
    sublabel: z.string().optional().describe('Subtitle shown below the router label'),
  }).describe('Central routing node (rendered as diamond)'),
  outputs: z.array(z.object({
    label: z.string().describe('Output destination name'),
    active: z.boolean().describe('If true, rendered as active outcome; if false, dimmed'),
  })).min(1).describe('Output nodes on the right'),
  color: hexColor.describe('Primary color for the routing diagram'),
}).describe('Fan-in → router → fan-out diagram. Rendered as horizontal flow with animated arrows. Use for: routing, triage, load balancing, classification.')

// ─── Data & Metrics ─────────────────────────────────────────────

export const StatCardsData = z.object({
  cards: z.array(z.object({
    value: z.string().describe('The metric value, e.g. "2.5K", "99.9%", "$1.2M"'),
    unit: z.string().describe('What the value measures, e.g. "Calories/day", "Uptime", "Revenue"'),
    color: hexColor,
  })).min(1).max(6).describe('Key metric cards in a grid (2 cols mobile, 4 cols desktop)'),
}).describe('Headline numbers / KPIs. Use for: key stats, specs, summary metrics.')

export const BarChartData = z.object({
  bars: z.array(z.object({
    label: z.string().describe('Category label shown below the bar'),
    value: z.number().describe('Numeric value determining bar height'),
    color: hexColor.optional().describe('Per-bar color. Falls back to section color if omitted.'),
  })).min(1).max(12).describe('Bars rendered vertically, auto-scaled to tallest bar'),
  unit: z.string().optional().describe('Label shown above the chart, e.g. "Monthly sales ($K)"'),
  maxValue: z.number().optional().describe('Explicit maximum for the Y axis. If omitted, auto-calculated from data.'),
}).describe('Categorical bar chart. Use for: quantities, distributions, comparisons across categories.')

export const UtilizationBarsData = z.object({
  bars: z.array(z.object({
    label: z.string().describe('What is being measured'),
    value: z.number().min(0).max(100).describe('Percentage value (0-100)'),
    color: hexColor,
  })).min(1).max(8).describe('Horizontal progress bars'),
  legend: z.string().optional().describe('Explanation text below all bars, e.g. "Cache Hit Rate (%)"'),
}).describe('Horizontal percentage bars. Use for: resource usage, progress, completion rates, scores.')

export const HeatmapData = z.object({
  xLabels: z.array(z.string()).min(1).describe('Column headers. Must match the number of columns in each cells row.'),
  yLabels: z.array(z.string()).min(1).describe('Row headers. Must match the number of rows in cells.'),
  cells: z.array(z.array(z.number().min(0).max(1))).min(1).describe('2D array of values (0-1). cells[row][col]. Number of rows must equal yLabels.length, number of cols must equal xLabels.length.'),
  color: hexColor.optional().describe('Cell color. Opacity scales with value. Falls back to section color.'),
  legend: z.string().optional().describe('Description text above the heatmap'),
}).describe('2D intensity grid. Use for: schedules, correlations, frequency data, performance matrices.')

export const XYPlotData = z.object({
  xAxis: z.object({
    label: z.string().describe('X axis label, e.g. "Time (months)"'),
    min: z.number().describe('X axis minimum value'),
    max: z.number().describe('X axis maximum value. MUST be greater than min.'),
  }),
  yAxis: z.object({
    label: z.string().describe('Y axis label, e.g. "Revenue ($K)"'),
    min: z.number().describe('Y axis minimum value'),
    max: z.number().describe('Y axis maximum value. MUST be greater than min.'),
  }),
  series: z.array(z.object({
    label: z.string().describe('Series name for the legend'),
    color: hexColor.optional().describe('Series color. Falls back to section color.'),
    mode: z.enum(['line', 'scatter', 'area']).describe('line = connected path, scatter = dots only, area = filled region under the line'),
    points: z.array(z.object({
      x: z.number().describe('X coordinate'),
      y: z.number().describe('Y coordinate'),
    })).min(1).describe('Data points. Should be sorted by x for line/area modes.'),
  })).min(1).describe('Data series to plot'),
  annotations: z.array(z.object({
    x: z.number().describe('X position of the vertical annotation line'),
    label: z.string().describe('Annotation text shown at the top'),
  })).optional().describe('Optional vertical annotation lines with labels'),
}).describe('Continuous line/scatter/area chart. Use for: trends over time, growth curves, correlations, dose-response.')

export const CompositionStackData = z.object({
  totalLabel: z.string().describe('What the total represents, e.g. "Monthly Budget"'),
  segments: z.array(z.object({
    label: z.string().describe('Segment name'),
    value: z.number().min(0).describe('Segment value. All segments are shown proportional to their value relative to the sum.'),
    color: hexColor,
  })).min(2).max(10).describe('Parts of the whole. Rendered as a horizontal stacked bar.'),
  unit: z.string().optional().describe('Unit label, e.g. "%", "$", "hours"'),
}).describe('Part-of-whole composition. Use for: budgets, nutrition breakdown, time allocation, portfolio mix.')

// ─── Comparison & Analysis ──────────────────────────────────────

export const ComparisonCardsData = z.object({
  cards: z.array(z.object({
    title: z.string().describe('Card heading, e.g. "HTTP/1.1", "Plan A"'),
    color: hexColor,
    rows: z.array(z.object({
      label: z.string().describe('Row label, e.g. "Price", "Speed"'),
      value: z.string().describe('Row value, e.g. "$99/mo", "Fast"'),
      badge: z.string().optional().describe('Optional badge text, e.g. "Best", "Pro", "Con"'),
    })).min(1).describe('Key-value rows inside the card'),
  })).min(2).max(4).describe('Side-by-side cards. 2-3 cards is ideal. Full colored border.'),
}).describe('Feature-by-feature comparison. Use for: product comparison, version comparison, plan tiers.')

export const ProsConsData = z.object({
  options: z.array(z.object({
    title: z.string().describe('Option name, e.g. "Renting", "Buying"'),
    color: hexColor,
    pros: z.array(z.string()).describe('List of advantages. Each item is a short sentence.'),
    cons: z.array(z.string()).describe('List of disadvantages. Each item is a short sentence.'),
  })).min(2).max(3).describe('Options to compare, each with pros and cons. Full colored border.'),
}).describe('Trade-off analysis. Use for: decision-making, option evaluation, A vs B.')

export const TabbedViewData = z.object({
  tabs: z.array(z.object({
    label: z.string().describe('Tab button text'),
    content: z.string().describe('HTML content shown when tab is active. Supports <p>, <strong>, <em>, <code>, <ul>, <ol>.'),
  })).min(2).max(5).describe('Tabs with switchable content'),
  color: hexColor.optional().describe('Tab accent color. Falls back to section color.'),
}).describe('Multi-perspective content. Use for: comparing approaches, different angles on the same topic.')

export const QuadrantData = z.object({
  axisX: z.object({
    low: z.string().describe('Left label, e.g. "Low Effort"'),
    high: z.string().describe('Right label, e.g. "High Effort"'),
  }),
  axisY: z.object({
    low: z.string().describe('Bottom label, e.g. "Low Impact"'),
    high: z.string().describe('Top label, e.g. "High Impact"'),
  }),
  quadrants: z.tuple([
    z.object({ label: z.string(), items: z.array(z.string()), color: hexColor }).describe('Top-left quadrant (high Y, low X)'),
    z.object({ label: z.string(), items: z.array(z.string()), color: hexColor }).describe('Top-right quadrant (high Y, high X)'),
    z.object({ label: z.string(), items: z.array(z.string()), color: hexColor }).describe('Bottom-left quadrant (low Y, low X)'),
    z.object({ label: z.string(), items: z.array(z.string()), color: hexColor }).describe('Bottom-right quadrant (low Y, high X)'),
  ]).describe('Exactly 4 quadrants in order: [top-left, top-right, bottom-left, bottom-right]'),
}).describe('2×2 categorization matrix. Use for: Eisenhower matrix, effort/impact, risk/reward, prioritization.')

// ─── Structure & Hierarchy ──────────────────────────────────────

export const TieredHierarchyData = z.object({
  tiers: z.array(z.object({
    label: z.string().describe('Tier name'),
    detail: z.string().describe('Short description of this tier'),
    color: hexColor,
    width: z.number().min(20).max(100).describe('Visual width as percentage of container. Typically decreasing: 100, 80, 60, 40.'),
  })).min(2).max(8).describe('Tiers rendered top-to-bottom, centered, with decreasing widths'),
}).describe('Stacked hierarchy. Use for: memory layers, abstraction levels, organizational charts, priority stacks.')

export const TimelineData = z.object({
  events: z.array(z.object({
    date: z.string().describe('Date or period label, e.g. "1943", "Q2 2024", "Week 3"'),
    label: z.string().describe('Event title'),
    detail: z.string().optional().describe('Short description of the event'),
    color: hexColor.optional().describe('Event accent color. Falls back to section color if omitted.'),
  })).min(2).max(20).describe('Events rendered on a vertical timeline, in chronological order'),
}).describe('Vertical timeline. Use for: history, milestones, evolution, roadmaps, biographical events.')

export const ContinuumScaleData = z.object({
  axis: z.object({
    label: z.string().describe('Scale name, e.g. "pH Level"'),
    min: z.number().describe('Axis minimum value'),
    max: z.number().describe('Axis maximum value. MUST be greater than min.'),
  }),
  bands: z.array(z.object({
    from: z.number().describe('Band start value (inclusive)'),
    to: z.number().describe('Band end value (exclusive). Must be > from.'),
    label: z.string().describe('Band name, e.g. "Acidic"'),
    color: hexColor.optional().describe('Band color. Falls back to section color.'),
  })).min(1).describe('Colored regions along the scale. Bands should cover the full axis range without gaps.'),
  markers: z.array(z.object({
    value: z.number().describe('Position on the axis'),
    label: z.string().describe('Marker label, e.g. "Lemon juice"'),
  })).optional().describe('Point markers with labels, alternating above/below the scale'),
}).describe('Ordered spectrum with colored bands and markers. Use for: pH, ideology, risk levels, roast levels, any continuous scale with named regions.')

// ─── Relationships ──────────────────────────────────────────────

export const ConceptMapData = z.object({
  nodes: z.array(z.object({
    id: z.string().describe('Unique node identifier, used in edges'),
    label: z.string().describe('Concept name'),
    color: hexColor.optional().describe('Node color. Falls back to section color.'),
  })).min(2).describe('Concept nodes'),
  edges: z.array(z.object({
    from: z.string().describe('Source node id'),
    to: z.string().describe('Target node id'),
    label: z.string().optional().describe('Relationship label, e.g. "includes", "causes", "type of"'),
  })).min(1).describe('Relationships between concepts. Rendered with arrows.'),
}).describe('Concept relationship graph. Rendered via React Flow (top-to-bottom dagre layout). Use for: taxonomies, systems thinking, philosophical schools, biological systems.')

export const SankeyFlowData = z.object({
  nodes: z.array(z.object({
    id: z.string().describe('Unique node identifier, used in links'),
    label: z.string().describe('Node name'),
    color: hexColor.optional().describe('Node color. Falls back to section color.'),
  })).min(2).describe('Source and target nodes'),
  links: z.array(z.object({
    source: z.string().describe('Source node id'),
    target: z.string().describe('Target node id'),
    value: z.number().min(0).describe('Flow weight. Path width is proportional to value.'),
    label: z.string().optional().describe('Flow label, e.g. "30%", "1400 kcal"'),
  })).min(1).describe('Weighted flows between nodes. Rendered as bezier curves with width proportional to value.'),
}).describe('Weighted flow diagram (2-column). Use for: budget allocation, energy flow, calorie breakdown, supply chains.')

// ─── Specialized ────────────────────────────────────────────────

export const TokenStreamData = z.object({
  tokens: z.array(z.string()).min(1).max(20).describe('Sequence of token strings'),
  activeIndex: z.number().min(0).describe('Index of the currently active token (highlighted green). All tokens before it are shown in the section color.'),
  color: hexColor.optional().describe('Token color for processed tokens. Falls back to section color.'),
}).describe('Token sequence with active position. Use for: parsing, tokenization, step-by-step text processing.')

export const InlineSvgData = z.object({
  svg: z.string().describe('Complete SVG markup including the <svg> tag. Use viewBox for responsive sizing. Use currentColor for theme-aware text. This is an escape hatch — prefer typed visualizations when possible.'),
}).describe('Raw SVG diagram. Escape hatch for custom visualizations not covered by other types.')

// ─── Discriminated union ────────────────────────────────────────

export const VizData = z.discriminatedUnion('type', [
  z.object({ type: z.literal('pipeline'), data: PipelineData }),
  z.object({ type: z.literal('flowchart'), data: FlowchartData }),
  z.object({ type: z.literal('cycle'), data: CycleData }),
  z.object({ type: z.literal('routing-diagram'), data: RoutingDiagramData }),
  z.object({ type: z.literal('stat-cards'), data: StatCardsData }),
  z.object({ type: z.literal('bar-chart'), data: BarChartData }),
  z.object({ type: z.literal('utilization-bars'), data: UtilizationBarsData }),
  z.object({ type: z.literal('heatmap'), data: HeatmapData }),
  z.object({ type: z.literal('xy-plot'), data: XYPlotData }),
  z.object({ type: z.literal('composition-stack'), data: CompositionStackData }),
  z.object({ type: z.literal('comparison-cards'), data: ComparisonCardsData }),
  z.object({ type: z.literal('pros-cons'), data: ProsConsData }),
  z.object({ type: z.literal('tabbed-view'), data: TabbedViewData }),
  z.object({ type: z.literal('quadrant'), data: QuadrantData }),
  z.object({ type: z.literal('tiered-hierarchy'), data: TieredHierarchyData }),
  z.object({ type: z.literal('timeline'), data: TimelineData }),
  z.object({ type: z.literal('continuum-scale'), data: ContinuumScaleData }),
  z.object({ type: z.literal('concept-map'), data: ConceptMapData }),
  z.object({ type: z.literal('sankey-flow'), data: SankeyFlowData }),
  z.object({ type: z.literal('token-stream'), data: TokenStreamData }),
  z.object({ type: z.literal('inline-svg'), data: InlineSvgData }),
])

export type VizDataType = z.infer<typeof VizData>
export const VIZ_TYPES = VizData.options.map(o => o.shape.type.value)
