import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLevel } from '@/lib/xp';
import type { ProgressPostBody } from '@/types';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const industryId = searchParams.get('industryId');
  if (!industryId) return Response.json({ error: 'industryId required' }, { status: 400 });

  const [progress, masteredCount] = await Promise.all([
    prisma.userProgress.findUnique({
      where: { userId_industryId: { userId: session.user.id, industryId } },
    }),
    prisma.userTermProgress.count({
      where: { userId: session.user.id, mastered: true, term: { industryId } },
    }),
  ]);

  return Response.json({ progress, masteredCount });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body: ProgressPostBody = await req.json();
  const { industryId, xpEarned, results } = body;
  const userId = session.user.id;

  // Fetch current progress for streak/level calc
  const existing = await prisma.userProgress.findUnique({
    where: { userId_industryId: { userId, industryId } },
  });

  const currentXp = existing?.xp ?? 0;
  const newXp = currentXp + xpEarned;
  const newLevel = getLevel(newXp);

  // Streak logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let newStreak = 1;
  if (existing?.lastPracticeDate) {
    const last = new Date(existing.lastPracticeDate);
    last.setHours(0, 0, 0, 0);
    if (last.getTime() === today.getTime()) {
      newStreak = existing.streak; // already practiced today
    } else if (last.getTime() === yesterday.getTime()) {
      newStreak = existing.streak + 1;
    }
    // else gap > 1 day → reset to 1
  }

  // Upsert UserProgress
  await prisma.userProgress.upsert({
    where: { userId_industryId: { userId, industryId } },
    update: { xp: newXp, level: newLevel, streak: newStreak, lastPracticeDate: new Date() },
    create: { userId, industryId, xp: newXp, level: newLevel, streak: newStreak, lastPracticeDate: new Date() },
  });

  // Upsert UserTermProgress for each result
  for (const r of results) {
    const existingTerm = await prisma.userTermProgress.findUnique({
      where: { userId_termId: { userId, termId: r.termId } },
    });

    const newCorrect  = (existingTerm?.correct  ?? 0) + (r.correct ? 1 : 0);
    const newIncorrect= (existingTerm?.incorrect ?? 0) + (r.correct ? 0 : 1);
    const total = newCorrect + newIncorrect;
    const mastered = total >= 3 && newCorrect / total >= 0.8;

    await prisma.userTermProgress.upsert({
      where: { userId_termId: { userId, termId: r.termId } },
      update: { correct: newCorrect, incorrect: newIncorrect, mastered, lastSeen: new Date() },
      create: { userId, termId: r.termId, correct: newCorrect, incorrect: newIncorrect, mastered, lastSeen: new Date() },
    });

    await prisma.exerciseLog.create({
      data: {
        userId,
        termId: r.termId,
        exerciseType: r.exerciseType,
        correct: r.correct,
        xpEarned: r.xpEarned,
      },
    });
  }

  return Response.json({ ok: true, xp: newXp, level: newLevel, streak: newStreak });
}
