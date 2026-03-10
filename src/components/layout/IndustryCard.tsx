import Link from 'next/link';
import XPBar from './XPBar';
import Button from '@/components/ui/Button';
import type { Industry, UserProgress } from '@/types';

interface IndustryCardProps {
  industry: Industry;
  progress?: UserProgress;
  masteredCount?: number;
  termCount?: number;
}

export default function IndustryCard({ industry, progress, masteredCount = 0, termCount = 0 }: IndustryCardProps) {
  const hasProgress = !!progress;

  return (
    <div className="bg-charcoal rounded-xl overflow-hidden flex flex-col group hover:ring-1 hover:ring-gold/40 transition-all duration-200">
      {/* Bold colored top stripe */}
      <div className="h-1 bg-gold" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Icon + name */}
        <div className="flex items-start gap-3">
          <span className="text-3xl shrink-0" role="img" aria-label={industry.name}>{industry.icon}</span>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-ivory text-lg leading-tight">{industry.name}</h3>
            <p className="font-body text-ivory/40 text-xs mt-0.5 leading-snug line-clamp-2">{industry.description}</p>
          </div>
        </div>

        {/* XP progress */}
        {hasProgress && (
          <XPBar xp={progress!.xp} streak={progress!.streak} />
        )}

        {/* Mastered count */}
        {termCount > 0 && (
          <p className="font-body text-sm text-ivory/50">
            <span className="text-gold font-bold">{masteredCount}</span>
            <span> / {termCount} mastered</span>
          </p>
        )}

        {/* CTA — pushed to bottom */}
        <div className="mt-auto">
          <Link href={`/learn/${industry.slug}`}>
            <Button variant={hasProgress ? 'primary' : 'secondary'} className="w-full">
              {hasProgress ? 'Practice' : 'Start Learning'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
