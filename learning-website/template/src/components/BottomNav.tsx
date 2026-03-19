// BottomNav
export default function BottomNav({ currentStep, total, goNext, goPrev, color }:
  { currentStep: number; total: number; goNext: () => void; goPrev: () => void; color: string }) {
  return (
    <div className="max-w-3xl w-full mx-auto px-4 sm:px-8 py-4 border-t border-border flex justify-between items-center">
      <button onClick={goPrev} disabled={currentStep === 0}
        className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:bg-accent disabled:opacity-30 transition-colors">
        ← Previous
      </button>
      <span className="text-xs text-muted-foreground">{currentStep + 1} of {total}</span>
      <button onClick={goNext} disabled={currentStep >= total - 1}
        className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-30"
        style={{ borderColor: color + '40', background: color + '10', color }}>
        Next →
      </button>
    </div>
  )
}
