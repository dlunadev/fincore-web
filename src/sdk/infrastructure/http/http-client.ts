import type { ITokenStorage } from '../../domain/ports/token-storage.port';

export class SdkError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'SdkError';
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Solicitud inválida.',
  401: 'No autorizado. Por favor inicie sesión.',
  403: 'Acceso denegado.',
  404: 'Recurso no encontrado.',
  409: 'Conflicto: el recurso ya existe.',
};

export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly tokenStorage: ITokenStorage,
  ) {}

  private buildHeaders(): HeadersInit {
    const token = this.tokenStorage.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as T;

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message =
        body?.error ??
        STATUS_MESSAGES[res.status] ??
        `Error inesperado (${res.status}).`;
      throw new SdkError(message, res.status);
    }

    return body as T;
  }

  get<T>(path: string): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.buildHeaders(),
    }).then((r) => this.handleResponse<T>(r));
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    }).then((r) => this.handleResponse<T>(r));
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    }).then((r) => this.handleResponse<T>(r));
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: this.buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then((r) => this.handleResponse<T>(r));
  }
}
