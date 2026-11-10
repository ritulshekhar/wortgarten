import { describe, it, expect } from 'vitest'
import { processCorrect, processWrong, isDue, isWeak, isNew, BOX_INTERVALS } from './srs'
import type { Word } from './db'

const baseWord: Word = {
  id: 1,
  german: 'lernen',
  english: 'to learn',
  type: 'verb',
  level: 'A1',
  dateAdded: 0,
  box: 1,
  timesCorrect: 0,
  timesWrong: 0,
  streak: 0,
}

describe('processCorrect', () => {
  it('advances box from 1 to 2', () => {
    const result = processCorrect({ ...baseWord, box: 1 })
    expect(result.box).toBe(2)
  })

  it('caps box at 5', () => {
    const result = processCorrect({ ...baseWord, box: 5 })
    expect(result.box).toBe(5)
  })

  it('sets nextDue based on new box interval', () => {
    const now = 1000000
    const result = processCorrect({ ...baseWord, box: 1 }, now)
    // box becomes 2, interval = 2 days
    expect(result.nextDue).toBe(now + BOX_INTERVALS[2] * 24 * 60 * 60 * 1000)
  })

  it('increments timesCorrect', () => {
    const result = processCorrect({ ...baseWord, timesCorrect: 3 })
    expect(result.timesCorrect).toBe(4)
  })

  it('increments streak', () => {
    const result = processCorrect({ ...baseWord, streak: 2 })
    expect(result.streak).toBe(3)
  })
})

describe('processWrong', () => {
  it('resets box to 1', () => {
    const result = processWrong({ ...baseWord, box: 4 })
    expect(result.box).toBe(1)
  })

  it('resets streak to 0', () => {
    const result = processWrong({ ...baseWord, streak: 5 })
    expect(result.streak).toBe(0)
  })

  it('increments timesWrong', () => {
    const result = processWrong({ ...baseWord, timesWrong: 2 })
    expect(result.timesWrong).toBe(3)
  })

  it('sets nextDue to 1 day', () => {
    const now = 1000000
    const result = processWrong(baseWord, now)
    expect(result.nextDue).toBe(now + 1 * 24 * 60 * 60 * 1000)
  })
})

describe('isDue', () => {
  it('returns true for never-reviewed word', () => {
    expect(isDue({ ...baseWord, nextDue: undefined })).toBe(true)
  })

  it('returns true when nextDue is in the past', () => {
    expect(isDue({ ...baseWord, nextDue: Date.now() - 1000 })).toBe(true)
  })

  it('returns false when nextDue is in the future', () => {
    expect(isDue({ ...baseWord, nextDue: Date.now() + 1000000 })).toBe(false)
  })
})

describe('isWeak', () => {
  it('returns false for untested word', () => {
    expect(isWeak({ ...baseWord })).toBe(false)
  })

  it('returns true when >40% wrong', () => {
    expect(isWeak({ ...baseWord, timesCorrect: 5, timesWrong: 5 })).toBe(true)
  })

  it('returns false when <=40% wrong', () => {
    expect(isWeak({ ...baseWord, timesCorrect: 7, timesWrong: 2 })).toBe(false)
  })
})

describe('isNew', () => {
  it('returns true when lastReviewed is undefined', () => {
    expect(isNew({ ...baseWord, lastReviewed: undefined })).toBe(true)
  })

  it('returns false when lastReviewed is set', () => {
    expect(isNew({ ...baseWord, lastReviewed: Date.now() })).toBe(false)
  })
})

describe('BOX_INTERVALS', () => {
  it('has correct intervals', () => {
    expect(BOX_INTERVALS[1]).toBe(1)
    expect(BOX_INTERVALS[2]).toBe(2)
    expect(BOX_INTERVALS[3]).toBe(4)
    expect(BOX_INTERVALS[4]).toBe(8)
    expect(BOX_INTERVALS[5]).toBe(16)
  })
})

