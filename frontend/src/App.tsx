import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import CollectionPage from './pages/CollectionPage'
import AdminPage from './pages/AdminPage'
import Navbar from './components/Navbar'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-slate-400">Загрузка...</div>
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" replace />
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
          <Route path="/quiz" element={<PrivateRoute><Layout><QuizPage /></Layout></PrivateRoute>} />
          <Route path="/collection" element={<PrivateRoute><Layout><CollectionPage /></Layout></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><Layout><AdminPage /></Layout></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
