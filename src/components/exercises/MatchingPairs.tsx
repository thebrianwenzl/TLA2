'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { MatchingExercise, TermWithProgress } from '@/types';
import { XP_PER_EXERCISE } from '@/lib/xp';

interface MatchingPairsProps {
  exercise: MatchingExercise;
  onResult: (correct: boolean, xp: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchingPairs({ exercise, onResult }: MatchingPairsProps) {
  const { terms } = exercise;
  const [defs] = useState(() => shuffle(terms));
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const [xpDeductions, setXpDeductions] = useState(0);

  function handleTermClick(termId: string) {
    if (matched.has(termId)) return;
    setSelectedTerm(termId === selectedTerm ? null : termId);
  }

  function handleDefClick(termId: string) {
    if (!selectedTerm || matched.has(termId)) return;

    if (selectedTerm === termId) {
      const next = new Set(matched).add(termId);
      setMatched(next);
      setSelectedTerm(null);
      setWrongPair(null);

      if (next.size === terms.length) {
        const xp = Math.max(0, XP_PER_EXERCISE.matching * terms.length - xpDeductions);
        onResult(true, xp);
      }
    } else {
      setWrongPair(selectedTerm);
      setXpDeductions((d) => d + 2);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedTerm(null);
      }, 600);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-body text-gold/70 text-sm uppercase tracking-widest text-center">
        Match the term to its definition
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Terms column */}
        <div className="flex flex-col gap-2">
          {terms.map((t) => {
            const isMatched = matched.has(t.id);
            const isSelected = selectedTerm === t.id;
            const isWrong = wrongPair === t.id;

            return (
              <motion.button
                key={t.id}
                onClick={() => handleTermClick(t.id)}
                animate={isWrong ? { x: [0, -6, 6, -6, 0] } : {}}
                transition={{ duration: 0.3 }}
                className={clsx(
                  'px-3 py-3 rounded-lg border font-mono text-sm font-semibold text-left transition-all duration-150',
                  isMatched && 'bg-gold/20 border-gold text-gold cursor-default',
                  isSelected && !isMatched && 'bg-cobalt/40 border-cobalt text-ivory scale-105',
                  isWrong && 'bg-crimson/30 border-crimson text-crimson',
                  !isMatched && !isSelected && !isWrong && 'bg-obsidian/60 border-gold/20 text-ivory hover:border-gold/50 cursor-pointer'
                )}
              >
                {t.term}
              </motion.button>
            );
          })}
        </div>

        {/* Definitions column */}
        <div className="flex flex-col gap-2">
          {defs.map((t) => {
            const isMatched = matched.has(t.id);

            return (
              <motion.button
                key={t.id}
                onClick={() => handleDefClick(t.id)}
                className={clsx(
                  'px-3 py-3 rounded-lg border font-body text-xs text-left transition-all duration-150 leading-snug',
                  isMatched && 'bg-gold/20 border-gold text-gold/80 cursor-default',
                  !isMatched && selectedTerm && 'border-cobalt/50 text-ivory/80 hover:bg-cobalt/20 cursor-pointer',
                  !isMatched && !selectedTerm && 'bg-obsidian/40 border-gold/10 text-ivory/60 cursor-default'
                )}
              >
                {t.definition}
              </motion.button>
            );
          })}
        </div>
      </div>

      {xpDeductions > 0 && (
        <p className="text-center text-xs font-body text-crimson">
          −{xpDeductions} XP from incorrect taps
        </p>
      )}
    </div>
  );
}
