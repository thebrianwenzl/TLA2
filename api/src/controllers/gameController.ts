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