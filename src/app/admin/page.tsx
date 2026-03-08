import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [industryCount, termCount, userCount, recentExercises] = await Promise.all([
    prisma.industry.count(),
    prisma.term.count(),
    prisma.user.count(),
    prisma.exerciseLog.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ]);

  const stats = [
    { label: 'Industries', value: industryCount },
    { label: 'Terms', value: termCount },
    { label: 'Users', value: userCount },
    { label: 'Exercises (7d)', value: recentExercises },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-charcoal/10 p-6 text-center shadow-sm">
            <p className="font-display text-4xl text-cobalt">{s.value}</p>
            <p className="font-body text-sm text-charcoal/60 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
