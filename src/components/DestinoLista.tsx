import React from 'react';
import { Destino } from '../types/destino';

interface DestinoListaProps {
  destinos: Destino[];
  minhaListaIds: string[];
  onToggleMinhaLista: (id: string) => void;
  loading: boolean;
  error: string | null;
}

export const DestinoLista: React.FC<DestinoListaProps> = ({
  destinos,
  minhaListaIds,
  onToggleMinhaLista,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <section className="destinos-secao" id="lista">
        <h2 className="secao-titulo">Destinos Disponíveis para Viagem</h2>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando destinos via Axios (Wikipedia REST API)...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="destinos-secao" id="lista">
        <h2 className="secao-titulo">Destinos Disponíveis para Viagem</h2>
        <div className="error-card" role="alert">
          <p className="error-title">⚠️ Erro ao carregar destinos</p>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="destinos-secao" id="lista">
      <div className="secao-header">
        <div>
          <h2 className="secao-titulo">Destinos Disponíveis para Viagem</h2>
          <p className="secao-descricao">
            Dados obtidos via <strong>Axios (Wikipedia REST API)</strong> com preços e filtros integrados (Aula 8).
          </p>
        </div>
        <span className="destinos-badge-contador">
          {destinos.length} {destinos.length === 1 ? 'destino exibido' : 'destinos exibidos'}
        </span>
      </div>

      {destinos.length === 0 ? (
        <div className="nenhum-destino-box">
          <p className="nenhum-destino">Nenhum destino encontrado para o filtro atual.</p>
        </div>
      ) : (
        <div className="destinos-grid">
          {/* Bloco 2: renderizado com .map() e key estável (id do destino, NÃO o índice) */}
          {destinos.map((destino) => {
            const estaNaLista = minhaListaIds.includes(destino.id);
            const ehBarato = destino.preco <= 650;

            return (
              <article key={destino.id} className={`destino-card ${estaNaLista ? 'card-salvo' : ''}`}>
                <figure className="card-imagem-wrapper">
                  <img
                    src={destino.imagem}
                    alt={`Foto de ${destino.nome}`}
                    className="card-imagem"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <figcaption className="card-caption">
                    Foto: {destino.nome} · Wikipedia Commons
                  </figcaption>
                  {ehBarato && (
                    <span className="badge-promocao">Promoção até R$ 650</span>
                  )}
                  {estaNaLista && (
                    <span className="badge-na-lista">✓ Na Minha Lista</span>
                  )}
                </figure>

                <div className="card-corpo">
                  <div className="card-topo-info">
                    <h3 className="card-cidade">{destino.nome}</h3>
                    <span className="card-preco">R$ {destino.preco.toLocaleString('pt-BR')}</span>
                  </div>

                  <p className="card-resumo">{destino.resumo}</p>

                  <div className="card-rodape">
                    <span className="card-id-tag" title="Key única do destino">
                      ID: {destino.id}
                    </span>

                    <button
                      type="button"
                      onClick={() => onToggleMinhaLista(destino.id)}
                      className={`btn-toggle-lista ${estaNaLista ? 'btn-remover' : 'btn-adicionar'}`}
                    >
                      {estaNaLista ? '✕ Remover da Lista' : '⭐ Quero Visitar'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Tabela de Resumo com reduce e total calculados */}
      {minhaListaIds.length > 0 && (
        <div className="tabela-resumo-container">
          <table className="tabela-destinos">
            <caption className="tabela-caption">
              📋 Resumo da Minha Lista Pessoal — {minhaListaIds.length} {minhaListaIds.length === 1 ? 'item selecionado' : 'itens selecionados'}
            </caption>
            <thead>
              <tr>
                <th scope="col">Cidade</th>
                <th scope="col">Preço Unitário</th>
                <th scope="col">Identificador</th>
                <th scope="col">Ação Rápida</th>
              </tr>
            </thead>
            <tbody>
              {destinos
                .filter((d) => minhaListaIds.includes(d.id))
                .map((d) => (
                  <tr key={`resumo-${d.id}`}>
                    <td className="td-cidade">
                      <span className="icone-cidade">✈️</span>
                      <strong>{d.nome}</strong>
                    </td>
                    <td>
                      <span className="preco-tabela">R$ {d.preco.toLocaleString('pt-BR')}</span>
                    </td>
                    <td>
                      <code className="codigo-wikidata">{d.id}</code>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onToggleMinhaLista(d.id)}
                        className="btn-tabela-remover"
                        title={`Remover ${d.nome} da lista`}
                      >
                        ✕ Remover
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
