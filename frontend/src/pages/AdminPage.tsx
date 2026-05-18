import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { adminListCards, adminCreateCard, adminDeleteCard } from '../api/admin'
import type { Card, League, Rarity } from '../api/types'

const fieldCls =
  'w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl ' +
  'px-4 py-3 text-white text-sm placeholder-slate-600 outline-none transition-all duration-200'
const labelCls = 'block text-slate-500 text-xs uppercase tracking-widest mb-2'

const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Common', rare: 'Rare', legendary: 'Legendary',
}
const LEAGUE_LABEL: Record<League, string> = {
  football: 'Football', nba: 'NBA', nhl: 'NHL',
}

export default function AdminPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [league, setLeague] = useState<League>('football')
  const [rarity, setRarity] = useState<Rarity>('common')
  const [imageUrl, setImageUrl] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const load = () => adminListCards().then(setCards).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setCreating(true)
    try {
      await adminCreateCard({ name, league, rarity, image_url: imageUrl })
      setName('')
      setImageUrl('')
      await load()
    } catch {
      setError('Ошибка создания карточки')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: number) => {
    await adminDeleteCard(id)
    setCards(c => c.filter(x => x.id !== id))
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-white font-semibold text-lg">Панель администратора</h1>

        {/* Форма добавления */}
        <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-white font-medium text-sm mb-5">Добавить карточку</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Имя игрока</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className={fieldCls}
                placeholder="Имя спортсмена"
              />
            </div>
            <div>
              <label className={labelCls}>Лига</label>
              <select value={league} onChange={e => setLeague(e.target.value as League)} className={fieldCls}>
                <option value="football">Football</option>
                <option value="nba">NBA</option>
                <option value="nhl">NHL</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Редкость</label>
              <select value={rarity} onChange={e => setRarity(e.target.value as Rarity)} className={fieldCls}>
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>URL картинки</label>
              <input
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className={fieldCls}
                placeholder="https://..."
              />
            </div>
            {error && <p className="sm:col-span-2 text-red-400 text-sm">{error}</p>}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40
                           text-white font-medium px-6 py-3 rounded-xl
                           transition-all duration-200 text-sm
                           hover:scale-[1.01] active:scale-[0.99]"
              >
                {creating ? 'Создание...' : 'Добавить карточку'}
              </button>
            </div>
          </form>
        </div>

        {/* Список */}
        <div>
          <h2 className="text-white font-medium text-sm mb-4">
            Все карточки
            {!loading && (
              <span className="text-slate-500 font-normal ml-2">({cards.length})</span>
            )}
          </h2>
          {loading ? (
            <p className="text-slate-500 text-sm">Загрузка...</p>
          ) : (
            <div className="space-y-2">
              {cards.map(card => (
                <div
                  key={card.id}
                  className="flex items-center justify-between gap-3 bg-slate-800
                             border border-slate-700/50 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {card.image_url && (
                      <img
                        src={card.image_url}
                        className="w-9 h-9 rounded-lg object-cover object-top shrink-0"
                        alt=""
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-white text-sm truncate">{card.name}</p>
                      <p className="text-slate-500 text-xs">
                        {LEAGUE_LABEL[card.league]} · {RARITY_LABEL[card.rarity]}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="text-slate-500 hover:text-red-400 text-xs border border-slate-700
                               hover:border-red-900/60 rounded-lg transition-all duration-200
                               shrink-0 px-3 py-1.5"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
