import type { Meta, StoryObj } from '@storybook/react-vite'
import Pipeline from './Pipeline'
import ComparisonCards from './ComparisonCards'
import UtilizationBars from './UtilizationBars'
import TokenStream from './TokenStream'
import Heatmap from './Heatmap'
import TieredHierarchy from './TieredHierarchy'
import RoutingDiagram from './RoutingDiagram'
import StatCards from './StatCards'
import TabbedView from './TabbedView'
import BarChart from './BarChart'
import Timeline from './Timeline'
import Flowchart from './Flowchart'
import ProsCons from './ProsCons'
import CycleDiagram from './CycleDiagram'
import QuadrantMatrix from './QuadrantMatrix'

const wrap = (children: React.ReactNode) => (
  <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">{children}</div>
)

// ─── Pipeline ───────────────────────────────────────────────────
const pipelineMeta: Meta<typeof Pipeline> = { title: 'Visualizations/Pipeline', component: Pipeline }
export default pipelineMeta

export const PipelineBasic: StoryObj<typeof Pipeline> = {
  render: () => wrap(
    <Pipeline color="#3b82f6" data={{
      stages: [
        { label: 'Research', color: '#8b5cf6' },
        { label: 'Draft', color: '#6366f1', active: true },
        { label: 'Review', color: '#06b6d4' },
        { label: 'Publish', color: '#22c55e' },
      ]
    }} />
  ),
}

export const PipelineManySteps: StoryObj<typeof Pipeline> = {
  render: () => wrap(
    <Pipeline color="#3b82f6" data={{
      stages: [
        { label: 'Ideation', color: '#8b5cf6' },
        { label: 'Research', color: '#a855f7' },
        { label: 'Planning', color: '#6366f1' },
        { label: 'Design', color: '#3b82f6', active: true },
        { label: 'Development', color: '#06b6d4' },
        { label: 'Testing', color: '#14b8a6' },
        { label: 'Staging', color: '#22c55e' },
        { label: 'Deployment', color: '#84cc16' },
        { label: 'Monitoring', color: '#eab308' },
      ]
    }} />
  ),
}

export const PipelineLongLabels: StoryObj<typeof Pipeline> = {
  render: () => wrap(
    <Pipeline color="#ef4444" data={{
      stages: [
        { label: 'Collect Ingredients', color: '#ef4444' },
        { label: 'Prep & Mise en Place', color: '#f97316', active: true },
        { label: 'Cook Main Course', color: '#eab308' },
        { label: 'Plate & Garnish', color: '#22c55e' },
      ]
    }} />
  ),
}

// ─── ComparisonCards ────────────────────────────────────────────
export const ComparisonCardsBasic: StoryObj = {
  render: () => wrap(
    <ComparisonCards data={{
      cards: [
        { title: 'Freelance', color: '#22c55e', rows: [
          { label: 'Flexibility', value: 'High', badge: 'Pro' },
          { label: 'Stability', value: 'Low', badge: 'Con' },
          { label: 'Income ceiling', value: 'Unlimited' },
        ]},
        { title: 'Full-time', color: '#3b82f6', rows: [
          { label: 'Flexibility', value: 'Low' },
          { label: 'Stability', value: 'High', badge: 'Pro' },
          { label: 'Income ceiling', value: 'Fixed' },
        ]},
      ]
    }} />
  ),
}

// ─── UtilizationBars ────────────────────────────────────────────
export const UtilizationBarsBasic: StoryObj = {
  render: () => wrap(
    <UtilizationBars data={{
      bars: [
        { label: 'Protein', value: 85, color: '#ef4444' },
        { label: 'Carbs', value: 60, color: '#eab308' },
        { label: 'Fat', value: 45, color: '#f97316' },
        { label: 'Fiber', value: 30, color: '#22c55e' },
      ],
      legend: 'Daily intake (%)'
    }} />
  ),
}

// ─── TokenStream ────────────────────────────────────────────────
export const TokenStreamBasic: StoryObj = {
  render: () => wrap(
    <TokenStream color="#8b5cf6" data={{
      tokens: ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'],
      activeIndex: 5,
    }} />
  ),
}

// ─── Heatmap (replaces AnimatedGrid) ────────────────────────────
export const HeatmapBasic: StoryObj = {
  render: () => wrap(
    <Heatmap color="#06b6d4" data={{
      xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      yLabels: ['Morning', 'Afternoon', 'Evening'],
      cells: [
        [0.8, 0.9, 0.7, 0.85, 0.6, 0.3, 0.2],
        [0.5, 0.6, 0.7, 0.5, 0.8, 0.9, 0.4],
        [0.3, 0.2, 0.4, 0.3, 0.5, 0.7, 0.8],
      ],
      legend: 'Productivity level',
    }} />
  ),
}

