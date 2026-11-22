import { apiClient, IS_DEV } from './api-client';
import { mockAuthHandlers } from '@/mock/handlers';
import type {
  User,
  AuthCredentials,
  RegisterDto,
  AuthResponse,
} from '@/types';

export class AuthService {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      if (IS_DEV) {
        return await mockAuthHandlers.login(credentials);
      }
      return await apiClient.post<AuthResponse>('/auth/login', credentials);
    } catch (error) {
      console.error('[AuthService.login] Error:', error);
      throw error;
    }
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      if (IS_DEV) {
        return await mockAuthHandlers.register(data);
      }
      return await apiClient.post<AuthResponse>('/auth/register', data);
    } catch (error) {
      console.error('[AuthService.register] Error:', error);
      throw error;
    }
  }

  async logout(): Promise<boolean> {
    try {
      if (IS_DEV) {
        return await mockAuthHandlers.logout();
      }
      await apiClient.post('/auth/logout');
      localStorage.removeItem('skar_access_token');
      localStorage.removeItem('access_token');
      return true;
    } catch (error) {
      console.error('[AuthService.logout] Error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      if (IS_DEV) {
        return await mockAuthHandlers.getCurrentUser();
      }
      return await apiClient.get<User>('/auth/me');
    } catch (error) {
      console.error('[AuthService.getCurrentUser] Error:', error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      if (IS_DEV) {
        return await mockAuthHandlers.forgotPassword(email);
      }
      return await apiClient.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
    } catch (error) {
      console.error('[AuthService.forgotPassword] Error:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      if (IS_DEV) {
        return await mockAuthHandlers.resetPassword(token, newPassword);
      }
      return await apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error) {
      console.error('[AuthService.resetPassword] Error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
