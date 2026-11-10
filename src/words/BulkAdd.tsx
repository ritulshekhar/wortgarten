import { useState, useCallback } from 'react'
import { parseBulkText, findDuplicates } from '../lib/bulkParse'
import type { Word } from '../lib/db'
import UmlautHelper from './UmlautHelper'

interface BulkAddProps {
  existingWords: Word[]
  onAdd: (entries: Omit<Word, 'id'>[]) => void
  onClose: () => void
}

export default function BulkAdd({ existingWords, onAdd, onClose }: BulkAddProps) {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(false)

  const parseResult = parseBulkText(text)
  const existingGerman = existingWords.map(w => w.german)
  const duplicates = findDuplicates(parseResult.entries, existingGerman)

  const handlePreview = () => {
    if (parseResult.entries.length > 0) setPreview(true)
  }

  const handleAdd = useCallback(() => {
    const toAdd = parseResult.entries
      .filter(e => !duplicates.has(e.german))
      .map(e => ({
        german: e.german.trim(),
        english: e.english.trim(),
        type: 'other' as const,
        level: 'A1' as const,
        dateAdded: Date.now(),
        box: 1 as const,
        timesCorrect: 0,
        timesWrong: 0,
        streak: 0,
      }))
    onAdd(toAdd)
    onClose()
  }, [parseResult.entries, duplicates, onAdd, onClose])

  return (
    <div
      className="sheet-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Bulk add words"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="sheet">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif" style={{ fontSize: 'var(--text-xl)' }}>Paste Word List</h2>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <p className="text-soft text-sm mb-4">
          One entry per line. Supports: <code>word - meaning</code>, <code>word, meaning</code>, or tab-separated.
        </p>

        {!preview ? (
          <>
            <UmlautHelper onInsert={char => setText(t => t + char)} />
            <div className="form-group">
              <label htmlFor="bulk-text">Word list</label>
              <textarea
                id="bulk-text"
                className="textarea"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={'suchen - to search\nbekommen - to get\nlernen, to learn'}
                rows={8}
                lang="de"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="text-sm text-soft mb-4">
              {parseResult.entries.length} words found
              {parseResult.errors.length > 0 && `, ${parseResult.errors.length} lines could not be parsed`}
            </div>
            <button
              className="btn btn-primary btn-full"
              onClick={handlePreview}
              disabled={parseResult.entries.length === 0}
            >
              Preview ({parseResult.entries.length})
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                maxHeight: '50dvh',
                overflowY: 'auto',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--space-4)',
              }}
            >
              {parseResult.entries.map((entry, i) => (
                <div
                  key={i}
                  className="card-flat"
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    opacity: duplicates.has(entry.german) ? 0.4 : 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 'var(--space-3)',
                  }}
                >
                  <span lang="de" className="overflow-safe" style={{ fontWeight: 600 }}>
                    {entry.german}
                  </span>
                  <span className="text-soft overflow-safe">{entry.english}</span>
                  {duplicates.has(entry.german) && (
                    <span className="badge badge-accent">duplicate</span>
                  )}
                </div>
              ))}
            </div>

            {duplicates.size > 0 && (
              <p className="text-sm text-soft mb-4" aria-live="polite">
                {duplicates.size} duplicate{duplicates.size > 1 ? 's' : ''} will be skipped.
              </p>
            )}

            {parseResult.errors.length > 0 && (
              <details style={{ marginBottom: 'var(--space-4)' }}>
                <summary className="text-sm text-soft" style={{ cursor: 'pointer' }}>
                  {parseResult.errors.length} line(s) could not be parsed
                </summary>
                <ul style={{ marginTop: 'var(--space-2)', paddingLeft: 'var(--space-4)' }}>
                  {parseResult.errors.map((e, i) => (
                    <li key={i} className="text-xs text-soft">{e}</li>
                  ))}
                </ul>
              </details>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" onClick={() => setPreview(false)}>
                Back
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleAdd}
                disabled={parseResult.entries.length - duplicates.size === 0}
              >
                Add {parseResult.entries.length - duplicates.size} words
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

