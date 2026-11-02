// src/services/desejos.ts
// CRUD completo para o recurso /todos do DummyJSON (Aula 10 - Blocos 1 e 2)
import { api } from './http'
import type { Desejo } from '../types'

type ListaDesejos = {
  todos: Desejo[]
  total: number
  skip: number
  limit: number
}

// 1. Ler (R): Carrega desejos de um usuário específico
export async function listarDesejos(userId: number): Promise<Desejo[]> {
  const { data } = await api.get<ListaDesejos>(`/todos/user/${userId}`)
  return data.todos
}

// 2. Criar (C): Adiciona um novo desejo de viagem
export async function criarDesejo(todo: string, userId: number): Promise<Desejo> {
  const { data } = await api.post<Desejo>('/todos/add', {
    todo,
    completed: false,
    userId,
  })
  return data
}

// 3. Atualizar (U): Atualiza parcialmente com PATCH (ex: marcar/desmarcar)
export async function atualizarDesejo(
  id: number,
  campos: Partial<Pick<Desejo, 'todo' | 'completed'>>,
): Promise<Desejo> {
  const { data } = await api.patch<Desejo>(`/todos/${id}`, campos)
  return data
}

// 4. Excluir (D): Deleta o desejo
export async function excluirDesejo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`)
}
