import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateVocabularyInput, UpdateVocabularyInput } from '../schemas/vocabularySchemas';

const prisma = new PrismaClient();

export class VocabularyController {
  static async getBySubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { subjectId } = req.params;
      const { page = 1, limit = 20, difficulty } = req.query;

      const where: any = {
        subjectId,
        isActive: true,
      };

      if (difficulty) {
        where.difficulty = parseInt(difficulty as string);
      }

      const vocabulary = await prisma.vocabulary.findMany({
        where,
        include: {
          subject: {
            select: { name: true, color: true },
          },
        },
        orderBy: { term: 'asc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.vocabulary.count({ where });

      res.json({
        vocabulary,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const vocabulary = await prisma.vocabulary.findUnique({
        where: { id },
        include: {
          subject: {
            select: { name: true, color: true },
          },
        },
      });

      if (!vocabulary) {
        return res.status(404).json({ error: 'Vocabulary term not found' });
      }

      res.json({ vocabulary });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateVocabularyInput = req.body;
      const vocabulary = await prisma.vocabulary.create({
        data,
        include: {
          subject: {
            select: { name: true },
          },
        },
      });

      res.status(201).json({
        message: 'Vocabulary term created successfully',
        vocabulary,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: UpdateVocabularyInput = req.body;

      const vocabulary = await prisma.vocabulary.update({
        where: { id },
        data,
        include: {
          subject: {
            select: { name: true },
          },
        },
      });

      res.json({
        message: 'Vocabulary term updated successfully',
        vocabulary,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Soft delete
      await prisma.vocabulary.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({ message: 'Vocabulary term deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, subjectId, difficulty } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Search query required' });
      }

      const where: any = {
        isActive: true,
        OR: [
          { term: { contains: q as string, mode: 'insensitive' } },
          { definition: { contains: q as string, mode: 'insensitive' } },
          { fullForm: { contains: q as string, mode: 'insensitive' } },
        ],
      };

      if (subjectId) {
        where.subjectId = subjectId;
      }

      if (difficulty) {
        where.difficulty = parseInt(difficulty as string);
      }

      const vocabulary = await prisma.vocabulary.findMany({
        where,
        include: {
          subject: {
            select: { name: true, color: true },
          },
        },
        orderBy: { term: 'asc' },
        take: 50, // Limit search results
      });

      res.json({ vocabulary, query: q });
    } catch (error) {
      next(error);
    }
  }
}