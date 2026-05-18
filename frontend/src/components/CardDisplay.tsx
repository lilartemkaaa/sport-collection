import type { Card } from '../api/types'

const rarityBorder: Record<string, string> = {
  common: 'border-slate-600',
  rare: 'border-blue-500',
  legendary: 'border-amber-500',
}

const rarityBadge: Record<string, string> = {
  common: 'bg-slate-700 text-slate-400',
  rare: 'bg-blue-900/50 text-blue-300',
  legendary: 'bg-amber-900/50 text-amber-300',
}

const rarityLabel: Record<string, string> = {
  common: 'Common',
  rare: 'Rare',
  legendary: 'Legendary',
}

const leagueLabel: Record<string, string> = {
  football: 'Футбол',
  nba: 'NBA',
  nhl: 'NHL',
}

export default function CardDisplay({ card }: { card: Card }) {
  return (
    <div className={`border rounded-xl overflow-hidden bg-slate-800 flex flex-col ${rarityBorder[card.rarity]}`}>

      {/* Картинка с фиксированными пропорциями */}
      <div className="relative w-full overflow-hidden bg-slate-700" style={{ aspectRatio: '3/4' }}>
        {card.image_url ? (
          <img
            src={card.image_url}
            alt={card.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-slate-600 text-xs uppercase tracking-widest">нет фото</span>
          </div>
        )}
      </div>

      {/* Мета-информация */}
      <div className="p-2.5 space-y-1.5">
        <p className="text-white text-xs font-medium truncate leading-snug">{card.name}</p>
        <div className="flex items-center justify-between gap-1">
          <span className="text-slate-500 text-xs shrink-0">{leagueLabel[card.league]}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${rarityBadge[card.rarity]}`}>
            {rarityLabel[card.rarity]}
          </span>
        </div>
      </div>
    </div>
  )
}
