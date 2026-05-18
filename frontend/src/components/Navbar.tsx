import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../api/auth'

export default function Navbar() {
  const { user, setUser } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setUser(null)
    nav('/login')
    setOpen(false)
  }

  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Логотип */}
          <Link to="/" className="text-white font-semibold text-sm tracking-tight shrink-0">
            SportCards
          </Link>

          {/* Навигация — только десктоп */}
          <nav className="hidden md:flex items-center gap-6 flex-1 ml-8">
            <Link to="/" className="text-slate-400 hover:text-white text-sm transition-all duration-200">
              Главная
            </Link>
            <Link to="/collection" className="text-slate-400 hover:text-white text-sm transition-all duration-200">
              Коллекция
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-indigo-400 hover:text-indigo-300 text-sm transition-all duration-200">
                Админ
              </Link>
            )}
          </nav>

          {/* Правая часть — десктоп */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700/50 px-3 py-1 rounded-full">
              <span className="text-indigo-400 font-semibold text-sm tabular-nums">
                {user?.tickets_balance ?? 0}
              </span>
              <span className="text-slate-500 text-xs">билетов</span>
            </div>
            <span className="text-slate-500 text-sm">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white text-sm transition-all duration-200"
            >
              Выйти
            </button>
          </div>

          {/* Мобильный правый блок: баланс + гамбургер */}
          <div className="flex md:hidden items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700/50 px-2.5 py-1 rounded-full">
              <span className="text-indigo-400 font-semibold text-xs tabular-nums">
                {user?.tickets_balance ?? 0}
              </span>
              <span className="text-slate-500 text-xs">б.</span>
            </div>
            <button
              onClick={() => setOpen(o => !o)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-all duration-200"
              aria-label="Меню"
            >
              {open ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Мобильное выпадающее меню */}
        {open && (
          <div className="md:hidden border-t border-slate-800 py-2 space-y-0.5">
            <Link to="/" onClick={close}
              className="flex items-center px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition-all duration-200">
              Главная
            </Link>
            <Link to="/collection" onClick={close}
              className="flex items-center px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition-all duration-200">
              Коллекция
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={close}
                className="flex items-center px-3 py-2.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg text-sm transition-all duration-200">
                Админ
              </Link>
            )}
            <div className="border-t border-slate-800 mt-2 pt-2 flex items-center justify-between px-3">
              <span className="text-slate-500 text-sm">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white text-sm transition-all duration-200"
              >
                Выйти
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
