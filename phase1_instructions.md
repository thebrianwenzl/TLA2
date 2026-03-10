# TLA Project - Phase 1 Implementation Instructions

## Overview
**Goal**: Set up complete project infrastructure and development environment for a cross-platform mobile learning game.

**Duration**: 1-2 days  
**Complexity**: Low  
**Dependencies**: None

## Technology Stack

### Mobile Application
- **Framework**: React Native (cross-platform iOS/Android)
- **Language**: TypeScript (strict mode enabled)
- **State Management**: Redux Toolkit + RTK Query
- **Navigation**: React Navigation v6
- **UI Components**: NativeBase or React Native Elements
- **Animations**: React Native Reanimated v3
- **Local Storage**: AsyncStorage + Redux Persist
- **Testing**: Jest + React Native Testing Library

### Backend API
- **Runtime**: Node.js 18+
- **Framework**: Express.js + TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

### Database
- **Primary Database**: Neon even for local development

## Project Structure

Create the following directory structure:

```
TLA/
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── games/      # Game-specific components
│   │   │   ├── common/     # Shared components
│   │   │   └── forms/      # Form components
│   │   ├── screens/        # Screen components
│   │   │   ├── auth/       # Authentication screens
│   │   │   ├── subjects/   # Subject selection and details
│   │   │   ├── games/      # Game screens
│   │   │   └── profile/    # User profile screens
│   │   ├── navigation/     # Navigation configuration
│   │   ├── store/          # Redux store and slices
│   │   │   ├── auth/
│   │   │   ├── subjects/
│   │   │   ├── games/
│   │   │   └── progress/
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript type definitions
│   ├── __tests__/
│   ├── android/
│   ├── ios/
│   ├── package.json
│   └── tsconfig.json
├── api/                    # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Prisma models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript types
│   │   └── app.ts          # Express app setup
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── __tests__/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Implementation Steps

### 1. Initialize React Native Project

```bash
# Create React Native project with TypeScript
npx react-native@latest init TLAMobile --template react-native-template-typescript

# Navigate to mobile directory
cd TLAMobile
mv * ../mobile/
cd ../mobile

# Install required dependencies
npm install @reduxjs/toolkit react-redux redux-persist
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install react-native-reanimated
npm install native-base react-native-svg react-native-safe-area-context

# Development dependencies
npm install --save-dev @types/react @types/react-native
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev prettier eslint-config-prettier
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

### 2. Initialize Node.js API Project

```bash
# Create API directory and initialize
mkdir api && cd api
npm init -y

# Install production dependencies
npm install express cors helmet morgan
npm install prisma @prisma/client
npm install jsonwebtoken bcryptjs
npm install zod
npm install dotenv

# Install TypeScript and development dependencies
npm install --save-dev typescript @types/node @types/express
npm install --save-dev @types/cors @types/helmet @types/morgan
npm install --save-dev @types/jsonwebtoken @types/bcryptjs
npm install --save-dev jest @types/jest supertest @types/supertest
npm install --save-dev ts-node nodemon
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev prettier eslint-config-prettier

# Initialize TypeScript
npx tsc --init

# Initialize Prisma
npx prisma init
```

### 3. Configure TypeScript

**API tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "__tests__"]
}
```

**Mobile tsconfig.json:** (should be created by React Native template)

### 4. Set Up Basic Express Server

**api/src/app.ts:**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'TLA API'
  });
});

// API routes will be added here in Phase 2
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
```

**api/src/server.ts:**
```typescript
import app from './app';

// This file is for starting the server
// app.ts exports the Express app for testing
```

### 5. Configure Database Connection

**api/prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Basic user model for Phase 1 testing
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

**api/.env:**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tla_dev"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="15m"

# Server
PORT=3000
NODE_ENV="development"
```

### 6. Set Up Package.json Scripts

**API package.json scripts:**
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  }
}
```

**Mobile package.json scripts:** (should include React Native defaults plus)
```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  }
}
```

### 7. Basic Mobile App Setup

**mobile/src/App.tsx:**
```typescript
import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const App = (): JSX.Element => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TLA - Three Letter Acronyms</Text>
      <Text style={styles.subtitle}>Learning Game</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default App;
```

## Environment Setup Requirements

### Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running locally
- React Native development environment set up:
  - Android Studio (for Android development)
  - Xcode (for iOS development, macOS only)
  - React Native CLI: `npm install -g react-native-cli`

### Database Setup
1. Install PostgreSQL locally
2. Create database: `createdb tla_dev`
3. Update DATABASE_URL in api/.env with your credentials
4. Run: `cd api && npm run db:push` to create initial schema

## Acceptance Criteria

### Must Complete Successfully:
- [ ] React Native app runs on iOS/Android simulator without errors
- [ ] Express server starts and responds to health check at `http://localhost:3000/health`
- [ ] PostgreSQL database connects successfully
- [ ] All specified dependencies installed and configured
- [ ] Project follows the defined folder structure exactly
- [ ] TypeScript compilation works without errors in both projects
- [ ] Basic health check endpoint returns 200 with proper JSON response
- [ ] Mobile app displays the basic welcome screen
- [ ] Database connection test passes (Prisma can connect)

### Testing Commands:
```bash
# Test API server
cd api
npm run dev
curl http://localhost:3000/health

# Test mobile app
cd mobile
npm run android  # or npm run ios

# Test database connection
cd api
npx prisma db push
npx prisma studio  # Should open database browser
```

## Deliverables Checklist

- [ ] Complete React Native project with TypeScript configuration
- [ ] Node.js/Express API project with TypeScript
- [ ] PostgreSQL database connection setup and tested
- [ ] Basic project structure matching specification
- [ ] Development environment fully configured
- [ ] All dependencies installed and working
- [ ] Health check endpoint functional
- [ ] Mobile app builds and runs on simulator
- [ ] TypeScript compilation error-free
- [ ] Basic README.md updated with setup instructions

## Next Steps (Phase 2 Preview)
After Phase 1 completion, Phase 2 will implement:
- Complete database schema with users, subjects, vocabulary tables
- User authentication API (register, login, JWT)
- Basic subject management endpoints
- Input validation with Zod schemas

## Support & Questions
- Refer to React Native documentation for platform-specific setup issues
- Check Prisma documentation for database connection troubleshooting
- Ensure all environment variables are properly configured
- Test each component individually before integration testing