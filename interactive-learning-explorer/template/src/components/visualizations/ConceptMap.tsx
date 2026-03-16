import FlowGraph, { type FlowNodeInput, type FlowEdgeInput } from './FlowGraph'

interface ConceptNode {
  id: string
  label: string
  color?: string
}

interface ConceptEdge {
  from: string
  to: string
  label?: string
}

export default function ConceptMap({ data, color }: { data: Record<string, unknown>; color: string }) {
  const rawNodes = (data.nodes ?? []) as ConceptNode[]
  const rawEdges = (data.edges ?? []) as ConceptEdge[]

  // Map all concept nodes to FlowGraph 'step' type
  const nodes: FlowNodeInput[] = rawNodes.map(n => ({
    id: n.id,
    label: n.label,
    type: 'step' as const,
    color: n.color,
  }))

  const edges: FlowEdgeInput[] = rawEdges.map(e => ({
    from: e.from,
    to: e.to,
    label: e.label,
  }))

  return (
    <FlowGraph
      nodes={nodes}
      edges={edges}
      direction="TB"
      fallbackColor={color}
      animateEdges={false}
      showArrows={true}
    />
  )
}
