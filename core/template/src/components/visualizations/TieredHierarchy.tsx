interface Tier { label: string; detail: string; color: string; width: number }
export default function TieredHierarchy({ data }: { data: Record<string, unknown> }) {
  const tiers = (data.tiers ?? []) as Tier[]
  return <div className="flex flex-col items-center gap-1.5">
    {tiers.map((t, i) => (
      <div key={i} className="border rounded-lg px-4 py-2.5 text-center" style={{ width: `${t.width}%`, borderColor: t.color + '60', background: `linear-gradient(135deg, ${t.color}15, ${t.color}05)` }}>
        <span className="block text-[13px] font-bold" style={{ color: t.color }}>{t.label}</span>
        <span className="block text-[11px] text-muted-foreground mt-0.5">{t.detail}</span>
      </div>
    ))}
    <div className="flex gap-6 mt-3 text-[11px] text-muted-foreground">
      <span>↑ Faster, smaller</span><span>↓ Slower, larger</span>
    </div>
  </div>
}
