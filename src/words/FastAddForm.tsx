import { useState, useRef, useCallback } from 'react'
import UmlautHelper from './UmlautHelper'
import type { Word, WordType, Article, Level } from '../lib/db'

interface FastAddFormProps {
  onAdd: (word: Omit<Word, 'id'>) => void
}

function insertAtCursor(input: HTMLInputElement | HTMLTextAreaElement, char: string) {
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? input.value.length
  const before = input.value.slice(0, start)
  const after = input.value.slice(end)
  input.value = before + char + after
  const pos = start + char.length
  input.setSelectionRange(pos, pos)
  // Trigger React's onChange
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set
  nativeInputValueSetter?.call(input, input.value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

export default function FastAddForm({ onAdd }: FastAddFormProps) {
  const [german, setGerman] = useState('')
  const [english, setEnglish] = useState('')
  const [type, setType] = useState<WordType>('verb')
  const [article, setArticle] = useState<Article | ''>('')
  const [exampleSentence, setExampleSentence] = useState('')
  const [level, setLevel] = useState<Level>('A1')
  const [expanded, setExpanded] = useState(false)

  const germanRef = useRef<HTMLInputElement>(null)
  const lastFocused = useRef<HTMLInputElement | null>(null)

  const handleUmlaut = useCallback((char: string) => {
    const target = lastFocused.current ?? germanRef.current
    if (target) {
      insertAtCursor(target, char)
      target.focus()
      // Sync React state
      if (target === germanRef.current) {
        setGerman(target.value)
      }
    }
  }, [])

  const handleSubmit = useCallback(() => {
    const g = german.trim()
    const e = english.trim()
    if (!g || !e) return

    const word: Omit<Word, 'id'> = {
      german: g,
      english: e,
      type,
      article: (type === 'noun' && article) ? article as Article : undefined,
      exampleSentence: exampleSentence.trim() || undefined,
      level,
      dateAdded: Date.now(),
      box: 1,
      timesCorrect: 0,
      timesWrong: 0,
      streak: 0,
    }

    onAdd(word)
    setGerman('')
    setEnglish('')
    setExampleSentence('')
    // Keep type/article/level for quick repeated entry
    setTimeout(() => germanRef.current?.focus(), 50)
  }, [german, english, type, article, exampleSentence, level, onAdd])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  return (
    <form
      onSubmit={e => { e.preventDefault(); handleSubmit() }}
      aria-label="Add new word"
      style={{ marginBottom: 'var(--space-6)' }}
    >
      <UmlautHelper onInsert={handleUmlaut} />

      <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 'var(--space-3)' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="fast-german">German</label>
          <input
            id="fast-german"
            ref={germanRef}
            className="input"
            type="text"
            value={german}
            onChange={e => setGerman(e.target.value)}
            onFocus={() => { lastFocused.current = germanRef.current }}
            onKeyDown={handleKeyDown}
            placeholder="z.B. lernen"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            lang="de"
            aria-required="true"
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="fast-english">English</label>
          <input
            id="fast-english"
            className="input"
            type="text"
            value={english}
            onChange={e => setEnglish(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="to learn"
            autoComplete="off"
            aria-required="true"
          />
        </div>
      </div>

      <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: 'var(--space-3)' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="fast-type">Type</label>
          <select
            id="fast-type"
            className="select"
            value={type}
            onChange={e => setType(e.target.value as WordType)}
          >
            <option value="verb">Verb</option>
            <option value="noun">Noun</option>
            <option value="adjective">Adjective</option>
            <option value="adverb">Adverb</option>
            <option value="phrase">Phrase</option>
            <option value="other">Other</option>
          </select>
        </div>

        {type === 'noun' && (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="fast-article">Article</label>
            <select
              id="fast-article"
              className="select"
              value={article}
              onChange={e => setArticle(e.target.value as Article | '')}
            >
              <option value="">—</option>
              <option value="der">der</option>
              <option value="die">die</option>
              <option value="das">das</option>
            </select>
          </div>
        )}

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="fast-level">Level</label>
          <select
            id="fast-level"
            className="select"
            value={level}
            onChange={e => setLevel(e.target.value as Level)}
          >
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          aria-controls="fast-extra"
        >
          {expanded ? '− Less' : '+ Example sentence'}
        </button>
      </div>

      {expanded && (
        <div id="fast-extra" className="form-group">
          <label htmlFor="fast-example">Example sentence (optional)</label>
          <input
            id="fast-example"
            className="input"
            type="text"
            value={exampleSentence}
            onChange={e => setExampleSentence(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ich lerne jeden Tag."
            lang="de"
          />
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary btn-full"
        disabled={!german.trim() || !english.trim()}
        aria-label="Add word to vocabulary list"
      >
        Add Word
      </button>
    </form>
  )
}

