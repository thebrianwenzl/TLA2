import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TermForm from '@/components/admin/TermForm';

interface Props {
  params: { id: string };
}

export default async function EditTermPage({ params }: Props) {
  const isNew = params.id === 'new';
  const industries = await prisma.industry.findMany({ orderBy: { name: 'asc' } });

  const term = isNew
    ? null
    : await prisma.term.findUnique({ where: { id: params.id } });

  if (!isNew && !term) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal mb-6">
        {isNew ? 'New Term' : `Edit: ${term!.term}`}
      </h1>
      <TermForm term={term ?? undefined} industries={industries} />
    </div>
  );
}
