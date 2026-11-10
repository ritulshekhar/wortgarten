import { useEffect, useCallback } from 'react'
import type { Word } from '../lib/db'

type AnswerResult = 'correct' | 'almost' | 'wrong'

interface FeedbackPanelProps {
  result: AnswerResult
  word: Word
  userInput: string
  correctSpelling?: string
  onNext: () => void
  onKnewIt?: () => void
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'de-DE'
  utter.rate = 0.9
  speechSynthesis.cancel()
  speechSynthesis.speak(utter)
}

export default function FeedbackPanel({
  result,
  word,
  userInput,
  correctSpelling,
  onNext,
  onKnewIt,
}: FeedbackPanelProps) {
  const displayGerman = word.article ? `${word.article} ${word.german}` : word.german

  // Auto-speak on correct or almost
  useEffect(() => {
    if (result !== 'wrong') speak(word.german)
  }, [word.german, result])

  // Enter to advance
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { e.preventDefault(); onNext() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onNext])

  const handleSpeak = useCallback(() => speak(word.german), [word.german])

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Result indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--line)',
          background: 'var(--surface)',
        }}
        role="alert"
        aria-live="assertive"
      >
        <span style={{ fontSize: '1.5rem' }} aria-hidden="true">
          {result === 'correct' ? '✓' : result === 'almost' ? '≈' : '✗'}
        </span>
        <div>
          {result === 'correct' && (
            <p style={{ color: 'var(--ink)', fontWeight: 600 }}>Correct!</p>
          )}
          {result === 'almost' && (
            <>
              <p style={{ color: 'var(--ink)', fontWeight: 600 }}>Almost correct!</p>
              {correctSpelling && (
                <p className="text-sm text-soft">
                  Correct spelling: <span lang="de" style={{ fontWeight: 600, color: 'var(--ink)' }}>{correctSpelling}</span>
                </p>
              )}
            </>
          )}
          {result === 'wrong' && (
            <>
              <p style={{ color: 'var(--accent)', fontWeight: 600 }}>
                <span style={{ textDecoration: 'line-through' }}>{userInput || '—'}</span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Word detail */}
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <span className="quiz-word" lang="de" style={{ fontSize: 'var(--text-2xl)' }}>
            {displayGerman}
          </span>
          {'speechSynthesis' in window && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleSpeak}
              aria-label={`Pronounce ${word.german}`}
              style={{ padding: 'var(--space-1)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            </button>
          )}
        </div>

        <p style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-2)' }}>
          {word.english}
        </p>

        {word.plural && (
          <p className="text-sm text-soft mb-1" lang="de">Plural: die {word.plural}</p>
        )}
        {word.exampleSentence && (
          <p className="text-sm text-soft" lang="de" style={{ fontStyle: 'italic' }}>
            „{word.exampleSentence}"
          </p>
        )}
        {word.note && (
          <p className="text-sm text-soft mt-2">{word.note}</p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {onKnewIt && (
          <button
            className="btn btn-secondary"
            onClick={onKnewIt}
            aria-label="Mark as correct — I actually knew this"
          >
            I knew this
          </button>
        )}
        <button
          className="btn btn-primary btn-full"
          onClick={onNext}
          aria-label="Next question"
          autoFocus
        >
          Next →
        </button>
      </div>
    </div>
  )
}

