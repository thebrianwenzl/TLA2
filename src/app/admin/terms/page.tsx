import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface Props {
  searchParams: { industry?: string; q?: string };
}

export default async function AdminTermsPage({ searchParams }: Props) {
  const industries = await prisma.industry.findMany({ orderBy: { name: 'asc' } });

  const terms = await prisma.term.findMany({
    where: {
      ...(searchParams.industry ? { industryId: searchParams.industry } : {}),
      ...(searchParams.q ? { term: { contains: searchParams.q, mode: 'insensitive' } } : {}),
    },
    include: { industry: { select: { name: true, icon: true } } },
    orderBy: [{ industryId: 'asc' }, { difficulty: 'asc' }, { term: 'asc' }],
    take: 200,
  });

  const diffLabel = (d: number) => d === 1 ? 'Beginner' : d === 2 ? 'Intermediate' : 'Advanced';
  const diffColor = (d: number) => d === 1 ? 'text-emerald-600' : d === 2 ? 'text-amber-600' : 'text-crimson';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-charcoal">Terms</h1>
        <Link href="/admin/terms/new">
          <Button variant="primary" size="sm">+ Add Term</Button>
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex gap-3 mb-6">
        <select name="industry" defaultValue={searchParams.industry ?? ''} className="border border-charcoal/20 rounded px-3 py-2 font-body text-sm text-charcoal bg-ivory">
          <option value="">All industries</option>
          {industries.map((i) => (
            <option key={i.id} value={i.id}>{i.icon} {i.name}</option>
          ))}
        </select>
        <input
          name="q"
          defaultValue={searchParams.q ?? ''}
          placeholder="Search terms…"
          className="border border-charcoal/20 rounded px-3 py-2 font-body text-sm text-charcoal bg-ivory flex-1"
        />
        <Button type="submit" variant="secondary" size="sm">Filter</Button>
      </form>

      <div className="bg-white rounded-lg border border-charcoal/10 shadow-sm overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead className="bg-parchment border-b border-charcoal/10">
            <tr>
              <th className="text-left px-4 py-3 text-charcoal/60 font-semibold">Industry</th>
              <th className="text-left px-4 py-3 text-charcoal/60 font-semibold">Term</th>
              <th className="text-left px-4 py-3 text-charcoal/60 font-semibold">Difficulty</th>
              <th className="text-left px-4 py-3 text-charcoal/60 font-semibold">Definition (preview)</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {terms.map((t) => (
              <tr key={t.id} className="border-b border-charcoal/5 hover:bg-parchment/40">
                <td className="px-4 py-3 text-charcoal/60">{t.industry.icon}</td>
                <td className="px-4 py-3 font-mono font-semibold text-charcoal">{t.term}</td>
                <td className={`px-4 py-3 ${diffColor(t.difficulty)}`}>{diffLabel(t.difficulty)}</td>
                <td className="px-4 py-3 text-charcoal/60 max-w-xs truncate">{t.definition}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/terms/${t.id}`} className="text-cobalt hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
            {terms.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-charcoal/40">No terms found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
