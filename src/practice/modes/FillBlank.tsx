import { useState, useRef, useEffect, useCallback } from 'react'
import type { Word } from '../../lib/db'
import UmlautHelper from '../../words/UmlautHelper'

interface FillBlankProps {
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

/** Replace the target word (case-insensitive) with ___ in the sentence */
function makeBlankSentence(sentence: string, german: string): string {
  const regex = new RegExp(`\\b${german.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
  return sentence.replace(regex, '___')
}

export default function FillBlank({ word, onAnswer }: FillBlankProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const sentence = word.exampleSentence ?? ''
  const displaySentence = makeBlankSentence(sentence, word.german)

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
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit() }
  }

  if (!sentence) {
    // No example sentence — fall back
    return (
      <div className="fade-in text-center text-soft mt-8">
        <p>No example sentence for this word.</p>
        <button className="btn btn-primary mt-4" onClick={() => onAnswer('')}>Skip</button>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <p className="text-soft text-sm mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Fill in the blank
      </p>

      <div className="card mb-6" lang="de">
        <p className="quiz-word" style={{ fontSize: 'var(--text-xl)', overflow: 'hidden', overflowWrap: 'anywhere' }}>
          {displaySentence}
        </p>
        <p className="text-soft text-sm mt-2">{word.english}</p>
      </div>

      <UmlautHelper onInsert={handleUmlaut} />

      <div className="form-group mb-4">
        <label htmlFor="fill-answer" className="sr-only">Fill in the blank</label>
        <input
          id="fill-answer"
          ref={inputRef}
          className="input"
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type the missing word…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          lang="de"
          aria-label="Fill in the blank"
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

