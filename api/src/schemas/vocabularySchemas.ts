import { z } from 'zod';

export const createVocabularySchema = z.object({
  term: z.string().min(1, 'Term is required').max(20, 'Term too long'),
  definition: z.string().min(1, 'Definition is required').max(1000, 'Definition too long'),
  fullForm: z.string().min(1, 'Full form is required').max(200, 'Full form too long'),
  example: z.string().max(500, 'Example too long').optional(),
  difficulty: z.number().int().min(1).max(5).default(1),
  subjectId: z.string().cuid('Invalid subject ID'),
});

export const updateVocabularySchema = createVocabularySchema.partial().omit({ subjectId: true });

export type CreateVocabularyInput = z.infer<typeof createVocabularySchema>;
export type UpdateVocabularyInput = z.infer<typeof updateVocabularySchema>;