# TLA Project - Phase 4 Implementation Instructions

## Overview
**Goal**: Implement the core game engine with challenge system, game mechanics, and one complete game type (FourChoicesOneWord) with full session management and progress tracking.

**Duration**: 5-6 days  
**Complexity**: High  
**Dependencies**: Phase 3 completed (mobile app shell with TLA visual design, authentication, and subject management functional)

## Phase 4 Objectives

### Primary Goals
1. **Challenge Database Schema**: Implement complete challenge and game session tables with relationships
2. **Game Session Management**: Full session lifecycle from start to completion with progress tracking
3. **Challenge System**: Challenge loading, answer validation, and attempt tracking
4. **FourChoicesOneWord Game**: Complete implementation of the primary game type with TLA visual design
5. **Timer System**: Countdown timer with visual feedback and automatic submission
6. **XP and Progress System**: Experience point calculation, awarding, and progress persistence
7. **Game UI Components**: TLA-styled game screens with character illustrations and feedback animations
8. **Session Results**: Comprehensive results screen with performance metrics and next steps

### Success Metrics
- Users can start a game session from subject detail screen
- FourChoicesOneWord game fully functional with timer and feedback
- Challenge attempts tracked and validated correctly
- XP system awards points and updates user progress
- Session completion shows results and updates subject progress
- Game screens follow TLA visual design with character illustrations
- Progress persists between app sessions
- Error handling and loading states throughout game flow

## Technology Stack Additions

### Backend Dependencies (API)
```bash
cd api

# No new dependencies needed - using existing Prisma, Express, JWT setup
# Verify existing dependencies are sufficient:
# - @prisma/client (database operations)
# - express (API endpoints)
# - jsonwebtoken (session authentication)
# - zod (input validation)
```

### Mobile Dependencies
```bash
cd mobile

# Timer and animation support
npm install react-native-countdown-circle-timer
npm install lottie-react-native
npm install react-native-sound --save

# Additional UI components for games
npm install react-native-progress
npm install react-native-confetti-cannon

# Development dependencies
npm install @types/react-native-sound --save-dev

# iOS linking for sound and animations
cd ios && pod install && cd ..
```

## Database Schema Implementation

### Challenge Tables

**Update `api/prisma/schema.prisma` with new models:**

```prisma
// Add to existing schema.prisma

// Challenge definitions
model Challenge {
  id              String   @id @default(cuid())
  subjectId       String
  level           Int      // 1-5 difficulty level
  type            String   // 'FourChoicesOneWord', 'ReverseDefinitions', etc.
  prompt          String   // Question or instruction text
  correctAnswer   String   // The correct answer
  distractors     Json?    // Array of incorrect options for multiple choice
  timeLimit       Int      @default(120) // seconds
  xpReward        Int      @default(10)
  difficultyLevel Int      @default(1)
  challengeData   Json?    // Additional structured data for complex game types
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relationships
  subject         Subject           @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  attempts        ChallengeAttempt[]

  @@map("challenges")
}

// Game session tracking
model GameSession {
  id               String   @id @default(cuid())
  userId           String
  subjectId        String
  sessionType      String   // 'main_path' or 'practice'
  startedAt        DateTime @default(now())
  completedAt      DateTime?
  totalChallenges  Int?
  correctAnswers   Int      @default(0)
  xpEarned         Int      @default(0)
  sessionData      Json?    // Additional session metrics
  isCompleted      Boolean  @default(false)

  // Relationships
  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  subject          Subject           @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  attempts         ChallengeAttempt[]

  @@map("game_sessions")
}

// Individual challenge attempts within sessions
model ChallengeAttempt {
  id           String   @id @default(cuid())
  sessionId    String
  challengeId  String
  userAnswer   String
  isCorrect    Boolean
  timeTaken    Int?     // milliseconds
  xpEarned     Int      @default(0)
  attemptedAt  DateTime @default(now())

  // Relationships
  session      GameSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  challenge    Challenge   @relation(fields: [challengeId], references: [id], onDelete: Cascade)

  @@map("challenge_attempts")
}

// Update existing User model to include game sessions
model User {
  // ... existing fields ...
  
  // Add new relationship
  gameSessions GameSession[]
  
  // ... rest of existing model ...
}

// Update existing Subject model to include challenges and sessions
model Subject {
  // ... existing fields ...
  
  // Add new relationships
  challenges   Challenge[]
  gameSessions GameSession[]
  
  // ... rest of existing model ...
}
```

### Database Migration and Seeding

**Create migration:**
```bash
cd api
npx prisma migrate dev --name "phase4-game-engine-schema"
```

