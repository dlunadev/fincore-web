export interface ITokenStorage {
  getToken(): string | undefined;
  setToken(token: string, expiresAt: string): void;
  clearToken(): void;
}
