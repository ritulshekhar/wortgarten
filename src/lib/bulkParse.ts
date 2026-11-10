export interface ParsedEntry {
  german: string
  english: string
}

export interface ParseResult {
  entries: ParsedEntry[]
  errors: string[]
}

/** Parse a line into german/english pair using -, , or tab as separator */
function parseLine(line: string): ParsedEntry | null {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return null

  // Try tab separator
  const tabParts = trimmed.split('\t')
  if (tabParts.length >= 2) {
    return { german: tabParts[0].trim(), english: tabParts[1].trim() }
  }

  // Try " - " dash separator
  const dashIdx = trimmed.indexOf(' - ')
  if (dashIdx > 0) {
    return {
      german: trimmed.slice(0, dashIdx).trim(),
      english: trimmed.slice(dashIdx + 3).trim(),
    }
  }

  // Try comma separator (but careful with "to do, to make" style)
  const commaIdx = trimmed.indexOf(', ')
  if (commaIdx > 0) {
    return {
      german: trimmed.slice(0, commaIdx).trim(),
      english: trimmed.slice(commaIdx + 2).trim(),
    }
  }

  // Try plain comma
  const plainCommaIdx = trimmed.indexOf(',')
  if (plainCommaIdx > 0) {
    return {
      german: trimmed.slice(0, plainCommaIdx).trim(),
      english: trimmed.slice(plainCommaIdx + 1).trim(),
    }
  }

  return null
}

/**
 * Parse a bulk paste of lines into german/english pairs.
 * Supports: dash ( - ), comma, tab, and CSV separators.
 */
export function parseBulkText(text: string): ParseResult {
  const lines = text.split('\n')
  const entries: ParsedEntry[] = []
  const errors: string[] = []

  for (const line of lines) {
    if (!line.trim()) continue
    const parsed = parseLine(line)
    if (parsed && parsed.german && parsed.english) {
      entries.push(parsed)
    } else {
      errors.push(`Could not parse: "${line.trim()}"`)
    }
  }

  return { entries, errors }
}

/**
 * Find duplicates: entries whose german word (case-insensitive, without article)
 * already exists in the existing words list.
 */
export function findDuplicates(
  entries: ParsedEntry[],
  existingGerman: string[]
): Set<string> {
  const existing = new Set(
    existingGerman.map(g =>
      g.toLowerCase().replace(/^(der|die|das)\s+/i, '').trim()
    )
  )

  const duplicates = new Set<string>()
  for (const entry of entries) {
    const normalized = entry.german.toLowerCase().replace(/^(der|die|das)\s+/i, '').trim()
    if (existing.has(normalized)) {
      duplicates.add(entry.german)
    }
  }
  return duplicates
}

