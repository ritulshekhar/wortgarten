import type { LeitnerBox, Word } from './db'

/** Days between reviews for each Leitner box (1-indexed) */
export const BOX_INTERVALS: Record<LeitnerBox, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 8,
  5: 16,
}

/** Process a correct answer: advance box, set nextDue */
export function processCorrect(word: Word, now = Date.now()): Partial<Word> {
  const newBox = Math.min(word.box + 1, 5) as LeitnerBox
  const intervalDays = BOX_INTERVALS[newBox]
  return {
    box: newBox,
    lastReviewed: now,
    nextDue: now + intervalDays * 24 * 60 * 60 * 1000,
    timesCorrect: word.timesCorrect + 1,
    streak: word.streak + 1,
  }
}

/** Process a wrong answer: reset to box 1, due tomorrow */
export function processWrong(word: Word, now = Date.now()): Partial<Word> {
  return {
    box: 1,
    lastReviewed: now,
    nextDue: now + BOX_INTERVALS[1] * 24 * 60 * 60 * 1000,
    timesWrong: word.timesWrong + 1,
    streak: 0,
  }
}

/** Is a word due for review? */
export function isDue(word: Word, now = Date.now()): boolean {
  if (!word.nextDue) return true // never reviewed = always due
  return word.nextDue <= now
}

/** Is a word "weak" (more wrong than 50% of attempts)? */
export function isWeak(word: Word): boolean {
  const total = word.timesCorrect + word.timesWrong
  if (total === 0) return false
  return word.timesWrong / total > 0.4
}

/** Is a word "new" (never reviewed)? */
export function isNew(word: Word): boolean {
  return word.lastReviewed === undefined || word.lastReviewed === null
}

/** Format nextDue as a human-readable string */
export function nextDueLabel(word: Word, now = Date.now()): string {
  if (!word.nextDue) return 'Due now'
  const diff = word.nextDue - now
  if (diff <= 0) return 'Due now'
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000))
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}

