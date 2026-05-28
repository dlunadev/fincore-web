import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const TOKEN_KEY = 'fincore_token';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function toUserMessage(status: number, serverMessage?: string): string {
  if (serverMessage) return serverMessage;
  const messages: Record<number, string> = {
    400: 'Los datos enviados no son válidos.',
    401: 'Sesión expirada. Por favor, inicie sesión nuevamente.',
    403: 'No tiene permisos para realizar esta acción.',
    404: 'El recurso solicitado no existe.',
    409: 'Ya existe un registro con esos datos.',
  };
  return messages[status] ?? 'Ocurrió un error inesperado. Inténtelo de nuevo.';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = Cookies.get(TOKEN_KEY);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new ApiError(res.status, toUserMessage(res.status, body.message));
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
