interface Stage { label: string; color: string; active?: boolean }

export default function Pipeline({ data }: { data: Record<string, unknown>; color: string }) {
  const stages = (data.stages ?? []) as Stage[]

  return (
    <div className="flex flex-wrap items-center gap-y-3">
      {stages.map((s, i) => (
        <div key={i} className="flex items-center">
          {/* Stage box */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="px-4 py-2 rounded-lg border-[1.5px] text-[13px] font-medium text-center whitespace-nowrap"
              style={{
                borderColor: s.color,
                background: s.color + '12',
                color: s.color,
              }}
            >
              {s.label}
            </div>
            {s.active && (
              <div className="w-1.5 h-1.5 rounded-full anim-pulse" style={{ background: s.color }} />
            )}
          </div>

          {/* Arrow between stages */}
          {i < stages.length - 1 && (
            <div className="flex items-center px-1.5 sm:px-3">
              <div className="w-4 sm:w-8 h-px border-t-2 border-dashed anim-flow" style={{ borderColor: s.color + '50' }} />
              <div
                className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[7px] -ml-px"
                style={{ borderLeftColor: s.color + '80' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
