import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.message,
        });
      }
      return res.status(400).json({ error: 'Invalid request data' });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid parameters',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
};