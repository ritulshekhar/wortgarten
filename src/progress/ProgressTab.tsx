import { useState, useEffect } from 'react'
import { db, getAllWords, getRecentSessions } from '../lib/db'
import type { Word, PracticeSession, GrammarProgress } from '../lib/db'
import { GRAMMAR_TOPICS } from '../grammar/grammar'
import StreakRing from './StreakRing'
import WordsChart from './WordsChart'

export default function ProgressTab() {
  const [words, setWords] = useState<Word[]>([])
  const [sessions, setSessions] = useState<PracticeSession[]>([])
  const [grammarProgress, setGrammarProgress] = useState<GrammarProgress[]>([])
  const [dailyGoal, setDailyGoal] = useState<number>(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [allWords, recentSessions, gp, settings] = await Promise.all([
        getAllWords(),
        getRecentSessions(30),
        db.grammarProgress.toArray(),
        db.settings.get(1),
      ])
      setWords(allWords)
      setSessions(recentSessions)
      setGrammarProgress(gp)
      if (settings?.dailyGoal) {
        setDailyGoal(settings.dailyGoal)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return <div className="page-content text-soft text-center mt-6">Loading progress…</div>
  }

  // 1. Calculations for words
  const totalWords = words.length
  const wordsByLevel: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 }
  let masteredCount = 0 // box >= 4
  const now = Date.now()
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000
  let addedThisWeek = 0

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayStartMs = todayStart.getTime()

  // Count words reviewed today from sessions
  const reviewedToday = sessions
    .filter(s => s.date >= todayStartMs)
    .reduce((acc, s) => acc + s.wordsReviewed, 0)

  // Streak calculation (consecutive days with at least 1 session)
  const sessionDates = new Set(
    sessions.map(s => {
      const d = new Date(s.date)
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    })
  )

  let streak = 0
  let checkDate = new Date()
  while (true) {
    const key = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`
    if (sessionDates.has(key)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      // If today has no session yet, allow streak to count back from yesterday
      if (streak === 0 && checkDate.getTime() >= todayStartMs) {
        checkDate.setDate(checkDate.getDate() - 1)
        const yesterdayKey = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`
        if (sessionDates.has(yesterdayKey)) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
          continue
        }
      }
      break
    }
  }

  for (const w of words) {
    if (wordsByLevel[w.level] !== undefined) {
      wordsByLevel[w.level]++
    }
    if (w.box >= 4) {
      masteredCount++
    }
    if (w.dateAdded >= oneWeekAgo) {
      addedThisWeek++
    }
  }

  // 2. 30-day Chart Data
  const chartData: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    const dayStart = d.getTime()
    const dayEnd = dayStart + 24 * 60 * 60 * 1000
    const count = words.filter(w => w.dateAdded >= dayStart && w.dateAdded < dayEnd).length
    chartData.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      count,
    })
  }

  // 3. Weakest 10 words
  const weakWords = [...words]
    .filter(w => w.timesWrong > 0)
    .sort((a, b) => {
      const rateA = a.timesWrong / (a.timesCorrect + a.timesWrong || 1)
      const rateB = b.timesWrong / (b.timesCorrect + b.timesWrong || 1)
      if (rateB !== rateA) return rateB - rateA
      return b.timesWrong - a.timesWrong
    })
    .slice(0, 10)

  // 4. Weakest Grammar Topic
  let weakestTopic: { topicTitle: string; accuracy: number; attempted: number } | null = null
  let lowestAccuracy = 101

  for (const gp of grammarProgress) {
    if (gp.drillsAttempted >= 3) {
      const acc = Math.round((gp.drillsCorrect / gp.drillsAttempted) * 100)
      if (acc < lowestAccuracy) {
        lowestAccuracy = acc
        const t = GRAMMAR_TOPICS.find(top => top.id === gp.topicId)
        weakestTopic = {
          topicTitle: t ? t.title : gp.topicId,
          accuracy: acc,
          attempted: gp.drillsAttempted,
        }
      }
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="hanko" aria-hidden="true">学</div>
        <h1 className="page-title">Progress</h1>
      </div>

      <div className="page-content">
        {/* Streak & Goal Section */}
        <div className="card mb-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 'var(--space-4)' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="stat-value" style={{ color: 'var(--accent)', fontSize: 'var(--text-3xl)' }}>
              {streak}
            </div>
            <div className="stat-label mt-1">Day Streak</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StreakRing current={reviewedToday} goal={dailyGoal} size={110} />
            <div className="stat-label mt-2">Daily Goal</div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="stat-grid mb-6">
          <div className="stat-card">
            <div className="stat-value">{totalWords}</div>
            <div className="stat-label">Total Words</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{masteredCount}</div>
            <div className="stat-label">Mastered (Box 4-5)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{addedThisWeek}</div>
            <div className="stat-label">Added this week</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{sessions.length}</div>
            <div className="stat-label">Sessions (30d)</div>
          </div>
        </div>

        {/* Words by Level breakdown */}
        <div className="card mb-6">
          <h2 className="font-serif text-md mb-3">Vocabulary by Level</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {Object.entries(wordsByLevel).map(([lvl, count]) => {
              const pct = totalWords > 0 ? Math.round((count / totalWords) * 100) : 0
              return (
                <div key={lvl}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ fontWeight: 600 }}>{lvl}</span>
                    <span className="text-soft">{count} words ({pct}%)</span>
                  </div>
                  <div className="progress-bar-wrap" style={{ height: 6, margin: 0 }}>
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 30-Day Activity Chart */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-serif text-md">Words Added (30 Days)</h2>
            <span className="text-xs text-soft">Recent trend</span>
          </div>
          <WordsChart data={chartData} height={90} />
          <div className="flex justify-between text-xs text-soft mt-2">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Weakest Grammar Topic */}
        {weakestTopic ? (
          <div className="card mb-6">
            <div className="stat-label mb-1">Needs attention</div>
            <h2 className="font-serif text-md mb-1">{weakestTopic.topicTitle}</h2>
            <p className="text-sm text-soft">
              Drill accuracy: <strong style={{ color: 'var(--accent)' }}>{weakestTopic.accuracy}%</strong> ({weakestTopic.attempted} attempts)
            </p>
          </div>
        ) : (
          <div className="card mb-6 text-soft text-sm">
            Complete at least 3 drills per grammar topic to see your focus areas.
          </div>
        )}

        {/* Weakest 10 Words */}
        <div className="card mb-6">
          <h2 className="font-serif text-md mb-3">Words with Most Mistakes</h2>
          {weakWords.length === 0 ? (
            <p className="text-sm text-soft">No mistakes logged yet. Keep practicing!</p>
          ) : (
            <div>
              {weakWords.map(w => {
                const total = w.timesCorrect + w.timesWrong
                const pctWrong = Math.round((w.timesWrong / total) * 100)
                return (
                  <div key={w.id} className="card-flat" style={{ padding: 'var(--space-2) 0' }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <span lang="de" className="overflow-safe" style={{ fontWeight: 600 }}>
                          {w.article ? `${w.article} ` : ''}{w.german}
                        </span>
                        <div className="text-soft text-xs">{w.english}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-accent">{pctWrong}% wrong</span>
                        <div className="text-soft text-xs mt-1">{w.timesWrong} mistakes</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

