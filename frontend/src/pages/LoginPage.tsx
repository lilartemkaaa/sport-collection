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
    'w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 ' +
    'rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none transition-all duration-200'

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">SportCards</h1>
          <p className="text-slate-500 text-sm mt-2">Коллекционируй. Играй. Выигрывай.</p>
        </div>

        <div className="bg-slate-800 border border-slate-700/50 p-8 rounded-2xl shadow-2xl flex flex-col gap-6">

          <div className="flex rounded-xl bg-slate-900 p-1">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  mode === m
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m === 'login' ? 'Войти' : 'Регистрация'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
              <label className="block text-slate-500 text-xs mb-2 uppercase tracking-widest">
                Логин
              </label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={inputCls}
                placeholder="username"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 text-xs mb-2 uppercase tracking-widest">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-950/60 border border-red-900/60 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40
                         disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl
                         transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]
                         shadow-lg shadow-indigo-900/30"
            >
              {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
