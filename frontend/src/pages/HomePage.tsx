import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { openPack } from '../api/packs'
import { getMe } from '../api/auth'
import CardDisplay from '../components/CardDisplay'
import type { Card, League } from '../api/types'

const PACKS: { league: League; label: string; sub: string }[] = [
  { league: 'football', label: 'Football', sub: 'Лига Чемпионов' },
  { league: 'nba',      label: 'NBA',      sub: 'Баскетбол' },
  { league: 'nhl',      label: 'NHL',      sub: 'Хоккей' },
]

const DROP_RATES = [
  { label: 'Common',    pct: '60%', cls: 'text-slate-400' },
  { label: 'Rare',      pct: '30%', cls: 'text-blue-400' },
  { label: 'Legendary', pct: '10%', cls: 'text-amber-400' },
]

export default function HomePage() {
  const { user, setUser } = useAuth()
  const nav = useNavigate()
  const [wonCard, setWonCard] = useState<Card | null>(null)
  const [opening, setOpening] = useState<League | null>(null)
  const [error, setError] = useState('')

  const handleOpen = async (league: League) => {
    setError('')
    setWonCard(null)
    setOpening(league)
    try {
      const result = await openPack(league)
      setWonCard(result.card)
      setUser(await getMe())
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg ?? 'Недостаточно билетов')
    } finally {
      setOpening(null)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

        {/* Панель баланса */}
        <div className="bg-slate-800 border border-slate-700/50 rounded-2xl px-6 py-5
                        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Баланс</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-light text-white tabular-nums leading-none">
                {user?.tickets_balance ?? 0}
              </span>
              <span className="text-slate-500 text-sm">билетов</span>
            </div>
          </div>
          <button
            onClick={() => nav('/quiz')}
            className="w-full sm:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-500
                       text-white font-semibold text-sm rounded-xl transition-all active:scale-[0.98]"
          >
            Пройти викторину
          </button>
        </div>

        {/* Заголовок паков */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">Бустеры</h2>
          <span className="text-slate-500 text-sm">10 билетов за пак</span>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-950/50 border border-red-900/50 rounded-xl text-red-400 text-sm -mt-4">
            {error}
          </div>
        )}

        {/* Сетка паков */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PACKS.map(p => (
            <div
              key={p.league}
              className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6
                         flex flex-col gap-6 hover:border-slate-600 transition-colors"
            >
              <div>
                <p className="text-white font-bold text-2xl tracking-wide">{p.label}</p>
                <p className="text-slate-500 text-sm mt-1">{p.sub}</p>
              </div>

              <div className="space-y-2">
                {DROP_RATES.map(r => (
                  <div key={r.label} className="flex justify-between items-center text-xs">
                    <span className={r.cls}>{r.label}</span>
                    <span className="text-slate-400 font-mono">{r.pct}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleOpen(p.league)}
                disabled={opening !== null}
                className="w-full py-3 bg-slate-700 hover:bg-indigo-600
                           disabled:opacity-40 disabled:cursor-not-allowed
                           text-white text-sm font-medium rounded-xl transition-all"
              >
                {opening === p.league ? 'Открываем...' : 'Открыть за 10 билетов'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Модалка выигрыша */}
      {wonCard && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setWonCard(null)}
        >
          <div
            className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-xs shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <p className="text-white font-semibold text-base">Новая карточка</p>
              <p className="text-slate-500 text-xs mt-1">Добавлена в коллекцию</p>
            </div>
            <CardDisplay card={wonCard} />
            <button
              onClick={() => setWonCard(null)}
              className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white
                         text-sm font-semibold rounded-xl transition-all"
            >
              Отлично
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
