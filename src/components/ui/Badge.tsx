import clsx from 'clsx';

type BadgeVariant = 'gold' | 'cobalt' | 'crimson' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  /** Render as a bold circular level badge */
  level?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold:    'bg-gold text-obsidian',
  cobalt:  'bg-cobalt text-white',
  crimson: 'bg-crimson text-white',
  default: 'bg-white/10 text-ivory border border-white/20',
};

export default function Badge({ children, variant = 'default', className, level }: BadgeProps) {
  if (level) {
    // Bold circle badge — clean, confident, Paul Rand
    return (
      <div
        className={clsx(
          'inline-flex items-center justify-center w-12 h-12 rounded-full font-display font-bold text-lg shrink-0',
          variantClasses[variant],
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold font-body',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
