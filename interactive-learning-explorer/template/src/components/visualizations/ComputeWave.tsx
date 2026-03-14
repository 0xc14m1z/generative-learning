export default function ComputeWave({ data, color }: { data: Record<string, unknown>; color: string }) {
  const n = (data.barCount ?? 48) as number
  const speed = (data.speed ?? 1.5) as number
  const label = data.label as string | undefined
  return <div>
    {label && <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{label}</p>}
    <div className="flex items-end gap-[2px] h-12">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="flex-1 h-full rounded-t-sm anim-wave" style={{
          background: `linear-gradient(to top, ${color}, ${color}60)`,
          animationDuration: `${speed}s`, animationDelay: `${i * 0.04}s`, transformOrigin: 'bottom',
        }} />
      ))}
    </div>
  </div>
}
