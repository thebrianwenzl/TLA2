'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import type { FlashcardExercise } from '@/types';

interface FlashcardProps {
  exercise: FlashcardExercise;
  onFlipped: (flipped: boolean) => void;
}

export default function Flashcard({ exercise, onFlipped }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const { term } = exercise;

  function handleFlip() {
    const next = !flipped;
    setFlipped(next);
    onFlipped(next);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card with 3D flip */}
      <div
        className="w-full max-w-sm h-56 cursor-pointer select-none"
        style={{ perspective: 1000 }}
        onClick={handleFlip}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full h-full"
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-obsidian border border-gold/30 shadow-xl p-6"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-gold/60 text-xs font-body uppercase tracking-widest mb-3">Tap to reveal</p>
            <p className="font-mono text-4xl font-semibold text-gold text-center break-all">{term.term}</p>
            {term.difficulty && (
              <Badge
                variant={term.difficulty === 1 ? 'cobalt' : term.difficulty === 2 ? 'gold' : 'crimson'}
                className="mt-4"
              >
                {term.difficulty === 1 ? 'Beginner' : term.difficulty === 2 ? 'Intermediate' : 'Advanced'}
              </Badge>
            )}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col justify-center rounded-lg bg-parchment border border-gold/30 shadow-xl p-6 overflow-y-auto"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {term.fullForm && (
              <p className="font-body text-cobalt text-sm font-semibold mb-1">{term.fullForm}</p>
            )}
            <p className="font-body text-charcoal text-base mb-3">{term.definition}</p>
            <p className="font-body text-charcoal/70 text-sm italic border-l-2 border-gold pl-3">
              &ldquo;{term.exampleJargon}&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
