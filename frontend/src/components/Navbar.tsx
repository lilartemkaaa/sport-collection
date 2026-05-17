import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../api/auth'

export default function Navbar() {
  const { user, setUser } = useAuth()
  const nav = useNavigate()

  const handleLogout = () => {
    logout()
    setUser(null)
    nav('/login')
  }

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-white font-bold text-lg tracking-tight">⚡ SportCards</Link>
          <Link to="/collection" className="text-slate-300 hover:text-white text-sm transition-colors">Коллекция</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">Админ</Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-yellow-400 text-sm font-semibold">🎟 {user?.tickets_balance ?? 0}</span>
          <span className="text-slate-400 text-sm">{user?.username}</span>
          <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm transition-colors">Выйти</button>
        </div>
      </div>
    </nav>
  )
}
