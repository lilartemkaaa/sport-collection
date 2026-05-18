import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { openPack } from '../api/packs'
import { getMe } from '../api/auth'
import CardDisplay from '../components/CardDisplay'
import type { Card, League } from '../api/types'

const PACKS: { league: League; label: string; desc: string }[] = [
  { league: 'football', label: 'FOOTBALL', desc: 'Лига Чемпионов' },
  { league: 'nba',     label: 'NBA',       desc: 'Баскетбол' },
  { league: 'nhl',     label: 'NHL',       desc: 'Хоккей' },
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
    <div className="space-y-8">

      {/* Виджет баланса + кнопка викторины */}
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6
                      flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Баланс</p>
          <p className="text-3xl md:text-4xl font-light text-indigo-400 tabular-nums leading-none">
            {user?.tickets_balance ?? 0}
            <span className="text-base text-slate-500 font-normal ml-2">билетов</span>
          </p>
          <p className="text-slate-600 text-xs mt-1.5">{user?.username}</p>
        </div>
        <button
          onClick={() => nav('/quiz')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3
                     rounded-xl transition-all duration-200 text-sm whitespace-nowrap
                     self-start sm:self-center shrink-0"
        >
          Пройти викторину
        </button>
      </div>

      {/* Секция бустеров */}
      <div>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-white font-semibold text-base">Открыть бустер</h2>
          <span className="text-slate-500 text-sm">10 билетов за пак</span>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-900/50 text-red-400 text-sm
                          px-4 py-2.5 rounded-xl mb-5">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKS.map(p => (
            <div
              key={p.league}
              className="bg-slate-800 border border-slate-700/50 rounded-2xl
                         overflow-hidden flex flex-col"
            >
              {/* Контент карточки пака */}
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center gap-2">
                <p className="text-white font-bold text-2xl tracking-widest">{p.label}</p>
                <p className="text-slate-500 text-sm">{p.desc}</p>
                <div className="flex flex-wrap justify-center gap-x-3 mt-3 text-xs text-slate-600">
                  <span>60% Common</span>
                  <span>30% Rare</span>
                  <span>10% Legendary</span>
                </div>
              </div>

              {/* Кнопка внизу */}
              <div className="p-4 border-t border-slate-700/50">
                <button
                  onClick={() => handleOpen(p.league)}
                  disabled={loading !== null}
                  className="w-full bg-slate-700 hover:bg-indigo-600
                             disabled:opacity-40 disabled:cursor-not-allowed
                             text-white font-medium py-2.5 rounded-xl
                             transition-all duration-200 text-sm"
                >
                  {loading === p.league ? 'Открываем...' : 'Открыть за 10 билетов'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно с карточкой */}
      {wonCard && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center
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
              <p className="text-slate-500 text-xs mt-0.5">Добавлена в коллекцию</p>
            </div>
            <CardDisplay card={wonCard} />
            <button
              onClick={() => setWonCard(null)}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white
                         py-2.5 rounded-xl font-medium transition-all duration-200 text-sm"
            >
              Отлично
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
