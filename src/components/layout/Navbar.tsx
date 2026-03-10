'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-charcoal border-b border-white/8 sticky top-0 z-40">
      <div className="max-w-8xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Bold wordmark — Paul Rand would approve */}
        <Link href="/" className="font-display text-2xl font-bold text-gold tracking-tight hover:opacity-80 transition-opacity">
          TLA
        </Link>

        <div className="flex items-center gap-5">
          {session?.user ? (
            <>
              {session.user.isAdmin && (
                <Link
                  href="/admin"
                  className="font-body text-sm text-ivory/50 hover:text-ivory transition-colors"
                >
                  Admin
                </Link>
              )}
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'User'}
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-gold/40"
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="font-body text-sm text-ivory/50 hover:text-ivory transition-colors"
              >
                Sign out
              </button>
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
