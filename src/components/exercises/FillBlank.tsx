'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Button from '@/components/ui/Button';
import type { FillBlankExercise } from '@/types';
import { XP_PER_EXERCISE } from '@/lib/xp';

interface FillBlankProps {
  exercise: FillBlankExercise;
  onResult: (correct: boolean, xp: number) => void;
}

type State = 'idle' | 'correct' | 'incorrect';

function buildPrompt(exampleJargon: string, term: string): string {
  // Replace first occurrence of the term (case-insensitive) with _______
  const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  return exampleJargon.replace(regex, '_______');
}

export default function FillBlank({ exercise, onResult }: FillBlankProps) {
  const [value, setValue] = useState('');
  const [state, setState] = useState<State>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const { term } = exercise;

  const prompt = buildPrompt(term.exampleJargon, term.term);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state !== 'idle') return;

    const normalized = value.trim().toLowerCase();
    const answers = [term.term.toLowerCase()];
    if (term.fullForm) answers.push(term.fullForm.toLowerCase());

    const correct = answers.some((a) => a === normalized);
    setState(correct ? 'correct' : 'incorrect');
    onResult(correct, correct ? XP_PER_EXERCISE.fill_blank : 0);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="font-body text-gold/70 text-sm uppercase tracking-widest mb-2">Fill in the blank</p>
      </div>

      <p className="font-body text-ivory text-lg leading-relaxed text-center">
        {prompt.split('_______').map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <span
                className={clsx(
                  'inline-block min-w-[6rem] border-b-2 text-center font-mono font-semibold mx-1 px-2',
                  state === 'correct' && 'border-emerald-400 text-emerald-300',
                  state === 'incorrect' && 'border-crimson text-crimson',
                  state === 'idle' && 'border-gold text-gold'
                )}
              >
                {state !== 'idle' ? term.term : (value || '\u00A0')}
              </span>
            )}
          </span>
        ))}
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={state !== 'idle'}
          placeholder="Type the missing term…"
          className={clsx(
            'flex-1 bg-obsidian/60 border rounded-lg px-4 py-3 font-mono text-ivory placeholder-ivory/30 outline-none',
            'focus:border-gold transition-colors',
            state === 'correct' ? 'border-emerald-400' : state === 'incorrect' ? 'border-crimson' : 'border-gold/30'
          )}
          autoFocus
        />
        <Button type="submit" disabled={!value.trim() || state !== 'idle'}>
          Check
        </Button>
      </form>

      {state !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            'rounded-lg px-4 py-3 font-body text-sm',
            state === 'correct'
              ? 'bg-emerald-900/40 text-emerald-300'
              : 'bg-crimson/20 text-crimson'
          )}
        >
          {state === 'correct'
            ? `Correct! +${XP_PER_EXERCISE.fill_blank} XP`
            : `The answer was "${term.term}"${term.fullForm ? ` (${term.fullForm})` : ''}`}
        </motion.div>
      )}
    </div>
  );
}
