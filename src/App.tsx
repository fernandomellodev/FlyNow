// src/App.tsx
// Roteador principal da aplicação FlyNow com rotas protegidas (Aula 9 e 10)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import { Header } from './components/Header'
import Destinos from './pages/Destinos'
import Desejos from './pages/Desejos'
import Login from './pages/Login'
import LabErros from './components/LabErros'
import './App.css'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-layout">
          <Header />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/destinos" replace />} />
              <Route path="/destinos" element={<Destinos />} />
              <Route path="/login" element={<Login />} />

              {/* Rotas protegidas (exigem autenticação via AuthContext) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/desejos" element={<Desejos />} />
              </Route>

              {/* Fallback para rotas inexistentes */}
              <Route path="*" element={<Navigate to="/destinos" replace />} />
            </Routes>

            {/* Simulador de erros HTTP para treinamento (Slide 42) */}
            <section className="container-lab-erros">
              <LabErros />
            </section>
          </main>

          <footer className="flynow-footer">
            <div className="footer-content">
              <p>
                <strong>FlyNow · Aula 10</strong> — CRUD · Erros · Layout Responsivo
              </p>
              <p className="footer-sub">
                Laboratório de Programação Front End · Engenharia de Software 2026.2 · Profa. Laís Pinheiro
              </p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
