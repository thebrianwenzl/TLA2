import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: number;
  _count: {
    vocabulary: number;
  };
}

interface SubjectsState {
  subjects: Subject[];
  selectedSubject: Subject | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SubjectsState = {
  subjects: [],
  selectedSubject: null,
  isLoading: false,
  error: null,
};

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    setSubjects: (state, action: PayloadAction<Subject[]>) => {
      state.subjects = action.payload;
    },
    setSelectedSubject: (state, action: PayloadAction<Subject | null>) => {
      state.selectedSubject = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setSubjects, setSelectedSubject, setLoading, setError } = subjectsSlice.actions;
export default subjectsSlice.reducer;