import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authConfig } from '../config/auth';

const prisma = new PrismaClient();

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, authConfig.bcryptRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      authConfig.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token: string): { userId: string } {
    return jwt.verify(token, authConfig.jwtSecret as jwt.Secret) as { userId: string };
  }

  static async createUser(userData: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const hashedPassword = await this.hashPassword(userData.password);
    
    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        totalXP: true,
        level: true,
        createdAt: true,
      },
    });
  }

  static async authenticateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !await this.comparePassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        totalXP: user.totalXP,
        level: user.level,
      },
      token: this.generateToken(user.id),
    };
  }
}