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

  return <FlowGraph nodes={nodes} edges={edges} direction="LR" fallbackColor={color} />
}
