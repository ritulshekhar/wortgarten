import { useState } from 'react'
import { lookupVerb } from './grammar'
import type { IrregularVerb } from './grammar'

interface ConjugationToolProps {
  onBack: () => void
}

export default function ConjugationTool({ onBack }: ConjugationToolProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{ verb: IrregularVerb; isIrregular: boolean } | null>(null)
  const [notFound, setNotFound] = useState(false)

  const handleLookup = () => {
    const v = lookupVerb(input.trim())
    if (v) {
      setResult(v)
      setNotFound(false)
    } else {
      setResult(null)
      setNotFound(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleLookup() }
  }

  const rows = result
    ? [
        { person: 'ich', form: result.verb.ich },
        { person: 'du', form: result.verb.du },
        { person: 'er / sie / es', form: result.verb.erSieEs },
        { person: 'wir', form: result.verb.wir },
        { person: 'ihr', form: result.verb.ihr },
        { person: 'sie / Sie', form: result.verb.sieSie },
      ]
    : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', paddingBottom: 'var(--nav-height)' }}>
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={onBack} aria-label="Back">←</button>
        <h1 className="page-title">Conjugation Tool</h1>
      </div>

      <div className="page-content">
        <p className="text-soft mb-4">
          Enter a German verb infinitive to see its present-tense conjugation. Supports ~60 common irregular verbs; all others are treated as regular.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="verb-input" className="sr-only">Verb infinitive</label>
            <input
              id="verb-input"
              className="input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="lernen, fahren, sein…"
              lang="de"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
          <button className="btn btn-primary" onClick={handleLookup} disabled={!input.trim()}>
            Look up
          </button>
        </div>

        {notFound && (
          <div className="card" style={{ color: 'var(--accent)' }} role="alert">
            <p>Unknown verb: <strong lang="de">"{input}"</strong></p>
            <p className="text-sm text-soft mt-2">
              This verb is not in the irregular verb list and doesn't look like a standard German infinitive ending in -en or -n. Please check the spelling.
            </p>
          </div>
        )}

        {result && (
          <div className="card fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl" lang="de">{result.verb.infinitive}</h2>
              <span className="badge">{result.isIrregular ? 'Irregular' : 'Regular'}</span>
            </div>

            <table className="grammar-table" aria-label={`Conjugation of ${result.verb.infinitive}`}>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Present tense</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.person}>
                    <td className="text-soft">{row.person}</td>
                    <td lang="de" style={{ fontWeight: 600 }}>{row.form}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!result.isIrregular && (
              <p className="text-xs text-soft mt-3">
                Regular conjugation: stem + standard endings. If this looks wrong, the verb may have irregularities not covered here.
              </p>
            )}
          </div>
        )}

        {!result && !notFound && (
          <div className="empty-state">
            <span className="kanji-watermark" aria-hidden="true">学</span>
            <p className="text-soft">Type a verb and press Look up</p>
          </div>
        )}
      </div>
    </div>
  )
}