**Update `api/prisma/seed.ts` with challenge data:**
```typescript
// Add to existing seed.ts file

async function seedChallenges() {
  console.log('🎮 Seeding challenges...');

  // Get existing subjects
  const techSubject = await prisma.subject.findFirst({ where: { name: 'Technology' } });
  const medicalSubject = await prisma.subject.findFirst({ where: { name: 'Medical' } });
  const businessSubject = await prisma.subject.findFirst({ where: { name: 'Business' } });

  if (!techSubject || !medicalSubject || !businessSubject) {
    throw new Error('Subjects not found. Run Phase 2 seed first.');
  }

  // Technology challenges
  const techChallenges = [
    {
      subjectId: techSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does API stand for?',
      correctAnswer: 'Application Programming Interface',
      distractors: [
        'Advanced Programming Interface',
        'Application Process Integration',
        'Automated Programming Instructions'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 1,
    },
    {
      subjectId: techSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does SQL stand for?',
      correctAnswer: 'Structured Query Language',
      distractors: [
        'Simple Query Language',
        'Standard Query Logic',
        'System Query Language'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 2,
    },
    {
      subjectId: techSubject.id,
      level: 2,
      type: 'FourChoicesOneWord',
      prompt: 'What does REST stand for?',
      correctAnswer: 'Representational State Transfer',
      distractors: [
        'Remote State Transfer',
        'Reliable State Transmission',
        'Resource State Transfer'
      ],
      timeLimit: 45,
      xpReward: 15,
      difficultyLevel: 3,
    },
  ];

  // Medical challenges
  const medicalChallenges = [
    {
      subjectId: medicalSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does CPR stand for?',
      correctAnswer: 'Cardiopulmonary Resuscitation',
      distractors: [
        'Cardiac Pressure Relief',
        'Circulatory Pulse Restoration',
        'Cardiovascular Pressure Response'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 1,
    },
    {
      subjectId: medicalSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does MRI stand for?',
      correctAnswer: 'Magnetic Resonance Imaging',
      distractors: [
        'Medical Radiology Imaging',
        'Molecular Resonance Inspection',
        'Multiple Range Imaging'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 2,
    },
  ];

  // Business challenges
  const businessChallenges = [
    {
      subjectId: businessSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does ROI stand for?',
      correctAnswer: 'Return on Investment',
      distractors: [
        'Rate of Interest',
        'Revenue Operations Index',
        'Risk Operations Indicator'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 1,
    },
    {
      subjectId: businessSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does KPI stand for?',
      correctAnswer: 'Key Performance Indicator',
      distractors: [
        'Key Process Integration',
        'Knowledge Performance Index',
        'Key Productivity Indicator'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 2,
    },
  ];

  // Insert all challenges
  const allChallenges = [...techChallenges, ...medicalChallenges, ...businessChallenges];
  
  for (const challenge of allChallenges) {
    await prisma.challenge.create({ data: challenge });
  }

  console.log(`✅ Created ${allChallenges.length} challenges`);
}

// Update main() function to include challenge seeding
async function main() {
  // ... existing seed code ...
  
  // Add challenge seeding
  await seedChallenges();
  
  console.log('✅ Database seeded successfully with Phase 4 data!');
}
```

## API Implementation

### Game Session Controller

