# TLA Project - Phase 2 Implementation Instructions

## Overview
**Goal**: Implement complete database schema, user authentication system, and core API endpoints for the TLA learning game.

**Duration**: 3-4 days  
**Complexity**: Medium  
**Dependencies**: Phase 1 completed (project infrastructure and development environment)

## Phase 2 Objectives

### Primary Goals
1. **Complete Database Schema**: Design and implement all core tables for users, subjects, vocabulary, and progress tracking
2. **Authentication System**: Full JWT-based authentication with registration, login, and session management
3. **Core API Endpoints**: Subject management, vocabulary CRUD operations, and user profile management
4. **Input Validation**: Comprehensive Zod schemas for all API endpoints
5. **Error Handling**: Robust error handling and logging system

### Success Metrics
- All database tables created and relationships established
- User registration and login working end-to-end
- Protected API routes with JWT middleware
- Complete CRUD operations for subjects and vocabulary
- Input validation preventing invalid data entry
- Comprehensive API documentation

## Technology Stack Additions

### New Dependencies for API
```bash
# Authentication & Security
npm install bcryptjs jsonwebtoken
npm install @types/bcryptjs @types/jsonwebtoken --save-dev

# Validation & Utilities
npm install zod
npm install winston  # Logging
npm install express-rate-limit  # Rate limiting
npm install express-validator  # Additional validation

# Development Tools
npm install swagger-jsdoc swagger-ui-express
npm install @types/swagger-jsdoc @types/swagger-ui-express --save-dev
```

## Database Schema Design

### Complete Prisma Schema

**api/prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User Management
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  password    String   // Hashed with bcrypt
  firstName   String?
  lastName    String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lastLoginAt DateTime?

  // User Progress & Gamification
  totalXP     Int      @default(0)
  level       Int      @default(1)
  streak      Int      @default(0)
  lastActive  DateTime @default(now())

  // Relationships
  progress    UserProgress[]
  achievements UserAchievement[]
  gameResults GameResult[]
  
  @@map("users")
}

// Subject Categories (e.g., "Medical", "Legal", "Tech")
model Subject {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  icon        String?  // Icon identifier
  color       String?  // Theme color
  isActive    Boolean  @default(true)
  difficulty  Int      @default(1) // 1-5 scale
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  vocabulary  Vocabulary[]
  progress    UserProgress[]
  
  @@map("subjects")
}

// Vocabulary Terms
model Vocabulary {
  id          String   @id @default(cuid())
  term        String   // The acronym (e.g., "API")
  definition  String   // Full definition
  fullForm    String   // What the acronym stands for
  example     String?  // Usage example
  difficulty  Int      @default(1) // 1-5 scale
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  subjectId   String
  subject     Subject  @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  gameResults GameResult[]

  @@map("vocabulary")
}

// User Progress per Subject
model UserProgress {
  id              String   @id @default(cuid())
  userId          String
  subjectId       String
  
  // Progress Metrics
  totalTerms      Int      @default(0)
  masteredTerms   Int      @default(0)
  currentStreak   Int      @default(0)
  bestStreak      Int      @default(0)
  totalXP         Int      @default(0)
  lastStudied     DateTime @default(now())
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relationships
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  subject         Subject  @relation(fields: [subjectId], references: [id], onDelete: Cascade)

  @@unique([userId, subjectId])
  @@map("user_progress")
}

// Achievement System
model Achievement {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  icon        String?
  category    String   // "streak", "mastery", "exploration", etc.
  requirement Int      // Threshold to unlock
  xpReward    Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  // Relationships
  userAchievements UserAchievement[]
  
  @@map("achievements")
}

// User Achievement Junction
model UserAchievement {
  id            String      @id @default(cuid())
  userId        String
  achievementId String
  unlockedAt    DateTime    @default(now())

  // Relationships
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement   Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)

  @@unique([userId, achievementId])
  @@map("user_achievements")
}

