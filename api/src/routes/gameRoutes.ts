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