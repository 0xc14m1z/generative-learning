interface Stage { label: string; color: string; active?: boolean }
export default function Pipeline({ data }: { data: Record<string, unknown>; color: string }) {
  const stages = (data.stages ?? []) as Stage[]
  const bw = 100, gap = 48, h = 80, bh = 40, y = (h - bh) / 2
  const w = stages.length * bw + (stages.length - 1) * gap + 20
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
      {stages.map((s, i) => {
        const x = 10 + i * (bw + gap)
        return <g key={i}>
          <rect x={x} y={y} width={bw} height={bh} rx={10} fill={s.color + '15'} stroke={s.color} strokeWidth={1.5} />
          <text x={x + bw / 2} y={y + bh / 2 + 4} textAnchor="middle" fill="currentColor" fontSize={12} fontFamily="system-ui">{s.label}</text>
          {s.active && <circle cx={x + bw / 2} cy={y + bh + 10} r={3} fill={s.color} className="anim-pulse" />}
          {i < stages.length - 1 && <>
            <line x1={x + bw + 4} y1={h / 2} x2={x + bw + gap - 8} y2={h / 2} stroke={s.color + '50'} strokeWidth={2} strokeDasharray="8 4" className="anim-flow" />
            <polygon points={`${x + bw + gap - 12},${h / 2 - 4} ${x + bw + gap - 4},${h / 2} ${x + bw + gap - 12},${h / 2 + 4}`} fill={s.color + '80'} />
          </>}
        </g>
      })}
    </svg>
  )
}