export const HeatmapQuarterly: StoryObj = {
  render: () => wrap(
    <Heatmap color="#8b5cf6" data={{
      xLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
      yLabels: ['Revenue', 'Costs', 'Margin', 'Growth'],
      cells: [
        [0.6, 0.7, 0.8, 0.9],
        [0.4, 0.5, 0.45, 0.5],
        [0.7, 0.65, 0.8, 0.85],
        [0.3, 0.5, 0.6, 0.8],
      ],
      legend: 'Performance relative to target',
    }} />
  ),
}

// ─── TieredHierarchy ────────────────────────────────────────────
export const TieredHierarchyBasic: StoryObj = {
  render: () => wrap(
    <TieredHierarchy data={{
      tiers: [
        { label: 'Strategy', detail: 'Long-term vision and goals', color: '#8b5cf6', width: 100 },
        { label: 'Tactics', detail: 'Quarter-by-quarter plans', color: '#6366f1', width: 80 },
        { label: 'Operations', detail: 'Day-to-day execution', color: '#3b82f6', width: 60 },
        { label: 'Tasks', detail: 'Individual work items', color: '#06b6d4', width: 40 },
      ]
    }} />
  ),
}

// ─── RoutingDiagram (now powered by FlowGraph) ──────────────────
export const RoutingDiagramBasic: StoryObj = {
  render: () => wrap(
    <RoutingDiagram color="#22c55e" data={{
      inputs: [
        { label: 'Email', color: '#3b82f6' },
        { label: 'Chat', color: '#8b5cf6' },
        { label: 'Phone', color: '#06b6d4' },
      ],
      router: { label: 'Triage', sublabel: 'Priority routing' },
      outputs: [
        { label: 'Urgent', active: true },
        { label: 'Normal', active: true },
        { label: 'Low', active: false },
        { label: 'Archive', active: false },
      ],
      color: '#22c55e'
    }} />
  ),
}

// ─── StatCards ──────────────────────────────────────────────────
export const StatCardsBasic: StoryObj = {
  render: () => wrap(
    <StatCards data={{
      cards: [
        { value: '2.5K', unit: 'Calories/day', color: '#ef4444' },
        { value: '8h', unit: 'Sleep', color: '#8b5cf6' },
        { value: '10K', unit: 'Steps', color: '#22c55e' },
        { value: '2L', unit: 'Water', color: '#3b82f6' },
      ]
    }} />
  ),
}

// ─── TabbedView ─────────────────────────────────────────────────
export const TabbedViewBasic: StoryObj = {
  render: () => wrap(
    <TabbedView color="#f97316" data={{
      tabs: [
        { label: 'Beginner', content: '<p>Start with the basics. Focus on form over intensity.</p>' },
        { label: 'Intermediate', content: '<p>Increase volume gradually. Track your progress weekly.</p>' },
        { label: 'Advanced', content: '<p>Periodize your training. Deload every 4-6 weeks.</p>' },
      ]
    }} />
  ),
}

// ─── BarChart (replaces ComputeWave) ────────────────────────────
export const BarChartBasic: StoryObj = {
  render: () => wrap(
    <BarChart color="#84cc16" data={{
      bars: [
        { label: 'Jan', value: 42 },
        { label: 'Feb', value: 58 },
        { label: 'Mar', value: 35 },
        { label: 'Apr', value: 71 },
        { label: 'May', value: 64 },
        { label: 'Jun', value: 89 },
      ],
      unit: 'Monthly sales ($K)',
    }} />
  ),
}

export const BarChartColored: StoryObj = {
  render: () => wrap(
    <BarChart color="#3b82f6" data={{
      bars: [
        { label: 'Protein', value: 120, color: '#ef4444' },
        { label: 'Carbs', value: 250, color: '#eab308' },
        { label: 'Fat', value: 65, color: '#f97316' },
        { label: 'Fiber', value: 30, color: '#22c55e' },
        { label: 'Sugar', value: 45, color: '#ec4899' },
      ],
      unit: 'Daily intake (grams)',
      maxValue: 300,
    }} />
  ),
}

// ─── Timeline ───────────────────────────────────────────────────
export const TimelineBasic: StoryObj = {
  render: () => wrap(
    <Timeline color="#8b5cf6" data={{
      events: [
        { date: '3000 BC', label: 'Ancient Fermentation', detail: 'Egyptians discover natural fermentation for bread and beer.', color: '#eab308' },
        { date: '1796', label: 'First Cookbook Published', detail: 'Amelia Simmons publishes "American Cookery", the first American cookbook.', color: '#f97316' },
        { date: '1891', label: 'Pellegrino Artusi', detail: 'Publishes "La scienza in cucina", unifying Italian regional cuisines.', color: '#ef4444' },
        { date: '1961', label: 'Julia Child', detail: 'Mastering the Art of French Cooking brings haute cuisine to home kitchens.', color: '#ec4899' },
        { date: '2003', label: 'Molecular Gastronomy', detail: 'Ferran Adrià\'s El Bulli popularizes science-driven cooking techniques.', color: '#8b5cf6' },
        { date: '2020s', label: 'AI-Assisted Cooking', detail: 'Recipe generators and smart kitchen appliances reshape home cooking.', color: '#3b82f6' },
      ]
    }} />
  ),
}

