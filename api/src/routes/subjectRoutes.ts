import { Router } from 'express';
import { SubjectController } from '../controllers/subjectController';
import { validateBody, validateParams } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { createSubjectSchema, updateSubjectSchema } from '../schemas/subjectSchemas';
import { z } from 'zod';

const router = Router();

const idSchema = z.object({ id: z.string().cuid() });

// Public routes
router.get('/', SubjectController.getAll);
router.get('/:id', validateParams(idSchema), SubjectController.getById);

// Protected routes (admin only - implement role-based auth later)
router.post('/', authenticateToken, validateBody(createSubjectSchema), SubjectController.create);
router.put('/:id', authenticateToken, validateParams(idSchema), validateBody(updateSubjectSchema), SubjectController.update);
router.delete('/:id', authenticateToken, validateParams(idSchema), SubjectController.delete);

export default router;