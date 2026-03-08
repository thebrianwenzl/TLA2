'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { MCQExercise } from '@/types';
import { XP_PER_EXERCISE } from '@/lib/xp';

interface MultipleChoiceProps {
  exercise: MCQExercise;
  onResult: (correct: boolean, xp: number) => void;
}

type AnswerState = 'idle' | 'correct' | 'incorrect';

export default function MultipleChoice({ exercise, onResult }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<AnswerState>('idle');
  const { term, options, correctIndex } = exercise;

  function handleSelect(idx: number) {
    if (state !== 'idle') return;
    setSelected(idx);
    const correct = idx === correctIndex;
    setState(correct ? 'correct' : 'incorrect');
    setTimeout(() => onResult(correct, correct ? XP_PER_EXERCISE.mcq : 0), 1200);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="font-body text-gold/70 text-sm uppercase tracking-widest mb-2">What does this mean?</p>
        <p className="font-mono text-3xl font-semibold text-gold">{term.term}</p>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => {
          const isCorrect = idx === correctIndex;
          const isSelected = idx === selected;

          let bg = 'bg-obsidian/60 border-gold/20 text-ivory hover:bg-gold/10 hover:border-gold/50 cursor-pointer';
          if (state !== 'idle' && isCorrect) bg = 'bg-emerald-900/60 border-emerald-400 text-emerald-300';
          if (state !== 'idle' && isSelected && !isCorrect) bg = 'bg-crimson/30 border-crimson text-crimson animate-shake';

          return (
            <motion.button
              key={idx}
              onClick={() => handleSelect(idx)}
              whileTap={state === 'idle' ? { scale: 0.98 } : {}}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-lg border font-body text-sm transition-all duration-150',
                bg
              )}
            >
              <span className="font-semibold text-gold/60 mr-2">
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
            </motion.button>
          );
        })}
      </div>

      {state === 'incorrect' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm font-body text-ivory/70"
        >
          Correct answer: <span className="text-emerald-400">{options[correctIndex]}</span>
        </motion.p>
      )}
    </div>
  );
}
