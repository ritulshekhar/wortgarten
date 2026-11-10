import { describe, it, expect } from 'vitest'
import { parseBulkText, findDuplicates } from './bulkParse'

describe('parseBulkText', () => {
  it('parses dash-separated lines', () => {
    const result = parseBulkText('suchen - to search\nbekommen - to get')
    expect(result.entries).toHaveLength(2)
    expect(result.entries[0]).toEqual({ german: 'suchen', english: 'to search' })
    expect(result.entries[1]).toEqual({ german: 'bekommen', english: 'to get' })
  })

  it('parses comma-separated lines', () => {
    const result = parseBulkText('suchen, to search')
    expect(result.entries[0]).toEqual({ german: 'suchen', english: 'to search' })
  })

  it('parses tab-separated lines', () => {
    const result = parseBulkText('suchen\tto search')
    expect(result.entries[0]).toEqual({ german: 'suchen', english: 'to search' })
  })

  it('skips blank lines', () => {
    const result = parseBulkText('\nsuchen - to search\n\n')
    expect(result.entries).toHaveLength(1)
  })

  it('skips comment lines', () => {
    const result = parseBulkText('# comment\nsuchen - to search')
    expect(result.entries).toHaveLength(1)
  })

  it('reports unparseable lines as errors', () => {
    const result = parseBulkText('justoneword')
    expect(result.errors).toHaveLength(1)
    expect(result.entries).toHaveLength(0)
  })

  it('handles mixed separators', () => {
    const text = 'suchen - to search\nbekommen, to get\nlernen\tto learn'
    const result = parseBulkText(text)
    expect(result.entries).toHaveLength(3)
  })
})

describe('findDuplicates', () => {
  it('finds case-insensitive duplicates', () => {
    const dups = findDuplicates(
      [{ german: 'Suchen', english: 'to search' }],
      ['suchen']
    )
    expect(dups.has('Suchen')).toBe(true)
  })

  it('ignores articles when detecting duplicates', () => {
    const dups = findDuplicates(
      [{ german: 'der Hund', english: 'dog' }],
      ['Hund']
    )
    expect(dups.has('der Hund')).toBe(true)
  })

  it('returns empty set when no duplicates', () => {
    const dups = findDuplicates(
      [{ german: 'lernen', english: 'to learn' }],
      ['suchen']
    )
    expect(dups.size).toBe(0)
  })
})

