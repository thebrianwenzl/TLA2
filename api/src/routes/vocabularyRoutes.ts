import { Router } from 'express';
import { VocabularyController } from '../controllers/vocabularyController';
import { validateBody, validateParams } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { createVocabularySchema, updateVocabularySchema } from '../schemas/vocabularySchemas';
import { z } from 'zod';

const router = Router();

const idSchema = z.object({ id: z.string().cuid() });
const subjectIdSchema = z.object({ subjectId: z.string().cuid() });

// Public routes
router.get('/subject/:subjectId', validateParams(subjectIdSchema), VocabularyController.getBySubject);
router.get('/search', VocabularyController.search);
router.get('/:id', validateParams(idSchema), VocabularyController.getById);

// Protected routes (admin only)
router.post('/', authenticateToken, validateBody(createVocabularySchema), VocabularyController.create);
router.put('/:id', authenticateToken, validateParams(idSchema), validateBody(updateVocabularySchema), VocabularyController.update);
router.delete('/:id', authenticateToken, validateParams(idSchema), VocabularyController.delete);

export default router;