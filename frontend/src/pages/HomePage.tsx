import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { openPack } from '../api/packs'
import { getMe } from '../api/auth'
import CardDisplay from '../components/CardDisplay'
import type { Card, League } from '../api/types'

const PACKS: { league: League; label: string; icon: string; color: string }[] = [
  { league: 'football', label: 'Лига Чемпионов', icon: '⚽', color: 'from-green-700 to-emerald-900' },
  { league: 'nba', label: 'NBA', icon: '🏀', color: 'from-orange-700 to-red-900' },
  { league: 'nhl', label: 'NHL', icon: '🏒', color: 'from-blue-700 to-indigo-900' },
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
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">Привет, {user?.username}!</h1>
        <div className="inline-flex items-center gap-2 bg-slate-800 px-5 py-2 rounded-full border border-slate-700">
          <span className="text-2xl">🎟</span>
          <span className="text-yellow-400 text-xl font-bold">{user?.tickets_balance}</span>
          <span className="text-slate-400">билетов</span>
        </div>
      </div>

      {/* Кнопка викторины */}
      <div className="text-center">
        <button onClick={() => nav('/quiz')}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg font-bold px-10 py-4 rounded-2xl transition-all shadow-lg hover:shadow-purple-500/20 hover:scale-105 active:scale-95">
          🎯 Играть в викторину (+10 билетов)
        </button>
      </div>

      {/* Паки */}
      <div>
        <h2 className="text-white text-xl font-bold mb-4 text-center">Открыть пак</h2>
        {error && (
          <p className="text-red-400 text-sm text-center bg-red-900/20 px-4 py-2 rounded-lg mb-4">{error}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PACKS.map(p => (
            <div key={p.league} className={`bg-gradient-to-br ${p.color} rounded-2xl p-6 border border-white/10 flex flex-col items-center gap-4`}>
              <div className="text-6xl">{p.icon}</div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">{p.label}</p>
                <p className="text-white/60 text-xs mt-1">Common 60% · Rare 30% · Legendary 10%</p>
              </div>
              <button onClick={() => handleOpen(p.league)} disabled={loading !== null}
                className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all border border-white/20 text-sm">
                {loading === p.league ? 'Открываем...' : '🎟 Открыть за 10 билетов'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Выпавшая карточка */}
      {wonCard && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setWonCard(null)}>
          <div className="bg-slate-800 rounded-2xl p-6 max-w-xs w-full border border-slate-600 text-center" onClick={e => e.stopPropagation()}>
            <p className="text-white font-bold text-lg mb-4">🎉 Поздравляем!</p>
            <CardDisplay card={wonCard} />
            <button onClick={() => setWonCard(null)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-semibold transition-colors">
              Отлично!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
