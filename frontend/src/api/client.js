const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const TOKEN_KEY = 'alarish.admin.token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

export async function apiFetch(path, { method = 'GET', body, auth = false, signal } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  })

  let data = null
  const ct = response.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    data = await response.json().catch(() => null)
  }

  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status})`
    throw new ApiError(message, response.status, data)
  }

  return data
}
