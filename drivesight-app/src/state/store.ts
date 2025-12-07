import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  state: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));

interface StudyState {
  selectedState: string | null;
  currentCategory: string | null;
  completedQuestions: number;
  correctAnswers: number;
  setSelectedState: (state: string) => void;
  setCurrentCategory: (category: string) => void;
  updateProgress: (correct: boolean) => void;
  resetProgress: () => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  selectedState: null,
  currentCategory: null,
  completedQuestions: 0,
  correctAnswers: 0,
  setSelectedState: (state) => set({ selectedState: state }),
  setCurrentCategory: (category) => set({ currentCategory: category }),
  updateProgress: (correct) =>
    set((state) => ({
      completedQuestions: state.completedQuestions + 1,
      correctAnswers: correct ? state.correctAnswers + 1 : state.correctAnswers,
    })),
  resetProgress: () =>
    set({
      completedQuestions: 0,
      correctAnswers: 0,
      currentCategory: null,
    }),
}));
