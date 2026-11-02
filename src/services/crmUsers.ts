// src/services/crmUsers.ts
// Receita do CRUD para o CRM (/users do DummyJSON - Slide 60 da Aula 10)
import { api } from './http'
import type { ContatoCRM } from '../types'

interface ListaUsersResponse {
  users: ContatoCRM[]
  total: number
  skip: number
  limit: number
}

// 1. Listar (R): GET /users
export async function listarContatosCRM(limit = 10, skip = 0): Promise<ContatoCRM[]> {
  const { data } = await api.get<ListaUsersResponse>('/users', {
    params: { limit, skip },
  })
  return data.users
}

// 2. Detalhe: GET /users/{id}
export async function obterContatoCRM(id: number): Promise<ContatoCRM> {
  const { data } = await api.get<ContatoCRM>(`/users/${id}`)
  return data
}

// 3. Criar (C): POST /users/add
export async function criarContatoCRM(contato: Omit<ContatoCRM, 'id'>): Promise<ContatoCRM> {
  const { data } = await api.post<ContatoCRM>('/users/add', contato)
  return data
}

// 4. Editar (U): PATCH /users/{id}
export async function atualizarContatoCRM(
  id: number,
  campos: Partial<Omit<ContatoCRM, 'id'>>,
): Promise<ContatoCRM> {
  const { data } = await api.patch<ContatoCRM>(`/users/${id}`, campos)
  return data
}

// 5. Excluir (D): DELETE /users/{id}
export async function excluirContatoCRM(id: number): Promise<{ isDeleted: boolean }> {
  const { data } = await api.delete<{ isDeleted: boolean }>(`/users/${id}`)
  return data
}

// 6. Busca no servidor: GET /users/search?q={termo}
export async function buscarContatosCRM(termo: string): Promise<ContatoCRM[]> {
  const { data } = await api.get<ListaUsersResponse>('/users/search', {
    params: { q: termo },
  })
  return data.users
}
