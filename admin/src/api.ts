const BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''
const FRONTEND_URL = 'https://msfurniturelahore.com'

export async function api(path: string, opts?: RequestInit) {
  const token = localStorage.getItem('token')
  const res = await fetch(BASE + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts?.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export function apiUrl(path: string) {
  if (path.startsWith('/images/')) return FRONTEND_URL + path
  return BASE + path
}
