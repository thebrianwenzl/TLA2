import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateTerm } from '@/lib/termGenerator';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { term, industryName } = await req.json();
  if (!term || !industryName) {
    return Response.json({ error: 'term and industryName are required' }, { status: 400 });
  }

  try {
    const result = await generateTerm(term, industryName);
    return Response.json(result);
  } catch {
    return Response.json(
      { error: 'Generation failed — please fill in fields manually.' },
      { status: 500 }
    );
  }
}
