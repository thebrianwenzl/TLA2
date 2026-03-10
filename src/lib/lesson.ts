import { prisma } from './prisma';
import type { Exercise, TermWithProgress, MCQExercise } from '@/types';

const EXERCISE_POOL: Array<'flashcard' | 'mcq' | 'fill_blank' | 'matching'> = [
  'flashcard', 'mcq', 'fill_blank', 'matching',
  'flashcard', 'mcq', 'fill_blank', 'matching',
  'flashcard', 'mcq', 'fill_blank', 'matching',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMCQ(term: TermWithProgress, allTerms: TermWithProgress[]): MCQExercise {
  const distractors = allTerms
    .filter((t) => t.id !== term.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((t) => t.definition);

  const options = shuffle([term.definition, ...distractors]);
  const correctIndex = options.indexOf(term.definition);

  return { type: 'mcq', term, options, correctIndex };
}

export async function buildLesson(
  industrySlug: string,
  userId: string
): Promise<Exercise[]> {
  const industry = await prisma.industry.findUnique({
    where: { slug: industrySlug },
  });
  if (!industry) throw new Error(`Industry "${industrySlug}" not found`);

  const allDbTerms = await prisma.term.findMany({
    where: { industryId: industry.id },
  });

  const termProgressList = await prisma.userTermProgress.findMany({
    where: { userId, termId: { in: allDbTerms.map((t) => t.id) } },
  });

  const progressMap = new Map(termProgressList.map((p) => [p.termId, p]));
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const terms: TermWithProgress[] = allDbTerms.map((t) => ({
    ...t,
    progress: progressMap.get(t.id),
  }));

  // Priority sort: never seen > high incorrect rate > not seen in 24h
  const sorted = [...terms].sort((a, b) => {
    const pa = a.progress;
    const pb = b.progress;

    if (!pa && pb) return -1;
    if (pa && !pb) return 1;
    if (!pa && !pb) return 0;

    const aUnseen = !pa!.lastSeen || pa!.lastSeen < oneDayAgo;
    const bUnseen = !pb!.lastSeen || pb!.lastSeen < oneDayAgo;
    if (aUnseen && !bUnseen) return -1;
    if (!aUnseen && bUnseen) return 1;

    const aRate = pa!.correct + pa!.incorrect > 0
      ? pa!.incorrect / (pa!.correct + pa!.incorrect)
      : 0;
    const bRate = pb!.correct + pb!.incorrect > 0
      ? pb!.incorrect / (pb!.correct + pb!.incorrect)
      : 0;
    return bRate - aRate;
  });

  const selected = sorted.slice(0, 10);
  const exercises: Exercise[] = [];
  let matchingBuffer: TermWithProgress[] = [];

  // Shuffle the pool each session so the same term gets a different type each time
  const shuffledPool = shuffle([...EXERCISE_POOL]);

  for (let i = 0; i < selected.length; i++) {
    const term = selected[i];
    const cycleType = shuffledPool[i % shuffledPool.length];

    if (cycleType === 'matching') {
      matchingBuffer.push(term);
      if (matchingBuffer.length === 4) {
        exercises.push({ type: 'matching', terms: shuffle(matchingBuffer) });
        matchingBuffer = [];
      }
    } else if (cycleType === 'mcq') {
      exercises.push(buildMCQ(term, terms));
    } else {
      exercises.push({ type: cycleType, term });
    }
  }

  // Flush any remaining matching buffer as MCQ instead
  for (const t of matchingBuffer) {
    exercises.push(buildMCQ(t, terms));
  }

  return exercises;
}
