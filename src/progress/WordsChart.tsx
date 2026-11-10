interface DayBar {
  date: string
  count: number
}

interface WordsChartProps {
  data: DayBar[]
  height?: number
}

export default function WordsChart({ data, height = 100 }: WordsChartProps) {
  if (data.length === 0) {
    return <p className="text-soft text-sm text-center">No data yet</p>
  }

  const max = Math.max(...data.map(d => d.count), 1)
  const barWidth = 100 / data.length
  const gap = 0.5

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: height, display: 'block' }}
      aria-label="Words added over last 30 days"
      role="img"
    >
      {data.map((day, i) => {
        const barH = (day.count / max) * (height - 10)
        const x = i * barWidth + gap / 2
        const w = barWidth - gap
        const y = height - barH - 2
        return (
          <g key={day.date}>
            <title>{day.date}: {day.count} words</title>
            <rect
              x={x}
              y={y}
              width={w}
              height={barH}
              fill="var(--ink)"
              opacity={day.count > 0 ? 1 : 0.1}
              rx="1"
            />
          </g>
        )
      })}
      {/* Baseline */}
      <line
        x1="0"
        y1={height - 2}
        x2="100"
        y2={height - 2}
        stroke="var(--line)"
        strokeWidth="0.5"
      />
    </svg>
  )
}

