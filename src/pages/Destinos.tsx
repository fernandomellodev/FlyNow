// src/pages/Destinos.tsx
// Tela de Exploração de Destinos (Aula 8 e 9 do FlyNow)
import { useState, useEffect } from 'react'
import { Destino, ContatoForm, TarefaSimulada } from '../types'
import { listarDestinos, criarTarefa, testarErro404 } from '../services/destinos'
import { DestinoLista } from '../components/DestinoLista'
import { DestinoForm } from '../components/DestinoForm'

export default function Destinos() {
  const [destinos, setDestinos] = useState<Destino[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [erro, setErro] = useState<string | null>(null)

  // Filtros derivados via HOFs
  const [soBaratos, setSoBaratos] = useState<boolean>(false)
  const [busca, setBusca] = useState<string>('')
  const [ordenarPorPreco, setOrdenarPorPreco] = useState<boolean>(false)

  // Lista pessoal de viagem (estado local sem mutação)
  const [minhaListaIds, setMinhaListaIds] = useState<string[]>([])
  const [filtroSomenteMinhaLista, setFiltroSomenteMinhaLista] = useState<boolean>(false)

  // Laboratório de teste Axios
  const [tarefaCriada, setTarefaCriada] = useState<TarefaSimulada | null>(null)
  const [statusErro404, setStatusErro404] = useState<number | null>(null)
  const [ultimoContato, setUltimoContato] = useState<ContatoForm | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        setErro(null)
        const dados = await listarDestinos()
        setDestinos(dados)
      } catch {
        setErro('Não deu pra carregar os destinos. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  // Estado derivado no render com HOFs (filter, sort, reduce)
  let listaProcessada = soBaratos
    ? destinos.filter((d) => d.preco <= 650)
    : destinos

  if (filtroSomenteMinhaLista) {
    listaProcessada = listaProcessada.filter((d) => minhaListaIds.includes(d.id))
  }

  if (busca.trim()) {
    listaProcessada = listaProcessada.filter((d) =>
      d.nome.toLowerCase().includes(busca.toLowerCase().trim()),
    )
  }

  if (ordenarPorPreco) {
    listaProcessada = [...listaProcessada].sort((a, b) => a.preco - b.preco)
  }

  const visiveis = listaProcessada
  const total = visiveis.reduce((soma, d) => soma + d.preco, 0)

  // Sincroniza o título do documento com a quantidade de destinos visíveis
  useEffect(() => {
    document.title = `${visiveis.length} destinos - FlyNow`
  }, [visiveis.length])

  const handleToggleMinhaLista = (id: string) => {
    setMinhaListaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleCriarTarefaTeste = async () => {
    try {
      const nova = await criarTarefa('Revisar HOF e Axios no FlyNow')
      setTarefaCriada(nova)
    } catch (e) {
      console.error('Erro no POST:', e)
    }
  }

  const handleTestarErro404 = async () => {
    const res = await testarErro404()
    if (res.status) {
      setStatusErro404(res.status)
    }
  }

  const handleEnviarContato = async (dados: ContatoForm) => {
    setUltimoContato(dados)
    try {
      const postRetorno = await criarTarefa(
        `Contato de ${dados.nome} sobre ${dados.destinoInteresse}`,
      )
      setTarefaCriada(postRetorno)
    } catch (e) {
      console.error('Erro ao enviar contato:', e)
    }
  }

  return (
    <>
      <section className="hero-banner" id="destinos">
        <div className="hero-content">
          <span className="hero-tag">FlyNow Airlines · Explorador de Destinos</span>
          <h2 className="hero-title">Painel de Destinos & Viagens</h2>
          <p className="hero-description">
            Dados consumidos via <strong>Axios</strong> na Wikipedia REST API (GET) e simulados na DummyJSON API.
            Filtros derivados calculados com as HOFs <code>filter</code>, <code>map</code> e <code>reduce</code>.
          </p>

          <div className="hof-controles-card">
            <div className="hof-linha-botoes">
              <button
                type="button"
                className={`btn-filtro-hof ${soBaratos ? 'ativo' : ''}`}
                onClick={() => setSoBaratos(!soBaratos)}
              >
                {soBaratos ? 'Mostrar todos' : '🏷️ Só até R$ 650'}
              </button>

              <button
                type="button"
                className={`btn-filtro-hof ${ordenarPorPreco ? 'ativo' : ''}`}
                onClick={() => setOrdenarPorPreco(!ordenarPorPreco)}
              >
                {ordenarPorPreco ? '↩️ Desfazer Ordenação' : '💲 Ordenar por preço'}
              </button>

              <button
                type="button"
                className={`btn-filtro-hof ${filtroSomenteMinhaLista ? 'ativo' : ''}`}
                onClick={() => setFiltroSomenteMinhaLista(!filtroSomenteMinhaLista)}
              >
                ⭐ Minha Lista ({minhaListaIds.length})
              </button>
            </div>

            <div className="busca-container">
              <input
                type="text"
                className="input-busca"
                placeholder="🔍 Buscar cidade por nome (ex: Rio, Salvador, Lisboa)..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              {busca && (
                <button
                  type="button"
                  className="btn-limpar-busca"
                  onClick={() => setBusca('')}
                >
                  Limpar
                </button>
              )}
            </div>

            <div className="hof-resumo-banner">
              <p className="texto-destinos-total">
                <strong>{visiveis.length}</strong> {visiveis.length === 1 ? 'destino' : 'destinos'} · total <strong>R$ {total.toLocaleString('pt-BR')}</strong>
              </p>
              <span className="hof-tag-explicacao">
                (Calculado com <code>reduce</code> e <code>filter</code> no render)
              </span>
            </div>
          </div>

          <div className="axios-lab-card">
            <h4 className="axios-lab-titulo">🧪 Laboratório Axios (Abra o F12 &gt; Network):</h4>
            <div className="axios-botoes-grupo">
              <button
                type="button"
                className="btn-axios btn-axios-post"
                onClick={handleCriarTarefaTeste}
              >
                📤 Disparar POST (/todos/add)
              </button>
              <button
                type="button"
                className="btn-axios btn-axios-erro"
                onClick={handleTestarErro404}
              >
                🛑 Simular Erro 404 (status lido no catch)
              </button>
            </div>

            {tarefaCriada && (
              <div className="axios-feedback-box feedback-sucesso">
                ✅ POST 201 no DummyJSON confirmado! ID gerado: <code>{tarefaCriada.id}</code> — "{tarefaCriada.todo}"
              </div>
            )}

            {statusErro404 && (
              <div className="axios-feedback-box feedback-erro">
                🔴 Status lido pelo Axios: <code>{statusErro404} Not Found</code> (capturado no bloco <code>catch</code> com <code>err.response?.status</code>).
              </div>
            )}
          </div>
        </div>
      </section>

      <DestinoLista
        destinos={visiveis}
        minhaListaIds={minhaListaIds}
        onToggleMinhaLista={handleToggleMinhaLista}
        loading={loading}
        error={erro}
      />

      {ultimoContato && (
        <aside className="registro-contato-card">
          <h3 className="registro-contato-titulo">📋 Contato Registrado:</h3>
          <div className="registro-contato-grid">
            <div><strong>Nome:</strong> {ultimoContato.nome}</div>
            <div><strong>E-mail:</strong> {ultimoContato.email}</div>
            <div><strong>Destino:</strong> {ultimoContato.destinoInteresse}</div>
            <div className="registro-contato-msg">
              <strong>Mensagem:</strong> {ultimoContato.mensagem || '(Vazia)'}
            </div>
          </div>
        </aside>
      )}

      <DestinoForm
        destinosDisponiveis={destinos}
        onEnviarContato={handleEnviarContato}
      />
    </>
  )
}
