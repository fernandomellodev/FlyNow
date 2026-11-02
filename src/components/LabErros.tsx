// src/components/LabErros.tsx
// Simulador de Códigos HTTP da DummyJSON (Aula 10 - Bloco 3)
import { useState } from 'react'
import { api } from '../services/http'
import { mensagemDeErro } from '../utils/erros'

const CODIGOS = [400, 401, 404, 500]

export default function LabErros() {
  const [msg, setMsg] = useState<string | null>(null)

  async function provocar(codigo: number) {
    setMsg(null)
    try {
      await api.get(`/http/${codigo}/teste`)
    } catch (err) {
      setMsg(`${codigo} → ${mensagemDeErro(err)}`)
    }
  }

  return (
    <div className="lab-erros-card">
      <h4 className="lab-erros-titulo">🧪 Simulador de Status HTTP (/http do DummyJSON):</h4>
      <p className="lab-erros-desc">
        Teste o tratamento centralizado de cada código ou o comportamento do 401 (logout):
      </p>
      <div className="lab-erros-botoes">
        {CODIGOS.map((c) => (
          <button
            key={c}
            type="button"
            className="btn-lab-codigo"
            onClick={() => provocar(c)}
          >
            Erro {c}
          </button>
        ))}
      </div>
      {msg && (
        <p role="alert" className="lab-erros-msg">
          {msg}
        </p>
      )}
    </div>
  )
}
