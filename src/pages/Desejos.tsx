// src/pages/Desejos.tsx
// Tela completa do CRUD Meus Desejos (Aula 10 - Blocos 1, 2, 3 e 4)
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  listarDesejos,
  criarDesejo,
  atualizarDesejo,
  excluirDesejo,
} from '../services/desejos'
import { mensagemDeErro } from '../utils/erros'
import DesejoItem from '../components/DesejoItem'
import type { Desejo } from '../types'

function validar(valor: string): string | null {
  if (valor.length < 3) return 'Escreve pelo menos 3 letras.'
  if (valor.length > 80) return 'Máximo de 80 letras.'
  return null
}

export default function Desejos() {
  const { usuario } = useAuth()
  const userId = usuario?.id

  // 1. Estados da lista de dados (4 estados: carregando, erro, vazio, lista)
  const [desejos, setDesejos] = useState<Desejo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [erro, setErro] = useState<string | null>(null)

  // 2. Estados do formulário de criação
  const [texto, setTexto] = useState<string>('')
  const [erroForm, setErroForm] = useState<string | null>(null)
  const [enviando, setEnviando] = useState<boolean>(false)

  // 3. Estados de operação sobre itens individuais (ocupado e avisos de erro)
  const [ocupado, setOcupado] = useState<number | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  // Guarda IDs criados localmente nesta sessão para contornar o 404 da API de simulação
  const idsLocais = useRef<Set<number>>(new Set<number>())

  // Ler (R): Carregar dados ao montar ou se o usuário mudar
  const carregar = async (id: number) => {
    try {
      setLoading(true)
      setErro(null)
      const dados = await listarDesejos(id)
      setDesejos(dados)
    } catch (err) {
      setErro(mensagemDeErro(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId === undefined) return
    carregar(userId)
  }, [userId])

  // Criar (C): Submeter formulário controlado com validação
  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const limpo = texto.trim()
    const avisoValidacao = validar(limpo)

    if (avisoValidacao) {
      setErroForm(avisoValidacao)
      return
    }
    if (userId === undefined) return

    setErroForm(null)
    setEnviando(true)

    try {
      const novo = await criarDesejo(limpo, userId)
      idsLocais.current.add(novo.id)
      // Atualiza o estado local imutavelmente (imutabilidade da Aula 8/10)
      setDesejos((lista) => [...lista, novo])
      setTexto('')
    } catch (err) {
      setErroForm(mensagemDeErro(err))
    } finally {
      setEnviando(false)
    }
  }

  // Atualizar (U): Marcar como feito/desfeito com PATCH
  async function alternar(d: Desejo) {
    setAviso(null)
    setOcupado(d.id)
    try {
      // Se não for id puramente local da simulação, chama a API
      if (!idsLocais.current.has(d.id)) {
        await atualizarDesejo(d.id, { completed: !d.completed })
      }
      setDesejos((lista) =>
        lista.map((x) => (x.id === d.id ? { ...x, completed: !x.completed } : x)),
      )
    } catch (err) {
      setAviso(mensagemDeErro(err))
    } finally {
      setOcupado(null)
    }
  }

  // Excluir (D): Confirmação prévia obrigatória + DELETE + filter
  async function excluir(d: Desejo) {
    if (!window.confirm(`Excluir “${d.todo}”?`)) return
    setAviso(null)
    setOcupado(d.id)
    try {
      if (!idsLocais.current.has(d.id)) {
        await excluirDesejo(d.id)
      }
      setDesejos((lista) => lista.filter((x) => x.id !== d.id))
    } catch (err) {
      setAviso(mensagemDeErro(err))
    } finally {
      setOcupado(null)
    }
  }

  return (
    <div className="pagina-desejos">
      <header className="desejos-cabecalho">
        <span className="hero-tag">FlyNow · Meus Desejos de Viagem</span>
        <h1>Meus desejos</h1>
        <p className="desejos-subtitulo">
          Planeje e gerencie seus destinos dos sonhos, <strong>{usuario?.firstName}</strong>.
        </p>
      </header>

      {/* Formulário controlado para criação (C) */}
      <section className="desejos-form-card">
        <form onSubmit={aoEnviar} noValidate className="form-desejo">
          <label htmlFor="desejo" className="form-label-desejo">
            Novo desejo de viagem
          </label>
          <div className="form-desejo-input-grupo">
            <input
              id="desejo"
              type="text"
              className="input-desejo"
              placeholder="Ex.: Conhecer Lisboa, Visitar o Rio..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              disabled={enviando}
              aria-invalid={erroForm !== null}
            />
            <button type="submit" className="btn-adicionar-desejo" disabled={enviando}>
              {enviando ? 'Salvando…' : 'Adicionar'}
            </button>
          </div>
          {erroForm && (
            <p role="alert" className="aviso-erro-campo">
              ⚠️ {erroForm}
            </p>
          )}
        </form>
      </section>

      {/* Aviso de erro temporário para ações nos itens (PATCH / DELETE) */}
      {aviso && (
        <div className="alerta-erro-acao" role="alert">
          <span>⚠️ {aviso}</span>
          <button type="button" onClick={() => setAviso(null)}>✕</button>
        </div>
      )}

      {/* Renderização dos 4 estados da tela */}
      <section className="desejos-lista-container">
        {loading ? (
          <div className="estado-box estado-loading">
            <div className="spinner"></div>
            <p>⏳ Carregando desejos...</p>
          </div>
        ) : erro ? (
          <div className="estado-box estado-erro" role="alert">
            <p className="texto-erro">❌ {erro}</p>
            {userId !== undefined && (
              <button
                type="button"
                className="btn-tentar-novamente"
                onClick={() => carregar(userId)}
              >
                🔁 Tentar de novo
              </button>
            )}
          </div>
        ) : desejos.length === 0 ? (
          <div className="estado-box estado-vazio">
            <p className="texto-vazio">📭 Nenhum desejo ainda. Que tal “Conhecer Lisboa”?</p>
          </div>
        ) : (
          <ul className="desejos-lista">
            {desejos.map((d) => (
              <DesejoItem
                key={d.id}
                desejo={d}
                ocupado={ocupado === d.id}
                aoAlternar={alternar}
                aoExcluir={excluir}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
