interface StreakRingProps {
  current: number
  goal: number
  size?: number
}

export default function StreakRing({ current, goal, size = 120 }: StreakRingProps) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const progress = goal > 0 ? Math.min(current / goal, 1) : 0
  const dashOffset = circumference * (1 - progress)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`Daily goal: ${current} of ${goal} words`}
      role="img"
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--line)"
        strokeWidth="6"
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        className="progress-ring"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      {/* Center text */}
      <text
        x={size / 2}
        y={size / 2 - 6}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-serif)"
        fontWeight="700"
        fontSize={size * 0.22}
        fill="var(--ink)"
      >
        {current}
      </text>
      <text
        x={size / 2}
        y={size / 2 + size * 0.16}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-sans)"
        fontSize={size * 0.11}
        fill="var(--ink-soft)"
      >
        / {goal}
      </text>
    </svg>
  )
}

