import { Injectable } from '@nestjs/common'

const TIMEOUT_MS = 5000

function extractErrorDetail(detail: string, status: number): string {
  if (detail) {
    try {
      const parsed = JSON.parse(detail) as {
        error?: string
        message?: string
      }
      const msg = parsed.error ?? parsed.message
      if (typeof msg === 'string' && msg.trim()) return msg.trim()
    } catch {
      // not JSON — fall through to raw text
    }
    return detail.trim()
  }
  return `Request failed with ${status}`
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  async request<T>(
    path: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
      body?: unknown
      headers?: Record<string, string>
    } = {},
  ): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body:
          options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal,
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new HttpError(
          response.status,
          extractErrorDetail(detail, response.status),
        )
      }

      const text = await response.text()
      return (text ? JSON.parse(text) : {}) as T
    } finally {
      clearTimeout(timeout)
    }
  }
}

@Injectable()
export class HttpService {
  client(url: string): HttpClient {
    return new HttpClient(url)
  }
}
