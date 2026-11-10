import { useState, useEffect, useCallback, useRef } from 'react'
import type { Word } from '../lib/db'
import { updateWord, addSession } from '../lib/db'
import { processCorrect, processWrong } from '../lib/srs'
import { checkAnswer, checkGermanAnswer } from '../lib/answerCheck'
import FeedbackPanel from './FeedbackPanel'
import SessionEnd from './SessionEnd'
import MultipleChoice from './modes/MultipleChoice'
import TypeAnswer from './modes/TypeAnswer'
import ArticleQuiz from './modes/ArticleQuiz'
import ListeningQuiz from './modes/ListeningQuiz'
import FillBlank from './modes/FillBlank'

type QuizMode = 'de-en' | 'en-de' | 'article' | 'listen' | 'fill'
type DifficultyFeel = 'easy' | 'medium' | 'hard'

interface QuizSessionProps {
  words: Word[]
  difficulty: DifficultyFeel
  mode: 'mixed' | QuizMode
  onEnd: () => void
}

function pickMode(word: Word, preferredMode: 'mixed' | QuizMode): QuizMode {
  if (preferredMode !== 'mixed') {
    // Fall back gracefully
    if (preferredMode === 'article' && word.type !== 'noun') return 'de-en'
    if (preferredMode === 'fill' && !word.exampleSentence) return 'de-en'
    return preferredMode
  }
  // Mixed: weighted selection
  const options: QuizMode[] = ['de-en', 'de-en', 'en-de', 'en-de']
  if (word.type === 'noun' && word.article) options.push('article')
  if (word.exampleSentence) options.push('fill')
  if ('speechSynthesis' in window) options.push('listen')
  return options[Math.floor(Math.random() * options.length)]
}

type AnswerResult = 'correct' | 'almost' | 'wrong'

