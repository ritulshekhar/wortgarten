interface UmlautHelperProps {
  onInsert: (char: string) => void
}

const UMLAUTS = ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß']

export default function UmlautHelper({ onInsert }: UmlautHelperProps) {
  return (
    <div className="umlaut-row" role="group" aria-label="German special characters">
      {UMLAUTS.map(char => (
        <button
          key={char}
          type="button"
          className="umlaut-btn"
          onClick={() => onInsert(char)}
          aria-label={`Insert ${char}`}
        >
          {char}
        </button>
      ))}
    </div>
  )
}

