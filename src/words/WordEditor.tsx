import { useState, useRef, useCallback } from 'react'
import UmlautHelper from './UmlautHelper'
import type { Word, WordType, Article, Level } from '../lib/db'

interface WordEditorProps {
  word: Word
  onSave: (updates: Partial<Word>) => void
  onDelete: () => void
  onClose: () => void
}

function insertAtCursor(input: HTMLInputElement | HTMLTextAreaElement, char: string) {
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? input.value.length
  const before = input.value.slice(0, start)
  const after = input.value.slice(end)
  const newVal = before + char + after
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set
  const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    'value'
  )?.set
  if (input instanceof HTMLTextAreaElement) {
    nativeTextareaValueSetter?.call(input, newVal)
  } else {
    nativeInputValueSetter?.call(input, newVal)
  }
  input.dispatchEvent(new Event('input', { bubbles: true }))
  const pos = start + char.length
  input.setSelectionRange(pos, pos)
}

export default function WordEditor({ word, onSave, onDelete, onClose }: WordEditorProps) {
  const [german, setGerman] = useState(word.german)
  const [english, setEnglish] = useState(word.english)
  const [type, setType] = useState<WordType>(word.type)
  const [article, setArticle] = useState<Article | ''>(word.article ?? '')
  const [plural, setPlural] = useState(word.plural ?? '')
  const [exampleSentence, setExampleSentence] = useState(word.exampleSentence ?? '')
  const [note, setNote] = useState(word.note ?? '')
  const [level, setLevel] = useState<Level>(word.level)

  const lastFocused = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  const handleUmlaut = useCallback((char: string) => {
    const target = lastFocused.current
    if (target) {
      insertAtCursor(target, char)
      target.focus()
    }
  }, [])

  const handleSave = () => {
    if (!german.trim() || !english.trim()) return
    onSave({
      german: german.trim(),
      english: english.trim(),
      type,
      article: (type === 'noun' && article) ? article as Article : undefined,
      plural: plural.trim() || undefined,
      exampleSentence: exampleSentence.trim() || undefined,
      note: note.trim() || undefined,
      level,
    })
    onClose()
  }

  return (
    <div
      className="sheet-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Edit word"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="sheet">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif" style={{ fontSize: 'var(--text-xl)' }}>Edit Word</h2>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close editor">✕</button>
        </div>

        <UmlautHelper onInsert={handleUmlaut} />

        <div className="form-group">
          <label htmlFor="edit-german">German</label>
          <input
            id="edit-german"
            className="input"
            type="text"
            value={german}
            onChange={e => setGerman(e.target.value)}
            onFocus={e => { lastFocused.current = e.target as HTMLInputElement }}
            lang="de"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-english">English</label>
          <input
            id="edit-english"
            className="input"
            type="text"
            value={english}
            onChange={e => setEnglish(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 'var(--space-4)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="edit-type">Type</label>
            <select
              id="edit-type"
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
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="edit-level">Level</label>
            <select
              id="edit-level"
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

        {type === 'noun' && (
          <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="edit-article">Article</label>
              <select
                id="edit-article"
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
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="edit-plural">Plural</label>
              <input
                id="edit-plural"
                className="input"
                type="text"
                value={plural}
                onChange={e => setPlural(e.target.value)}
                onFocus={e => { lastFocused.current = e.target as HTMLInputElement }}
                lang="de"
                placeholder="die …"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="edit-example">Example sentence</label>
          <input
            id="edit-example"
            className="input"
            type="text"
            value={exampleSentence}
            onChange={e => setExampleSentence(e.target.value)}
            onFocus={e => { lastFocused.current = e.target as HTMLInputElement }}
            lang="de"
            placeholder="Ich lerne jeden Tag."
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-note">Note</label>
          <textarea
            id="edit-note"
            className="textarea"
            value={note}
            onChange={e => setNote(e.target.value)}
            onFocus={e => { lastFocused.current = e.target as HTMLTextAreaElement }}
            placeholder="Memory trick, usage notes…"
            rows={2}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onDelete}
            style={{ color: 'var(--accent)' }}
            aria-label="Delete word"
          >
            Delete
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleSave}
            disabled={!german.trim() || !english.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

