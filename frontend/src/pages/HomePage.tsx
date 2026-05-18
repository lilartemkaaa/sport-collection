import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { openPack } from '../api/packs'
import { getMe } from '../api/auth'
import CardDisplay from '../components/CardDisplay'
import type { Card, League } from '../api/types'

const PACKS: { league: League; label: string; desc: string }[] = [
  { league: 'football', label: 'FOOTBALL', desc: 'Лига Чемпионов' },
  { league: 'nba',      label: 'NBA',      desc: 'Баскетбол' },
  { league: 'nhl',      label: 'NHL',      desc: 'Хоккей' },
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
      setError(msg ?? 'Недостаточно билетов')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-4xl space-y-8">

        {/* Панель баланса + викторина */}
        <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full flex justify-between items-center gap-4">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Баланс</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-light text-indigo-400 tabular-nums leading-none">
                {user?.tickets_balance ?? 0}
              </span>
              <span className="text-slate-500 text-sm">билетов</span>
            </div>
          </div>
          <button
            onClick={() => nav('/quiz')}
            className="shrink-0 px-8 py-3 bg-indigo-600 hover:bg-indigo-500
                       rounded-xl font-semibold text-white text-sm transition-all duration-200
                       hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-900/30"
          >
            Пройти викторину
          </button>
        </div>

        {/* Бустеры */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-base">Открыть бустер</h2>
            <span className="text-slate-500 text-sm">10 билетов за пак</span>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-900/50 text-red-400 text-sm
                            px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKS.map(p => (
              <div
                key={p.league}
                className="bg-slate-800 border border-slate-700/50 rounded-2xl
                           flex flex-col overflow-hidden
                           hover:-translate-y-1 hover:border-slate-600
                           transition-all duration-300 shadow-lg"
              >
                <div className="flex-1 flex flex-col justify-center items-center
                                text-center px-6 py-10 gap-2">
                  <p className="text-white font-bold text-3xl tracking-widest">{p.label}</p>
                  <p className="text-slate-500 text-sm">{p.desc}</p>
                </div>

                <div className="px-6 pb-5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Common</span>
                    <span className="text-slate-400 font-mono">60%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-400">Rare</span>
                    <span className="text-slate-400 font-mono">30%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-400">Legendary</span>
                    <span className="text-slate-400 font-mono">10%</span>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-700/50">
                  <button
                    onClick={() => handleOpen(p.league)}
                    disabled={loading !== null}
                    className="w-full py-3 bg-slate-700 hover:bg-indigo-600
                               disabled:opacity-40 disabled:cursor-not-allowed
                               text-white font-medium rounded-xl
                               transition-all duration-200 text-sm"
                  >
                    {loading === p.league ? 'Открываем...' : 'Открыть за 10 билетов'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {wonCard && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center
                     z-50 p-4 backdrop-blur-sm"
          onClick={() => setWonCard(null)}
        >
          <div
            className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6
                       w-full max-w-xs shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <p className="text-white font-semibold">Новая карточка</p>
              <p className="text-slate-500 text-xs mt-1">Добавлена в коллекцию</p>
            </div>
            <CardDisplay card={wonCard} />
            <button
              onClick={() => setWonCard(null)}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white
                         py-3 rounded-xl font-semibold transition-all duration-200 text-sm"
            >
              Отлично
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
