import { useEffect, useState } from 'react'
import { getCollection } from '../api/collection'
import CardDisplay from '../components/CardDisplay'
import type { Card, League } from '../api/types'

const LEAGUE_LABELS: Record<League, string> = {
  football: '⚽ Футбол',
  nba: '🏀 NBA',
  nhl: '🏒 NHL',
}

export default function CollectionPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollection().then(setCards).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center text-slate-400 py-20">Загрузка коллекции...</div>

  if (cards.length === 0) return (
    <div className="text-center py-20 space-y-3">
      <p className="text-6xl">🃏</p>
      <p className="text-white text-xl font-bold">Коллекция пуста</p>
      <p className="text-slate-400">Открой паки на главной странице</p>
    </div>
  )

  const byLeague = (['football', 'nba', 'nhl'] as League[]).map(league => ({
    league,
    cards: cards.filter(c => c.league === league),
  })).filter(g => g.cards.length > 0)

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Моя коллекция</h1>
        <p className="text-slate-400 mt-1">{cards.length} {cards.length === 1 ? 'карточка' : 'карточек'}</p>
      </div>

      {byLeague.map(({ league, cards: lCards }) => (
        <div key={league}>
          <h2 className="text-white text-lg font-bold mb-4">{LEAGUE_LABELS[league]}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {lCards.map(card => <CardDisplay key={card.id} card={card} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
