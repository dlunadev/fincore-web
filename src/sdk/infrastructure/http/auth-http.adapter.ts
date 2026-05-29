import type { IAuthPort } from '../../domain/ports/auth.port';
import type { LoginCredentials, LoginResult } from '../../domain/models/auth';
import type { HttpClient } from './http-client';

export class AuthHttpAdapter implements IAuthPort {
  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginCredentials): Promise<LoginResult> {
    return this.http.post<LoginResult>('/api/auth/login', credentials);
  }
}