export const TimelineCompact: StoryObj = {
  render: () => wrap(
    <Timeline color="#06b6d4" data={{
      events: [
        { date: 'Week 1', label: 'Foundation', color: '#06b6d4' },
        { date: 'Week 2-3', label: 'Core Skills', color: '#14b8a6' },
        { date: 'Week 4', label: 'Assessment', color: '#22c55e' },
      ]
    }} />
  ),
}

// ─── Flowchart ──────────────────────────────────────────────────
export const FlowchartDecisionTree: StoryObj = {
  render: () => wrap(
    <Flowchart color="#3b82f6" data={{
      nodes: [
        { id: 'start', label: 'Need a meal?', type: 'decision', color: '#3b82f6' },
        { id: 'time', label: 'Have 30+ min?', type: 'decision', color: '#8b5cf6' },
        { id: 'quick', label: 'Quick Snack', type: 'outcome', color: '#22c55e' },
        { id: 'cook', label: 'Cook at home', type: 'step', color: '#f97316' },
        { id: 'order', label: 'Order delivery', type: 'step', color: '#ef4444' },
        { id: 'ingredients', label: 'Have ingredients?', type: 'decision', color: '#06b6d4' },
        { id: 'recipe', label: 'Follow recipe', type: 'outcome', color: '#22c55e' },
        { id: 'shop', label: 'Go shopping', type: 'outcome', color: '#eab308' },
      ],
      edges: [
        { from: 'start', to: 'time', label: 'Yes' },
        { from: 'start', to: 'quick', label: 'No' },
        { from: 'time', to: 'cook', label: 'Yes' },
        { from: 'time', to: 'order', label: 'No' },
        { from: 'cook', to: 'ingredients' },
        { from: 'ingredients', to: 'recipe', label: 'Yes' },
        { from: 'ingredients', to: 'shop', label: 'No' },
      ]
    }} />
  ),
}

export const FlowchartComplex: StoryObj = {
  render: () => wrap(
    <Flowchart color="#6366f1" data={{
      nodes: [
        { id: 'goal', label: 'Financial Goal?', type: 'decision', color: '#3b82f6' },
        { id: 'emergency', label: 'Emergency Fund?', type: 'decision', color: '#8b5cf6' },
        { id: 'build-fund', label: 'Build 3-6 mo fund', type: 'outcome', color: '#ef4444' },
        { id: 'debt', label: 'High-interest debt?', type: 'decision', color: '#f97316' },
        { id: 'pay-debt', label: 'Pay debt first', type: 'outcome', color: '#ef4444' },
        { id: 'timeline', label: 'Timeline?', type: 'decision', color: '#06b6d4' },
        { id: 'short', label: 'Savings Account', type: 'outcome', color: '#22c55e' },
        { id: 'medium', label: 'Index Funds', type: 'outcome', color: '#22c55e' },
        { id: 'long', label: 'Diversified Portfolio', type: 'outcome', color: '#22c55e' },
      ],
      edges: [
        { from: 'goal', to: 'emergency' },
        { from: 'emergency', to: 'build-fund', label: 'No' },
        { from: 'emergency', to: 'debt', label: 'Yes' },
        { from: 'debt', to: 'pay-debt', label: 'Yes' },
        { from: 'debt', to: 'timeline', label: 'No' },
        { from: 'timeline', to: 'short', label: '<1 year' },
        { from: 'timeline', to: 'medium', label: '1-5 years' },
        { from: 'timeline', to: 'long', label: '5+ years' },
      ]
    }} />
  ),
}

export const FlowchartLinear: StoryObj = {
  render: () => wrap(
    <Flowchart color="#14b8a6" data={{
      nodes: [
        { id: 'idea', label: 'Idea', type: 'step', color: '#8b5cf6' },
        { id: 'validate', label: 'Validate?', type: 'decision', color: '#3b82f6' },
        { id: 'build', label: 'Build MVP', type: 'step', color: '#06b6d4' },
        { id: 'pivot', label: 'Pivot', type: 'outcome', color: '#f97316' },
        { id: 'launch', label: 'Launch', type: 'outcome', color: '#22c55e' },
      ],
      edges: [
        { from: 'idea', to: 'validate' },
        { from: 'validate', to: 'build', label: 'Yes' },
        { from: 'validate', to: 'pivot', label: 'No' },
        { from: 'build', to: 'launch' },
      ]
    }} />
  ),
}