**Create `api/src/controllers/gameController.ts`:**
```typescript
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class GameController {
  // Start a new game session
  static async startSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { subjectId, sessionType = 'main_path' } = req.body;
      const userId = req.userId!;

      // Validate subject exists
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: {
          challenges: {
            where: { isActive: true },
            orderBy: [{ level: 'asc' }, { difficultyLevel: 'asc' }],
          },
        },
      });

      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      if (subject.challenges.length === 0) {
        return res.status(400).json({ error: 'No challenges available for this subject' });
      }

      // Create new game session
      const session = await prisma.gameSession.create({
        data: {
          userId,
          subjectId,
          sessionType,
          totalChallenges: Math.min(5, subject.challenges.length), // Limit to 5 challenges per session
          sessionData: {
            challengeIds: subject.challenges.slice(0, 5).map(c => c.id),
            currentChallengeIndex: 0,
          },
        },
        include: {
          subject: {
            select: { name: true, description: true },
          },
        },
      });

      // Get first challenge
      const firstChallenge = subject.challenges[0];
      
      res.status(201).json({
        message: 'Game session started successfully',
        session: {
          id: session.id,
          subjectId: session.subjectId,
          subjectName: session.subject.name,
          sessionType: session.sessionType,
          totalChallenges: session.totalChallenges,
          currentChallenge: 0,
          startedAt: session.startedAt,
        },
        challenge: {
          id: firstChallenge.id,
          type: firstChallenge.type,
          prompt: firstChallenge.prompt,
          options: [
            firstChallenge.correctAnswer,
            ...(firstChallenge.distractors as string[] || []),
          ].sort(() => Math.random() - 0.5), // Randomize order
          timeLimit: firstChallenge.timeLimit,
          xpReward: firstChallenge.xpReward,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get session details
  static async getSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const userId = req.userId!;

      const session = await prisma.gameSession.findFirst({
        where: { id: sessionId, userId },
        include: {
          subject: {
            select: { name: true, description: true },
          },
          attempts: {
            include: {
              challenge: {
                select: { prompt: true, correctAnswer: true, xpReward: true },
              },
            },
            orderBy: { attemptedAt: 'asc' },
          },
        },
      });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.json({ session });
    } catch (error) {
      next(error);
    }
  }

  // Submit challenge attempt
  static async submitAttempt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId, challengeId } = req.params;
      const { userAnswer, timeTaken } = req.body;
      const userId = req.userId!;

      // Validate session belongs to user
      const session = await prisma.gameSession.findFirst({
        where: { id: sessionId, userId, isCompleted: false },
        include: {
          attempts: true,
        },
      });

      if (!session) {
        return res.status(404).json({ error: 'Active session not found' });
      }

      // Get challenge details
      const challenge = await prisma.challenge.findUnique({
        where: { id: challengeId },
      });

      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }

      // Check if already attempted
      const existingAttempt = session.attempts.find(a => a.challengeId === challengeId);
      if (existingAttempt) {
        return res.status(400).json({ error: 'Challenge already attempted' });
      }

      // Validate answer
      const isCorrect = userAnswer.trim().toLowerCase() === challenge.correctAnswer.trim().toLowerCase();
      const xpEarned = isCorrect ? challenge.xpReward : 0;

      // Create attempt record
      const attempt = await prisma.challengeAttempt.create({
        data: {
          sessionId,
          challengeId,
          userAnswer,
          isCorrect,
          timeTaken,
          xpEarned,
        },
      });

      // Update session progress
      const updatedSession = await prisma.gameSession.update({
        where: { id: sessionId },
        data: {
          correctAnswers: isCorrect ? session.correctAnswers + 1 : session.correctAnswers,
          xpEarned: session.xpEarned + xpEarned,
        },
      });

      // Get next challenge if available
      const sessionData = session.sessionData as any;
      const challengeIds = sessionData?.challengeIds || [];
      const currentIndex = sessionData?.currentChallengeIndex || 0;
      const nextIndex = currentIndex + 1;

      let nextChallenge = null;
      if (nextIndex < challengeIds.length) {
        const nextChallengeData = await prisma.challenge.findUnique({
          where: { id: challengeIds[nextIndex] },
        });

        if (nextChallengeData) {
          nextChallenge = {
            id: nextChallengeData.id,
            type: nextChallengeData.type,
            prompt: nextChallengeData.prompt,
            options: [
              nextChallengeData.correctAnswer,
              ...(nextChallengeData.distractors as string[] || []),
            ].sort(() => Math.random() - 0.5),
            timeLimit: nextChallengeData.timeLimit,
            xpReward: nextChallengeData.xpReward,
          };

          // Update session data with new index
          await prisma.gameSession.update({
            where: { id: sessionId },
            data: {
              sessionData: {
                ...sessionData,
                currentChallengeIndex: nextIndex,
              },
            },
          });
        }
      }

      res.json({
        message: 'Answer submitted successfully',
        result: {
          isCorrect,
          correctAnswer: challenge.correctAnswer,
          xpEarned,
          timeTaken,
        },
        session: {
          correctAnswers: updatedSession.correctAnswers,
          totalXP: updatedSession.xpEarned,
          challengesCompleted: session.attempts.length + 1,
          totalChallenges: session.totalChallenges,
        },
        nextChallenge,
      });
    } catch (error) {
      next(error);
    }
  }

  // Complete game session
  static async completeSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const userId = req.userId!;

      const session = await prisma.gameSession.findFirst({
        where: { id: sessionId, userId, isCompleted: false },
        include: {
          attempts: {
            include: {
              challenge: true,
            },
          },
          subject: {
            select: { name: true },
          },
        },
      });

      if (!session) {
        return res.status(404).json({ error: 'Active session not found' });
      }

      // Calculate final stats
      const totalAttempts = session.attempts.length;
      const correctAnswers = session.attempts.filter(a => a.isCorrect).length;
      const accuracy = totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0;
      const totalXP = session.attempts.reduce((sum, a) => sum + a.xpEarned, 0);

      // Complete the session
      const completedSession = await prisma.gameSession.update({
        where: { id: sessionId },
        data: {
          isCompleted: true,
          completedAt: new Date(),
          correctAnswers,
          xpEarned: totalXP,
          sessionData: {
            ...(session.sessionData as any),
            accuracy,
            completedChallenges: totalAttempts,
          },
        },
      });

      // Update user's total XP
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalXP: {
            increment: totalXP,
          },
        },
      });

      // Update user subject progress
      const userProgress = await prisma.userProgress.upsert({
        where: {
          userId_subjectId: {
            userId,
            subjectId: session.subjectId,
          },
        },
        update: {
          totalXP: {
            increment: totalXP,
          },
          lastStudied: new Date(),
        },
        create: {
          userId,
          subjectId: session.subjectId,
          totalXP,
          lastStudied: new Date(),
        },
      });

      res.json({
        message: 'Session completed successfully',
        results: {
          sessionId: completedSession.id,
          subjectName: session.subject.name,
          totalChallenges: totalAttempts,
          correctAnswers,
          accuracy: Math.round(accuracy),
          xpEarned: totalXP,
          completedAt: completedSession.completedAt,
          attempts: session.attempts.map(a => ({
            challengePrompt: a.challenge.prompt,
            userAnswer: a.userAnswer,
            correctAnswer: a.challenge.correctAnswer,
            isCorrect: a.isCorrect,
            xpEarned: a.xpEarned,
            timeTaken: a.timeTaken,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### Game Routes

**Create `api/src/routes/gameRoutes.ts`:**
```typescript
import { Router } from 'express';
import { GameController } from '../controllers/gameController';
import { validateBody, validateParams } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Validation schemas
const startSessionSchema = z.object({
  subjectId: z.string().cuid('Invalid subject ID'),
  sessionType: z.enum(['main_path', 'practice']).default('main_path'),
});

const submitAttemptSchema = z.object({
  userAnswer: z.string().min(1, 'Answer is required'),
  timeTaken: z.number().int().min(0).optional(),
});

const sessionIdSchema = z.object({
  sessionId: z.string().cuid('Invalid session ID'),
});

const challengeAttemptSchema = z.object({
  sessionId: z.string().cuid('Invalid session ID'),
  challengeId: z.string().cuid('Invalid challenge ID'),
});

// All game routes require authentication
router.use(authenticateToken);

// Game session management
router.post('/sessions/start', validateBody(startSessionSchema), GameController.startSession);
router.get('/sessions/:sessionId', validateParams(sessionIdSchema), GameController.getSession);
router.post('/sessions/:sessionId/complete', validateParams(sessionIdSchema), GameController.completeSession);

// Challenge attempts
router.post(
  '/sessions/:sessionId/challenges/:challengeId/attempt',
  validateParams(challengeAttemptSchema),
  validateBody(submitAttemptSchema),
  GameController.submitAttempt
);

export default router;
```

### Update Main App

**Update `api/src/app.ts` to include game routes:**
```typescript
// Add to existing imports
import gameRoutes from './routes/gameRoutes';

