import axios from 'axios';
import { api } from './api';
import { useAuthStore, type User } from '../store/authStore';

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse extends User {
  token: string;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: credentials.expiresInMins || 30,
    });

    const data = response.data;
    const accessToken = data.accessToken || data.token;
    
    useAuthStore.getState().setAuth(data, accessToken, data.refreshToken);
    return data;
  },

  async validateSession(): Promise<boolean> {
    const refreshToken = localStorage.getItem('sprintdesk_refresh_token');
    
    if (!refreshToken) {
      useAuthStore.getState().logout();
      return false;
    }

    try {
      const response = await axios.post('https://dummyjson.com/auth/refresh', {
        refreshToken,
        expiresInMins: 30,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Fetch current user details with new token
      const meResponse = await axios.get('https://dummyjson.com/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      useAuthStore.getState().setAuth(
        meResponse.data,
        accessToken,
        newRefreshToken || refreshToken
      );
      return true;
    } catch {
      useAuthStore.getState().logout();
      return false;
    } finally {
      useAuthStore.getState().setLoadingSession(false);
    }
  },
};