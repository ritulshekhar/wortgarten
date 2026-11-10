import { describe, it, expect } from 'vitest'
import { checkAnswer, checkGermanAnswer, foldUmlauts } from './answerCheck'

describe('foldUmlauts', () => {
  it('converts ae->ä, oe->ö, ue->ü, ss->ß', () => {
    expect(foldUmlauts('ae')).toBe('ä')
    expect(foldUmlauts('oe')).toBe('ö')
    expect(foldUmlauts('ue')).toBe('ü')
    expect(foldUmlauts('ss')).toBe('ß')
  })

  it('handles mixed case', () => {
    expect(foldUmlauts('AE')).toBe('Ä')
    expect(foldUmlauts('Ue')).toBe('Ü')
  })
})

describe('checkAnswer', () => {
  it('exact match returns correct', () => {
    expect(checkAnswer('to learn', 'to learn')).toEqual({ status: 'correct' })
  })

  it('case-insensitive match', () => {
    expect(checkAnswer('To Learn', 'to learn')).toEqual({ status: 'correct' })
  })

  it('trimmed whitespace match', () => {
    expect(checkAnswer('  to learn  ', 'to learn')).toEqual({ status: 'correct' })
  })

  it('accepts umlaut substitutes: ue -> ü', () => {
    expect(checkAnswer('muede', 'müde')).toEqual({ status: 'correct' })
    expect(checkAnswer('tuer', 'Tür')).toEqual({ status: 'correct' })
  })

  it('accepts oe for ö', () => {
    expect(checkAnswer('schoen', 'schön')).toEqual({ status: 'correct' })
  })

  it('accepts ss for ß', () => {
    expect(checkAnswer('strasse', 'straße')).toEqual({ status: 'correct' })
  })

  it('accepts any comma-separated answer', () => {
    expect(checkAnswer('hello', 'hi, hello, hey')).toEqual({ status: 'correct' })
  })

  it('1-char typo on 6+ letter word returns almost', () => {
    const result = checkAnswer('lernan', 'lernen')
    expect(result.status).toBe('almost')
  })

  it('no typo tolerance for short words (<6 chars)', () => {
    expect(checkAnswer('ab', 'ac')).toEqual({ status: 'wrong' })
  })

  it('clearly wrong answer returns wrong', () => {
    expect(checkAnswer('banana', 'to learn')).toEqual({ status: 'wrong' })
  })

  it('empty input returns wrong', () => {
    expect(checkAnswer('', 'to learn')).toEqual({ status: 'wrong' })
  })
})

describe('checkGermanAnswer', () => {
  it('exact match without article', () => {
    expect(checkGermanAnswer('Hund', 'Hund', 'der')).toEqual({ status: 'correct' })
  })

  it('match with article prefix', () => {
    expect(checkGermanAnswer('der Hund', 'Hund', 'der')).toEqual({ status: 'correct' })
  })

  it('umlaut substitutes in German answer', () => {
    expect(checkGermanAnswer('schoen', 'schön')).toEqual({ status: 'correct' })
    expect(checkGermanAnswer('muede', 'müde')).toEqual({ status: 'correct' })
  })

  it('1-char typo returns almost', () => {
    const result = checkGermanAnswer('lernan', 'lernen')
    expect(result.status).toBe('almost')
  })
})
