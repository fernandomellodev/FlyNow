// src/services/http.ts
// Configurações das instâncias Axios com Interceptors (Aula 10 - Bloco 3)
import axios from 'axios'

export const wiki = axios.create({
  baseURL: import.meta.env.VITE_WIKI_URL,
  timeout: 10000,
})

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

// Interceptor de Request: Adiciona automaticamente o token Bearer no header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('flynow.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Controle de expiração de sessão (401 -> logout)
let aoExpirar: (() => void) | null = null

export function registrarAoExpirar(fn: (() => void) | null) {
  aoExpirar = fn
}

// Interceptor de Response: Captura 401 (exceto na rota de login) e expira sessão
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const ehLogin = String(err.config?.url).includes('/auth/login')
    if (axios.isAxiosError(err) && err.response?.status === 401 && !ehLogin) {
      aoExpirar?.()
    }
    return Promise.reject(err)
  },
)
