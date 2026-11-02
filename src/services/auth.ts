// src/services/auth.ts
// Serviços de autenticação com a API DummyJSON (Aula 9 e 10)
import { api } from './http'
import type { Usuario } from '../types'

interface LoginPayload {
  username: string
  password: string
  expiresInMins?: number
}

export async function login(payload: LoginPayload): Promise<Usuario> {
  const { data } = await api.post<Usuario>('/auth/login', {
    ...payload,
    expiresInMins: payload.expiresInMins ?? 60,
  })
  return data
}

export async function me(token: string): Promise<Usuario> {
  const { data } = await api.get<Usuario>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}
