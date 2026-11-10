import { useState, useEffect, useCallback } from 'react'
import { db, addWord, updateWord, deleteWord } from '../lib/db'
import type { Word } from '../lib/db'
import FastAddForm from './FastAddForm'
import WordList from './WordList'
import WordEditor from './WordEditor'
import BulkAdd from './BulkAdd'
import WordOfDay from './WordOfDay'
import { useToast } from '../components/Toast'

type SortKey = 'newest' | 'alpha' | 'mistakes'
type FilterLevel = 'all' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'weak' | 'today'

function todayStart() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export default function WordsTab() {
  const [words, setWords] = useState<Word[]>([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [filterLevel, setFilterLevel] = useState<FilterLevel>('all')
  const [editingWord, setEditingWord] = useState<Word | null>(null)
  const [showBulk, setShowBulk] = useState(false)
  const { showToast } = useToast()

  const loadWords = useCallback(async () => {
    const all = await db.words.toArray()
    setWords(all)
  }, [])

  useEffect(() => { loadWords() }, [loadWords])

  const handleAdd = useCallback(async (wordData: Omit<Word, 'id'>) => {
    await addWord(wordData)
    await loadWords()
    showToast(`"${wordData.german}" added`)
  }, [loadWords, showToast])

  const handleBulkAdd = useCallback(async (entries: Omit<Word, 'id'>[]) => {
    for (const entry of entries) {
      await addWord(entry)
    }
    await loadWords()
    showToast(`${entries.length} words added`)
  }, [loadWords, showToast])

  const handleSave = useCallback(async (updates: Partial<Word>) => {
    if (!editingWord?.id) return
    await updateWord(editingWord.id, updates)
    await loadWords()
    showToast('Word updated')
  }, [editingWord, loadWords, showToast])

  const handleDelete = useCallback(async () => {
    if (!editingWord?.id) return
    const deleted = { ...editingWord }
    await deleteWord(editingWord.id)
    await loadWords()
    setEditingWord(null)
    showToast(
      `"${deleted.german}" deleted`,
      async () => {
        const { id: _, ...rest } = deleted
        await addWord(rest)
        await loadWords()
      },
      'Undo'
    )
  }, [editingWord, loadWords, showToast])

  // Filtering + sorting
  const addedToday = words.filter(w => w.dateAdded >= todayStart()).length

  // Pick word of the day: first due word or first word
  const wordOfDay = words.find(w => !w.lastReviewed) ?? words[0]

  const filtered = words
    .filter(w => {
      if (search) {
        const q = search.toLowerCase()
        return w.german.toLowerCase().includes(q) || w.english.toLowerCase().includes(q)
      }
      return true
    })
    .filter(w => {
      switch (filterLevel) {
        case 'all': return true
        case 'weak': return w.timesWrong / Math.max(w.timesCorrect + w.timesWrong, 1) > 0.4
        case 'today': return w.dateAdded >= todayStart()
        default: return w.level === filterLevel
      }
    })
    .sort((a, b) => {
      switch (sort) {
        case 'newest': return b.dateAdded - a.dateAdded
        case 'alpha': return a.german.localeCompare(b.german, 'de')
        case 'mistakes': return b.timesWrong - a.timesWrong
      }
    })

  const FILTER_OPTIONS: { key: FilterLevel; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'A1', label: 'A1' },
    { key: 'A2', label: 'A2' },
    { key: 'B1', label: 'B1' },
    { key: 'B2', label: 'B2' },
    { key: 'C1', label: 'C1' },
    { key: 'weak', label: 'Weak' },
    { key: 'today', label: 'Today' },
  ]

  return (
    <>
      <div className="page-header">
        <div className="hanko" aria-hidden="true">学</div>
        <h1 className="page-title">Words</h1>
        <div style={{ flex: 1 }} />
        <span className="text-soft text-sm" aria-live="polite">
          {words.length} total · {addedToday} today
        </span>
      </div>

      <div className="page-content">
        {wordOfDay && <WordOfDay word={wordOfDay} />}

        <FastAddForm onAdd={handleAdd} />

        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: 'var(--text-md)', fontFamily: 'var(--font-serif)' }}>
            Vocabulary
          </h2>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowBulk(true)}
            aria-label="Bulk add words by pasting a list"
          >
            Paste list
          </button>
        </div>

        {/* Search */}
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
          </svg>
          <input
            type="search"
            className="input search-input"
            placeholder="Search words…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search vocabulary"
          />
        </div>

        {/* Filter chips */}
        <div className="filter-bar" role="group" aria-label="Filter by level">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={`filter-chip${filterLevel === opt.key ? ' active' : ''}`}
              onClick={() => setFilterLevel(opt.key)}
              aria-pressed={filterLevel === opt.key}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 mb-4">
          <label htmlFor="sort-select" className="text-soft text-sm" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
            Sort:
          </label>
          <select
            id="sort-select"
            className="select"
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            style={{ flex: 1 }}
          >
            <option value="newest">Newest first</option>
            <option value="alpha">Alphabetical</option>
            <option value="mistakes">Most mistakes</option>
          </select>
        </div>

        <WordList words={filtered} onWordClick={setEditingWord} />
      </div>

      {editingWord && (
        <WordEditor
          word={editingWord}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditingWord(null)}
        />
      )}

      {showBulk && (
        <BulkAdd
          existingWords={words}
          onAdd={handleBulkAdd}
          onClose={() => setShowBulk(false)}
        />
      )}
    </>
  )
}

