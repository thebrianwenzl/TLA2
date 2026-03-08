import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import XPBar from '@/components/layout/XPBar';
import Badge from '@/components/ui/Badge';
import ArtDecoFrame from '@/components/ui/ArtDecoFrame';

interface Props {
  params: { industry: string };
}

export default async function IndustryHomePage({ params }: Props) {
  const session = await getServerSession(authOptions);

  const industry = await prisma.industry.findUnique({
    where: { slug: params.industry },
  });
  if (!industry) notFound();

  const allTerms = await prisma.term.findMany({
    where: { industryId: industry.id },
    orderBy: { difficulty: 'asc' },
  });

  let progress = null;
  let masteredTermIds = new Set<string>();

  if (session?.user?.id) {
    progress = await prisma.userProgress.findUnique({
      where: { userId_industryId: { userId: session.user.id, industryId: industry.id } },
    });

    const masteredList = await prisma.userTermProgress.findMany({
      where: { userId: session.user.id, mastered: true, term: { industryId: industry.id } },
      select: { termId: true },
    });
    masteredTermIds = new Set(masteredList.map((m) => m.termId));
  }

  const xp = progress?.xp ?? 0;
  const streak = progress?.streak ?? 0;

  return (
    <main className="min-h-screen bg-obsidian px-6 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="text-gold/50 hover:text-gold transition-colors font-body text-sm">← Back</Link>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <span className="text-5xl">{industry.icon}</span>
          <div>
            <h1 className="font-display text-4xl text-gold">{industry.name}</h1>
            <p className="font-body text-ivory/60 text-sm">{industry.description}</p>
          </div>
        </div>

        {/* XP + Streak */}
        <div className="mb-6">
          <XPBar xp={xp} streak={streak} />
        </div>

        <div className="chevron-divider mb-8" />

        {/* Start Lesson CTA */}
        <Link href={`/learn/${industry.slug}/lesson`}>
          <Button variant="primary" size="lg" className="w-full mb-8">
            Start Lesson
          </Button>
        </Link>

        {/* Mastered terms */}
        <div>
          <h2 className="font-display text-xl text-gold mb-1">
            Terms you&apos;ve mastered
          </h2>
          <p className="font-body text-xs text-gold/50 mb-4">
            {masteredTermIds.size} of {allTerms.length} terms mastered
          </p>

          {masteredTermIds.size === 0 ? (
            <p className="font-body text-ivory/40 text-sm">
              Complete lessons to master terms and see them here.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allTerms
                .filter((t) => masteredTermIds.has(t.id))
                .map((t) => (
                  <Badge key={t.id} variant="gold">
                    {t.term}
                  </Badge>
                ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
