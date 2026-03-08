import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) redirect('/');

  return (
    <div className="min-h-screen bg-ivory">
      <nav className="bg-obsidian border-b border-gold/20 px-6 py-3 flex gap-6">
        <Link href="/admin" className="font-display text-gold text-xl">TLA Admin</Link>
        <Link href="/admin/industries" className="font-body text-sm text-ivory/70 hover:text-gold transition-colors self-center">Industries</Link>
        <Link href="/admin/terms" className="font-body text-sm text-ivory/70 hover:text-gold transition-colors self-center">Terms</Link>
        <Link href="/" className="font-body text-sm text-ivory/40 hover:text-ivory transition-colors self-center ml-auto">← App</Link>
      </nav>
      <main className="p-8">{children}</main>
    </div>
  );
}
