import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProgress {
  id: string;
  userId: string;
  vocabularyId: string;
  masteryLevel: number;
  correctAnswers: number;
  totalAttempts: number;
  lastPracticed: string;
}

interface ProgressState {
  userProgress: UserProgress[];
  currentStreak: number;
  totalXP: number;
  level: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  userProgress: [],
  currentStreak: 0,
  totalXP: 0,
  level: 1,
  isLoading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setUserProgress: (state, action: PayloadAction<UserProgress[]>) => {
      state.userProgress = action.payload;
    },
    updateProgress: (state, action: PayloadAction<UserProgress>) => {
      const index = state.userProgress.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.userProgress[index] = action.payload;
      } else {
        state.userProgress.push(action.payload);
      }
    },
    setCurrentStreak: (state, action: PayloadAction<number>) => {
      state.currentStreak = action.payload;
    },
    setTotalXP: (state, action: PayloadAction<number>) => {
      state.totalXP = action.payload;
    },
    setLevel: (state, action: PayloadAction<number>) => {
      state.level = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUserProgress,
  updateProgress,
  setCurrentStreak,
  setTotalXP,
  setLevel,
  setLoading,
  setError,
} = progressSlice.actions;
export default progressSlice.reducer;