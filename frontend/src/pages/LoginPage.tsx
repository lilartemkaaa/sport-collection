import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register, getMe } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const nav = useNavigate()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') await register(username, password, role)
      await login(username, password)
      const me = await getMe()
      setUser(me)
      nav('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg ?? 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm ' +
    'placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors'

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">
            <span className="text-white">Sport</span><span className="text-indigo-400">Cards</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2">Коллекционируй. Соревнуйся. Побеждай.</p>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-8 shadow-2xl">

          {/* Переключатель режима */}
          <div className="flex bg-slate-900 rounded-xl p-1 mb-7">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  mode === m ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Войти' : 'Регистрация'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                Логин
              </label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="username"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••"
                className={inputCls}
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
                  Роль
                </label>
                <div className="flex bg-slate-900 rounded-xl p-1">
                  {(['user', 'admin'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                        role === r ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {r === 'user' ? 'Пользователь' : 'Администратор'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-950/50 border border-red-900/50 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
                         text-white font-semibold text-sm rounded-xl transition-colors
                         active:scale-[0.98]"
            >
              {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
