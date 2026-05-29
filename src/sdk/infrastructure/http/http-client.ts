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
  400: 'Los datos enviados no son válidos.',
  401: 'Tu sesión expiró. Por favor volvé a iniciar sesión.',
  403: 'No tenés permisos para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  409: 'Ya existe un registro con esos datos.',
  422: 'Los datos ingresados no cumplen los requisitos.',
  500: 'Error interno del servidor. Intentá de nuevo en unos momentos.',
  503: 'El servicio no está disponible en este momento. Intentá más tarde.',
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

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, init)
      .catch(() => {
        throw new SdkError('No se pudo conectar al servidor. Verificá tu conexión.', 0);
      })
      .then((r) => this.handleResponse<T>(r));
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET', headers: this.buildHeaders() });
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    });
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    });
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      headers: this.buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }
}
