// ============================================================================
// SKARWORLD REVENUE OS — Production Typed API Client
// ============================================================================

export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
export const IS_DEV =
  import.meta.env.VITE_APP_ENV === 'development' || !import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private getAuthToken(): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return (
          localStorage.getItem('skar_access_token') ||
          localStorage.getItem('access_token') ||
          null
        );
      }
    } catch {
      // LocalStorage might be disabled or unavailable
    }
    return null;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    const token = this.getAuthToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit,
    params?: Record<string, string | number | boolean | undefined | null>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        const errorMessage =
          (typeof errorData === 'object' && errorData !== null && 'message' in errorData)
            ? String((errorData as { message: unknown }).message)
            : `HTTP Error ${response.status}: ${response.statusText}`;

        throw new ApiError(errorMessage, response.status, errorData);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err;
      }
      const message = err instanceof Error ? err.message : 'Network request failed';
      throw new ApiError(message, 0, err);
    }
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): Promise<T> {
    return this.request<T>(path, { method: 'GET' }, params);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
