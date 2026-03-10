import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Challenge {
  id: string;
  type: string;
  prompt: string;
  options: string[];
  timeLimit: number;
  xpReward: number;
}

interface GameSession {
  id: string;
  subjectId: string;
  subjectName: string;
  sessionType: 'main_path' | 'practice';
  totalChallenges: number;
  currentChallenge: number;
  startedAt: string;
}

interface ChallengeResult {
  isCorrect: boolean;
  correctAnswer: string;
  xpEarned: number;
  timeTaken?: number;
}

interface SessionResults {
  sessionId: string;
  subjectName: string;
  totalChallenges: number;
  correctAnswers: number;
  accuracy: number;
  xpEarned: number;
  completedAt: string;
  attempts: Array<{
    challengePrompt: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    xpEarned: number;
    timeTaken?: number;
  }>;
}

interface GamesState {
  currentSession: GameSession | null;
  currentChallenge: Challenge | null;
  lastResult: ChallengeResult | null;
  sessionResults: SessionResults | null;
  isLoading: boolean;
  error: string | null;
  timeRemaining: number;
  isTimerActive: boolean;
}

const initialState: GamesState = {
  currentSession: null,
  currentChallenge: null,
  lastResult: null,
  sessionResults: null,
  isLoading: false,
  error: null,
  timeRemaining: 0,
  isTimerActive: false,
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    // Session management
    startSessionRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.sessionResults = null;
    },
    startSessionSuccess: (state, action: PayloadAction<{ session: GameSession; challenge: Challenge }>) => {
      state.isLoading = false;
      state.currentSession = action.payload.session;
      state.currentChallenge = action.payload.challenge;
      state.timeRemaining = action.payload.challenge.timeLimit;
      state.isTimerActive = true;
      state.lastResult = null;
    },
    startSessionFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Challenge management
    submitAnswerRequest: (state) => {
      state.isLoading = true;
      state.isTimerActive = false;
    },
    submitAnswerSuccess: (state, action: PayloadAction<{
      result: ChallengeResult;
      nextChallenge?: Challenge;
      session: any;
    }>) => {
      state.isLoading = false;
      state.lastResult = action.payload.result;
      
      if (action.payload.nextChallenge) {
        state.currentChallenge = action.payload.nextChallenge;
        state.timeRemaining = action.payload.nextChallenge.timeLimit;
        state.isTimerActive = true;
      } else {
        state.currentChallenge = null;
        state.timeRemaining = 0;
        state.isTimerActive = false;
      }

      // Update session progress
      if (state.currentSession) {
        state.currentSession.currentChallenge = action.payload.session.challengesCompleted;
      }
    },
    submitAnswerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isTimerActive = false;
    },

    // Session completion
    completeSessionRequest: (state) => {
      state.isLoading = true;
    },
    completeSessionSuccess: (state, action: PayloadAction<SessionResults>) => {
      state.isLoading = false;
      state.sessionResults = action.payload;
      state.currentSession = null;
      state.currentChallenge = null;
      state.lastResult = null;
      state.timeRemaining = 0;
      state.isTimerActive = false;
    },
    completeSessionFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Timer management
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    stopTimer: (state) => {
      state.isTimerActive = false;
    },
    startTimer: (state) => {
      state.isTimerActive = true;
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
    },
    clearResults: (state) => {
      state.sessionResults = null;
      state.lastResult = null;
    },
    resetGame: (state) => {
      return initialState;
    },
  },
});

export const {
  startSessionRequest,
  startSessionSuccess,
  startSessionFailure,
  submitAnswerRequest,
  submitAnswerSuccess,
  submitAnswerFailure,
  completeSessionRequest,
  completeSessionSuccess,
  completeSessionFailure,
  updateTimer,
  stopTimer,
  startTimer,
  clearError,
  clearResults,
  resetGame,
} = gamesSlice.actions;

export default gamesSlice.reducer;