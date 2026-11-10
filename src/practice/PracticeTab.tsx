import { useState, useEffect } from 'react'
import { db } from '../lib/db'
import type { Word } from '../lib/db'
import { buildSession, type LevelFilter } from '../lib/sessionBuilder'
import QuizSession from './QuizSession'

type DifficultyFeel = 'easy' | 'medium' | 'hard'

const SIZE_OPTIONS = [10, 20, 30, 50] as const

export default function PracticeTab() {
  const [words, setWords] = useState<Word[]>([])
  const [sessionSize, setSessionSize] = useState<number>(20)
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all')
  const [difficulty, setDifficulty] = useState<DifficultyFeel>('medium')
  const [mode, setMode] = useState<'mixed' | 'de-en' | 'en-de' | 'article' | 'listen' | 'fill'>('mixed')
  const [session, setSession] = useState<Word[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    db.words.toArray().then(w => { setWords(w); setLoading(false) })
  }, [])

  const startSession = () => {
    const built = buildSession(words, { sessionSize, levelFilter })
    setSession(built)
  }

  const handleSessionEnd = () => {
    db.words.toArray().then(setWords)
    setSession(null)
  }

  if (loading) return <div className="page-content text-soft text-center mt-6">Loading…</div>

  if (session) {
    return (
      <QuizSession
        words={session}
        difficulty={difficulty}
        mode={mode}
        onEnd={handleSessionEnd}
      />
    )
  }

  const eligible = buildSession(words, { sessionSize, levelFilter })
  const hasSpeechSynthesis = 'speechSynthesis' in window

  return (
    <>
      <div className="page-header">
        <div className="hanko" aria-hidden="true">学</div>
        <h1 className="page-title">Practice</h1>
      </div>

      <div className="page-content">
        {words.length === 0 ? (
          <div className="empty-state">
            <span className="kanji-watermark" aria-hidden="true">学</span>
            <p style={{ fontSize: 'var(--text-lg)', fontFamily: 'var(--font-serif)' }}>
              No words to practice yet.
            </p>
            <p className="text-soft">Add words in the Words tab first.</p>
          </div>
        ) : (
          <>
            <div className="card mb-6">
              <p className="text-soft text-sm mb-1">Ready to practice</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                {eligible.length} <span className="text-soft text-lg">words</span>
              </p>
              <p className="text-soft text-sm mt-1">
                {words.length} total in your log
              </p>
            </div>

            {/* Session size */}
            <div className="mb-6">
              <h2 className="text-md font-serif mb-3">Session size</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)' }}>
                {SIZE_OPTIONS.map(s => (
                  <button
                    key={s}
                    className={`btn${sessionSize === s ? ' btn-primary' : ' btn-secondary'}`}
                    onClick={() => setSessionSize(s)}
                    aria-pressed={sessionSize === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Level filter */}
            <div className="mb-6">
              <h2 className="text-md font-serif mb-3">Word filter</h2>
              <div className="filter-bar">
                {(['all', 'A1', 'A2', 'B1+', 'weak', 'due'] as LevelFilter[]).map(f => (
                  <button
                    key={f}
                    className={`filter-chip${levelFilter === f ? ' active' : ''}`}
                    onClick={() => setLevelFilter(f)}
                    aria-pressed={levelFilter === f}
                  >
                    {f === 'all' ? 'All levels' : f === 'weak' ? 'Weak words' : f === 'due' ? 'Due today' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty feel */}
            <div className="mb-6">
              <h2 className="text-md font-serif mb-3">Difficulty feel</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {([
                  { key: 'easy' as DifficultyFeel, label: 'Easy', hint: 'Multiple choice — just tap the right answer' },
                  { key: 'medium' as DifficultyFeel, label: 'Medium', hint: 'Type your answer (umlauts accepted)' },
                  { key: 'hard' as DifficultyFeel, label: 'Hard', hint: 'Type answer + article required, no hints' },
                ] as const).map(({ key, label, hint }) => (
                  <label key={key} className="session-option" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="difficulty"
                      value={key}
                      checked={difficulty === key}
                      onChange={() => setDifficulty(key)}
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{label}</div>
                      <div className="text-sm text-soft">{hint}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="mb-6">
              <h2 className="text-md font-serif mb-3">Question type</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {([
                  { key: 'mixed' as const, label: 'Mixed', hint: 'All question types in one session' },
                  { key: 'de-en' as const, label: 'German → English', hint: 'See German, give English meaning' },
                  { key: 'en-de' as const, label: 'English → German', hint: 'See English, type the German word' },
                  { key: 'article' as const, label: 'Articles only', hint: 'der / die / das — nouns only' },
                  ...(hasSpeechSynthesis ? [{ key: 'listen' as const, label: 'Listening', hint: 'Hear the word, type what you hear' }] : []),
                  { key: 'fill' as const, label: 'Fill the blank', hint: 'Complete the example sentence (needs examples)' },
                ]).map(({ key, label, hint }) => (
                  <label key={key} className="session-option" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="mode"
                      value={key}
                      checked={mode === key}
                      onChange={() => setMode(key as typeof mode)}
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{label}</div>
                      <div className="text-sm text-soft">{hint}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={startSession}
              disabled={eligible.length === 0}
              style={{ fontSize: 'var(--text-md)' }}
            >
              Start Practice →
            </button>
          </>
        )}
      </div>
    </>
  )
}

