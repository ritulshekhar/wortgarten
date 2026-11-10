import { useState, useRef, useEffect, useCallback } from 'react'
import type { Word } from '../../lib/db'
import UmlautHelper from '../../words/UmlautHelper'

interface ListeningQuizProps {
  word: Word
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
  utter.rate = 0.85
  speechSynthesis.cancel()
  speechSynthesis.speak(utter)
}

export default function ListeningQuiz({ word, onAnswer }: ListeningQuizProps) {
  const [value, setValue] = useState('')
  const [played, setPlayed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-play on mount
    setTimeout(() => {
      speak(word.german)
      setPlayed(true)
    }, 500)
  }, [word.german])

  useEffect(() => {
    if (played) setTimeout(() => inputRef.current?.focus(), 100)
  }, [played])

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
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit() }
  }

  return (
    <div className="fade-in">
      <p className="text-soft text-sm mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Listen and type what you hear
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)',
          padding: 'var(--space-8) 0',
        }}
      >
        <button
          className="btn btn-secondary"
          style={{ padding: 'var(--space-6)', borderRadius: '50%', width: 80, height: 80, fontSize: '2rem' }}
          onClick={() => speak(word.german)}
          aria-label="Play pronunciation again"
        >
          🔊
        </button>
        <p className="text-soft text-sm">Tap to hear again</p>
      </div>

      <UmlautHelper onInsert={handleUmlaut} />

      <div className="form-group mb-4">
        <label htmlFor="listen-answer" className="sr-only">Type what you heard</label>
        <input
          id="listen-answer"
          ref={inputRef}
          className="input"
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type the German word…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          lang="de"
          aria-label="Type what you heard"
        />
      </div>

      <button
        className="btn btn-primary btn-full"
        onClick={handleSubmit}
        disabled={!value.trim()}
      >
        Check
      </button>
    </div>
  )
}

