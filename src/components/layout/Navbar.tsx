'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full border-b border-gold/20 bg-obsidian/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl text-gold tracking-wide hover:opacity-80 transition-opacity">
          TLA
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              {session.user.isAdmin && (
                <Link href="/admin" className="font-body text-sm text-gold/70 hover:text-gold transition-colors">
                  Admin
                </Link>
              )}
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'User'}
                  width={32}
                  height={32}
                  className="rounded-full border border-gold/30"
                />
              )}
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/signin">
              <Button variant="primary" size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
