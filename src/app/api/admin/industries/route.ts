import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) throw new Error('Forbidden');
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const industry = await prisma.industry.create({ data: body });
    return Response.json(industry, { status: 201 });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 403 });
  }
}
