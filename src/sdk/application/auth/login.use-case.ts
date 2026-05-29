import type { IAuthPort } from '../../domain/ports/auth.port';
import type { LoginCredentials, LoginResult } from '../../domain/models/auth';

export class LoginUseCase {
  constructor(private readonly auth: IAuthPort) {}

  execute(credentials: LoginCredentials): Promise<LoginResult> {
    return this.auth.login(credentials);
  }
}
