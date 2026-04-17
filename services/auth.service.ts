
import api from '@/lib/axios';
import { ENDPOINTS } from '@/constants/api';
import type { LoginPayload, RegisterPayload, AuthResponse, User } from '@/types/auth';

export const authService = {
  login:    (data: LoginPayload)    => api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN,    data),
  register: (data: RegisterPayload) => api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data),
  me:       ()                      => api.get<User>(ENDPOINTS.AUTH.ME),
};