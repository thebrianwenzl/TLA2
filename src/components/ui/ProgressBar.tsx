'use client';

import clsx from 'clsx';

interface ProgressBarProps {
  value: number;   // 0–100
  label?: string;
  ticks?: boolean;
  className?: string;
}

export default function ProgressBar({ value, label, ticks = false, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <div className="flex justify-between text-xs font-body text-gold/70 mb-1">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="relative h-3 bg-obsidian/60 rounded-full overflow-hidden border border-gold/20">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
        {/* Art Deco tick marks every 20% */}
        {ticks && [20, 40, 60, 80].map((tick) => (
          <div
            key={tick}
            className="absolute top-0 bottom-0 w-px bg-obsidian/40"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>
    </div>
  );
}
