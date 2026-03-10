'use client';

import clsx from 'clsx';

interface ProgressBarProps {
  value: number;   // 0–100
  label?: string;
  ticks?: boolean; // kept for API compat, ignored — clean bar only
  className?: string;
}

export default function ProgressBar({ value, label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <div className="flex justify-between text-xs font-body text-ivory/50 mb-1.5">
          <span>{label}</span>
          <span className="text-gold font-semibold">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
