// src/components/Header.tsx
// Cabeçalho da aplicação com Navegação React Router e autenticação (Aula 9 e 10)
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const Header: React.FC = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flynow-header">
      <div className="header-container">
        <NavLink to="/destinos" className="header-brand-link">
          <div className="header-brand">
            <div className="logo-icon">✈️</div>
            <div>
              <h1 className="header-title">FlyNow</h1>
              <p className="header-subtitle">Painel de Viagens & Desejos</p>
            </div>
          </div>
        </NavLink>

        <nav className="nav" aria-label="Navegação principal">
          <NavLink
            to="/destinos"
            className={({ isActive }) => `nav-link ${isActive ? 'ativo' : ''}`}
          >
            🌍 Destinos
          </NavLink>

          <NavLink
            to="/desejos"
            className={({ isActive }) => `nav-link ${isActive ? 'ativo' : ''}`}
          >
            ✨ Meus Desejos
          </NavLink>
        </nav>

        <div className="header-auth-section">
          {usuario ? (
            <div className="usuario-logado-badge">
              <span className="usuario-saudacao">
                Olá, <strong>{usuario.firstName}</strong>
              </span>
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                title="Encerrar sessão"
              >
                Sair
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="btn-login-link">
              Entrar
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}
