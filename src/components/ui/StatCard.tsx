interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel
}: StatCardProps) {
  const trendColor =
    trend === 'up'
      ? 'text-edward-coral'
      : trend === 'down'
        ? 'text-edward-teal'
        : 'text-edward-muted';

  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <div className="ed-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-edward-muted text-sm font-medium">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {trendLabel && (
        <p className={`text-xs font-medium ${trendColor}`}>
          {trendIcon} {trendLabel}
        </p>
      )}
    </div>
  );
}
