export default function AnimatedGrid({ data, color }: { data: Record<string, unknown>; color: string }) {
  const rows = (data.rows ?? 8) as number, cols = (data.cols ?? 16) as number
  const pattern = (data.activePattern ?? 'all') as string
  const activeCols = (data.activeCols ?? [0, 1]) as number[]
  const label = data.label as string | undefined
  const isActive = (r: number, c: number) => pattern === 'all' ? true : pattern === 'sparse' ? (r + c) % 5 === 0 : pattern === 'columns' ? activeCols.includes(c) : false
  return <div>
    {label && <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{label}</p>}
    <div className="grid gap-[3px] max-w-md" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols), c = i % cols, a = isActive(r, c)
        return <div key={i} className={`aspect-square rounded-[3px] transition-colors ${a ? 'anim-pulse' : ''}`}
          style={{ background: a ? color : 'var(--color-border)', opacity: a ? 1 : 0.35, animationDelay: a ? `${(r * cols + c) * 0.02}s` : undefined, boxShadow: a ? `0 0 6px ${color}30` : 'none' }} />
      })}
    </div>
  </div>
}
