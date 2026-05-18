import { useEffect, useState } from 'react'
import { getCollection } from '../api/collection'
import CardDisplay from '../components/CardDisplay'
import type { Card, League } from '../api/types'

type Filter = 'all' | League

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',      label: 'Все' },
  { value: 'football', label: 'Футбол' },
  { value: 'nba',      label: 'NBA' },
  { value: 'nhl',      label: 'NHL' },
]

export default function CollectionPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    getCollection().then(setCards).finally(() => setLoading(false))
  }, [])

  const visible = filter === 'all' ? cards : cards.filter(c => c.league === filter)

  if (loading) return (
    <div className="flex items-center justify-center py-24 text-slate-500 text-sm">
      Загрузка...
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Шапка */}
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="text-lg font-semibold text-white">Моя коллекция</h1>
        <span className="text-slate-500 text-sm shrink-0">{cards.length} карточек</span>
      </div>

      {/* Фильтры по лигам */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => {
          const count = f.value === 'all'
            ? cards.length
            : cards.filter(c => c.league === f.value).length
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium
                          transition-all duration-200 ${
                filter === f.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              {f.label}
              <span className={`text-xs ${filter === f.value ? 'text-indigo-200' : 'text-slate-600'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Пустое состояние */}
      {visible.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-white font-medium text-sm">Карточек нет</p>
          <p className="text-slate-500 text-sm mt-1">
            {cards.length === 0
              ? 'Открывай паки на главной странице'
              : 'В этой лиге карточек пока нет'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visible.map(card => (
            <CardDisplay key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  )
}
