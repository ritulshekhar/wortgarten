import { describe, it, expect } from 'vitest'
import { buildSession } from './sessionBuilder'
import type { Word } from './db'

function makeWord(id: number, overrides: Partial<Word> = {}): Word {
  return {
    id,
    german: `word${id}`,
    english: `meaning${id}`,
    type: 'noun',
    level: 'A1',
    dateAdded: 0,
    box: 1,
    timesCorrect: 0,
    timesWrong: 0,
    streak: 0,
    ...overrides,
  }
}

function makeWords(count: number): Word[] {
  return Array.from({ length: count }, (_, i) => makeWord(i + 1))
}

describe('buildSession', () => {
  it('returns all words when count <= 30', () => {
    const words = makeWords(25)
    const session = buildSession(words, { sessionSize: 20, levelFilter: 'all' })
    expect(session).toHaveLength(25)
  })

  it('returns exactly sessionSize when count > 30', () => {
    const words = makeWords(100)
    const session = buildSession(words, { sessionSize: 20, levelFilter: 'all' })
    expect(session).toHaveLength(20)
  })

  it('no duplicates in session', () => {
    const words = makeWords(60)
    const session = buildSession(words, { sessionSize: 20, levelFilter: 'all' })
    const ids = session.map(w => w.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(session.length)
  })

  it('prioritizes due words', () => {
    const past = Date.now() - 1000
    const future = Date.now() + 1000000
    const words = [
      ...Array.from({ length: 50 }, (_, i) => makeWord(i + 1, { nextDue: future, lastReviewed: 1 })),
      ...Array.from({ length: 10 }, (_, i) => makeWord(i + 51, { nextDue: past, lastReviewed: 1 })),
    ]
    const session = buildSession(words, { sessionSize: 20, levelFilter: 'all', now: Date.now() })
    const dueIds = new Set(words.filter(w => w.nextDue! <= Date.now()).map(w => w.id))
    const dueInSession = session.filter(w => dueIds.has(w.id))
    expect(dueInSession.length).toBe(10) // all 10 due words included
  })

  it('filters by level', () => {
    const a1 = Array.from({ length: 40 }, (_, i) => makeWord(i + 1, { level: 'A1' }))
    const a2 = Array.from({ length: 20 }, (_, i) => makeWord(i + 41, { level: 'A2' }))
    const session = buildSession([...a1, ...a2], { sessionSize: 20, levelFilter: 'A2' })
    expect(session.every(w => w.level === 'A2')).toBe(true)
  })

  it('returns empty for empty word list', () => {
    expect(buildSession([], { sessionSize: 20, levelFilter: 'all' })).toHaveLength(0)
  })

  it('handles 600 words and returns exactly 20', () => {
    const words = makeWords(600)
    const session = buildSession(words, { sessionSize: 20, levelFilter: 'all' })
    expect(session).toHaveLength(20)
  })
})

