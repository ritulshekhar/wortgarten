import { useState, useEffect } from 'react'
import type { GrammarTopic, GrammarContent } from './grammar'
import { getGrammarProgress, updateGrammarProgress } from '../lib/db'

interface TopicCardProps {
  topic: GrammarTopic
  onDrill: () => void
}

function renderContent(item: GrammarContent, idx: number) {
  switch (item.type) {
    case 'paragraph':
      return (
        <p key={idx} style={{ marginBottom: 'var(--space-3)', whiteSpace: 'pre-line' }} lang="de">
          {item.text}
        </p>
      )
    case 'heading':
      return (
        <h4 key={idx} style={{ margin: 'var(--space-4) 0 var(--space-2)', fontFamily: 'var(--font-serif)' }}>
          {item.text}
        </h4>
      )
    case 'table':
      return (
        <div key={idx} style={{ overflowX: 'auto', marginBottom: 'var(--space-3)' }}>
          <table className="grammar-table">
            <thead>
              <tr>
                {item.headers.map((h, i) => <th key={i}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {item.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} lang="de" className="overflow-safe">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'highlight':
      return (
        <div
          key={idx}
          style={{
            padding: 'var(--space-4)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-3)',
            fontStyle: 'italic',
            whiteSpace: 'pre-line',
          }}
          lang="de"
        >
          {item.text}
        </div>
      )
    default:
      return null
  }
}

export default function TopicCard({ topic, onDrill }: TopicCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [myNotes, setMyNotes] = useState('')
  const [progress, setProgress] = useState({ drillsAttempted: 0, drillsCorrect: 0 })
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    getGrammarProgress(topic.id).then(p => {
      setProgress({ drillsAttempted: p.drillsAttempted, drillsCorrect: p.drillsCorrect })
      setMyNotes(p.myNotes ?? '')
    })
  }, [topic.id])

  const handleNotesSave = async () => {
    setSavingNotes(true)
    await updateGrammarProgress(topic.id, { myNotes })
    setSavingNotes(false)
  }

  const accuracy = progress.drillsAttempted > 0
    ? Math.round((progress.drillsCorrect / progress.drillsAttempted) * 100)
    : null

  return (
    <div className="card mb-4" style={{ padding: 0, overflow: 'hidden' }}>
      <button
        className="collapsible-header"
        style={{ padding: 'var(--space-5) var(--space-4)', width: '100%', textAlign: 'left' }}
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        aria-controls={`topic-${topic.id}`}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: 'var(--space-1)', fontFamily: 'var(--font-serif)', fontSize: 'var(--text-md)' }}>
            {topic.title}
          </h3>
          <p className="text-soft text-sm">{topic.summary}</p>
          {accuracy !== null && (
            <span className="badge badge-accent mt-2">{accuracy}% drill accuracy</span>
          )}
        </div>
        <span aria-hidden="true" style={{ marginLeft: 'var(--space-3)', flexShrink: 0 }}>
          {expanded ? '−' : '+'}
        </span>
      </button>

      {expanded && (
        <div id={`topic-${topic.id}`} style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--line)' }}>
          {/* Content */}
          {topic.content.map((item, i) => renderContent(item, i))}

          {/* Common mistakes */}
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <p className="text-xs text-soft" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-1)' }}>
              Common mistakes
            </p>
            <p className="text-sm">{topic.commonMistakes}</p>
          </div>

          {/* Examples */}
          <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-2)' }}>Examples</h4>
          {topic.examples.map((ex, i) => (
            <div key={i} className="card-flat" style={{ padding: 'var(--space-2) 0' }}>
              <p lang="de" className="overflow-safe" style={{ fontStyle: 'italic', marginBottom: 2 }}>{ex.german}</p>
              <p className="text-soft text-sm">{ex.english}</p>
            </div>
          ))}

          {/* My notes */}
          <div style={{ marginTop: 'var(--space-5)' }}>
            <label htmlFor={`notes-${topic.id}`} style={{ marginBottom: 'var(--space-2)', display: 'block' }}>
              My notes
            </label>
            <textarea
              id={`notes-${topic.id}`}
              className="textarea"
              value={myNotes}
              onChange={e => setMyNotes(e.target.value)}
              placeholder="Write your own notes, mnemonics, examples…"
              rows={3}
            />
            <button
              className="btn btn-secondary btn-sm mt-2"
              onClick={handleNotesSave}
              disabled={savingNotes}
            >
              {savingNotes ? 'Saved' : 'Save notes'}
            </button>
          </div>

          {/* Drill CTA */}
          <button
            className="btn btn-primary btn-full mt-4"
            onClick={onDrill}
          >
            Practice drills ({topic.drills.length} questions)
          </button>
        </div>
      )}
    </div>
  )
}

