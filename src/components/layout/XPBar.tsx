import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { xpToNextLevel } from '@/lib/xp';

interface XPBarProps {
  xp: number;
  streak?: number;
}

export default function XPBar({ xp, streak }: XPBarProps) {
  const { current, needed, level } = xpToNextLevel(xp);
  const pct = Math.round((current / needed) * 100);

  return (
    <div className="flex items-center gap-4 w-full">
      <Badge variant="gold" level>
        {level}
      </Badge>
      <div className="flex-1">
        <ProgressBar value={pct} ticks label={`Level ${level}`} />
        <p className="text-xs text-gold/50 font-body mt-1">{current} / {needed} XP to next level</p>
      </div>
      {streak !== undefined && streak > 0 && (
        <div className="flex flex-col items-center">
          <span className="text-xl">🔥</span>
          <span className="text-xs font-body text-gold">{streak}d</span>
        </div>
      )}
    </div>
  );
}