// Add to existing routes section
app.use('/api/game', gameRoutes);
```

## Mobile Game Implementation

### Game Store Slice

**Create `mobile/src/store/games/gamesSlice.ts`:**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Challenge {
  id: string;
  type: string;
  prompt: string;
  options: string[];
  timeLimit: number;
  xpReward: number;
}

interface GameSession {
  id: string;
  subjectId: string;
  subjectName: string;
  sessionType: 'main_path' | 'practice';
  totalChallenges: number;
  currentChallenge: number;
  startedAt: string;
}

interface ChallengeResult {
  isCorrect: boolean;
  correctAnswer: string;
  xpEarned: number;
  timeTaken?: number;
}

interface SessionResults {
  sessionId: string;
  subjectName: string;
  totalChallenges: number;
  correctAnswers: number;
  accuracy: number;
  xpEarned: number;
  completedAt: string;
  attempts: Array<{
    challengePrompt: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    xpEarned: number;
    timeTaken?: number;
  }>;
}

interface GamesState {
  currentSession: GameSession | null;
  currentChallenge: Challenge | null;
  lastResult: ChallengeResult | null;
  sessionResults: SessionResults | null;
  isLoading: boolean;
  error: string | null;
  timeRemaining: number;
  isTimerActive: boolean;
}

const initialState: GamesState = {
  currentSession: null,
  currentChallenge: null,
  lastResult: null,
  sessionResults: null,
  isLoading: false,
  error: null,
  timeRemaining: 0,
  isTimerActive: false,
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    // Session management
    startSessionRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.sessionResults = null;
    },
    startSessionSuccess: (state, action: PayloadAction<{ session: GameSession; challenge: Challenge }>) => {
      state.isLoading = false;
      state.currentSession = action.payload.session;
      state.currentChallenge = action.payload.challenge;
      state.timeRemaining = action.payload.challenge.timeLimit;
      state.isTimerActive = true;
      state.lastResult = null;
    },
    startSessionFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Challenge management
    submitAnswerRequest: (state) => {
      state.isLoading = true;
      state.isTimerActive = false;
    },
    submitAnswerSuccess: (state, action: PayloadAction<{
      result: ChallengeResult;
      nextChallenge?: Challenge;
      session: any;
    }>) => {
      state.isLoading = false;
      state.lastResult = action.payload.result;
      
      if (action.payload.nextChallenge) {
        state.currentChallenge = action.payload.nextChallenge;
        state.timeRemaining = action.payload.nextChallenge.timeLimit;
        state.isTimerActive = true;
      } else {
        state.currentChallenge = null;
        state.timeRemaining = 0;
        state.isTimerActive = false;
      }

      // Update session progress
      if (state.currentSession) {
        state.currentSession.currentChallenge = action.payload.session.challengesCompleted;
      }
    },
    submitAnswerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isTimerActive = false;
    },

    // Session completion
    completeSessionRequest: (state) => {
      state.isLoading = true;
    },
    completeSessionSuccess: (state, action: PayloadAction<SessionResults>) => {
      state.isLoading = false;
      state.sessionResults = action.payload;
      state.currentSession = null;
      state.currentChallenge = null;
      state.lastResult = null;
      state.timeRemaining = 0;
      state.isTimerActive = false;
    },
    completeSessionFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Timer management
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    stopTimer: (state) => {
      state.isTimerActive = false;
    },
    startTimer: (state) => {
      state.isTimerActive = true;
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
    },
    clearResults: (state) => {
      state.sessionResults = null;
      state.lastResult = null;
    },
    resetGame: (state) => {
      return initialState;
    },
  },
});

export const {
  startSessionRequest,
  startSessionSuccess,
  startSessionFailure,
  submitAnswerRequest,
  submitAnswerSuccess,
  submitAnswerFailure,
  completeSessionRequest,
  completeSessionSuccess,
  completeSessionFailure,
  updateTimer,
  stopTimer,
  startTimer,
  clearError,
  clearResults,
  resetGame,
} = gamesSlice.actions;

export default gamesSlice.reducer;
```

### Game API Slice

**Update `mobile/src/store/api/apiSlice.ts` with game endpoints:**
```typescript
// Add to existing apiSlice endpoints
export const apiSlice = createApi({
  // ... existing configuration ...
  endpoints: (builder) => ({
    // ... existing endpoints ...

    // Game endpoints
    startGameSession: builder.mutation<
      { session: any; challenge: any },
      { subjectId: string; sessionType?: 'main_path' | 'practice' }
    >({
      query: (data) => ({
        url: '/game/sessions/start',
        method: 'POST',
        body: data,
      }),
    }),

    getGameSession: builder.query<{ session: any }, string>({
      query: (sessionId) => `/game/sessions/${sessionId}`,
    }),

    submitChallengeAttempt: builder.mutation<
      { result: any; nextChallenge?: any; session: any },
      { sessionId: string; challengeId: string; userAnswer: string; timeTaken?: number }
    >({
      query: ({ sessionId, challengeId, ...data }) => ({
        url: `/game/sessions/${sessionId}/challenges/${challengeId}/attempt`,
        method: 'POST',
        body: data,
      }),
    }),

    completeGameSession: builder.mutation<
      { results: any },
      string
    >({
      query: (sessionId) => ({
        url: `/game/sessions/${sessionId}/complete`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  // ... existing hooks ...
  useStartGameSessionMutation,
  useGetGameSessionQuery,
  useSubmitChallengeAttemptMutation,
  useCompleteGameSessionMutation,
} = apiSlice;
```

### Game Screen Components

