export const API_URL = process.env.NEXT_PUBLIC_API_URL!

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

export const api = {
  products: {
    getAll: () => fetchApi('/products'),
    getOne: (id: number) => fetchApi(`/products/${id}`),
    create: (data: any) => fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => fetchApi(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchApi(`/products/${id}`, {
      method: 'DELETE',
    }),
  }
}
