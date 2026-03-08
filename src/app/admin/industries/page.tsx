import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default async function AdminIndustriesPage() {
  const industries = await prisma.industry.findMany({
    include: { _count: { select: { terms: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-charcoal">Industries</h1>
        <Link href="/admin/industries/new">
          <Button variant="primary" size="sm">+ Add Industry</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-charcoal/10 shadow-sm overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead className="bg-parchment border-b border-charcoal/10">
            <tr>
              <th className="text-left px-4 py-3 text-charcoal/60 font-semibold">Icon</th>
              <th className="text-left px-4 py-3 text-charcoal/60 font-semibold">Name</th>
              <th className="text-left px-4 py-3 text-charcoal/60 font-semibold">Slug</th>
              <th className="text-left px-4 py-3 text-charcoal/60 font-semibold">Terms</th>
              <th className="text-left px-4 py-3 text-charcoal/60 font-semibold">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {industries.map((ind) => (
              <tr key={ind.id} className="border-b border-charcoal/5 hover:bg-parchment/40">
                <td className="px-4 py-3 text-2xl">{ind.icon}</td>
                <td className="px-4 py-3 text-charcoal font-medium">{ind.name}</td>
                <td className="px-4 py-3 text-charcoal/50 font-mono text-xs">{ind.slug}</td>
                <td className="px-4 py-3 text-charcoal">{ind._count.terms}</td>
                <td className="px-4 py-3">
                  <span className={ind.isActive ? 'text-emerald-600' : 'text-crimson'}>
                    {ind.isActive ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/industries/${ind.id}`} className="text-cobalt hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
