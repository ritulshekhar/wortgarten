import { useState } from 'react'
import { GRAMMAR_TOPICS } from './grammar'
import TopicCard from './TopicCard'
import DrillView from './DrillView'
import ConjugationTool from './ConjugationTool'
import PossessiveSelector from './PossessiveSelector'

type View = 'list' | 'drill' | 'conjugation' | 'possessive'

export default function GrammarTab() {
  const [view, setView] = useState<View>('list')
  const [drillTopicId, setDrillTopicId] = useState<string | null>(null)

  if (view === 'conjugation') {
    return <ConjugationTool onBack={() => setView('list')} />
  }

  if (view === 'possessive') {
    return <PossessiveSelector onBack={() => setView('list')} />
  }

  if (view === 'drill' && drillTopicId) {
    const topic = GRAMMAR_TOPICS.find(t => t.id === drillTopicId)!
    return <DrillView topic={topic} onBack={() => setView('list')} />
  }

  return (
    <>
      <div className="page-header">
        <div className="hanko" aria-hidden="true">学</div>
        <h1 className="page-title">Grammar</h1>
      </div>

      <div className="page-content">
        {/* Quick tools */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={() => setView('conjugation')}
          >
            Conjugation tool
          </button>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={() => setView('possessive')}
          >
            Possessive selector
          </button>
        </div>

        {/* Reference topics */}
        <h2 className="font-serif text-lg mb-4">Reference</h2>
        {GRAMMAR_TOPICS.map(topic => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onDrill={() => { setDrillTopicId(topic.id); setView('drill') }}
          />
        ))}
      </div>
    </>
  )
}

