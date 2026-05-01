interface ScoreRingProps {
  score: number; // 0–100
  size?: number; // px, default 120
}

export default function ScoreRing({ score, size = 120 }: ScoreRingProps) {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75
      ? '#0F766E' // teal — good
      : score >= 50
        ? '#F59E0B' // amber — okay
        : '#E11D48'; // coral — bad

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <p className="text-edward-muted text-xs">Spending Score</p>
    </div>
  );
}
