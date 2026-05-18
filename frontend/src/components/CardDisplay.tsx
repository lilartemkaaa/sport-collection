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

const leaguePlaceholderBg: Record<string, string> = {
  football: 'bg-green-950/60',
  nba:      'bg-orange-950/60',
  nhl:      'bg-blue-950/60',
}

const leaguePlaceholderText: Record<string, string> = {
  football: 'text-green-500',
  nba:      'text-orange-500',
  nhl:      'text-blue-500',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function CardDisplay({ card }: { card: Card }) {
  return (
    <div className={`h-full border rounded-xl overflow-hidden bg-slate-800 flex flex-col
                     ${rarityBorder[card.rarity]} ${rarityGlow[card.rarity]}`}>
      <div className={`flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center gap-3
                       ${leaguePlaceholderBg[card.league]}`}>
        {card.image_url ? (
          <img
            src={card.image_url}
            alt={card.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <>
            <span className={`text-4xl font-bold tracking-tight ${leaguePlaceholderText[card.league]}`}>
              {getInitials(card.name)}
            </span>
            {card.position && (
              <span className="text-slate-500 text-xs uppercase tracking-widest">
                {card.position}
              </span>
            )}
          </>
        )}
      </div>
      <div className="flex-none p-3 space-y-1.5">
        <p className="text-white text-xs font-medium truncate leading-snug">{card.name}</p>
        {card.team && (
          <p className="text-slate-500 text-xs truncate">{card.team}</p>
        )}
        <div className="flex items-center justify-between gap-1">
          <span className="text-slate-600 text-xs shrink-0">{leagueLabel[card.league]}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium shrink-0 ${rarityBadge[card.rarity]}`}>
            {rarityLabel[card.rarity]}
          </span>
        </div>
      </div>
    </div>
  )
}
