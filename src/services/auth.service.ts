import { api } from './api';
import type { LoginRequest, LoginResponse } from '@/models';

export const authService = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/api/auth/login', data),
};
