import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register, getMe } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const nav = useNavigate()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') await register(username, password)
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
    'w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white ' +
    'placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors'

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">SportCards</h1>
          <p className="text-slate-500 text-sm mt-1">Коллекционируй. Соревнуйся. Побеждай.</p>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-6 shadow-2xl">

          <div className="flex bg-slate-900 rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  mode === m ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Войти' : 'Регистрация'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">
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
              <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">
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

            {error && (
              <div className="bg-red-950/50 border border-red-900/50 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
                         text-white font-semibold text-sm rounded-xl transition-all
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
