'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Flashcard from './Flashcard';
import MultipleChoice from './MultipleChoice';
import FillBlank from './FillBlank';
import MatchingPairs from './MatchingPairs';
import ArtDecoFrame from '@/components/ui/ArtDecoFrame';
import Button from '@/components/ui/Button';
import type { Exercise, ExerciseResult } from '@/types';

interface ExerciseShellProps {
  exercises: Exercise[];
  industrySlug: string;
  industryName: string;
}

type Phase = 'exercise' | 'complete' | 'levelup';

export default function ExerciseShell({ exercises, industrySlug, industryName }: ExerciseShellProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [phase, setPhase] = useState<Phase>('exercise');
  const [saving, setSaving] = useState(false);

  const current = exercises[index];

  const handleResult = useCallback(
    async (correct: boolean, xpEarned: number) => {
      const ex = exercises[index];
      const termId =
        ex.type === 'matching'
          ? ex.terms[0].id // matching logs as first term; individual results track in results[]
          : ex.term.id;

      const newResult: ExerciseResult = {
        termId,
        exerciseType: ex.type,
        correct,
        xpEarned,
      };

      // For matching, add a result per term
      const newResults =
        ex.type === 'matching'
          ? ex.terms.map((t) => ({
              termId: t.id,
              exerciseType: 'matching' as const,
              correct,
              xpEarned: xpEarned / ex.terms.length,
            }))
          : [newResult];

      const nextResults = [...results, ...newResults];
      const nextXp = totalXp + xpEarned;
      setResults(nextResults);
      setTotalXp(nextXp);

      const isLast = index === exercises.length - 1;
      if (isLast) {
        setSaving(true);
        try {
          await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              industryId: exercises[0].type === 'matching'
                ? exercises[0].terms[0].industryId
                : (exercises[0] as { term: { industryId: string } }).term.industryId,
              xpEarned: nextXp,
              results: nextResults,
            }),
          });
        } catch {
          // Non-fatal — progress save failure shouldn't block completion screen
        } finally {
          setSaving(false);
        }
        setPhase('complete');
      } else {
        setTimeout(() => setIndex((i) => i + 1), 400);
      }
    },
    [index, exercises, results, totalXp]
  );

  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm w-full"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="font-display text-4xl text-gold mb-2">Lesson Complete!</h1>
          <p className="font-body text-ivory/70 mb-6">
            You earned <span className="text-gold font-semibold">{totalXp} XP</span> this session.
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="primary" size="lg" onClick={() => router.push(`/learn/${industrySlug}`)}>
              Back to {industryName}
            </Button>
            <Button variant="ghost" onClick={() => {
              setIndex(0);
              setTotalXp(0);
              setResults([]);
              setPhase('exercise');
            }}>
              Practice Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const progress = ((index) / exercises.length) * 100;

  return (
    <div className="min-h-screen bg-obsidian flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between max-w-lg mx-auto w-full">
        <button
          onClick={() => router.push(`/learn/${industrySlug}`)}
          className="text-gold/60 hover:text-gold transition-colors font-body text-sm"
        >
          ✕ Exit
        </button>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {exercises.map((_, i) => (
            <div
              key={i}
              className={clsx(
                'w-2 h-2 rounded-full transition-all duration-300',
                i < index ? 'bg-gold' : i === index ? 'bg-gold/60' : 'bg-gold/20'
              )}
            />
          ))}
        </div>

        <p className="font-body text-gold text-sm font-semibold">{totalXp} XP</p>
      </div>

      {/* Exercise area */}
      <div className="flex-1 flex items-center justify-center px-6 pb-8">
        <div className="w-full max-w-lg">
          <ArtDecoFrame variant="exercise" className="bg-obsidian/50">
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  {current.type === 'flashcard' && (
                    <Flashcard exercise={current} onResult={handleResult} />
                  )}
                  {current.type === 'mcq' && (
                    <MultipleChoice exercise={current} onResult={handleResult} />
                  )}
                  {current.type === 'fill_blank' && (
                    <FillBlank exercise={current} onResult={handleResult} />
                  )}
                  {current.type === 'matching' && (
                    <MatchingPairs exercise={current} onResult={handleResult} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </ArtDecoFrame>
        </div>
      </div>
    </div>
  );
}
