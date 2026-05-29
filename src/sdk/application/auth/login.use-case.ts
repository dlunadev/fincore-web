import { SdkError } from '../../infrastructure/http/http-client';
import type { IAuthPort } from '../../domain/ports/auth.port';
import type { LoginCredentials, LoginResult } from '../../domain/models/auth';

export class LoginUseCase {
  constructor(private readonly auth: IAuthPort) {}

  execute(credentials: LoginCredentials): Promise<LoginResult> {
    return this.auth.login(credentials).catch((err: unknown) => {
      if (err instanceof SdkError && err.status === 401)
        throw new SdkError('Email o contraseña incorrectos. Verificá tus datos e intentá de nuevo.', 401);
      throw err;
    });
  }
}