// ─── CycleDiagram ───────────────────────────────────────────────
export const CycleHabitLoop: StoryObj = {
  render: () => wrap(
    <CycleDiagram color="#8b5cf6" data={{
      nodes: [
        { label: 'Cue', detail: 'Environmental trigger', color: '#f97316' },
        { label: 'Craving', detail: 'Desire for change', color: '#eab308' },
        { label: 'Response', detail: 'Action taken', color: '#22c55e' },
        { label: 'Reward', detail: 'Satisfaction gained', color: '#3b82f6' },
      ],
      centerLabel: 'Habit Loop',
    }} />
  ),
}

export const CyclePDCA: StoryObj = {
  render: () => wrap(
    <CycleDiagram color="#06b6d4" data={{
      nodes: [
        { label: 'Plan', color: '#3b82f6' },
        { label: 'Do', color: '#22c55e' },
        { label: 'Check', color: '#eab308' },
        { label: 'Act', color: '#ef4444' },
      ],
      centerLabel: 'PDCA',
    }} />
  ),
}

export const CycleThreeSteps: StoryObj = {
  render: () => wrap(
    <CycleDiagram color="#ec4899" data={{
      nodes: [
        { label: 'Learn', detail: 'Acquire new knowledge', color: '#8b5cf6' },
        { label: 'Practice', detail: 'Apply in real context', color: '#06b6d4' },
        { label: 'Reflect', detail: 'Evaluate and adjust', color: '#f97316' },
      ],
    }} />
  ),
}

// ─── QuadrantMatrix ─────────────────────────────────────────────
export const QuadrantEisenhower: StoryObj = {
  render: () => wrap(
    <QuadrantMatrix data={{
      axisX: { low: 'Not Urgent', high: 'Urgent' },
      axisY: { low: 'Not Important', high: 'Important' },
      quadrants: [
        { label: 'Schedule', items: ['Strategic planning', 'Exercise', 'Learning'], color: '#3b82f6' },
        { label: 'Do First', items: ['Deadlines', 'Crises', 'Urgent bugs'], color: '#ef4444' },
        { label: 'Eliminate', items: ['Time wasters', 'Busywork'], color: '#64748b' },
        { label: 'Delegate', items: ['Some emails', 'Some meetings', 'Routine tasks'], color: '#eab308' },
      ],
    }} />
  ),
}

export const QuadrantEffortImpact: StoryObj = {
  render: () => wrap(
    <QuadrantMatrix data={{
      axisX: { low: 'Low Effort', high: 'High Effort' },
      axisY: { low: 'Low Impact', high: 'High Impact' },
      quadrants: [
        { label: 'Quick Wins', items: ['Fix typos', 'Update copy', 'Add alt text'], color: '#22c55e' },
        { label: 'Major Projects', items: ['Redesign', 'New features', 'Platform migration'], color: '#8b5cf6' },
        { label: 'Fill-ins', items: ['Minor refactors', 'Nice-to-haves'], color: '#64748b' },
        { label: 'Thankless Tasks', items: ['Legacy cleanup', 'Compliance work'], color: '#f97316' },
      ],
    }} />
  ),
}

// ─── ProsCons ───────────────────────────────────────────────────
export const ProsConsBasic: StoryObj = {
  render: () => wrap(
    <ProsCons data={{
      options: [
        {
          title: 'Renting',
          color: '#3b82f6',
          pros: ['Flexibility to move', 'No maintenance costs', 'Lower upfront cost'],
          cons: ['No equity built', 'Rent increases', 'Limited customization'],
        },
        {
          title: 'Buying',
          color: '#22c55e',
          pros: ['Build equity', 'Stable payments', 'Full customization'],
          cons: ['High down payment', 'Maintenance costs', 'Less flexibility'],
        },
      ]
    }} />
  ),
}

export const ProsConsThreeOptions: StoryObj = {
  render: () => wrap(
    <ProsCons data={{
      options: [
        { title: 'Keto', color: '#ef4444', pros: ['Fast weight loss', 'Reduced hunger'], cons: ['Hard to sustain', 'Limited food choices'] },
        { title: 'Mediterranean', color: '#22c55e', pros: ['Heart healthy', 'Sustainable', 'Varied foods'], cons: ['Slower results'] },
        { title: 'Intermittent Fasting', color: '#8b5cf6', pros: ['Simple rules', 'Flexible food'], cons: ['Hunger windows', 'Social challenges'] },
      ]
    }} />
  ),
}
