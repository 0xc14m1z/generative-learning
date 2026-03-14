export default function TokenStream({ data, color }: { data: Record<string, unknown>; color: string }) {
  const tokens = (data.tokens ?? []) as string[]
  const activeIdx = (data.activeIndex ?? tokens.length - 1) as number
  return (
    <div className="flex flex-wrap gap-1.5 py-1">
      {tokens.map((t, i) => (
        <span key={i} className="inline-block border rounded-md px-2.5 py-1 text-[13px] font-mono anim-token"
          style={{
            borderColor: i <= activeIdx ? (i === activeIdx ? '#22c55e40' : color + '40') : 'var(--color-border)',
            background: i <= activeIdx ? (i === activeIdx ? '#22c55e10' : color + '10') : 'transparent',
            color: i === activeIdx ? '#22c55e' : i < activeIdx ? color : 'var(--color-muted-foreground)',
            animationDelay: `${i * 0.12}s`,
          }}>{t}</span>
      ))}
      <span className="inline-block w-0.5 h-5 bg-green-500 rounded-sm self-center anim-pulse" />
    </div>
  )
}
