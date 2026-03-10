# TLA - Technical Specification

## Technology Stack

### Mobile Application
- **Framework**: React Native (cross-platform iOS/Android)
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
- **Primary Database**: PostgreSQL (Neon for managed hosting)
- **Caching**: Redis (for session management and leaderboards)
- **File Storage**: AWS S3 (for user avatars, certificates)

### Infrastructure
- **API Hosting**: Railway, Render, or AWS ECS
- **CDN**: CloudFront (for static assets)
- **Monitoring**: Sentry (error tracking)
- **Analytics**: Mixpanel or Amplitude

---

## Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    total_xp INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

#### subjects
```sql
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    author VARCHAR(200),
    total_levels INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### vocabulary
```sql
CREATE TABLE vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    term VARCHAR(200) NOT NULL,
    definition TEXT NOT NULL,
    related_terms TEXT[], -- PostgreSQL array
    example_use TEXT,
    difficulty_level INTEGER DEFAULT 1, -- 1-5 scale
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### challenges
```sql
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    level INTEGER NOT NULL, -- 1-5
    type VARCHAR(50) NOT NULL, -- 'FourChoicesOneWord', 'ReverseDefinitions', etc.
    prompt TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    distractors JSONB, -- Array of incorrect options
    time_limit INTEGER DEFAULT 120, -- seconds
    xp_reward INTEGER DEFAULT 10,
    difficulty_level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);
```
- **challenge_data (JSONB)**: Optional structured field to support game types that require ordered or nested input. For example, `SequenceBuilder` uses `ordered_items` to define correct sequence logic.

Example:
```json
{
  "ordered_items": [
    "Discovery",
    "Preclinical Testing",
    "Clinical Trials",
    "FDA Review",
    "Post-Market Surveillance"
  ]
}
```

### Progress Tracking Tables

#### user_subjects
```sql
CREATE TABLE user_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    current_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    challenges_completed INTEGER DEFAULT 0,
    total_challenges INTEGER,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_mastered BOOLEAN DEFAULT false,
    mastery_date TIMESTAMP,
    date_started TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, subject_id)
);
```

#### game_sessions
```sql
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    session_type VARCHAR(20) NOT NULL, -- 'main_path' or 'practice'
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    total_challenges INTEGER,
    correct_answers INTEGER,
    xp_earned INTEGER DEFAULT 0,
    session_data JSONB -- Store additional session metrics
);
```

#### challenge_attempts
```sql
CREATE TABLE challenge_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    user_answer TEXT,
    is_correct BOOLEAN NOT NULL,
    time_taken INTEGER, -- milliseconds
    xp_earned INTEGER DEFAULT 0,
    attempted_at TIMESTAMP DEFAULT NOW()
);
```

#### user_achievements
```sql
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id),
    achievement_type VARCHAR(50) NOT NULL, -- 'level_complete', 'subject_mastery', 'expert_mode'
    level INTEGER, -- for level completion badges
    earned_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB -- Additional achievement data
);
```

---

## API Architecture

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

### User Management
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `GET /users/stats` - Get user statistics and achievements

### Subject Management
- `GET /subjects` - List available subjects
- `GET /subjects/:id` - Get subject details
- `GET /subjects/:id/vocabulary` - Get subject vocabulary
- `POST /subjects/:id/start` - Start a new subject
- `GET /subjects/:id/glossary` – Returns a full list of vocabulary entries and definitions for browsing/reference within a subject.


### Game Sessions
- `POST /sessions/start` - Start new game session
- `GET /sessions/:id` - Get session details
- `POST /sessions/:id/complete` - Complete session
- `POST /sessions/:id/challenges/:challengeId/attempt` - Submit challenge attempt

### Progress Tracking
- `GET /progress/subjects` - Get all subject progress
- `GET /progress/subjects/:id` - Get specific subject progress
- `GET /achievements` - Get user achievements

---

## Mobile App Architecture

### UX Feedback & Gamification Triggers
- XP gain animations after each correct answer.
- Progress bar and level-up notifications after level completion.
- “Mastery” modal on subject completion.
- Daily streak tracker and reminder notification (configurable).
- Achievement badge pop-ups and optional sound/vibration feedback.


### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── games/          # Game-specific components
│   ├── common/         # Shared components
│   └── forms/          # Form components
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   ├── subjects/       # Subject selection and details
│   ├── games/          # Game screens
│   └── profile/        # User profile screens
├── navigation/         # Navigation configuration
├── store/              # Redux store and slices
│   ├── auth/
│   ├── subjects/
│   ├── games/
│   └── progress/
├── services/           # API services
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

### State Management Structure
```typescript
interface RootState {
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
  };
  subjects: {
    available: Subject[];
    current: Subject | null;
    userProgress: UserSubjectProgress[];
  };
  games: {
    currentSession: GameSession | null;
    currentChallenge: Challenge | null;
    sessionHistory: GameSession[];
  };
  progress: {
    totalXP: number;
    achievements: Achievement[];
    stats: UserStats;
  };
}
```

### Game Engine Architecture
```typescript
interface GameEngine {
  startSession(subjectId: string, type: 'main_path' | 'practice'): Promise<GameSession>;
  loadChallenge(challengeId: string): Promise<Challenge>;
  submitAnswer(answer: string): Promise<ChallengeResult>;
  completeSession(): Promise<SessionResult>;
}
```

---

## Performance Considerations

### Database Optimization
- Index on `user_subjects(user_id, subject_id)`
- Index on `challenges(subject_id, level)`
- Index on `challenge_attempts(session_id)`
- Partial index on `users(email) WHERE is_active = true`

### Mobile Performance
- Lazy loading of game assets
- Image optimization and caching
- Offline mode for downloaded content
- Background sync for progress data

### Caching Strategy
- Redis cache for:
  - User session data
  - Subject metadata
  - Leaderboard data
  - Frequently accessed vocabulary

---

## Security Measures

### Authentication & Authorization
- JWT tokens with 15-minute expiry
- Refresh tokens with 7-day expiry
- Rate limiting on authentication endpoints
- Password hashing with bcryptjs (12 rounds)

### Data Protection
- Input validation using Zod schemas
- SQL injection prevention via Prisma ORM
- XSS protection with sanitized inputs
- CORS configuration for API access

### Mobile Security
- Certificate pinning for API calls
- Keychain/Keystore for token storage
- Biometric authentication option
- App transport security (ATS) compliance

---

## Deployment & DevOps

### CI/CD Pipeline
- **Mobile**: EAS Build (Expo) or Fastlane
- **API**: GitHub Actions with automated testing
- **Database**: Prisma migrations in staging/production

### Environment Configuration
- Development: Local PostgreSQL + Redis
- Staging: Neon PostgreSQL + Railway deployment
- Production: Neon PostgreSQL + AWS/Railway with redundancy

### Monitoring & Logging
- Application logs via Winston (Node.js)
- Error tracking via Sentry
- Performance monitoring via New Relic or DataDog
- User analytics via Mixpanel

---

## Content Management System

### Admin Dashboard (Future Enhancement)
- Web-based CMS for content creators
- Bulk upload for vocabulary and challenges
- Challenge difficulty adjustment tools
- User progress analytics dashboard

### Content Validation Pipeline
- Automated quality checks for new content
- Subject matter expert review workflow
- A/B testing framework for challenge effectiveness

#### Challenge Builder Enhancements
- Select game type (dropdown)
- Enter prompt, correct answer, distractors (if applicable)
- Structured fields for game types like `SequenceBuilder` or `DragToSort`
- Vocabulary-term auto-linking (optional)
- Real-time preview for mobile display