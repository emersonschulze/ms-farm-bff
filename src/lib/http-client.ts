interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function httpGet<T>(url: string, options?: RequestOptions): Promise<T> {
  const fullUrl  = buildUrl(url, options?.params);
  const response = await fetch(fullUrl, {
    ...options,
    method:  'GET',
    headers: buildHeaders(options?.headers),
  });

  if (!response.ok) {
    throw new HttpError(response.status, await response.text(), url);
  }

  return response.json() as Promise<T>;
}

export async function httpPost<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
  const response = await fetch(url, {
    ...options,
    method:  'POST',
    headers: buildHeaders(options?.headers),
    body:    JSON.stringify(body),
  });

  if (!response.ok) {
    throw new HttpError(response.status, await response.text(), url);
  }

  return response.json() as Promise<T>;
}

export async function httpPut<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
  const response = await fetch(url, {
    ...options,
    method:  'PUT',
    headers: buildHeaders(options?.headers),
    body:    JSON.stringify(body),
  });

  if (!response.ok) {
    throw new HttpError(response.status, await response.text(), url);
  }

  return response.json() as Promise<T>;
}

export async function httpDelete(url: string, options?: RequestOptions): Promise<void> {
  const response = await fetch(url, {
    ...options,
    method:  'DELETE',
    headers: buildHeaders(options?.headers),
  });

  if (!response.ok) {
    throw new HttpError(response.status, await response.text(), url);
  }
}

function buildUrl(url: string, params?: Record<string, string>): string {
  if (!params) return url;
  const query = new URLSearchParams(params).toString();
  return `${url}?${query}`;
}

function buildHeaders(headers?: HeadersInit): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...headers,
  };
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly body:   string,
    public readonly url:    string,
  ) {
    super(`HTTP ${status} on ${url}`);
  }
}
