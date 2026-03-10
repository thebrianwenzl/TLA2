import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import IndustryCard from '@/components/layout/IndustryCard';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const industries = await prisma.industry.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  let progressMap: Record<string, { xp: number; level: number; streak: number; lastPracticeDate: Date | null }> = {};
  let masteredMap: Record<string, number> = {};
  let termCountMap: Record<string, number> = {};

  if (session?.user?.id) {
    const [progressList, termCounts] = await Promise.all([
      prisma.userProgress.findMany({ where: { userId: session.user.id } }),
      prisma.term.groupBy({ by: ['industryId'], _count: { id: true } }),
    ]);

    for (const p of progressList) progressMap[p.industryId] = p;
    for (const t of termCounts) termCountMap[t.industryId] = t._count.id;

    const masteredList = await prisma.userTermProgress.groupBy({
      by: ['termId'],
      where: { userId: session.user.id, mastered: true },
      _count: { termId: true },
    });

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

  // ─── Unauthenticated hero ────────────────────────────────────────────────
  if (!session) {
    return (
      <main className="min-h-screen bg-obsidian flex flex-col">
        {/* Full-width yellow band — bold Rand hero */}
        <div className="bg-gold px-6 py-10 md:py-16 lg:py-24 flex-1">
          <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="font-display font-bold text-obsidian leading-none mb-4 md:mb-6"
                style={{ fontSize: 'clamp(4rem, 12vw, 11rem)' }}>
                TLA
              </div>
              <p className="font-body text-obsidian/60 text-base md:text-lg max-w-sm">
                Three-letter acronyms. The secret handshake of every industry.
              </p>
            </div>
            <div>
              <h2 className="font-display font-bold text-obsidian text-2xl md:text-3xl lg:text-5xl mb-4 md:mb-5 leading-tight">
                Learn the language.<br />Own the room.
              </h2>
              <p className="font-body text-obsidian/60 mb-6 md:mb-8 text-sm md:text-base leading-relaxed max-w-md">
                Master industry jargon through spaced repetition and gamified exercises.
                Biotech, advertising, nonprofits — speak every room.
              </p>
              <Link href="/signin">
                <button className="bg-obsidian text-gold font-display font-bold px-8 py-4 text-lg rounded-lg hover:bg-obsidian/90 transition-colors">
                  Get started free →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Industry preview strip */}
        <div className="bg-charcoal border-t border-white/8 px-6 py-8 md:py-12">
          <div className="max-w-8xl mx-auto">
            <p className="font-body text-xs text-ivory/30 uppercase tracking-widest mb-6">What you&apos;ll learn</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {industries.slice(0, 3).map((ind) => (
                <div key={ind.id} className="flex items-center gap-4 p-5 bg-obsidian rounded-lg">
                  <span className="text-3xl shrink-0">{ind.icon}</span>
                  <div>
                    <p className="font-display font-bold text-ivory text-base">{ind.name}</p>
                    <p className="font-body text-ivory/40 text-xs mt-0.5 line-clamp-2">{ind.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Authenticated dashboard ─────────────────────────────────────────────
  const totalXp = Object.values(progressMap).reduce((sum, p) => sum + p.xp, 0);
  const totalMastered = Object.values(masteredMap).reduce((sum, n) => sum + n, 0);
  const maxStreak = Object.values(progressMap).reduce((max, p) => Math.max(max, p.streak), 0);

  return (
    <main className="min-h-screen bg-obsidian">
      {/* Stats bar — fills the screen on large monitors */}
      <div className="bg-charcoal border-b border-white/8">
        <div className="max-w-8xl mx-auto px-6 py-5 flex flex-wrap gap-6 items-center justify-between">
          <h1 className="font-display font-bold text-xl text-ivory">
            Welcome back{session.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}.
          </h1>
          <div className="flex flex-wrap gap-8 items-center">
            <Stat label="Total XP" value={totalXp.toLocaleString()} accent />
            <Stat label="Terms mastered" value={totalMastered.toString()} />
            {maxStreak > 0 && <Stat label="Best streak" value={`${maxStreak}d 🔥`} />}
          </div>
        </div>
      </div>

      {/* Industry grid */}
      <div className="max-w-8xl mx-auto px-6 py-10">
        <p className="font-body text-xs text-ivory/30 uppercase tracking-widest mb-6">Choose an industry</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className={`font-display font-bold text-2xl ${accent ? 'text-gold' : 'text-ivory'}`}>{value}</p>
      <p className="font-body text-xs text-ivory/40 mt-0.5">{label}</p>
    </div>
  );
}
