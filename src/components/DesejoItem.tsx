// src/components/DesejoItem.tsx
// Componente de item da lista de desejos (Aula 10 - Bloco 2)
import type { Desejo } from '../types'

type Props = {
  desejo: Desejo
  ocupado: boolean
  aoAlternar: (d: Desejo) => void
  aoExcluir: (d: Desejo) => void
}

export default function DesejoItem({ desejo, ocupado, aoAlternar, aoExcluir }: Props) {
  return (
    <li className={desejo.completed ? 'desejo feito' : 'desejo'}>
      <label className="desejo-label">
        <input
          type="checkbox"
          checked={desejo.completed}
          disabled={ocupado}
          onChange={() => aoAlternar(desejo)}
        />
        <span className="desejo-texto">{desejo.todo}</span>
      </label>
      <button
        type="button"
        className="btn-excluir-desejo"
        disabled={ocupado}
        onClick={() => aoExcluir(desejo)}
        aria-label={`Excluir ${desejo.todo}`}
      >
        Excluir
      </button>
    </li>
  )
}
