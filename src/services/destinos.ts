// src/services/destinos.ts
// Bloco 3 da Aula 8: Requisições com instâncias Axios configuradas
import axios from 'axios';
import { wiki, api } from './http';
import type { Destino, TarefaSimulada } from '../types/destino';

// Cidades da Wikipedia solicitadas na Aula 8
const TITULOS = ['Rio_de_Janeiro', 'Salvador,_Bahia', 'Lisbon', 'Tokyo'];

// Metadados de preços fixados na aula (Slide 17: Rio 800, Salvador 600, Lisboa 2400)
const METADADOS_DESTINOS: Record<string, { preco: number; fallbackImg: string }> = {
  Rio_de_Janeiro: {
    preco: 800,
    fallbackImg: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80',
  },
  'Salvador,_Bahia': {
    preco: 600,
    fallbackImg: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=600&q=80',
  },
  Lisbon: {
    preco: 2400,
    fallbackImg: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=600&q=80',
  },
  Tokyo: {
    preco: 3500,
    fallbackImg: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
  },
};

/**
 * GET com Axios: busca dados de resumo das cidades na Wikipedia REST API
 * Conforme Slides 29-30 da Aula 8.
 */
export async function listarDestinos(): Promise<Destino[]> {
  const respostas = await Promise.all(
    TITULOS.map((t) => wiki.get(`/page/summary/${encodeURIComponent(t)}`))
  );

  return respostas.map(({ data }) => {
    const chave = Object.keys(METADADOS_DESTINOS).find((k) => data.title.includes(k.split('_')[0])) || 'Rio_de_Janeiro';
    const meta = METADADOS_DESTINOS[chave] || { preco: 1000, fallbackImg: '' };
    const nomeExibicao = data.title.replace(', Bahia', '');

    return {
      id: data.title,
      nome: nomeExibicao,
      cidade: nomeExibicao,
      preco: meta.preco,
      resumo: data.extract,
      imagem: data.thumbnail?.source || meta.fallbackImg,
    };
  });
}

/**
 * POST com Axios: simula a criação de um item na API DummyJSON
 * Conforme Slide 31 da Aula 8.
 */
export async function criarTarefa(todo: string): Promise<TarefaSimulada> {
  const { data } = await api.post('/todos/add', {
    todo,
    completed: false,
    userId: 1,
  });
  return data;
}

/**
 * Tratamento de Erro com Axios: dispara intencionalmente rota inexistente
 * e captura o código de status HTTP com err.response?.status.
 * Conforme Slide 32 da Aula 8.
 */
export async function testarErro404(): Promise<{ status?: number; data?: unknown }> {
  try {
    await api.get('/http/404/nao-achei');
    return { status: 200 };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log('🔴 Status do Erro capturado no Axios:', err.response?.status, err.response?.data);
      return {
        status: err.response?.status,
        data: err.response?.data,
      };
    } else {
      console.log('Erro inesperado:', err);
      throw err;
    }
  }
}
