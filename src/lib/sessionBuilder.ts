import type { Word, Level } from './db'
import { isDue, isWeak, isNew } from './srs'

export type LevelFilter = 'all' | 'A1' | 'A2' | 'B1+' | 'weak' | 'due'

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function filterByLevel(words: Word[], filter: LevelFilter): Word[] {
  switch (filter) {
    case 'all': return words
    case 'A1': return words.filter(w => w.level === 'A1')
    case 'A2': return words.filter(w => w.level === 'A2')
    case 'B1+': return words.filter(w => ['B1', 'B2', 'C1'].includes(w.level as Level))
    case 'weak': return words.filter(isWeak)
    case 'due': return words.filter(isDue)
    default: return words
  }
}

export interface SessionOptions {
  sessionSize: number
  levelFilter: LevelFilter
  now?: number
}

/**
 * Build a practice session word list using the smart session algorithm:
 * 1. Due words (overdue first)
 * 2. Weak words (not already included)
 * 3. New/untested words (randomly)
 * 4. Random remaining to fill up
 *
 * If total words <= 30, use all of them.
 */
export function buildSession(allWords: Word[], options: SessionOptions): Word[] {
  const { sessionSize, levelFilter, now = Date.now() } = options

  const eligible = filterByLevel(allWords, levelFilter)

  if (eligible.length === 0) return []
  if (eligible.length <= 30) return shuffleArray(eligible)

  const targetSize = Math.min(sessionSize, eligible.length)
  const included = new Set<number>()
  const result: Word[] = []

  // 1. Due words, sorted by most overdue (nextDue ascending)
  const dueWords = eligible
    .filter(w => isDue(w, now))
    .sort((a, b) => (a.nextDue ?? 0) - (b.nextDue ?? 0))

  for (const w of dueWords) {
    if (result.length >= targetSize) break
    if (w.id !== undefined && !included.has(w.id)) {
      included.add(w.id)
      result.push(w)
    }
  }

  // 2. Weak words
  if (result.length < targetSize) {
    const weakWords = shuffleArray(eligible.filter(w => isWeak(w) && !included.has(w.id!)))
    for (const w of weakWords) {
      if (result.length >= targetSize) break
      included.add(w.id!)
      result.push(w)
    }
  }

  // 3. New words
  if (result.length < targetSize) {
    const newWords = shuffleArray(eligible.filter(w => isNew(w) && !included.has(w.id!)))
    for (const w of newWords) {
      if (result.length >= targetSize) break
      included.add(w.id!)
      result.push(w)
    }
  }

  // 4. Random fill from remaining
  if (result.length < targetSize) {
    const remaining = shuffleArray(eligible.filter(w => !included.has(w.id!)))
    for (const w of remaining) {
      if (result.length >= targetSize) break
      result.push(w)
    }
  }

  return shuffleArray(result)
}

