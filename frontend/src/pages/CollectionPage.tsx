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
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center text-slate-500 text-sm">
      Загрузка...
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Шапка */}
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-8">
          <h1 className="text-lg font-semibold text-white">Моя коллекция</h1>
          <span className="text-slate-500 text-sm">{cards.length} карточек</span>
        </div>

        {/* Фильтры — горизонтальный ряд с переносом */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {FILTERS.map(f => {
            const count = f.value === 'all'
              ? cards.length
              : cards.filter(c => c.league === f.value).length
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium
                            transition-all duration-200 ${
                  filter === f.value
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {f.label}
                <span className={`text-xs ${
                  filter === f.value ? 'text-indigo-200' : 'text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Пустое состояние */}
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="text-white font-medium text-sm">Карточек нет</p>
            <p className="text-slate-500 text-sm">
              {cards.length === 0
                ? 'Открывай паки на главной странице'
                : 'В этой лиге карточек пока нет'}
            </p>
          </div>
        ) : (
          /* Адаптивная сетка: 2 → 3 → 4 → 5 колонок */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {visible.map(card => (
              <CardDisplay key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
