import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
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

  const navLinkCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-white bg-slate-800'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">

          {/* Логотип */}
          <Link to="/" className="shrink-0 text-base font-bold tracking-tight">
            <span className="text-white">Sport</span><span className="text-indigo-400">Cards</span>
          </Link>

          {/* Навигация — десктоп */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkCls}>Главная</NavLink>
            <NavLink to="/collection" className={navLinkCls}>Коллекция</NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkCls}>Администратор</NavLink>
            )}
          </nav>

          {/* Правая часть — десктоп */}
          <div className="hidden md:flex items-center gap-3 ml-auto shrink-0">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-2">
              <span className="text-indigo-400 font-bold text-sm tabular-nums">
                {user?.tickets_balance ?? 0}
              </span>
              <span className="text-slate-500 text-xs">билетов</span>
            </div>
            <div className="w-px h-5 bg-slate-700 mx-1" />
            <span className="text-slate-300 text-sm">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm text-slate-400 hover:text-white border border-slate-700/60
                         hover:border-slate-500 rounded-lg transition-colors"
            >
              Выйти
            </button>
          </div>

          {/* Мобильная правая часть */}
          <div className="flex md:hidden items-center gap-4 ml-auto shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-1.5">
              <span className="text-indigo-400 font-bold text-xs tabular-nums">
                {user?.tickets_balance ?? 0}
              </span>
              <span className="text-slate-500 text-xs">б.</span>
            </div>
            <button
              onClick={() => setOpen(o => !o)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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

        {/* Мобильное меню */}
        {open && (
          <nav className="md:hidden border-t border-slate-800 py-3 space-y-1">
            <NavLink to="/" end className={navLinkCls} onClick={() => setOpen(false)}>
              Главная
            </NavLink>
            <NavLink to="/collection" className={navLinkCls} onClick={() => setOpen(false)}>
              Коллекция
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkCls} onClick={() => setOpen(false)}>
                Администратор
              </NavLink>
            )}
            <div className="border-t border-slate-800 mt-3 pt-3 px-1 flex items-center justify-between">
              <span className="text-slate-400 text-sm px-2">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-white border border-slate-700/60
                           hover:border-slate-500 rounded-lg transition-colors"
              >
                Выйти
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
