import clsx from 'clsx';

type FrameVariant = 'card' | 'hero' | 'exercise';

interface ArtDecoFrameProps {
  children: React.ReactNode;
  variant?: FrameVariant;
  className?: string;
}

/** SVG corner bracket for Art Deco framing */
function SteppedCorner({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={clsx('text-gold', className)}
    >
      <path
        d="M0 32 L0 4 L4 4 L4 8 L8 8 L8 12 L12 12 L12 16 L32 16 L32 12 L16 12 L16 8 L12 8 L12 4 L8 4 L8 0 L32 0 L32 32 Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M0 32 L0 0 L4 0 L4 28 L32 28 L32 32 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Sunburst ornament for hero sections */
function Sunburst({ className }: { className?: string }) {
  const rays = Array.from({ length: 24 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 200 200"
      className={clsx('text-gold', className)}
      aria-hidden
    >
      {rays.map((i) => (
        <line
          key={i}
          x1="100"
          y1="100"
          x2={100 + 95 * Math.cos((i * Math.PI * 2) / 24)}
          y2={100 + 95 * Math.sin((i * Math.PI * 2) / 24)}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
      ))}
      <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export default function ArtDecoFrame({ children, variant = 'card', className }: ArtDecoFrameProps) {
  if (variant === 'hero') {
    return (
      <div className={clsx('relative', className)}>
        <Sunburst className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  if (variant === 'exercise') {
    return (
      <div
        className={clsx(
          'relative rounded-lg overflow-hidden',
          'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent',
          className
        )}
      >
        {/* Arch top border via rounded top */}
        <div className="absolute top-0 left-0 right-0 h-8 border-t-2 border-x-2 border-gold/30 rounded-t-3xl pointer-events-none" />
        <div className="pt-4">{children}</div>
      </div>
    );
  }

  // 'card' variant — stepped corner brackets
  return (
    <div className={clsx('relative', className)}>
      <SteppedCorner className="absolute top-0 left-0" />
      <SteppedCorner className="absolute top-0 right-0 rotate-90" />
      <SteppedCorner className="absolute bottom-0 left-0 -rotate-90" />
      <SteppedCorner className="absolute bottom-0 right-0 rotate-180" />
      <div className="p-2">{children}</div>
    </div>
  );
}
