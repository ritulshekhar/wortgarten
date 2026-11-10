import { useState, useRef, useEffect, useCallback } from 'react'
import type { Word } from '../../lib/db'
import UmlautHelper from '../../words/UmlautHelper'

interface TypeAnswerProps {
  word: Word
  direction: 'de-en' | 'en-de'
  requireArticle?: boolean
  showHint?: boolean
  onAnswer: (answer: string) => void
}

function insertAtCursor(input: HTMLInputElement, char: string) {
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? input.value.length
  const newVal = input.value.slice(0, start) + char + input.value.slice(end)
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
  setter?.call(input, newVal)
  input.dispatchEvent(new Event('input', { bubbles: true }))
  const pos = start + char.length
  input.setSelectionRange(pos, pos)
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'de-DE'
  utter.rate = 0.9
  speechSynthesis.cancel()
  speechSynthesis.speak(utter)
}

export default function TypeAnswer({ word, direction, requireArticle, showHint, onAnswer }: TypeAnswerProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const displayGerman = word.article ? `${word.article} ${word.german}` : word.german

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [word])

  const handleUmlaut = useCallback((char: string) => {
    if (inputRef.current) {
      insertAtCursor(inputRef.current, char)
      setValue(inputRef.current.value)
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = () => {
    if (!value.trim()) return
    onAnswer(value.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="fade-in">
      <p className="text-soft text-sm mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {direction === 'de-en' ? 'Translate to English' : 'Translate to German'}
      </p>

      {direction === 'de-en' ? (
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
      ) : (
        <div className="mb-6">
          <span className="quiz-word">{word.english}</span>
          {showHint && word.type === 'noun' && word.article && !requireArticle && (
            <p className="text-soft text-sm mt-2">Hint: starts with "{word.article[0].toUpperCase()}"</p>
          )}
          {requireArticle && word.type === 'noun' && (
            <p className="text-soft text-sm mt-2">Include the article (der/die/das)</p>
          )}
        </div>
      )}

      {direction === 'en-de' && <UmlautHelper onInsert={handleUmlaut} />}

      <div className="form-group mb-4">
        <label htmlFor="type-answer" className="sr-only">Your answer</label>
        <input
          id="type-answer"
          ref={inputRef}
          className="input"
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={direction === 'de-en' ? 'Type the English meaning…' : 'Tippe auf Deutsch…'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          lang={direction === 'en-de' ? 'de' : 'en'}
          aria-label="Your answer"
          style={{ fontSize: '1rem' }}
        />
      </div>

      <button
        className="btn btn-primary btn-full"
        onClick={handleSubmit}
        disabled={!value.trim()}
      >
        Check Answer
      </button>
    </div>
  )
}

