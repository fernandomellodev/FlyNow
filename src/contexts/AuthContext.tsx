// src/contexts/AuthContext.tsx
// Gerenciamento global de autenticação com React Context (Aula 9 e 10)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Usuario } from '../types'
import { login as apiLogin, me as apiMe } from '../services/auth'
import { registrarAoExpirar } from '../services/http'

interface AuthContextData {
  usuario: Usuario | null
  token: string | null
  carregando: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('flynow.token'))
  const [carregando, setCarregando] = useState<boolean>(true)

  const logout = useCallback(() => {
    localStorage.removeItem('flynow.token')
    setToken(null)
    setUsuario(null)
  }, [])

  // Sincroniza interceptor do Axios para executar logout automático ao receber 401
  useEffect(() => {
    registrarAoExpirar(logout)
    return () => registrarAoExpirar(null)
  }, [logout])

  // Restaura a sessão ao recarregar a página (F5) via GET /auth/me
  useEffect(() => {
    async function restaurarSessao() {
      const salvo = localStorage.getItem('flynow.token')
      if (!salvo) {
        setCarregando(false)
        return
      }

      try {
        const dadosUsuario = await apiMe(salvo)
        setUsuario(dadosUsuario)
        setToken(salvo)
      } catch (err) {
        console.warn('Sessão expirada ou inválida ao recarregar:', err)
        logout()
      } finally {
        setCarregando(false)
      }
    }

    restaurarSessao()
  }, [logout])

  const login = async (username: string, password: string): Promise<void> => {
    const dados = await apiLogin({ username, password })
    if (dados.token) {
      localStorage.setItem('flynow.token', dados.token)
      setToken(dados.token)
    }
    setUsuario(dados)
  }

  return (
    <AuthContext.Provider value={{ usuario, token, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider')
  }
  return context
}
