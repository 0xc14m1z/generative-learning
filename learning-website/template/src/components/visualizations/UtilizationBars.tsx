interface Bar { label: string; value: number; color: string }
export default function UtilizationBars({ data }: { data: Record<string, unknown> }) {
  const bars = (data.bars ?? []) as Bar[]
  const legend = data.legend as string | undefined
  return <div>
    {bars.map((b, i) => (
      <div key={i} className="mb-3.5">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-muted-foreground">{b.label}</span>
          <span className="text-sm font-semibold" style={{ color: b.color }}>{b.value}%</span>
        </div>
        <div className="bg-muted rounded-full h-2.5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${b.value}%`, background: `linear-gradient(90deg, ${b.color}, ${b.color}cc)` }} />
        </div>
      </div>
    ))}
    {legend && <p className="text-xs text-muted-foreground mt-2">{legend}</p>}
  </div>
}
