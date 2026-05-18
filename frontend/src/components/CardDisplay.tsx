import type { Card } from '../api/types'

const rarityBorder: Record<string, string> = {
  common:    'border-slate-700',
  rare:      'border-blue-500',
  legendary: 'border-amber-500',
}

const rarityGlow: Record<string, string> = {
  common:    '',
  rare:      'shadow-blue-900/30 shadow-md',
  legendary: 'shadow-amber-900/40 shadow-lg',
}

const rarityBadge: Record<string, string> = {
  common:    'bg-slate-700 text-slate-400',
  rare:      'bg-blue-900/50 text-blue-300',
  legendary: 'bg-amber-900/50 text-amber-300',
}

const rarityLabel: Record<string, string> = {
  common:    'Common',
  rare:      'Rare',
  legendary: 'Legendary',
}

const leagueLabel: Record<string, string> = {
  football: 'Football',
  nba:      'NBA',
  nhl:      'NHL',
}

export default function CardDisplay({ card }: { card: Card }) {
  return (
    <div className={`h-full border rounded-xl overflow-hidden bg-slate-800 flex flex-col
                     ${rarityBorder[card.rarity]} ${rarityGlow[card.rarity]}`}>
      {/* Изображение занимает всё свободное пространство карточки */}
      <div className="flex-1 min-h-0 bg-slate-700 overflow-hidden">
        {card.image_url ? (
          <img
            src={card.image_url}
            alt={card.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate-600 text-xs uppercase tracking-widest">нет фото</span>
          </div>
        )}
      </div>
      {/* Подпись — фиксированная нижняя полоска */}
      <div className="flex-none p-3.5 space-y-2">
        <p className="text-white text-xs font-medium truncate leading-snug">{card.name}</p>
        <div className="flex items-center justify-between gap-1">
          <span className="text-slate-500 text-xs shrink-0">{leagueLabel[card.league]}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium shrink-0 ${rarityBadge[card.rarity]}`}>
            {rarityLabel[card.rarity]}
          </span>
        </div>
      </div>
    </div>
  )
}
