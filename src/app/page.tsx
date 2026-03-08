import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import IndustryCard from '@/components/layout/IndustryCard';
import ArtDecoFrame from '@/components/ui/ArtDecoFrame';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const industries = await prisma.industry.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  // For authenticated users, fetch their progress across all industries
  let progressMap: Record<string, { xp: number; level: number; streak: number; lastPracticeDate: Date | null }> = {};
  let masteredMap: Record<string, number> = {};
  let termCountMap: Record<string, number> = {};

  if (session?.user?.id) {
    const [progressList, termCounts] = await Promise.all([
      prisma.userProgress.findMany({
        where: { userId: session.user.id },
      }),
      prisma.term.groupBy({
        by: ['industryId'],
        _count: { id: true },
      }),
    ]);

    for (const p of progressList) {
      progressMap[p.industryId] = p;
    }

    for (const t of termCounts) {
      termCountMap[t.industryId] = t._count.id;
    }

    const masteredList = await prisma.userTermProgress.groupBy({
      by: ['termId'],
      where: {
        userId: session.user.id,
        mastered: true,
      },
      _count: { termId: true },
    });

    // Group mastered by industry
    const masteredTermIds = masteredList.map((m) => m.termId);
    if (masteredTermIds.length > 0) {
      const masteredTerms = await prisma.term.findMany({
        where: { id: { in: masteredTermIds } },
        select: { id: true, industryId: true },
      });
      for (const t of masteredTerms) {
        masteredMap[t.industryId] = (masteredMap[t.industryId] ?? 0) + 1;
      }
    }
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-6 text-center">
        <ArtDecoFrame variant="hero" className="mb-8 w-48 h-48">
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="font-display text-8xl text-gold">TLA</h1>
          </div>
        </ArtDecoFrame>

        <h2 className="font-display text-4xl text-ivory mb-3">
          Learn the language.<br />Own the room.
        </h2>
        <p className="font-body text-ivory/60 max-w-md mb-8">
          Master industry jargon through spaced repetition and gamified exercises. Biotech, advertising, nonprofits — speak every room.
        </p>

        <div className="chevron-divider w-48 mb-8" />

        <Link href="/signin">
          <Button variant="primary" size="lg">Sign in with Google</Button>
        </Link>

        <div className="grid grid-cols-3 gap-6 mt-16 max-w-sm">
          {industries.slice(0, 3).map((ind) => (
            <div key={ind.id} className="text-center">
              <div className="text-4xl mb-2">{ind.icon}</div>
              <p className="font-body text-xs text-gold/60">{ind.name.split(' /')[0]}</p>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-obsidian px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-gold mb-1">
            Welcome back{session.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}.
          </h1>
          <p className="font-body text-ivory/60">Which industry are you practicing today?</p>
        </div>

        <div className="chevron-divider mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => (
            <IndustryCard
              key={industry.id}
              industry={industry}
              progress={progressMap[industry.id] as any}
              masteredCount={masteredMap[industry.id] ?? 0}
              termCount={termCountMap[industry.id] ?? 0}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
