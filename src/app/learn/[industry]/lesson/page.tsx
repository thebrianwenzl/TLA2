import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildLesson } from '@/lib/lesson';
import ExerciseShell from '@/components/exercises/ExerciseShell';

interface Props {
  params: { industry: string };
}

export default async function LessonPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/signin');

  const industry = await prisma.industry.findUnique({
    where: { slug: params.industry },
  });
  if (!industry) notFound();

  const exercises = await buildLesson(params.industry, session.user.id);

  if (exercises.length === 0) {
    return (
      <main className="min-h-screen bg-obsidian flex items-center justify-center text-center px-6">
        <div>
          <p className="font-display text-3xl text-gold mb-4">No terms available yet.</p>
          <p className="font-body text-ivory/60">Come back after terms have been added to this industry.</p>
        </div>
      </main>
    );
  }

  return (
    <ExerciseShell
      exercises={exercises}
      industrySlug={industry.slug}
      industryName={industry.name}
      industryId={industry.id}
    />
  );
}
