// src/pages/Login.tsx
// Tela de autenticação com validação e credenciais da DummyJSON (Aula 9 e 10)
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

export default function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState<string>('emilys')
  const [password, setPassword] = useState<string>('emilyspass')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState<boolean>(false)

  // Se já estiver logado, redireciona diretamente para a tela de desejos
  if (usuario) {
    return <Navigate to="/desejos" replace />
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)

    try {
      await login(username.trim(), password)
      navigate('/desejos')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 400 || status === 401) {
          setErro('Usuário ou senha incorretos. Verifique os dados digitados.')
        } else {
          setErro('Não foi possível conectar ao servidor de login. Tente novamente.')
        }
      } else {
        setErro('Erro inesperado ao realizar login.')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon-login">✈️</div>
          <h2>Acesso FlyNow</h2>
          <p>Entre com sua conta para gerenciar seus desejos de viagem.</p>
        </div>

        {erro && (
          <div className="login-erro" role="alert">
            <span>⚠️ {erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-grupo">
            <label htmlFor="campo-username">Usuário</label>
            <input
              id="campo-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={enviando}
              required
            />
          </div>

          <div className="form-grupo">
            <label htmlFor="campo-password">Senha</label>
            <input
              id="campo-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={enviando}
              required
            />
          </div>

          <button type="submit" className="btn-login-submit" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar na Plataforma'}
          </button>
        </form>

        <div className="login-dica">
          <p>
            💡 <strong>Credenciais de teste da aula:</strong>
          </p>
          <div className="dica-botoes">
            <button
              type="button"
              className="btn-preencher-demo"
              onClick={() => {
                setUsername('emilys')
                setPassword('emilyspass')
              }}
            >
              Usar: emilys / emilyspass
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
