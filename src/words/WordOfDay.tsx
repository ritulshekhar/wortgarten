import type { Word } from '../lib/db'
import { isDue } from '../lib/srs'

interface WordOfDayProps {
  word: Word
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'de-DE'
  utter.rate = 0.9
  speechSynthesis.cancel()
  speechSynthesis.speak(utter)
}

export default function WordOfDay({ word }: WordOfDayProps) {
  const displayGerman = word.article ? `${word.article} ${word.german}` : word.german

  return (
    <div
      className="card"
      style={{ marginBottom: 'var(--space-6)', position: 'relative', overflow: 'hidden' }}
      aria-label="Word of the day"
    >
      <div
        style={{
          position: 'absolute',
          top: 'var(--space-3)',
          right: 'var(--space-3)',
        }}
      >
        <div className="hanko hanko-sm" aria-hidden="true">学</div>
      </div>

      <p className="text-xs text-soft" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>
        Word of the Day
      </p>

      <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-1)' }}>
        <span
          className="quiz-word"
          lang="de"
          style={{ fontSize: 'var(--text-2xl)' }}
        >
          {displayGerman}
        </span>
        {'speechSynthesis' in window && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => speak(word.german)}
            aria-label={`Pronounce ${word.german}`}
            style={{ padding: 'var(--space-1)', flexShrink: 0 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-soft">{word.english}</p>
      {word.exampleSentence && (
        <p className="text-sm text-soft mt-2" lang="de" style={{ fontStyle: 'italic' }}>
          {word.exampleSentence}
        </p>
      )}
      <div className="flex gap-2 mt-2">
        <span className="badge">{word.level}</span>
        <span className="badge">{word.type}</span>
        {isDue(word) && <span className="badge badge-accent">Due for review</span>}
      </div>
    </div>
  )
}

