import { useEffect, useState } from 'react'
import { getCollection } from '../api/collection'
import CardDisplay from '../components/CardDisplay'
import type { Card, League } from '../api/types'

type Tab = 'all' | League

const TABS: { id: Tab; label: string }[] = [
  { id: 'all',      label: 'Все лиги' },
  { id: 'football', label: 'Футбол' },
  { id: 'nba',      label: 'NBA' },
  { id: 'nhl',      label: 'NHL' },
]

export default function CollectionPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('all')

  useEffect(() => {
    getCollection()
      .then(data => {
        const seen = new Set<number>()
        setCards(data.filter(c => {
          if (seen.has(c.id)) return false
          seen.add(c.id)
          return true
        }))
      })
      .finally(() => setLoading(false))
  }, [])

  const visible = tab === 'all' ? cards : cards.filter(c => c.league === tab)

  if (loading) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center text-slate-500 text-sm">
      Загрузка...
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white font-semibold text-lg">Моя коллекция</h1>
          <span className="text-slate-500 text-sm tabular-nums">{cards.length} карточек</span>
        </div>

        {/* Вкладки */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => {
            const count = t.id === 'all'
              ? cards.length
              : cards.filter(c => c.league === t.id).length
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border text-sm
                            font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-slate-800 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-500'
                }`}
              >
                {t.label}
                <span className={`text-xs tabular-nums ${
                  tab === t.id ? 'text-indigo-200' : 'text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-2">
            <p className="text-white font-medium">Карточек нет</p>
            <p className="text-slate-500 text-sm">
              {cards.length === 0
                ? 'Открывай паки на главной странице'
                : 'В этой лиге карточек пока нет'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {visible.map(card => (
              <CardDisplay key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
