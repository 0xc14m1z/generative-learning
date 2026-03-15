import FlowGraph, { type FlowNodeInput, type FlowEdgeInput } from './FlowGraph'

interface Stage { label: string; color: string; active?: boolean }

export default function Pipeline({ data, color }: { data: Record<string, unknown>; color: string }) {
  const stages = (data.stages ?? []) as Stage[]

  const nodes: FlowNodeInput[] = stages.map((s, i) => ({
    id: `stage-${i}`,
    label: s.label,
    type: 'step' as const,
    color: s.color,
    active: s.active,
  }))

  const edges: FlowEdgeInput[] = stages.slice(0, -1).map((_, i) => ({
    from: `stage-${i}`,
    to: `stage-${i + 1}`,
  }))

  // Auto-switch to vertical when there are many stages to keep them readable
  const direction = stages.length > 5 ? 'TB' : 'LR'

  return <FlowGraph nodes={nodes} edges={edges} direction={direction} fallbackColor={color} animateEdges showArrows />
}