// Game Results for Analytics
model GameResult {
  id           String   @id @default(cuid())
  userId       String
  vocabularyId String
  gameType     String   // "multiple_choice", "fill_blank", "matching", etc.
  
  // Result Data
  isCorrect    Boolean
  timeSpent    Int      // milliseconds
  attempts     Int      @default(1)
  xpEarned     Int      @default(0)
  
  createdAt    DateTime @default(now())

  // Relationships
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  vocabulary   Vocabulary @relation(fields: [vocabularyId], references: [id], onDelete: Cascade)

  @@map("game_results")
}
```

## Authentication System Architecture

### JWT Configuration

**api/src/config/auth.ts:**
```typescript
export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshTokenExpiresIn: '30d',
  bcryptRounds: 12,
  maxLoginAttempts: 5,
  lockoutTime: 15 * 60 * 1000, // 15 minutes
};
```

### Password Hashing Service

**api/src/services/authService.ts:**
```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
      { expiresIn: authConfig.jwtExpiresIn }
    );
  }

  static verifyToken(token: string): { userId: string } {
    return jwt.verify(token, authConfig.jwtSecret) as { userId: string };
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
```

## Input Validation Schemas

### Zod Validation Schemas

**api/src/schemas/authSchemas.ts:**
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
```

**api/src/schemas/subjectSchemas.ts:**
```typescript
import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required').max(50, 'Subject name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
  difficulty: z.number().int().min(1).max(5).default(1),
});

export const updateSubjectSchema = createSubjectSchema.partial();

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
```

**api/src/schemas/vocabularySchemas.ts:**
```typescript
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
```

## Middleware Implementation

### Authentication Middleware

**api/src/middleware/auth.ts:**
```typescript
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = AuthService.verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
```

### Validation Middleware

**api/src/middleware/validation.ts:**
```typescript
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
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid parameters',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
};
```

### Error Handling Middleware

**api/src/middleware/errorHandler.ts:**
```typescript
import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';

  // Handle Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Resource already exists';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found';
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
    }
  }

  console.error(`Error ${statusCode}: ${message}`, error);

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
```

## API Controllers

### Authentication Controller

**api/src/controllers/authController.ts:**
```typescript
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { RegisterInput, LoginInput } from '../schemas/authSchemas';

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
```

### Subject Controller

**api/src/controllers/subjectController.ts:**
```typescript
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
```

### Vocabulary Controller

**api/src/controllers/vocabularyController.ts:**
```typescript
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
```

## API Routes

### Authentication Routes

**api/src/routes/authRoutes.ts:**
```typescript
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateBody } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { registerSchema, loginSchema } from '../schemas/authSchemas';

const router = Router();

router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;
```

### Subject Routes

**api/src/routes/subjectRoutes.ts:**
```typescript
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
```

### Vocabulary Routes

**api/src/routes/vocabularyRoutes.ts:**
```typescript
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
```

## Updated Express App

**api/src/app.ts:**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes';
import subjectRoutes from './routes/subjectRoutes';
import vocabularyRoutes from './routes/vocabularyRoutes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'TLA API',
    version: '2.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/vocabulary', vocabularyRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 TLA API v2.0.0 - Phase 2`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
}

export default app;
```

## Environment Configuration

### Updated .env file

**api/.env:**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tla_dev"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production-make-it-long-and-random"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT
_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL="info"
LOG_FILE="logs/app.log"

# Development
DEBUG=true
```

## Database Seeding

### Initial Data Setup

**api/prisma/seed.ts:**
```typescript
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/services/authService';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample subjects
  const techSubject = await prisma.subject.create({
    data: {
      name: 'Technology',
      description: 'Common technology and software development acronyms',
      icon: 'laptop',
      color: '#3B82F6',
      difficulty: 2,
    },
  });

  const medicalSubject = await prisma.subject.create({
    data: {
      name: 'Medical',
      description: 'Medical and healthcare terminology',
      icon: 'heart',
      color: '#EF4444',
      difficulty: 3,
    },
  });

  const businessSubject = await prisma.subject.create({
    data: {
      name: 'Business',
      description: 'Business and finance acronyms',
      icon: 'briefcase',
      color: '#10B981',
      difficulty: 2,
    },
  });

  // Create sample vocabulary for Technology
  const techVocabulary = [
    {
      term: 'API',
      definition: 'A set of protocols and tools for building software applications',
      fullForm: 'Application Programming Interface',
      example: 'The weather app uses an API to get current weather data',
      difficulty: 1,
      subjectId: techSubject.id,
    },
    {
      term: 'SQL',
      definition: 'A programming language designed for managing data in relational databases',
      fullForm: 'Structured Query Language',
      example: 'We use SQL to query the user database',
      difficulty: 2,
      subjectId: techSubject.id,
    },
    {
      term: 'REST',
      definition: 'An architectural style for designing networked applications',
      fullForm: 'Representational State Transfer',
      example: 'Our REST API follows standard HTTP methods',
      difficulty: 3,
      subjectId: techSubject.id,
    },
  ];

  // Create sample vocabulary for Medical
  const medicalVocabulary = [
    {
      term: 'CPR',
      definition: 'An emergency procedure to restore blood circulation and breathing',
      fullForm: 'Cardiopulmonary Resuscitation',
      example: 'The paramedic performed CPR on the patient',
      difficulty: 1,
      subjectId: medicalSubject.id,
    },
    {
      term: 'MRI',
      definition: 'A medical imaging technique using magnetic fields and radio waves',
      fullForm: 'Magnetic Resonance Imaging',
      example: 'The doctor ordered an MRI to examine the brain injury',
      difficulty: 2,
      subjectId: medicalSubject.id,
    },
  ];

  // Create sample vocabulary for Business
  const businessVocabulary = [
    {
      term: 'ROI',
      definition: 'A measure of the efficiency of an investment',
      fullForm: 'Return on Investment',
      example: 'The marketing campaign had a 300% ROI',
      difficulty: 1,
      subjectId: businessSubject.id,
    },
    {
      term: 'KPI',
      definition: 'A measurable value that demonstrates effectiveness in achieving objectives',
      fullForm: 'Key Performance Indicator',
      example: 'Customer satisfaction is our primary KPI',
      difficulty: 2,
      subjectId: businessSubject.id,
    },
  ];

  // Insert vocabulary
  await prisma.vocabulary.createMany({
    data: [...techVocabulary, ...medicalVocabulary, ...businessVocabulary],
  });

  // Create sample achievements
  const achievements = [
    {
      name: 'First Steps',
      description: 'Complete your first vocabulary term',
      icon: 'star',
      category: 'milestone',
      requirement: 1,
      xpReward: 10,
    },
    {
      name: 'Quick Learner',
      description: 'Master 10 terms in a single subject',
      icon: 'lightning',
      category: 'mastery',
      requirement: 10,
      xpReward: 50,
    },
    {
      name: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: 'fire',
      category: 'streak',
      requirement: 7,
      xpReward: 100,
    },
    {
      name: 'Subject Explorer',
      description: 'Try vocabulary from 3 different subjects',
      icon: 'compass',
      category: 'exploration',
      requirement: 3,
      xpReward: 75,
    },
  ];

  await prisma.achievement.createMany({
    data: achievements,
  });

  // Create a test user
  const testUser = await AuthService.createUser({
    email: 'test@example.com',
    username: 'testuser',
    password: 'TestPassword123',
    firstName: 'Test',
    lastName: 'User',
  });

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${techVocabulary.length + medicalVocabulary.length + businessVocabulary.length} vocabulary terms`);
  console.log(`🏆 Created ${achievements.length} achievements`);
  console.log(`👤 Created test user: test@example.com / TestPassword123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Testing Setup

### API Testing

**api/__tests__/auth.test.ts:**
```typescript
import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: { email: { contains: 'test' } },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'TestPassword123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        username: 'testuser',
        password: 'TestPassword123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject weak password', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'weak',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login-test@example.com',
          username: 'logintest',
          password: 'TestPassword123',
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'TestPassword123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'WrongPassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
```

**api/__tests__/subjects.test.ts:**
```typescript
import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Subject Endpoints', () => {
  let authToken: string;

  beforeAll(async () => {
    // Create and login test user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'subject-test@example.com',
        username: 'subjecttest',
        password: 'TestPassword123',
      });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'subject-test@example.com',
        password: 'TestPassword123',
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'subject-test' } },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/subjects', () => {
    it('should return all active subjects', async () => {
      const response = await request(app)
        .get('/api/subjects')
        .expect(200);

      expect(response.body).toHaveProperty('subjects');
      expect(Array.isArray(response.body.subjects)).toBe(true);
    });
  });

  describe('POST /api/subjects', () => {
    it('should create a new subject with valid data', async () => {
      const subjectData = {
        name: 'Test Subject',
        description: 'A test subject for unit testing',
        difficulty: 2,
      };

      const response = await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(subjectData)
        .expect(201);

      expect(response.body).toHaveProperty('subject');
      expect(response.body.subject.name).toBe(subjectData.name);
    });

    it('should require authentication', async () => {
      const subjectData = {
        name: 'Unauthorized Subject',
        description: 'Should fail without auth',
      };

      await request(app)
        .post('/api/subjects')
        .send(subjectData)
        .expect(401);
    });
  });
});
```

## Implementation Steps

### Step 1: Install Dependencies
```bash
cd api

# Install new dependencies
npm install bcryptjs jsonwebtoken zod winston express-rate-limit swagger-jsdoc swagger-ui-express
npm install @types/bcryptjs @types/jsonwebtoken @types/swagger-jsdoc @types/swagger-ui-express --save-dev

# Update Prisma client
npm run db:generate
```

### Step 2: Database Migration
```bash
# Create and apply migration
npx prisma migrate dev --name "phase2-complete-schema"

# Seed the database
npx prisma db seed
```

### Step 3: Create Directory Structure
```bash
# Create new directories
mkdir -p src/config src/schemas src/services

# Verify structure matches requirements
```

### Step 4: Implement Core Files
1. Create all schema files (`src/schemas/`)
2. Implement authentication service (`src/services/authService.ts`)
3. Create middleware files (`src/middleware/`)
4. Implement controllers (`src/controllers/`)
5. Set up routes (`src/routes/`)
6. Update main app file (`src/app.ts`)

### Step 5: Database Setup
1. Update Prisma schema with complete model definitions
2. Run migration to create all tables
3. Execute seed script to populate initial data
4. Verify database structure in Prisma Studio

### Step 6: Testing
```bash
# Run API tests
npm test

# Test endpoints manually
npm run dev

# Test health check
curl http://localhost:3000/health

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"TestPassword123"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPassword123"}'
```

## Acceptance Criteria

### Must Complete Successfully:
- [ ] All database tables created with proper relationships
- [ ] User registration endpoint working with validation
- [ ] User login endpoint returning JWT tokens
- [ ] Protected routes requiring valid JWT authentication
- [ ] Subject CRUD operations (Create, Read, Update, Delete)
- [ ] Vocabulary CRUD operations with subject relationships
- [ ] Input validation preventing invalid data entry
- [ ] Error handling returning appropriate HTTP status codes
- [ ] Database seeding with sample data
- [ ] All API tests passing
- [ ] API documentation accessible (if Swagger implemented)

### API Endpoints to Test:

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

**Subjects:**
- `GET /api/subjects` - List all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create subject (protected)
- `PUT /api/subjects/:id` - Update subject (protected)
- `DELETE /api/subjects/:id` - Delete subject (protected)

**Vocabulary:**
- `GET /api/vocabulary/subject/:subjectId` - Get vocabulary by subject
- `GET /api/vocabulary/search?q=term` - Search vocabulary
- `GET /api/vocabulary/:id` - Get vocabulary by ID
- `POST /api/vocabulary` - Create vocabulary (protected)
- `PUT /api/vocabulary/:id` - Update vocabulary (protected)
- `DELETE /api/vocabulary/:id` - Delete vocabulary (protected)

### Testing Commands:
```bash
# Start development server
cd api && npm run dev

# Run test suite
npm test

# Check database
npx prisma studio

# Test API endpoints
curl -X GET http://localhost:3000/api/subjects
curl -X GET http://localhost:3000/api/vocabulary/search?q=API
```

## Security Considerations

### Implemented Security Features:
1. **Password Hashing**: bcrypt with 12 rounds
2. **JWT Authentication**: Secure token-based auth
3. **Input Validation**: Zod schemas for all inputs
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **CORS Configuration**: Restricted to frontend domain
6. **Helmet**: Security headers
7. **SQL Injection Prevention**: Prisma ORM parameterized queries

### Environment Security:
- Strong JWT secrets (minimum 32 characters)
- Database credentials in environment variables
- No sensitive data in version control
- Proper error handling without information leakage

## Performance Considerations

### Database Optimization:
- Proper indexing on frequently queried fields
- Pagination for large result sets
- Soft deletes to maintain referential integrity
- Connection pooling through Prisma

### API Optimization:
- Request/response compression
- Efficient query patterns
- Caching headers for static data
- Rate limiting to prevent abuse

## Deliverables Checklist

- [ ] Complete database schema with all relationships
- [ ] User authentication system (register, login, JWT)
- [ ] Protected API routes with middleware
- [ ] Subject management endpoints
- [ ] Vocabulary management endpoints
- [ ] Input validation with Zod schemas
- [ ] Error handling middleware
- [ ] Database seeding script
- [ ] Comprehensive test suite
- [ ] Updated API documentation
- [ ] Security middleware implementation
- [ ] Rate limiting configuration
- [ ] Environment configuration updated

## Next Steps (Phase 3 Preview)

After Phase 2 completion, Phase 3 will implement:
- Game mechanics and scoring system
- User progress tracking and analytics
- Achievement system implementation
- Mobile app authentication integration
- Real-time features (if needed)
- Advanced search and filtering
- User preferences and settings

## Troubleshooting Guide

### Common Issues:

**Database Connection:**
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists and is accessible

**Authentication Issues:**
- Verify JWT_SECRET is set and secure
- Check token expiration settings
- Validate password hashing configuration

**Validation Errors:**
- Review Zod schema definitions
- Check request body format
- Verify required fields are provided

**Migration Problems:**
- Reset database: `npx prisma migrate reset`
- Generate client: `npx prisma generate`
- Check schema syntax

### Debug Commands:
```bash
# Check database connection
npx prisma db pull

# View generated SQL
npx prisma migrate diff --preview-feature

# Reset and reseed database
npx prisma migrate reset --force
npm run db:seed

# View logs
tail -f logs/app.log
```

## Support Resources

- **Prisma Documentation**: https://www.prisma.io/docs/
- **Express.js Guide**: https://expressjs.com/
- **Zod Validation**: https://zod.dev/
- **JWT.io**: https://jwt.io/
- **bcrypt Documentation**: https://github.com/kelektiv/node.bcrypt.js

---

**Phase 2 Success Criteria**: All API endpoints functional, authentication working, database fully populated, and comprehensive test coverage achieved.