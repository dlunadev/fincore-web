import type { LoginCredentials, LoginResult } from '../models/auth';

export interface IAuthPort {
  login(credentials: LoginCredentials): Promise<LoginResult>;
}