**Create `mobile/src/screens/games/GameScreen.tsx`:**
```typescript
import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Progress } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';

import { RootState } from '../../store';
import {
  startSessionRequest,
  startSessionSuccess,
  startSessionFailure,
  submitAnswerRequest,
  submitAnswerSuccess,
  submitAnswerFailure,
  completeSessionRequest,
  completeSessionSuccess,
  completeSessionFailure,
  updateTimer,
  stopTimer,
} from '../../store/games/gamesSlice';
import {
  useStartGameSessionM
utation,
  useGetGameSessionQuery,
  useSubmitChallengeAttemptMutation,
  useCompleteGameSessionMutation,
} from '../../store/api/apiSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CharacterIllustration from '../../components/common/CharacterIllustration';
import GameButton from '../../components/common/GameButton';
import Toast from 'react-native-toast-message';

const GameScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { subjectId } = route.params;
  
  const {
    currentSession,
    currentChallenge,
    lastResult,
    isLoading,
    error,
    timeRemaining,
    isTimerActive,
  } = useSelector((state: RootState) => state.games);

  const [startGameSession] = useStartGameSessionMutation();
  const [submitChallengeAttempt] = useSubmitChallengeAttemptMutation();
  const [completeGameSession] = useCompleteGameSessionMutation();

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  // Start game session on component mount
  useEffect(() => {
    handleStartSession();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch(updateTimer(timeRemaining - 1));
      }, 1000);
    } else if (timeRemaining === 0 && isTimerActive) {
      // Time's up - auto submit
      handleTimeUp();
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const handleStartSession = async () => {
    try {
      dispatch(startSessionRequest());
      const result = await startGameSession({ subjectId }).unwrap();
      dispatch(startSessionSuccess(result));
    } catch (error: any) {
      dispatch(startSessionFailure(error.data?.error || 'Failed to start game session'));
      Toast.show({
        type: 'error',
        text1: 'Game Start Failed',
        text2: error.data?.error || 'Unable to start the game. Please try again.',
      });
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (!showResult && !isLoading) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentSession || !currentChallenge) return;

    const timeTaken = (currentChallenge.timeLimit - timeRemaining) * 1000; // Convert to milliseconds

    try {
      dispatch(submitAnswerRequest());
      const result = await submitChallengeAttempt({
        sessionId: currentSession.id,
        challengeId: currentChallenge.id,
        userAnswer: selectedAnswer,
        timeTaken,
      }).unwrap();

      dispatch(submitAnswerSuccess(result));
      setShowResult(true);

      // Show result feedback
      Toast.show({
        type: result.result.isCorrect ? 'success' : 'error',
        text1: result.result.isCorrect ? 'Correct!' : 'Incorrect',
        text2: result.result.isCorrect 
          ? `+${result.result.xpEarned} XP` 
          : `Correct answer: ${result.result.correctAnswer}`,
      });

      // Auto-advance after showing result
      setTimeout(() => {
        if (result.nextChallenge) {
          setShowResult(false);
          setSelectedAnswer('');
        } else {
          handleCompleteSession();
        }
      }, 3000);

    } catch (error: any) {
      dispatch(submitAnswerFailure(error.data?.error || 'Failed to submit answer'));
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: error.data?.error || 'Unable to submit answer. Please try again.',
      });
    }
  };

  const handleTimeUp = async () => {
    dispatch(stopTimer());
    if (selectedAnswer) {
      await handleSubmitAnswer();
    } else {
      // Auto-submit with no answer
      setSelectedAnswer('');
      await handleSubmitAnswer();
    }
  };

  const handleCompleteSession = async () => {
    if (!currentSession) return;

    try {
      dispatch(completeSessionRequest());
      const result = await completeGameSession(currentSession.id).unwrap();
      dispatch(completeSessionSuccess(result.results));
      
      // Navigate to results screen
      navigation.replace('GameResults');
    } catch (error: any) {
      dispatch(completeSessionFailure(error.data?.error || 'Failed to complete session'));
      Toast.show({
        type: 'error',
        text1: 'Session Completion Failed',
        text2: error.data?.error || 'Unable to complete session. Please try again.',
      });
    }
  };

  if (isLoading && !currentChallenge) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center">
        <LoadingSpinner text="Starting game..." />
      </Box>
    );
  }

  if (error && !currentChallenge) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center" px={6}>
        <ErrorMessage
          message={error}
          onRetry={handleStartSession}
        />
      </Box>
    );
  }

  if (!currentChallenge || !currentSession) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center">
        <Text>No challenge available</Text>
      </Box>
    );
  }

  const progressPercentage = ((currentSession.currentChallenge + 1) / currentSession.totalChallenges) * 100;

  return (
    <Box flex={1} bg="background.50" safeArea>
      <VStack space={6} px={6} py={8} flex={1}>
        {/* Header with Progress */}
        <VStack space={4}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              {currentSession.subjectName}
            </Text>
            <Text fontSize="md" color="gray.600">
              {currentSession.currentChallenge + 1} of {currentSession.totalChallenges}
            </Text>
          </HStack>
          
          <Progress 
            value={progressPercentage} 
            colorScheme="orange" 
            size="sm" 
            rounded="full"
          />
        </VStack>

        {/* Timer */}
        <HStack justifyContent="center" alignItems="center" space={2}>
          <Text fontSize="2xl" fontWeight="bold" color={timeRemaining <= 10 ? "error.500" : "primary.500"}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </Text>
        </HStack>

        {/* Character Illustration */}
        <Box alignItems="center">
          <CharacterIllustration type="teacher-male" size={100} />
        </Box>

        {/* Challenge Content */}
        <VStack space={6} flex={1}>
          {/* Question */}
          <Box bg="white" p={6} rounded="xl" shadow={2}>
            <Text fontSize="lg" fontWeight="medium" textAlign="center" color="gray.800">
              {currentChallenge.prompt}
            </Text>
          </Box>

          {/* Answer Options */}
          <VStack space={3} flex={1}>
            {currentChallenge.options.map((option, index) => (
              <GameButton
                key={index}
                title={option}
                onPress={() => handleAnswerSelect(option)}
                isSelected={selectedAnswer === option}
                isDisabled={showResult || isLoading}
                variant={
                  showResult && lastResult
                    ? option === lastResult.correctAnswer
                      ? 'primary'
                      : selectedAnswer === option && !lastResult.isCorrect
                      ? 'error'
                      : 'option'
                    : 'option'
                }
              />
            ))}
          </VStack>

          {/* Submit Button */}
          {!showResult && (
            <GameButton
              title={isLoading ? 'Submitting...' : 'Submit Answer'}
              onPress={handleSubmitAnswer}
              isDisabled={!selectedAnswer || isLoading}
              variant="primary"
            />
          )}

          {/* Result Display */}
          {showResult && lastResult && (
            <Box bg={lastResult.isCorrect ? "success.50" : "error.50"} p={4} rounded="lg">
              <VStack space={2} alignItems="center">
                <Text 
                  fontSize="lg" 
                  fontWeight="bold" 
                  color={lastResult.isCorrect ? "success.600" : "error.600"}
                >
                  {lastResult.isCorrect ? 'Correct!' : 'Incorrect'}
                </Text>
                {!lastResult.isCorrect && (
                  <Text fontSize="md" color="gray.700" textAlign="center">
                    Correct answer: {lastResult.correctAnswer}
                  </Text>
                )}
                {lastResult.xpEarned > 0 && (
                  <Text fontSize="md" color="primary.600" fontWeight="medium">
                    +{lastResult.xpEarned} XP
                  </Text>
                )}
              </VStack>
            </Box>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default GameScreen;
```

