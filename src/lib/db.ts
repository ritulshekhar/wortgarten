import Dexie, { Table } from 'dexie'

export type WordType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'other'
export type Article = 'der' | 'die' | 'das'
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export type LeitnerBox = 1 | 2 | 3 | 4 | 5

export interface Word {
  id?: number
  german: string
  english: string
  type: WordType
  article?: Article
  plural?: string
  exampleSentence?: string
  note?: string
  level: Level
  dateAdded: number
  // SRS (Leitner)
  box: LeitnerBox
  lastReviewed?: number
  nextDue?: number
  timesCorrect: number
  timesWrong: number
  streak: number
}

export interface GrammarProgress {
  topicId: string
  drillsAttempted: number
  drillsCorrect: number
  myNotes?: string
}

export interface PracticeSession {
  id?: number
  date: number
  wordsReviewed: number
  correct: number
  wrong: number
  durationSeconds: number
}

export interface AppSettings {
  id: 1
  theme: 'auto' | 'light' | 'dark'
  dailyGoal: number
  defaultSessionSize: 10 | 20 | 30 | 50
  defaultLevelFilter: 'all' | 'A1' | 'A2' | 'B1+' | 'weak' | 'due'
  hapticEnabled: boolean
  lastExportDate?: number
}

class GermanDB extends Dexie {
  words!: Table<Word>
  grammarProgress!: Table<GrammarProgress>
  sessions!: Table<PracticeSession>
  settings!: Table<AppSettings>

  constructor() {
    super('GermanPWA')
    this.version(1).stores({
      words: '++id, german, level, type, box, nextDue, dateAdded',
      grammarProgress: 'topicId',
      sessions: '++id, date',
      settings: 'id',
    })
  }
}

export const db = new GermanDB()

// Initialize default settings on first run
export async function initSettings(): Promise<AppSettings> {
  const existing = await db.settings.get(1)
  if (existing) return existing
  const defaults: AppSettings = {
    id: 1,
    theme: 'auto',
    dailyGoal: 10,
    defaultSessionSize: 20,
    defaultLevelFilter: 'all',
    hapticEnabled: true,
  }
  await db.settings.put(defaults)
  return defaults
}

export async function getSettings(): Promise<AppSettings> {
  const s = await db.settings.get(1)
  if (s) return s
  return initSettings()
}

export async function updateSettings(partial: Partial<Omit<AppSettings, 'id'>>): Promise<void> {
  await db.settings.update(1, partial)
}

export async function getAllWords(): Promise<Word[]> {
  return db.words.toArray()
}

export async function addWord(word: Omit<Word, 'id'>): Promise<number> {
  const id = await db.words.add(word as Word)
  return id as number
}

export async function updateWord(id: number, partial: Partial<Word>): Promise<void> {
  await db.words.update(id, partial)
}

export async function deleteWord(id: number): Promise<void> {
  await db.words.delete(id)
}

export async function getGrammarProgress(topicId: string): Promise<GrammarProgress> {
  const p = await db.grammarProgress.get(topicId)
  return p ?? { topicId, drillsAttempted: 0, drillsCorrect: 0, myNotes: '' }
}

export async function updateGrammarProgress(
  topicId: string,
  partial: Partial<GrammarProgress>
): Promise<void> {
  const existing = await db.grammarProgress.get(topicId)
  if (existing) {
    await db.grammarProgress.update(topicId, partial)
  } else {
    await db.grammarProgress.put({ topicId, drillsAttempted: 0, drillsCorrect: 0, ...partial })
  }
}

export async function addSession(session: Omit<PracticeSession, 'id'>): Promise<void> {
  await db.sessions.add(session)
}

export async function getRecentSessions(days = 30): Promise<PracticeSession[]> {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return db.sessions.where('date').above(cutoff).toArray()
}

export async function exportAllData(): Promise<string> {
  const [words, grammarProgress, sessions, settings] = await Promise.all([
    db.words.toArray(),
    db.grammarProgress.toArray(),
    db.sessions.toArray(),
    db.settings.toArray(),
  ])
  return JSON.stringify({ words, grammarProgress, sessions, settings }, null, 2)
}

export async function importAllData(json: string): Promise<void> {
  const data = JSON.parse(json)
  await db.transaction('rw', db.words, db.grammarProgress, db.sessions, db.settings, async () => {
    if (data.words) {
      await db.words.clear()
      await db.words.bulkPut(data.words)
    }
    if (data.grammarProgress) {
      await db.grammarProgress.clear()
      await db.grammarProgress.bulkPut(data.grammarProgress)
    }
    if (data.sessions) {
      await db.sessions.clear()
      await db.sessions.bulkPut(data.sessions)
    }
    if (data.settings) {
      await db.settings.clear()
      await db.settings.bulkPut(data.settings)
    }
  })
}

export async function resetAllData(): Promise<void> {
  await db.transaction('rw', db.words, db.grammarProgress, db.sessions, db.settings, async () => {
    await db.words.clear()
    await db.grammarProgress.clear()
    await db.sessions.clear()
    await db.settings.clear()
  })
  await initSettings()
}

