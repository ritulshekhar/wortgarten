import { useState, useEffect, useRef } from 'react'
import {
  db,
  getSettings,
  updateSettings,
  exportAllData,
  importAllData,
  resetAllData,
  addWord,
  getAllWords,
  type AppSettings,
} from '../lib/db'
import { SAMPLE_WORDS } from '../lib/sampleWords'
import { useToast } from '../components/Toast'

interface SettingsTabProps {
  onSettingsChange: () => void
}

export default function SettingsTab({ onSettingsChange }: SettingsTabProps) {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [resetInput, setResetInput] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [wordCount, setWordCount] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const loadData = async () => {
    const s = await getSettings()
    setSettings(s)
    const words = await getAllWords()
    setWordCount(words.length)
  }

  useEffect(() => {
    loadData()
  }, [])

  if (!settings) {
    return <div className="page-content text-soft text-center mt-6">Loading settings…</div>
  }

  const handleThemeChange = async (theme: 'auto' | 'light' | 'dark') => {
    await updateSettings({ theme })
    setSettings(prev => prev ? { ...prev, theme } : null)
    onSettingsChange()
    showToast(`Theme set to ${theme}`)
  }

  const handleDailyGoalChange = async (goal: number) => {
    await updateSettings({ dailyGoal: goal })
    setSettings(prev => prev ? { ...prev, dailyGoal: goal } : null)
    onSettingsChange()
  }

  const handleSessionSizeChange = async (size: 10 | 20 | 30 | 50) => {
    await updateSettings({ defaultSessionSize: size })
    setSettings(prev => prev ? { ...prev, defaultSessionSize: size } : null)
    onSettingsChange()
  }

  const handleHapticChange = async (enabled: boolean) => {
    await updateSettings({ hapticEnabled: enabled })
    setSettings(prev => prev ? { ...prev, hapticEnabled: enabled } : null)
    onSettingsChange()
  }

  const handleLoadSamples = async () => {
    await db.words.bulkAdd(SAMPLE_WORDS as any)
    await loadData()
    onSettingsChange()
    showToast(`Loaded ${SAMPLE_WORDS.length} sample words!`)
  }

  const handleExport = async () => {
    const json = await exportAllData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const dateStr = new Date().toISOString().slice(0, 10)
    a.download = `deutsch-backup-${dateStr}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    const now = Date.now()
    await updateSettings({ lastExportDate: now })
    setSettings(prev => prev ? { ...prev, lastExportDate: now } : null)
    showToast('Backup downloaded!')
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      await importAllData(text)
      await loadData()
      onSettingsChange()
      showToast('Data restored successfully!')
    } catch (err) {
      console.error(err)
      showToast('Failed to import: invalid JSON file')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleReset = async () => {
    if (resetInput.trim() !== 'RESET') {
      showToast('Type RESET in capital letters to confirm')
      return
    }
    await resetAllData()
    setShowResetConfirm(false)
    setResetInput('')
    await loadData()
    onSettingsChange()
    showToast('All app data has been reset')
  }

  // Backup reminder: check if lastExportDate was > 14 days ago or never
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000
  const exportOverdue = !settings.lastExportDate || (Date.now() - settings.lastExportDate > fourteenDaysMs)

  return (
    <>
      <div className="page-header">
        <div className="hanko" aria-hidden="true">学</div>
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="page-content">
        {/* Backup Reminder Notice */}
        {exportOverdue && wordCount > 0 && (
          <div
            className="card mb-6"
            style={{
              borderLeft: '4px solid var(--accent)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <div style={{ fontWeight: 600 }}>Backup Recommendation</div>
            <p className="text-soft text-sm">
              All vocabulary and grammar progress is stored locally on this device.
              {settings.lastExportDate
                ? ' It has been more than 14 days since your last export.'
                : ' You haven’t exported your data yet.'}{' '}
              Download a backup copy to keep it safe.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={handleExport} style={{ alignSelf: 'flex-start' }}>
              Export Backup Now
            </button>
          </div>
        )}

        {/* Appearance */}
        <h2 className="font-serif text-md mb-3">Appearance</h2>
        <div className="card mb-6" style={{ padding: '0 var(--space-4)' }}>
          <div className="settings-row">
            <div>
              <div className="settings-label">Theme</div>
              <div className="settings-hint">Warm washi paper vs. deep charcoal</div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {(['auto', 'light', 'dark'] as const).map(th => (
                <button
                  key={th}
                  className={`btn btn-sm ${settings.theme === th ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleThemeChange(th)}
                  aria-pressed={settings.theme === th}
                >
                  {th === 'auto' ? 'System' : th === 'light' ? 'Light' : 'Dark'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Practice Preferences */}
        <h2 className="font-serif text-md mb-3">Practice Defaults</h2>
        <div className="card mb-6" style={{ padding: '0 var(--space-4)' }}>
          <div className="settings-row">
            <div>
              <div className="settings-label">Daily Goal</div>
              <div className="settings-hint">Words to review each day</div>
            </div>
            <select
              className="select"
              style={{ width: 'auto', minWidth: 90 }}
              value={settings.dailyGoal}
              onChange={e => handleDailyGoalChange(Number(e.target.value))}
              aria-label="Daily goal"
            >
              {[5, 10, 15, 20, 30, 50].map(n => (
                <option key={n} value={n}>{n} words</option>
              ))}
            </select>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label">Default Session Size</div>
              <div className="settings-hint">Number of words per quiz</div>
            </div>
            <select
              className="select"
              style={{ width: 'auto', minWidth: 90 }}
              value={settings.defaultSessionSize}
              onChange={e => handleSessionSizeChange(Number(e.target.value) as 10 | 20 | 30 | 50)}
              aria-label="Default session size"
            >
              {[10, 20, 30, 50].map(n => (
                <option key={n} value={n}>{n} words</option>
              ))}
            </select>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label">Haptic Feedback</div>
              <div className="settings-hint">Vibrate on incorrect answers</div>
            </div>
            <label className="toggle" aria-label="Toggle haptic feedback">
              <input
                type="checkbox"
                checked={settings.hapticEnabled}
                onChange={e => handleHapticChange(e.target.checked)}
              />
              <span className="toggle-track" />
              <span className="toggle-thumb" />
            </label>
          </div>
        </div>

        {/* Test Data */}
        <h2 className="font-serif text-md mb-3">Starter Vocabulary</h2>
        <div className="card mb-6">
          <p className="text-soft text-sm mb-4">
            Load 15 high-frequency real A1 German words (nouns with articles and plurals, verbs with example sentences, and compound words) to immediately test quizzes and SRS intervals.
          </p>
          <button className="btn btn-secondary btn-full" onClick={handleLoadSamples}>
            Load 15 Sample A1 Words
          </button>
        </div>

        {/* Data & Backup */}
        <h2 className="font-serif text-md mb-3">Data Management</h2>
        <div className="card mb-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <p className="text-soft text-sm">
            Total stored words: <strong>{wordCount}</strong>. Everything stays in your browser’s IndexedDB. Export a JSON file to transfer to another device or keep a personal backup.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleExport}>
              Export JSON
            </button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => fileInputRef.current?.click()}
            >
              Import JSON
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>

        {/* Danger Zone */}
        <h2 className="font-serif text-md mb-3" style={{ color: 'var(--accent)' }}>Danger Zone</h2>
        <div className="card mb-6" style={{ borderColor: 'var(--line)' }}>
          <p className="text-soft text-sm mb-4">
            Resetting deletes all words, drill scores, sessions, and settings permanently.
          </p>

          {!showResetConfirm ? (
            <button
              className="btn btn-secondary btn-full"
              style={{ color: 'var(--accent)' }}
              onClick={() => setShowResetConfirm(true)}
            >
              Reset All Data
            </button>
          ) : (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <label htmlFor="reset-input" className="text-sm font-semibold">
                Type <span style={{ color: 'var(--accent)' }}>RESET</span> to confirm:
              </label>
              <input
                id="reset-input"
                className="input"
                type="text"
                value={resetInput}
                onChange={e => setResetInput(e.target.value)}
                placeholder="RESET"
                autoComplete="off"
              />
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setShowResetConfirm(false)
                    setResetInput('')
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={resetInput.trim() !== 'RESET'}
                  onClick={handleReset}
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-soft mb-8">
          <div className="hanko hanko-sm" style={{ margin: '0 auto var(--space-2)' }}>学</div>
          <div>Deutsch Lernen · Wabi-sabi Edition</div>
          <div className="mt-1">Version 1.0.0 · Offline Progressive Web App</div>
        </div>
      </div>
    </>
  )
}