### Game Results Screen

**Create `mobile/src/screens/games/GameResultsScreen.tsx`:**
```typescript
import React from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Progress,
  Divider,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootState } from '../../store';
import { clearResults } from '../../store/games/gamesSlice';
import CharacterIllustration from '../../components/common/CharacterIllustration';
import ConfettiCannon from 'react-native-confetti-cannon';

const GameResultsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { sessionResults } = useSelector((state: RootState) => state.games);

  if (!sessionResults) {
    navigation.replace('Subjects');
    return null;
  }

  const handleContinue = () => {
    dispatch(clearResults());
    navigation.navigate('Subjects');
  };

  const handlePlayAgain = () => {
    dispatch(clearResults());
    navigation.replace('Game', { subjectId: sessionResults.sessionId });
  };

  const getPerformanceMessage = () => {
    if (sessionResults.accuracy >= 80) return "Excellent work!";
    if (sessionResults.accuracy >= 60) return "Good job!";
    if (sessionResults.accuracy >= 40) return "Keep practicing!";
    return "Don't give up!";
  };

  const getCharacterType = () => {
    if (sessionResults.accuracy >= 80) return "business-person-female";
    if (sessionResults.accuracy >= 60) return "teacher-female";
    return "student-male";
  };

  return (
    <Box flex={1} bg="background.50" safeArea>
      {sessionResults.accuracy >= 80 && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          fadeOut={true}
        />
      )}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={8} p={6}>
          {/* Header */}
          <VStack space={6} alignItems="center" mt={4}>
            <CharacterIllustration type={getCharacterType()} size={120} />
            
            <VStack alignItems="center" space={2}>
              <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="gray.800">
                Session Complete!
              </Text>
              <Text fontSize="lg" color="gray.600" textAlign="center">
                {sessionResults.subjectName}
              </Text>
              <Text fontSize="md" color="primary.600" fontWeight="medium">
                {getPerformanceMessage()}
              </Text>
            </VStack>
          </VStack>

          <Divider />

          {/* Performance Stats */}
          <VStack space={6}>
            <Text fontSize="lg" fontWeight="semibold">Performance Summary</Text>
            
            {/* Accuracy */}
            <VStack space={2}>
              <HStack justifyContent="space-between">
                <Text color="gray.600">Accuracy</Text>
                <Text color="gray.800" fontWeight="medium">{sessionResults.accuracy}%</Text>
              </HStack>
              <Progress 
                value={sessionResults.accuracy} 
                colorScheme={sessionResults.accuracy >= 80 ? "green" : sessionResults.accuracy >= 60 ? "orange" : "red"}
                size="sm" 
                rounded="full"
              />
            </VStack>

            {/* Stats Grid */}
            <HStack space={4}>
              <VStack flex={1} alignItems="center" space={1} bg="white" p={4} rounded="lg" shadow={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                  {sessionResults.correctAnswers}
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Correct Answers
                </Text>
              </VStack>
              
              <VStack flex={1} alignItems="center" space={1} bg="white" p={4} rounded="lg" shadow={1}>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {sessionResults.xpEarned}
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  XP Earned
                </Text>
              </VStack>
              
              <VStack flex={1} alignItems="center" space={1} bg="white" p={4} rounded="lg" shadow={1}>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {sessionResults.totalChallenges}
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Total Questions
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <Divider />

          {/* Detailed Results */}
          <VStack space={4}>
            <Text fontSize="lg" fontWeight="semibold">Question Review</Text>
            
            {sessionResults.attempts.map((attempt, index) => (
              <Box key={index} bg="white" p={4} rounded="lg" shadow={1}>
                <VStack space={2}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="md" fontWeight="medium" flex={1}>
                      Q{index + 1}: {attempt.challengePrompt}
                    </Text>
                    <Icon 
                      name={attempt.isCorrect ? "check-circle" : "cancel"} 
                      size={24} 
                      color={attempt.isCorrect ? "#10B981" : "#EF4444"} 
                    />
                  </HStack>
                  
                  <VStack space={1}>
                    <Text fontSize="sm" color="gray.600">
                      Your answer: <Text color={attempt.isCorrect ? "success.600" : "error.600"}>
                        {attempt.userAnswer}
                      </Text>
                    </Text>
                    {!attempt.isCorrect && (
                      <Text fontSize="sm" color="gray.600">
                        Correct answer: <Text color="success.600">{attempt.correctAnswer}</Text>
                      </Text>
                    )}
                    {attempt.xpEarned > 0 && (
                      <Text fontSize="sm" color="primary.600">
                        +{attempt.xpEarned} XP
                      </Text>
                    )}
                  </VStack>
                </VStack>
              </Box>
            ))}
          </VStack>

          {/* Action Buttons */}
          <VStack space={3} mt={6}>
            <Button
              variant="solid"
              size="lg"
              onPress={handleContinue}
            >
              Continue Learning
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onPress={handlePlayAgain}
            >
              Play Again
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default GameResultsScreen;
```

