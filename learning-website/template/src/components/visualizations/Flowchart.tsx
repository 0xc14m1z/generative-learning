import FlowGraph, { type FlowNodeInput, type FlowEdgeInput } from './FlowGraph'

export default function Flowchart({ data, color }: { data: Record<string, unknown>; color: string }) {
  const nodes = (data.nodes ?? []) as FlowNodeInput[]
  const edges = (data.edges ?? []) as FlowEdgeInput[]

  return <FlowGraph nodes={nodes} edges={edges} direction="TB" fallbackColor={color} />
}
