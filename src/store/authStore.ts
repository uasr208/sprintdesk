import { create } from 'zustand';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setLoadingSession: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoadingSession: true,

  setAuth: (user, accessToken, refreshToken) => {
    if (refreshToken) {
      localStorage.setItem('sprintdesk_refresh_token', refreshToken);
    }
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoadingSession: false,
    });
  },

  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  logout: () => {
    localStorage.removeItem('sprintdesk_refresh_token');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoadingSession: false,
    });
  },

  setLoadingSession: (loading) => {
    set({ isLoadingSession: loading });
  },
}));