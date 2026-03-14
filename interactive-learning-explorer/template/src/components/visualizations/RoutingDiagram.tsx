interface Input { label: string; color: string }
interface Output { label: string; active: boolean }
export default function RoutingDiagram({ data }: { data: Record<string, unknown> }) {
  const inputs = (data.inputs ?? []) as Input[]
  const router = data.router as { label: string; sublabel?: string } | undefined
  const outputs = (data.outputs ?? []) as Output[]
  const color = (data.color ?? '#22c55e') as string
  const h = Math.max(inputs.length, outputs.length) * 40 + 30
  const inY = (i: number) => 15 + i * 40, outY = (i: number) => 15 + i * 40
  return (
    <svg viewBox={`0 0 460 ${h}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
      {inputs.map((inp, i) => <g key={`i${i}`}>
        <rect x={10} y={inY(i)} width={80} height={28} rx={6} fill={inp.color + '15'} stroke={inp.color} strokeWidth={1} />
        <text x={50} y={inY(i) + 18} textAnchor="middle" fill={inp.color} fontSize={11} fontFamily="system-ui">{inp.label}</text>
      </g>)}
      {router && <g>
        <rect x={130} y={h / 2 - 28} width={75} height={56} rx={8} fill="#eab30812" stroke="#eab308" strokeWidth={1.5} />
        <text x={167} y={h / 2} textAnchor="middle" fill="#eab308" fontSize={11} fontFamily="system-ui">{router.label}</text>
        {router.sublabel && <text x={167} y={h / 2 + 14} textAnchor="middle" fill="#eab30880" fontSize={9} fontFamily="system-ui">{router.sublabel}</text>}
      </g>}
      {outputs.map((o, i) => <g key={`o${i}`}>
        <rect x={270} y={outY(i)} width={90} height={28} rx={6} fill={o.active ? color + '20' : 'var(--color-muted)'} stroke={o.active ? color : 'var(--color-border)'} strokeWidth={o.active ? 1.5 : 1} opacity={o.active ? 1 : 0.4} />
        <text x={315} y={outY(i) + 18} textAnchor="middle" fill={o.active ? color : 'var(--color-muted-foreground)'} fontSize={11} fontFamily="system-ui">{o.label}</text>
        {o.active && <circle cx={370} cy={outY(i) + 14} r={3} fill={color} className="anim-pulse" />}
      </g>)}
    </svg>
  )
}
