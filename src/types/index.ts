// src/types/index.ts
// Tipos centralizados para a aplicação FlyNow e exercícios da Aula 10

export type Desejo = {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export interface Usuario {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender?: string
  image?: string
  token?: string
}

export interface Destino {
  id: string
  nome: string
  cidade: string
  preco: number
  resumo: string
  imagem: string
}

export interface ContatoForm {
  nome: string
  email: string
  destinoInteresse: string
  mensagem: string
}

export interface TarefaSimulada {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export interface WikidataSparqlResponse {
  head: {
    vars: string[]
  }
  results: {
    bindings: Array<{
      item: { type: string; value: string }
      itemLabel?: { type: string; value: string; 'xml:lang'?: string }
      description?: { type: string; value: string; 'xml:lang'?: string }
      image?: { type: string; value: string }
    }>
  }
}

// Tipo de referência para o CRM (/users)
export interface ContatoCRM {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  company: {
    name: string
  }
}
