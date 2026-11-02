// src/routes/ProtectedRoute.tsx
// Rota protegida com verificação do AuthContext (Aula 9 e 10)
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute() {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verificando sessão...</p>
      </div>
    )
  }

  return usuario ? <Outlet /> : <Navigate to="/login" replace />
}
