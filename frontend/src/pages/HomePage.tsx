import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { openPack } from '../api/packs'
import { getMe } from '../api/auth'
import CardDisplay from '../components/CardDisplay'
import type { Card, League } from '../api/types'

const PACKS: { league: League; label: string; sublabel: string; accent: string }[] = [
  { league: 'football', label: 'Футбол', sublabel: 'Лига Чемпионов', accent: 'from-green-800 to-emerald-950' },
  { league: 'nba', label: 'NBA', sublabel: 'Баскетбол', accent: 'from-orange-800 to-red-950' },
  { league: 'nhl', label: 'NHL', sublabel: 'Хоккей', accent: 'from-blue-800 to-indigo-950' },
]

export default function HomePage() {
  const { user, setUser } = useAuth()
  const nav = useNavigate()
  const [wonCard, setWonCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState<League | null>(null)
  const [error, setError] = useState('')

  const handleOpen = async (league: League) => {
    setError('')
    setWonCard(null)
    setLoading(league)
    try {
      const result = await openPack(league)
      setWonCard(result.card)
      const me = await getMe()
      setUser(me)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg ?? 'Ошибка открытия пака')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-10">
      {/* Приветствие и баланс */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-white">Привет, {user?.username}</h1>
        <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-5 py-2 rounded-full">
          <span className="text-yellow-400 text-lg font-bold">{user?.tickets_balance}</span>
          <span className="text-slate-400 text-sm">билетов</span>
        </div>
      </div>

      {/* Кнопка викторины */}
      <div className="flex justify-center">
        <button
          onClick={() => nav('/quiz')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg text-sm"
        >
          Пройти викторину — заработай билеты
        </button>
      </div>

      {/* Паки */}
      <div>
        <h2 className="text-white text-lg font-semibold mb-4">Открыть пак — 10 билетов</h2>
        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 px-4 py-2.5 rounded-lg mb-4">
            {error}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PACKS.map(p => (
            <div
              key={p.league}
              className={`bg-gradient-to-br ${p.accent} rounded-2xl border border-white/10 overflow-hidden`}
            >
              <div className="px-5 pt-5 pb-4">
                <p className="text-white font-bold text-xl">{p.label}</p>
                <p className="text-white/50 text-xs mt-0.5">{p.sublabel}</p>
                <div className="flex gap-2 mt-3 text-xs text-white/40">
                  <span>60% обычные</span>
                  <span>·</span>
                  <span>30% редкие</span>
                  <span>·</span>
                  <span>10% легендарные</span>
                </div>
              </div>
              <div className="px-5 pb-5">
                <button
                  onClick={() => handleOpen(p.league)}
                  disabled={loading !== null}
                  className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-all border border-white/15 text-sm"
                >
                  {loading === p.league ? 'Открываем...' : 'Открыть за 10 билетов'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно с выпавшей карточкой */}
      {wonCard && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
          onClick={() => setWonCard(null)}
        >
          <div
            className="bg-slate-800 rounded-2xl p-6 max-w-xs w-full border border-slate-600 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-white font-bold text-center mb-1">Поздравляем!</p>
            <p className="text-slate-400 text-sm text-center mb-4">Вы получили карточку:</p>
            <CardDisplay card={wonCard} />
            <button
              onClick={() => setWonCard(null)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-semibold transition-colors text-sm"
            >
              Отлично
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
