import { useState, useCallback, useEffect } from 'react'
import type { GrammarTopic, Drill } from './grammar'
import { getGrammarProgress, updateGrammarProgress } from '../lib/db'

interface DrillViewProps {
  topic: GrammarTopic
  onBack: () => void
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function DrillView({ topic, onBack }: DrillViewProps) {
  const [drills] = useState<Drill[]>(() => shuffleArray(topic.drills))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [done, setDone] = useState(false)

  const current = drills[index]

  // Load existing progress
  useEffect(() => {
    getGrammarProgress(topic.id)
  }, [topic.id])

  const handleSelect = useCallback(
    async (option: string) => {
      if (selected !== null) return
      setSelected(option)
      const isCorrect = option === current.correct
      const newScore = {
        correct: score.correct + (isCorrect ? 1 : 0),
        wrong: score.wrong + (isCorrect ? 0 : 1),
      }
      setScore(newScore)

      // Update DB progress
      const prog = await getGrammarProgress(topic.id)
      await updateGrammarProgress(topic.id, {
        drillsAttempted: prog.drillsAttempted + 1,
        drillsCorrect: prog.drillsCorrect + (isCorrect ? 1 : 0),
      })
    },
    [selected, current, score, topic.id]
  )

  const handleNext = useCallback(() => {
    setSelected(null)
    if (index + 1 >= drills.length) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
    }
  }, [index, drills.length])

  // Enter key to advance
  useEffect(() => {
    if (selected === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { e.preventDefault(); handleNext() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, handleNext])

  if (done) {
    const total = score.correct + score.wrong
    const percent = Math.round((score.correct / total) * 100)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', padding: 'var(--space-6) var(--space-4)', paddingBottom: 'calc(var(--nav-height) + var(--space-6))' }}>
        <button className="btn btn-ghost btn-sm mb-6" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
          ← Back
        </button>
        <div className="text-center mb-8">
          <div className="hanko hanko-lg" style={{ margin: '0 auto var(--space-4)' }} aria-hidden="true">学</div>
          <h2 className="font-serif mb-2">{topic.title} drills complete!</h2>
          <p className="text-soft">Score: {score.correct} / {total} ({percent}%)</p>
        </div>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">{score.correct}</div>
            <div className="stat-label">Correct</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={score.wrong > 0 ? { color: 'var(--accent)' } : {}}>{score.wrong}</div>
            <div className="stat-label">Wrong</div>
          </div>
        </div>
        <button className="btn btn-primary btn-full mt-auto" onClick={onBack}>Done</button>
      </div>
    )
  }

  const shuffledOptions = [...(current.options)]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', paddingBottom: 'var(--nav-height)' }}>
      {/* Progress bar */}
      <div className="progress-bar-wrap" style={{ margin: 0, borderRadius: 0, height: 3 }}>
        <div className="progress-bar-fill" style={{ width: `${(index / drills.length) * 100}%` }} />
      </div>

      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={onBack} aria-label="Back to grammar">
          ←
        </button>
        <span style={{ flex: 1, textAlign: 'center' }} className="text-soft text-sm">
          {index + 1} / {drills.length}
        </span>
        <span className="badge">{topic.title}</span>
      </div>

      <div className="page-content" style={{ flex: 1 }}>
        <div className="fade-in">
          <p className="text-soft text-sm mb-3" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Choose the correct form
          </p>

          <div className="card mb-6">
            <p lang="de" className="overflow-safe" style={{ fontSize: 'var(--text-lg)', fontFamily: 'var(--font-serif)', lineHeight: 1.5 }}>
              {current.question}
            </p>
            {current.hint && selected === null && (
              <p className="text-soft text-sm mt-2">{current.hint}</p>
            )}
          </div>

          <div className="mc-options" role="group" aria-label="Answer choices">
            {shuffledOptions.map(option => {
              let cls = 'mc-option'
              if (selected !== null) {
                if (option === current.correct) cls += ' correct'
                else if (option === selected) cls += ' wrong'
              }
              return (
                <button
                  key={option}
                  className={cls}
                  onClick={() => handleSelect(option)}
                  disabled={selected !== null}
                  lang="de"
                >
                  {option}
                </button>
              )
            })}
          </div>

          {selected !== null && (
            <div
              className="card fade-in mt-4"
              style={{ borderColor: selected === current.correct ? 'var(--ink)' : 'var(--accent)' }}
              role="alert"
              aria-live="assertive"
            >
              <p style={{ fontWeight: 600, marginBottom: 'var(--space-2)', color: selected === current.correct ? 'var(--ink)' : 'var(--accent)' }}>
                {selected === current.correct ? '✓ Correct' : `✗ The correct answer is: ${current.correct}`}
              </p>
              <p className="text-sm text-soft">{current.explanation}</p>

              <button
                className="btn btn-primary btn-full mt-4"
                onClick={handleNext}
                autoFocus
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

