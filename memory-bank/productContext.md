# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2025-07-19 00:06:23 - Log of updates made will be appended as footnotes to the end of this file.

## Project Goal

Build a cross-platform mobile learning game for industry-specific jargon using React Native and Node.js. The app will help users master technical terminology through interactive challenges and gamified learning experiences.

## Key Features

- Cross-platform mobile app (iOS/Android) built with React Native
- User authentication and profile management
- Subject-based learning with industry-specific vocabulary
- Multiple game types for varied learning experiences
- Progress tracking with XP, levels, and achievements
- Gamification elements (badges, streaks, mastery system)
- Practice mode separate from main learning path

## Overall Architecture

- **Frontend**: React Native with TypeScript, Redux Toolkit for state management
- **Backend**: Node.js/Express API with TypeScript, JWT authentication
- **Database**: PostgreSQL with Prisma ORM
- **Infrastructure**: Railway/Render hosting, Neon managed PostgreSQL
- **Development**: 5-phase iterative approach building from foundation to full feature set