const API_BASE = '/api'

function getDeviceId(): string {
  let id = localStorage.getItem('alpha_device_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('alpha_device_id', id)
  }
  return id
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', 'X-Device-Id': getDeviceId() },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}

export const imagesApi = {
  list: () => api.get<{ images: Array<{ id: number; prompt: string; url: string; created_at: string }> }>('/images'),
  save: (prompt: string, url: string) => api.post<{ image: { id: number; prompt: string; url: string; created_at: string } }>('/images', { prompt, url }),
  delete: (id: number) => api.delete<{ success: boolean }>(`/images/${id}`),
}

export const generateApi = {
  create: (prompt: string) => api.post<{ imageUrl: string }>('/generate', { prompt }),
}
