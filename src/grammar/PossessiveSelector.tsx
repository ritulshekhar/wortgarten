import { useState } from 'react'
import {
  POSSESSIVE_STEMS,
  getPossessiveForm,
  type GrammarContent,
} from './grammar'

type Gender = 'maskulin' | 'feminin' | 'neutrum' | 'plural'
type Case = 'Nominativ' | 'Akkusativ' | 'Dativ' | 'Genitiv'

const GENDERS: { key: Gender; label: string; exampleNoun: string }[] = [
  { key: 'maskulin', label: 'maskulin (der)', exampleNoun: 'Bruder' },
  { key: 'feminin', label: 'feminin (die)', exampleNoun: 'Schwester' },
  { key: 'neutrum', label: 'neutrum (das)', exampleNoun: 'Kind' },
  { key: 'plural', label: 'Plural (die)', exampleNoun: 'Kinder' },
]

const CASES: { key: Case; label: string }[] = [
  { key: 'Nominativ', label: 'Nominativ (subject)' },
  { key: 'Akkusativ', label: 'Akkusativ (direct object)' },
  { key: 'Dativ', label: 'Dativ (indirect object)' },
  { key: 'Genitiv', label: 'Genitiv (possession)' },
]

interface PossessiveSelectorProps {
  onBack: () => void
}

export default function PossessiveSelector({ onBack }: PossessiveSelectorProps) {
  const [selectedGender, setSelectedGender] = useState<Gender>('maskulin')
  const [selectedCase, setSelectedCase] = useState<Case>('Nominativ')

  const example = GENDERS.find(g => g.key === selectedGender)!

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', paddingBottom: 'var(--nav-height)' }}>
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={onBack} aria-label="Back">←</button>
        <h1 className="page-title">Possessive Selector</h1>
      </div>

      <div className="page-content">
        <p className="text-soft mb-4">
          Select the noun's gender and the grammatical case to see the correct form of all possessive articles.
        </p>

        {/* Gender selector */}
        <div className="form-group">
          <label htmlFor="gender-select">Noun gender</label>
          <select
            id="gender-select"
            className="select"
            value={selectedGender}
            onChange={e => setSelectedGender(e.target.value as Gender)}
          >
            {GENDERS.map(g => (
              <option key={g.key} value={g.key}>{g.label}</option>
            ))}
          </select>
        </div>

        {/* Case selector */}
        <div className="form-group mb-6">
          <label htmlFor="case-select">Case</label>
          <select
            id="case-select"
            className="select"
            value={selectedCase}
            onChange={e => setSelectedCase(e.target.value as Case)}
          >
            {CASES.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Result table */}
        <div className="card fade-in">
          <p className="text-sm text-soft mb-4">
            {selectedCase} of <strong>{example.label}</strong> noun — e.g. <span lang="de">{example.exampleNoun}</span>
          </p>

          <table className="grammar-table" aria-label="Possessive forms">
            <thead>
              <tr>
                <th>Possessive</th>
                <th>Form</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              {POSSESSIVE_STEMS.map(({ label, stem }) => {
                // Handle case sensitivity for Ihr (formal)
                const useStem = stem === 'Ihr' ? 'Ihr' : stem.toLowerCase() + stem.slice(1)
                const normalizedStem = stem.toLowerCase() === 'ihr' && stem !== 'Ihr'
                  ? 'ihr'
                  : stem
                const form = getPossessiveForm(normalizedStem, selectedGender, selectedCase)
                return (
                  <tr key={stem}>
                    <td className="text-soft text-sm">{label}</td>
                    <td lang="de" style={{ fontWeight: 700, color: 'var(--accent)' }}>{form}</td>
                    <td lang="de" className="text-sm overflow-safe">
                      {form} {example.exampleNoun}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Full mein- paradigm */}
        <div className="card mt-4">
          <h3 className="font-serif text-md mb-3">Full mein- paradigm (reference)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="grammar-table">
              <thead>
                <tr>
                  <th></th>
                  <th>maskulin</th>
                  <th>feminin</th>
                  <th>neutrum</th>
                  <th>Plural</th>
                </tr>
              </thead>
              <tbody>
                {(['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'] as Case[]).map(c => (
                  <tr key={c} style={c === selectedCase ? { background: 'var(--paper)' } : {}}>
                    <td style={{ fontWeight: 600 }}>{c}</td>
                    {(['maskulin', 'feminin', 'neutrum', 'plural'] as Gender[]).map(g => {
                      const form = getPossessiveForm('mein', g, c)
                      const isHighlighted = c === selectedCase && g === selectedGender
                      return (
                        <td
                          key={g}
                          lang="de"
                          className={isHighlighted ? 'highlight' : ''}
                        >
                          {form}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

