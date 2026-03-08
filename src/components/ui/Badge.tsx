import clsx from 'clsx';

type BadgeVariant = 'gold' | 'cobalt' | 'crimson' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  /** Render as an octagonal level badge */
  level?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold:    'bg-gold text-obsidian',
  cobalt:  'bg-cobalt text-ivory',
  crimson: 'bg-crimson text-ivory',
  default: 'bg-parchment/20 text-parchment border border-parchment/30',
};

export default function Badge({ children, variant = 'default', className, level }: BadgeProps) {
  if (level) {
    // Octagonal clip-path badge
    return (
      <div
        className={clsx(
          'relative inline-flex items-center justify-center w-14 h-14 font-display font-bold text-xl',
          variantClasses[variant],
          className
        )}
        style={{
          clipPath:
            'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        }}
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
