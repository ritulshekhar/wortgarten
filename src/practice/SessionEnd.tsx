import type { Word } from '../lib/db'

interface SessionEndProps {
  total: number
  correct: number
  mistakes: Word[]
  onDone: () => void
  onPracticeMistakes?: () => void
}

export default function SessionEnd({ total, correct, mistakes, onDone, onPracticeMistakes }: SessionEndProps) {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', padding: 'var(--space-6) var(--space-4)', paddingBottom: 'calc(var(--nav-height) + var(--space-6))' }}>
      <div className="text-center mb-8">
        <div className="hanko hanko-lg" style={{ margin: '0 auto var(--space-4)' }} aria-hidden="true">学</div>
        <h1 className="font-serif mb-2" style={{ fontSize: 'var(--text-2xl)' }}>Session complete!</h1>
        <p className="text-soft">Great work. Keep it up.</p>
      </div>

      <div className="stat-grid mb-6">
        <div className="stat-card">
          <div className="stat-value">{correct}</div>
          <div className="stat-label">Correct</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={mistakes.length > 0 ? { color: 'var(--accent)' } : {}}>
            {mistakes.length}
          </div>
          <div className="stat-label">To review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{percent}%</div>
          <div className="stat-label">Score</div>
        </div>
      </div>

      {mistakes.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-serif text-md mb-3">Words to review</h2>
          {mistakes.slice(0, 10).map(w => (
            <div key={w.id} className="card-flat" style={{ padding: 'var(--space-2) 0' }}>
              <span lang="de" className="overflow-safe" style={{ fontWeight: 600 }}>
                {w.article ? `${w.article} ` : ''}{w.german}
              </span>
              <span className="text-soft text-sm"> — {w.english}</span>
            </div>
          ))}
          {mistakes.length > 10 && (
            <p className="text-sm text-soft mt-2">…and {mistakes.length - 10} more</p>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'auto' }}>
        {onPracticeMistakes && (
          <button className="btn btn-secondary" onClick={onPracticeMistakes}>
            Practice mistakes again
          </button>
        )}
        <button className="btn btn-primary btn-full" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  )
}

