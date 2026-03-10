import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateSubjectInput, UpdateSubjectInput } from '../schemas/subjectSchemas';

const prisma = new PrismaClient();

export class SubjectController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await prisma.subject.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { vocabulary: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      res.json({ subjects });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const subject = await prisma.subject.findUnique({
        where: { id },
        include: {
          vocabulary: {
            where: { isActive: true },
            select: {
              id: true,
              term: true,
              definition: true,
              fullForm: true,
              difficulty: true,
            },
          },
          _count: {
            select: { vocabulary: true },
          },
        },
      });

      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      res.json({ subject });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateSubjectInput = req.body;
      const subject = await prisma.subject.create({
        data,
      });

      res.status(201).json({
        message: 'Subject created successfully',
        subject,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: UpdateSubjectInput = req.body;

      const subject = await prisma.subject.update({
        where: { id },
        data,
      });

      res.json({
        message: 'Subject updated successfully',
        subject,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Soft delete
      await prisma.subject.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}