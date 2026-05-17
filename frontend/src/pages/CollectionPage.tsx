import { useEffect, useState } from 'react'
import { getCollection } from '../api/collection'
import CardDisplay from '../components/CardDisplay'
import type { Card, League } from '../api/types'

const LEAGUE_LABELS: Record<League, string> = {
  football: 'Футбол',
  nba: 'NBA',
  nhl: 'NHL',
}

export default function CollectionPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollection().then(setCards).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">Загрузка коллекции...</div>
  )

  if (cards.length === 0) return (
    <div className="text-center py-20 space-y-2">
      <p className="text-white text-xl font-semibold">Коллекция пуста</p>
      <p className="text-slate-400 text-sm">Открывай паки на главной странице, чтобы получить карточки</p>
    </div>
  )

  const byLeague = (['football', 'nba', 'nhl'] as League[])
    .map(league => ({ league, cards: cards.filter(c => c.league === league) }))
    .filter(g => g.cards.length > 0)

  return (
    <div className="space-y-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-white">Моя коллекция</h1>
        <span className="text-slate-400 text-sm">{cards.length} карточек</span>
      </div>

      {byLeague.map(({ league, cards: lCards }) => (
        <div key={league}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-white font-semibold">{LEAGUE_LABELS[league]}</h2>
            <span className="text-slate-500 text-sm">{lCards.length} шт.</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {lCards.map(card => <CardDisplay key={card.id} card={card} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
