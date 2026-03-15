import type { Meta, StoryObj } from '@storybook/react-vite'
import Pipeline from './Pipeline'
import ComparisonCards from './ComparisonCards'
import UtilizationBars from './UtilizationBars'
import TokenStream from './TokenStream'
import AnimatedGrid from './AnimatedGrid'
import TieredHierarchy from './TieredHierarchy'
import RoutingDiagram from './RoutingDiagram'
import StatCards from './StatCards'
import TabbedView from './TabbedView'
import ComputeWave from './ComputeWave'
import Timeline from './Timeline'
import Flowchart from './Flowchart'
import ProsCons from './ProsCons'

const wrap = (children: React.ReactNode) => (
  <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">{children}</div>
)

// ─── Pipeline ───────────────────────────────────────────────────
const pipelineMeta: Meta<typeof Pipeline> = { title: 'Visualizations/Pipeline', component: Pipeline }
export default pipelineMeta // default for the file

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

// ─── AnimatedGrid ───────────────────────────────────────────────
export const AnimatedGridBasic: StoryObj = {
  render: () => wrap(
    <AnimatedGrid color="#06b6d4" data={{
      rows: 4, cols: 8,
      activePattern: 'columns', activeCols: [1, 3, 5, 7],
      label: 'Active zones'
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

// ─── RoutingDiagram ─────────────────────────────────────────────
export const RoutingDiagramBasic: StoryObj = {
  render: () => wrap(
    <RoutingDiagram data={{
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

// ─── ComputeWave ────────────────────────────────────────────────
export const ComputeWaveBasic: StoryObj = {
  render: () => wrap(
    <ComputeWave color="#84cc16" data={{
      barCount: 20, speed: 1.5, label: 'Activity over time'
    }} />
  ),
}

// ─── Timeline (NEW) ─────────────────────────────────────────────
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

// ─── Flowchart (NEW) ────────────────────────────────────────────
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

// ─── ProsCons (NEW) ─────────────────────────────────────────────
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
