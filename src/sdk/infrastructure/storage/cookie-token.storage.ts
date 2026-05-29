import Cookies from 'js-cookie';
import type { ITokenStorage } from '../../domain/ports/token-storage.port';

const TOKEN_KEY = 'fincore_token';

export class CookieTokenStorage implements ITokenStorage {
  getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  }

  setToken(token: string, expiresAt: string): void {
    const expires = new Date(expiresAt);
    Cookies.set(TOKEN_KEY, token, { expires, sameSite: 'Lax' });
  }

  clearToken(): void {
    Cookies.remove(TOKEN_KEY);
  }
}