export default function QuizSession({ words: initialWords, difficulty, mode, onEnd }: QuizSessionProps) {
  const [queue, setQueue] = useState<Word[]>([...initialWords])
  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState<{ word: Word; result: AnswerResult; userInput: string; correctSpelling?: string }[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastResult, setLastResult] = useState<{ word: Word; result: AnswerResult; userInput: string; correctSpelling?: string } | null>(null)
  const [done, setDone] = useState(false)
  const startTime = useRef(Date.now())
  const wrongRequeued = useRef(new Set<number>())

  const currentWord = queue[current]
  const questionMode = currentWord ? pickMode(currentWord, mode) : 'de-en'
  const progress = current / queue.length

  const handleAnswer = useCallback(async (userInput: string) => {
    if (!currentWord) return

    let result: AnswerResult = 'wrong'

    if (questionMode === 'de-en') {
      const check = checkAnswer(userInput, currentWord.english)
      result = check.status
    } else if (questionMode === 'en-de') {
      const check = checkGermanAnswer(userInput, currentWord.german, currentWord.article)
      result = check.status
    } else if (questionMode === 'article') {
      result = userInput.toLowerCase() === currentWord.article?.toLowerCase() ? 'correct' : 'wrong'
    } else if (questionMode === 'listen') {
      const check = checkGermanAnswer(userInput, currentWord.german, currentWord.article)
      result = check.status
    } else if (questionMode === 'fill') {
      // For fill-the-blank, check if the user's answer is in the example sentence
      const check = checkGermanAnswer(userInput, currentWord.german, currentWord.article)
      result = check.status
    }

    // Check typo spelling
    let correctSpelling: string | undefined
    if (result === 'almost') {
      correctSpelling = questionMode === 'de-en' ? currentWord.english : currentWord.german
    }

    // Haptic on wrong
    if (result === 'wrong' && 'vibrate' in navigator) {
      navigator.vibrate([50, 30, 50])
    }

    const entry = { word: currentWord, result, userInput, correctSpelling }
    setLastResult(entry)
    setAnswered(prev => [...prev, entry])
    setShowFeedback(true)

    // Update SRS in DB (almost = correct for SRS)
    if (currentWord.id !== undefined) {
      const srsResult = result === 'wrong' ? 'wrong' : 'correct'
      const updates = srsResult === 'correct'
        ? processCorrect(currentWord)
        : processWrong(currentWord)
      await updateWord(currentWord.id, updates)
    }

    // Re-queue wrong answers once
    if (result === 'wrong' && currentWord.id !== undefined && !wrongRequeued.current.has(currentWord.id)) {
      wrongRequeued.current.add(currentWord.id!)
      setQueue(prev => [...prev, { ...currentWord }])
    }
  }, [currentWord, questionMode])

  const handleKnewIt = useCallback(async () => {
    if (!currentWord?.id || !lastResult) return
    // Override: mark as correct
    const updates = processCorrect(currentWord)
    await updateWord(currentWord.id, updates)
    // Update answered log
    setAnswered(prev => prev.map((a, i) =>
      i === prev.length - 1 ? { ...a, result: 'correct' as AnswerResult } : a
    ))
    setLastResult(prev => prev ? { ...prev, result: 'correct' } : prev)
  }, [currentWord, lastResult])

  const handleNext = useCallback(() => {
    setShowFeedback(false)
    if (current + 1 >= queue.length) {
      // Session complete
      const durationSeconds = Math.round((Date.now() - startTime.current) / 1000)
      const correct = answered.filter(a => a.result !== 'wrong').length
      const wrong = answered.filter(a => a.result === 'wrong').length
      addSession({
        date: Date.now(),
        wordsReviewed: answered.length,
        correct,
        wrong,
        durationSeconds,
      })
      setDone(true)
    } else {
      setCurrent(c => c + 1)
    }
  }, [current, queue.length, answered])

  const handlePracticeMistakes = useCallback(() => {
    const mistakes = answered
      .filter(a => a.result === 'wrong')
      .map(a => a.word)
    if (mistakes.length === 0) return
    setQueue(mistakes)
    setCurrent(0)
    setAnswered([])
    setShowFeedback(false)
    setDone(false)
    wrongRequeued.current = new Set()
    startTime.current = Date.now()
  }, [answered])

  if (done) {
    const correct = answered.filter(a => a.result !== 'wrong').length
    const mistakes = answered.filter(a => a.result === 'wrong').map(a => a.word)
    return (
      <SessionEnd
        total={answered.length}
        correct={correct}
        mistakes={mistakes}
        onDone={onEnd}
        onPracticeMistakes={mistakes.length > 0 ? handlePracticeMistakes : undefined}
      />
    )
  }

  if (!currentWord) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', paddingBottom: 'var(--nav-height)' }}>
      {/* Progress bar */}
      <div className="progress-bar-wrap" style={{ margin: 0, borderRadius: 0, height: 3 }}>
        <div className="progress-bar-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="page-header" style={{ position: 'relative' }}>
        <button className="btn btn-ghost btn-sm" onClick={onEnd} aria-label="Quit session">
          ✕
        </button>
        <span className="text-soft text-sm" style={{ flex: 1, textAlign: 'center' }}>
          {current + 1} / {queue.length}
        </span>
        <span className="badge badge-accent">
          {questionMode === 'de-en' ? 'DE→EN' : questionMode === 'en-de' ? 'EN→DE' : questionMode === 'article' ? 'Article' : questionMode === 'listen' ? 'Listen' : 'Fill'}
        </span>
      </div>

      <div className="page-content" style={{ flex: 1 }}>
        {!showFeedback ? (
          <>
            {questionMode === 'de-en' && (
              <MultipleChoice
                word={currentWord}
                allWords={initialWords}
                onAnswer={handleAnswer}
                difficulty={difficulty}
              />
            )}
            {questionMode === 'en-de' && (
              <TypeAnswer
                word={currentWord}
                direction="en-de"
                requireArticle={difficulty === 'hard' && currentWord.type === 'noun'}
                showHint={difficulty !== 'hard'}
                onAnswer={handleAnswer}
              />
            )}
            {questionMode === 'article' && (
              <ArticleQuiz word={currentWord} onAnswer={handleAnswer} />
            )}
            {questionMode === 'listen' && (
              <ListeningQuiz word={currentWord} onAnswer={handleAnswer} />
            )}
            {questionMode === 'fill' && (
              <FillBlank word={currentWord} onAnswer={handleAnswer} />
            )}
          </>
        ) : (
          lastResult && (
            <FeedbackPanel
              result={lastResult.result}
              word={lastResult.word}
              userInput={lastResult.userInput}
              correctSpelling={lastResult.correctSpelling}
              onNext={handleNext}
              onKnewIt={lastResult.result === 'wrong' ? handleKnewIt : undefined}
            />
          )
        )}
      </div>
    </div>
  )
}

