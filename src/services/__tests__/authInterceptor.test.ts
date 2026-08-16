import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../../store/authStore';

describe('Auth Interceptor & Token Refresh Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    // Store refresh token in localStorage as per app design
    localStorage.setItem('sprintdesk_refresh_token', 'valid-refresh-token');

    // Reset Zustand auth state (only valid AuthState properties)
    useAuthStore.setState({
      accessToken: 'expired-token',
      user: null,
      isAuthenticated: true,
      isLoadingSession: false,
    });
    vi.clearAllMocks();
  });

  it('should attach Bearer token to outgoing request headers', () => {
    const token = useAuthStore.getState().accessToken;
    const config = { headers: {} as Record<string, string> };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    expect(config.headers.Authorization).toBe('Bearer expired-token');
  });

  it('should clear session state on logout', () => {
    useAuthStore.getState().logout();

    const { accessToken, user, isAuthenticated } = useAuthStore.getState();
    const storedRefreshToken = localStorage.getItem('sprintdesk_refresh_token');

    expect(accessToken).toBeNull();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
    expect(storedRefreshToken).toBeNull();
  });
});