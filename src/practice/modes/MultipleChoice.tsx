import { useState, useMemo } from 'react'
import type { Word } from '../../lib/db'

interface MultipleChoiceProps {
  word: Word
  allWords: Word[]
  difficulty: 'easy' | 'medium' | 'hard'
  onAnswer: (answer: string) => void
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'de-DE'
  utter.rate = 0.9
  speechSynthesis.cancel()
  speechSynthesis.speak(utter)
}

export default function MultipleChoice({ word, allWords, onAnswer }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const displayGerman = word.article ? `${word.article} ${word.german}` : word.german

  const choices = useMemo(() => {
    const distractors = allWords
      .filter(w => w.id !== word.id && w.english !== word.english)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.english)
    return shuffleArray([word.english, ...distractors])
  }, [word, allWords])

  const handleSelect = (choice: string) => {
    if (selected !== null) return
    setSelected(choice)
    onAnswer(choice)
  }

  return (
    <div className="fade-in">
      <p className="text-soft text-sm mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        What does this mean?
      </p>

      <div className="flex items-center gap-3 mb-6">
        <span className="quiz-word" lang="de">{displayGerman}</span>
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

      <div className="mc-options" role="group" aria-label="Answer choices">
        {choices.map(choice => {
          let cls = 'mc-option'
          if (selected !== null) {
            if (choice === word.english) cls += ' correct'
            else if (choice === selected) cls += ' wrong'
          }
          return (
            <button
              key={choice}
              className={cls}
              onClick={() => handleSelect(choice)}
              disabled={selected !== null}
              aria-pressed={selected === choice}
            >
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}

