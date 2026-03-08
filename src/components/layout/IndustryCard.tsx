import Link from 'next/link';
import ArtDecoFrame from '@/components/ui/ArtDecoFrame';
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
    <ArtDecoFrame variant="card" className="w-full">
      <div className="bg-obsidian/80 border border-gold/20 rounded-lg p-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className="text-4xl" role="img" aria-label={industry.name}>{industry.icon}</span>
          <div>
            <h3 className="font-display text-xl text-gold">{industry.name}</h3>
            <p className="font-body text-ivory/60 text-sm">{industry.description}</p>
          </div>
        </div>

        {hasProgress && (
          <XPBar xp={progress!.xp} streak={progress!.streak} />
        )}

        {termCount > 0 && (
          <p className="font-body text-xs text-gold/40">
            {masteredCount} / {termCount} terms mastered
          </p>
        )}

        <Link href={`/learn/${industry.slug}`}>
          <Button variant={hasProgress ? 'primary' : 'secondary'} className="w-full">
            {hasProgress ? 'Practice' : 'Start Learning'}
          </Button>
        </Link>
      </div>
    </ArtDecoFrame>
  );
}
