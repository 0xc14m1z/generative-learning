interface Option {
  title: string
  pros: string[]
  cons: string[]
  color: string
}

export default function ProsCons({ data }: { data: Record<string, unknown> }) {
  const options = (data.options ?? []) as Option[]

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(options.length, 3)}, 1fr)` }}>
      {options.map((opt, i) => (
        <div key={i} className="bg-muted/30 rounded-xl overflow-hidden border-t-[3px]" style={{ borderColor: opt.color }}>
          <h4 className="text-[13px] font-bold uppercase tracking-wider px-4 pt-4 pb-2" style={{ color: opt.color }}>
            {opt.title}
          </h4>

          {/* Pros */}
          {opt.pros.length > 0 && (
            <div className="px-4 pb-2">
              {opt.pros.map((pro, pi) => (
                <div key={pi} className="flex items-start gap-2 py-1.5">
                  <span className="text-green-500 text-sm mt-0.5 shrink-0">+</span>
                  <span className="text-sm">{pro}</span>
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          {opt.pros.length > 0 && opt.cons.length > 0 && (
            <div className="border-t border-border mx-4" />
          )}

          {/* Cons */}
          {opt.cons.length > 0 && (
            <div className="px-4 py-2">
              {opt.cons.map((con, ci) => (
                <div key={ci} className="flex items-start gap-2 py-1.5">
                  <span className="text-red-400 text-sm mt-0.5 shrink-0">-</span>
                  <span className="text-sm text-muted-foreground">{con}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
