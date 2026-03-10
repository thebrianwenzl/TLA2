import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/authService';
import { RegisterInput, LoginInput } from '../schemas/authSchemas';

const prisma = new PrismaClient();

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: RegisterInput = req.body;
      const user = await AuthService.createUser(userData);
      const token = AuthService.generateToken(user.id);

      res.status(201).json({
        message: 'User registered successfully',
        user,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: LoginInput = req.body;
      const result = await AuthService.authenticateUser(email, password);

      res.json({
        message: 'Login successful',
        ...result,
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          totalXP: true,
          level: true,
          streak: true,
          createdAt: true,
          lastLoginAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}