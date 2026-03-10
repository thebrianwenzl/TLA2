# TLA - Three Letter Acronyms Learning Game

A cross-platform mobile learning game for industry-specific jargon built with React Native and Node.js.

## Project Structure

```
TLA/
├── mobile/                 # React Native app
│   ├── src/               # Source code
│   ├── android/           # Android platform files
│   ├── ios/               # iOS platform files
│   └── package.json       # Mobile dependencies
├── api/                   # Node.js/Express backend
│   ├── src/               # Source code
│   ├── prisma/            # Database schema and migrations
│   └── package.json       # API dependencies
└── README.md
```

## Technology Stack

### Mobile Application
- **Framework**: React Native with TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Navigation**: React Navigation v6
- **UI Components**: NativeBase
- **Animations**: React Native Reanimated v3
- **Local Storage**: AsyncStorage + Redux Persist

### Backend API
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod

### Database
- **Development**: PostgreSQL (local)
- **Production**: Neon managed PostgreSQL

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running locally
- React Native development environment set up
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Database Setup
1. Install PostgreSQL locally
2. Create database: `createdb tla_dev`
3. Update DATABASE_URL in `api/.env` with your credentials
4. Run database setup:
   ```bash
   cd api
   npm run db:push
   ```

### API Setup
```bash
cd api
npm install
npm run dev
```

The API will be available at `http://localhost:3000`

### Mobile App Setup
```bash
cd mobile
npm install
npm run start
```

For Android:
```bash
npm run android
```

For iOS:
```bash
npm run ios
```

## Testing

### Test API Health Check
```bash
curl http://localhost:3000/health
```

### Test Database Connection
```bash
cd api
npx prisma studio
```

## Development Status

This is Phase 1 of the project, which includes:
- ✅ Project infrastructure setup
- ✅ Basic Express server with health check
- ✅ PostgreSQL database connection
- ✅ React Native app with basic welcome screen
- ✅ TypeScript configuration for both projects

## Next Steps (Phase 2)
- Complete database schema with users, subjects, vocabulary tables
- User authentication API (register, login, JWT)
- Basic subject management endpoints
- Input validation with Zod schemas
