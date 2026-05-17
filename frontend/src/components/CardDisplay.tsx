import type { Card } from '../api/types'

const rarityStyles: Record<string, string> = {
  common: 'border-slate-500 bg-slate-800',
  rare: 'border-blue-500 bg-blue-950 shadow-blue-500/20 shadow-lg',
  legendary: 'border-yellow-400 bg-yellow-950 shadow-yellow-400/30 shadow-xl',
}

const rarityBadge: Record<string, string> = {
  common: 'bg-slate-600 text-slate-200',
  rare: 'bg-blue-600 text-white',
  legendary: 'bg-yellow-500 text-slate-900',
}

const rarityLabel: Record<string, string> = {
  common: 'Обычная',
  rare: 'Редкая',
  legendary: '⭐ Легендарная',
}

const leagueLabel: Record<string, string> = {
  football: '⚽ Футбол',
  nba: '🏀 NBA',
  nhl: '🏒 NHL',
}

export default function CardDisplay({ card }: { card: Card }) {
  return (
    <div className={`border-2 rounded-xl overflow-hidden ${rarityStyles[card.rarity]}`}>
      {card.image_url ? (
        <img src={card.image_url} alt={card.name} className="w-full h-40 object-cover object-top" />
      ) : (
        <div className="w-full h-40 flex items-center justify-center text-5xl bg-slate-700">🃏</div>
      )}
      <div className="p-3 space-y-1.5">
        <p className="text-white font-semibold text-sm truncate">{card.name}</p>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">{leagueLabel[card.league]}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rarityBadge[card.rarity]}`}>
            {rarityLabel[card.rarity]}
          </span>
        </div>
      </div>
    </div>
  )
}
