import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'gold';
}

export default function Card({ children, className, variant = 'default' }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg p-6 shadow-lg',
        {
          'bg-parchment text-charcoal': variant === 'default',
          'bg-obsidian/80 text-ivory border border-gold/20': variant === 'dark',
          'bg-gold/10 border border-gold/40 text-ivory': variant === 'gold',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
