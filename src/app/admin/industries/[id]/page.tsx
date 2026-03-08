import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import IndustryForm from '@/components/admin/IndustryForm';

interface Props {
  params: { id: string };
}

export default async function EditIndustryPage({ params }: Props) {
  const isNew = params.id === 'new';
  const industry = isNew
    ? null
    : await prisma.industry.findUnique({ where: { id: params.id } });

  if (!isNew && !industry) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal mb-6">
        {isNew ? 'New Industry' : `Edit: ${industry!.name}`}
      </h1>
      <IndustryForm industry={industry ?? undefined} />
    </div>
  );
}
