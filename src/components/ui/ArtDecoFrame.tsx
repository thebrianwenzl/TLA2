import clsx from 'clsx';

type FrameVariant = 'card' | 'hero' | 'exercise';

interface ArtDecoFrameProps {
  children: React.ReactNode;
  variant?: FrameVariant;
  className?: string;
}

/**
 * Paul Rand–inspired geometric frame.
 * Bold, confident geometry — no ornamentation.
 */
export default function ArtDecoFrame({ children, variant = 'card', className }: ArtDecoFrameProps) {

  // Hero: strong horizontal rules bracket the content
  if (variant === 'hero') {
    return (
      <div className={clsx('relative flex flex-col items-center justify-center', className)}>
        <div className="w-16 h-1 bg-gold mb-6" />
        <div className="relative z-10">{children}</div>
        <div className="w-16 h-1 bg-gold mt-6" />
      </div>
    );
  }

  // Exercise: bold yellow top stripe on a clean dark panel
  if (variant === 'exercise') {
    return (
      <div className={clsx('relative rounded-xl overflow-hidden', className)}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
        <div>{children}</div>
      </div>
    );
  }

  // Card: bold left accent bar, clean container — no decorative corners
  return (
    <div className={clsx('relative pl-4', className)}>
      <div className="absolute left-0 top-2 bottom-2 w-1 bg-gold rounded-full" />
      {children}
    </div>
  );
}