### Update Store Configuration

**Update `mobile/src/store/index.ts` to include games slice:**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

import authSlice from './auth/authSlice';
import subjectsSlice from './subjects/subjectsSlice';
import progressSlice from './progress/progressSlice';
import gamesSlice from './games/gamesSlice'; // Add this import
import { apiSlice } from './api/apiSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authSlice,
  subjects: subjectsSlice,
  progress: progressSlice,
  games: gamesSlice, // Add this line
  api: apiSlice.reducer,
});

// ... rest of store configuration remains the same
```

### Update Navigation

**Update `mobile/src/navigation/SubjectsNavigator.tsx` to include game screens:**
```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SubjectsListScreen from '../screens/subjects/SubjectsListScreen';
import SubjectDetailScreen from '../screens/subjects/SubjectDetailScreen';
import GameScreen from '../screens/games/GameScreen'; // Add this import
import GameResultsScreen from '../screens/games/GameResultsScreen'; // Add this import

const Stack = createStackNavigator();

const SubjectsNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SubjectsList" component={SubjectsListScreen} />
      <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
      <Stack.Screen name="Game" component={GameScreen} /> {/* Add this line */}
      <Stack.Screen name="GameResults" component={GameResultsScreen} /> {/* Add this line */}
    </Stack.Navigator>
  );
};

export default SubjectsNavigator;
```

### Update Subject Detail Screen

**Update `mobile/src/screens/subjects/SubjectDetailScreen.tsx` to include game navigation:**
```typescript
// Update the action buttons section in SubjectDetailScreen.tsx

{/* Action Buttons */}
<VStack space={3} mt={6}>
  <Button
    variant="solid"
    size="lg"
    onPress={() => {
      navigation.navigate('Game', { subjectId: subject.id });
    }}
  >
    Start Learning
  </Button>
  
  <Button
    variant="outline"
    size="lg"
    onPress={() => {
      navigation.navigate('Game', { subjectId: subject.id, sessionType: 'practice' });
    }}
  >
    Practice Mode
  </Button>

  <Button
    variant="ghost"
    size="lg"
    onPress={() => {
      // TODO: Navigate to glossary view (future feature)
      console.log('View Glossary - Future feature');
    }}
  >
    View All Terms
  </Button>
</VStack>
```

## Implementation Steps

### Step 1: Database Schema Implementation
```bash
cd api

# Update Prisma schema with new models
# Add Challenge, GameSession, and ChallengeAttempt models to schema.prisma

# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name "phase4-game-engine-schema"

# Update seed file with challenge data
# Run seed to populate challenges
npx prisma db seed
```

### Step 2: API Implementation
```bash
# Create game controller and routes
mkdir -p src/controllers
mkdir -p src/routes

# Create the files:
# - src/controllers/gameController.ts
# - src/routes/gameRoutes.ts

# Update src/app.ts to include game routes

# Test API endpoints
npm run dev

# Test game session endpoints manually:
curl -X POST http://localhost:3000/api/game/sessions/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"subjectId":"SUBJECT_ID"}'
```

### Step 3: Mobile Game Implementation
```bash
cd mobile

# Install new dependencies
npm install react-native-countdown-circle-timer lottie-react-native react-native-sound
npm install react-native-progress react-native-confetti-cannon
npm install @types/react-native-sound --save-dev

# iOS linking
cd ios && pod install && cd ..

# Create game store slice and update store configuration
mkdir -p src/store/games

# Create game screens
mkdir -p src/screens/games

# Update navigation to include game screens
```

### Step 4: Game UI Components
```bash
# Create game-specific components
mkdir -p src/components/games

# Update existing components for game integration
# Test game flow end-to-end
```

### Step 5: Testing and Polish
```bash
# Test complete game flow:
# 1. Start session from subject detail
# 2. Play through challenges with timer
# 3. Submit answers and see feedback
# 4. Complete session and view results
# 5. Verify XP and progress updates

# Test error handling and edge cases
# Test timer functionality
# Test navigation between screens
```

## Acceptance Criteria

### Must Complete Successfully:
- [ ] Challenge database tables created with proper relationships
- [ ] Game session start/end API endpoints working
- [ ] Challenge loading and answer submission functional
- [ ] FourChoicesOneWord game fully implemented with TLA design
- [ ] Timer implementation with countdown and auto-submission
- [ ] Answer validation and immediate feedback working
- [ ] XP calculation and award system functional
- [ ] Session completion with results summary
- [ ] Progress persistence between sessions
- [ ] Game screens follow TLA visual design with character illustrations
- [ ] Error handling and loading states throughout game flow
- [ ] Navigation between game screens working smoothly

### Game Flow Testing:
1. **Session Start**: User can start game from subject detail screen
2. **Challenge Display**: Questions display with multiple choice options and timer
3. **Answer Selection**: User can select answers with visual feedback
4. **Answer Submission**: Answers submit correctly with validation
5. **Result Feedback**: Immediate feedback shows correct/incorrect with XP
6. **Challenge Progression**: Automatically advances to next challenge
7. **Session Completion**: Shows comprehensive results screen
8. **Progress Updates**: User XP and subject progress update correctly
9. **Navigation**: Can return to subjects or play again

### API Endpoints to Test:
```bash
# Start game session
POST /api/game/sessions/start
{
  "subjectId": "subject_id",
  "sessionType": "main_path"
}

