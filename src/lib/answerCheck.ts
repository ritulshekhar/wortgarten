/** Normalize a string for comparison: lowercase, trim, collapse spaces */
function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Convert umlaut substitutes to actual umlauts, preserving case */
export function foldUmlauts(s: string): string {
  return s
    .replace(/Ae/g, 'Ä')
    .replace(/AE/g, 'Ä')
    .replace(/ae/g, 'ä')
    .replace(/Oe/g, 'Ö')
    .replace(/OE/g, 'Ö')
    .replace(/oe/g, 'ö')
    .replace(/Ue/g, 'Ü')
    .replace(/UE/g, 'Ü')
    .replace(/ue/g, 'ü')
    .replace(/ss/gi, 'ß')
}

/** Levenshtein distance between two strings */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

export type CheckResult =
  | { status: 'correct' }
  | { status: 'almost'; correctSpelling: string }
  | { status: 'wrong' }

/**
 * Check a user's answer against one or more accepted answers.
 * - Case-insensitive, trims whitespace
 * - Accepts ae/oe/ue/ss as ä/ö/ü/ß
 * - Accepts any of several comma-separated accepted answers
 * - Tolerates 1-character typo for words >= 6 characters
 */
export function checkAnswer(userInput: string, acceptedAnswers: string): CheckResult {
  const userNorm = normalize(foldUmlauts(userInput))
  const userNormNoFold = normalize(userInput)

  const rawAnswers = acceptedAnswers
    .split(',')
    .map(a => normalize(a))
    .filter(Boolean)

  for (const ans of rawAnswers) {
    if (userNorm === ans || userNormNoFold === ans) {
      return { status: 'correct' }
    }
  }

  // Umlaut-folded version of accepted answers
  for (const ans of rawAnswers) {
    const foldedAns = normalize(foldUmlauts(ans))
    if (userNorm === foldedAns || userNormNoFold === foldedAns) {
      return { status: 'correct' }
    }
  }

  // Typo tolerance: 1 edit distance for words >= 6 chars
  for (const ans of rawAnswers) {
    if (ans.length >= 6) {
      const dist = levenshtein(userNorm, ans)
      if (dist === 1) {
        return { status: 'almost', correctSpelling: ans }
      }
      // Also check umlaut-folded
      const foldedAns = normalize(foldUmlauts(ans))
      if (levenshtein(userNorm, foldedAns) === 1) {
        return { status: 'almost', correctSpelling: ans }
      }
    }
  }

  return { status: 'wrong' }
}

/**
 * Check a German answer (for English->German mode).
 * Also handles article prefix: "der Hund" can be answered as "Hund".
 */
export function checkGermanAnswer(
  userInput: string,
  correctGerman: string,
  correctArticle?: string
): CheckResult {
  const userNorm = normalize(foldUmlauts(userInput))
  const correctNorm = normalize(foldUmlauts(correctGerman))

  // Try exact match (without article)
  if (userNorm === correctNorm) return { status: 'correct' }

  // Try with article prefix
  if (correctArticle) {
    const withArticle = normalize(`${correctArticle} ${correctGerman}`)
    if (userNorm === withArticle || userNorm === normalize(foldUmlauts(withArticle))) {
      return { status: 'correct' }
    }
  }

  // Strip article from user input and try again
  const stripped = userNorm.replace(/^(der|die|das)\s+/, '')
  if (stripped === correctNorm || stripped === normalize(foldUmlauts(correctGerman))) {
    return { status: 'correct' }
  }

  // Typo tolerance
  if (correctNorm.length >= 6 && levenshtein(userNorm, correctNorm) === 1) {
    return { status: 'almost', correctSpelling: correctGerman }
  }
  if (stripped.length >= 6 && levenshtein(stripped, correctNorm) === 1) {
    return { status: 'almost', correctSpelling: correctGerman }
  }

  return { status: 'wrong' }
}
