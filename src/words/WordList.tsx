import type { Word } from '../lib/db'
import WordCard from './WordCard'

interface WordListProps {
  words: Word[]
  onWordClick: (word: Word) => void
}

export default function WordList({ words, onWordClick }: WordListProps) {
  if (words.length === 0) {
    return (
      <div className="empty-state">
        <span className="kanji-watermark" aria-hidden="true">学</span>
        <p style={{ fontSize: 'var(--text-lg)', fontFamily: 'var(--font-serif)' }}>
          Your vocabulary is empty.
        </p>
        <p className="text-soft">Add your first word above and begin your journey.</p>
      </div>
    )
  }

  return (
    <div role="list" aria-label={`${words.length} words`}>
      {words.map(word => (
        <div key={word.id} role="listitem">
          <WordCard word={word} onClick={() => onWordClick(word)} />
        </div>
      ))}
    </div>
  )
}