# Submit challenge attempt
POST /api/game/sessions/:sessionId/challenges/:challengeId/attempt
{
  "userAnswer": "Application Programming Interface",
  "timeTaken": 15000
}

# Complete session
POST /api/game/sessions/:sessionId/complete

# Get session details
GET /api/game/sessions/:sessionId
```

### Performance Requirements:
- [ ] Game screens load within 2 seconds
- [ ] Timer accuracy within 100ms
- [ ] Smooth animations and transitions
- [ ] No memory leaks during extended play sessions
- [ ] Responsive design on different screen sizes

## Testing Strategy

### Manual Testing Checklist
1. **Game Session Flow**
   - Start session from subject detail screen
   - Verify first challenge loads with timer
   - Test answer selection and submission
   - Verify immediate feedback display
   - Test progression to next challenge
   - Complete full session and view results

2. **Timer Functionality**
   - Verify countdown timer displays correctly
   - Test auto-submission when timer reaches zero
   - Verify timer stops when answer is submitted
   - Test timer accuracy over multiple challenges

3. **TLA Design Integration**
   - Verify orange/cream color scheme in game screens
   - Test character illustrations display correctly
   - Verify game buttons follow TLA styling
   - Test responsive design on different screen sizes

4. **Error Handling**
   - Test network errors during session
   - Test invalid session/challenge IDs
   - Test app behavior when API is unavailable
   - Verify error messages follow TLA styling

5. **Progress Tracking**
   - Verify XP awards correctly for correct answers
   - Test user total XP updates after session
   - Verify subject progress updates
   - Test progress persistence across app restarts

### Automated Testing Setup
```bash
# API tests
cd api
npm test

# Mobile tests
cd mobile
npm test

# Integration tests
# Test game flow with mock API responses
# Test timer functionality
# Test Redux state management
```

## Security Considerations

### Game Session Security
- All game endpoints require JWT authentication
- Session validation ensures users can only access their own sessions
- Challenge answers validated server-side to prevent cheating
- XP awards calculated server-side to prevent manipulation

### Data Validation
- All user inputs validated with Zod schemas
- Challenge IDs and session IDs validated as proper CUIDs
- Time taken values validated for reasonable ranges
- Answer strings sanitized to prevent injection attacks

## Performance Optimization

### Database Performance
- Indexes on frequently queried fields (session_id, user_id, subject_id)
- Efficient challenge loading with proper joins
- Session data stored as JSONB for flexible querying
- Cleanup of old completed sessions (future enhancement)

### Mobile Performance
- Challenge data cached in Redux store
- Timer implemented with efficient state updates
- Animations optimized for smooth performance
- Memory management for long game sessions

## Deliverables Checklist

- [ ] Complete challenge database schema with relationships
- [ ] Game session management API endpoints
- [ ] Challenge attempt tracking and validation
- [ ] FourChoicesOneWord game implementation
- [ ] Timer system with visual countdown
- [ ] XP calculation and progress tracking
- [ ] Game screens with TLA visual design
- [ ] Character illustrations in game context
- [ ] Session results screen with detailed feedback
- [ ] Navigation integration with existing app
- [ ] Error handling and loading states
- [ ] Comprehensive testing of game flow
- [ ] API documentation for game endpoints
- [ ] Performance optimization implementation

## Next Steps (Phase 5 Preview)

After Phase 4 completion, Phase 5 will implement:
- Achievement and badge system
- Level progression mechanics within subjects
- Subject mastery detection and rewards
- Enhanced UI with animations and celebrations
- Practice mode with different challenge selection
- Daily streak tracking and notifications
- Additional game types beyond FourChoicesOneWord
- Social features and leaderboards

## Troubleshooting Guide

### Common Issues:

**Database Migration Problems:**
- Ensure Phase 2 schema is properly applied first
- Check for conflicting model names or relationships
- Verify Prisma client is regenerated after schema changes

**Game Session Issues:**
- Verify JWT token is properly included in API requests
- Check that challenges exist for the selected subject
- Ensure session state is properly managed in Redux

**Timer Problems:**
- Verify timer interval is properly cleared on component unmount
- Check for memory leaks with multiple timer instances
- Ensure timer state updates don't cause unnecessary re-renders

**Mobile Performance:**
- Monitor memory usage during extended game sessions
- Optimize image loading and caching
- Check for proper cleanup of event listeners and timers

### Debug Commands:
```bash
# Check database schema
cd api
npx prisma studio

# View challenge data
npx prisma db pull

# Test API endpoints
curl -X GET http://localhost:3000/api/subjects

# Check mobile logs
cd mobile
npx react-native log-ios
npx react-native log-android
```

## Support Resources

- **Prisma Documentation**: https://www.prisma.io/docs/
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **React Navigation**: https://reactnavigation.org/
- **NativeBase Components**: https://nativebase.io/
- **React Native Timer**: https://reactnative.dev/docs/timers

---

**Phase 4 Success Criteria**: Complete game engine with FourChoicesOneWord game type, session management, progress tracking, and TLA visual design integration. Users can play full game sessions with timer, feedback, and results.