'use client';

import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-obsidian flex items-stretch">
      {/* Left panel — bold yellow brand block */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gold w-1/2 p-16">
        <div className="font-display font-bold text-obsidian leading-none mb-8"
          style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}>
          TLA
        </div>
        <div className="w-12 h-1 bg-obsidian mb-8" />
        <p className="font-display font-bold text-obsidian text-2xl text-center leading-snug max-w-xs">
          Learn the language.<br />Own the room.
        </p>
      </div>

      {/* Right panel — clean sign-in */}
      <div className="flex flex-col justify-center items-center flex-1 px-6 py-16">
        {/* Mobile wordmark */}
        <div className="md:hidden font-display font-bold text-gold text-6xl mb-10">TLA</div>

        <div className="w-full max-w-sm">
          <h2 className="font-display font-bold text-ivory text-3xl mb-2">Sign in</h2>
          <p className="font-body text-ivory/40 text-sm mb-10">
            Master industry jargon with spaced repetition.
          </p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-body font-semibold text-sm px-6 py-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="font-body text-ivory/20 text-xs text-center mt-8">
            Free to use · No credit card required
          </p>
        </div>
      </div>
    </main>
  );
}
