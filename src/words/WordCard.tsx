import type { Word } from '../lib/db'
import { isWeak } from '../lib/srs'

interface WordCardProps {
  word: Word
  onClick: () => void
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'de-DE'
  utter.rate = 0.9
  speechSynthesis.cancel()
  speechSynthesis.speak(utter)
}

export default function WordCard({ word, onClick }: WordCardProps) {
  const displayGerman = word.article
    ? `${word.article} ${word.german}`
    : word.german

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation()
    speak(word.german)
  }

  return (
    <div
      className="word-item fade-in"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${displayGerman}: ${word.english}. Tap to edit.`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
    >
      <div className="word-item-main">
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          <span className="word-german" lang="de">{displayGerman}</span>
          {word.plural && (
            <span className="text-soft text-sm" lang="de">/ {word.plural}</span>
          )}
          {isWeak(word) && (
            <span className="badge badge-accent" aria-label="Weak word">weak</span>
          )}
        </div>
        <div className="word-english">{word.english}</div>
        {word.exampleSentence && (
          <div
            className="text-soft text-sm mt-2"
            lang="de"
            style={{ fontStyle: 'italic', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}
          >
            {word.exampleSentence}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
        <span className="badge">{word.level}</span>
        <span className="badge" aria-label={`Box ${word.box}`} title={`Leitner box ${word.box}`}>
          {'★'.repeat(word.box)}
        </span>
        {'speechSynthesis' in window && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleSpeak}
            aria-label={`Pronounce ${word.german}`}
            style={{ padding: 'var(--space-1)', minWidth: 36, minHeight: 36 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

