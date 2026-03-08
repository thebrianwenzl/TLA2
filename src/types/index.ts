import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    isAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
  }
}

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export interface Term {
  id: string;
  industryId: string;
  term: string;
  fullForm: string | null;
  definition: string;
  exampleJargon: string;
  examplePlain: string;
  difficulty: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  industryId: string;
  xp: number;
  level: number;
  streak: number;
  lastPracticeDate: Date | null;
}

export interface UserTermProgress {
  id: string;
  userId: string;
  termId: string;
  correct: number;
  incorrect: number;
  mastered: boolean;
  lastSeen: Date | null;
}

// ─── Exercise Types ───────────────────────────────────────────────────────────

export type ExerciseType = 'flashcard' | 'mcq' | 'fill_blank' | 'matching';

export interface TermWithProgress extends Term {
  progress?: UserTermProgress;
}

export interface FlashcardExercise {
  type: 'flashcard';
  term: TermWithProgress;
}

export interface MCQExercise {
  type: 'mcq';
  term: TermWithProgress;
  options: string[]; // 4 definitions, correct one included
  correctIndex: number;
}

export interface FillBlankExercise {
  type: 'fill_blank';
  term: TermWithProgress;
}

export interface MatchingExercise {
  type: 'matching';
  terms: TermWithProgress[]; // exactly 4
}

export type Exercise =
  | FlashcardExercise
  | MCQExercise
  | FillBlankExercise
  | MatchingExercise;

// ─── API Payloads ─────────────────────────────────────────────────────────────

export interface ExerciseResult {
  termId: string;
  exerciseType: ExerciseType;
  correct: boolean;
  xpEarned: number;
}

export interface ProgressPostBody {
  industryId: string;
  xpEarned: number;
  results: ExerciseResult[];
}
