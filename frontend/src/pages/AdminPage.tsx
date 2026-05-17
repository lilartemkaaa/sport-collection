import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { adminListCards, adminCreateCard, adminDeleteCard } from '../api/admin'
import type { Card, League, Rarity } from '../api/types'

const inputCls = 'w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500'
const selectCls = 'w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors'
const labelCls = 'block text-slate-400 text-xs mb-1.5 uppercase tracking-wide font-medium'

const RARITY_LABEL: Record<Rarity, string> = { common: 'Обычная', rare: 'Редкая', legendary: 'Легендарная' }
const LEAGUE_LABEL: Record<League, string> = { football: 'Футбол', nba: 'NBA', nhl: 'NHL' }

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
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Панель администратора</h1>

      {/* Форма создания */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-white font-semibold mb-5">Добавить карточку</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Имя игрока</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className={inputCls}
              placeholder="Имя спортсмена"
            />
          </div>
          <div>
            <label className={labelCls}>Лига</label>
            <select value={league} onChange={e => setLeague(e.target.value as League)} className={selectCls}>
              <option value="football">Футбол</option>
              <option value="nba">NBA</option>
              <option value="nhl">NHL</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Редкость</label>
            <select value={rarity} onChange={e => setRarity(e.target.value as Rarity)} className={selectCls}>
              <option value="common">Обычная</option>
              <option value="rare">Редкая</option>
              <option value="legendary">Легендарная</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>URL картинки</label>
            <input
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
          </div>
          {error && <p className="sm:col-span-2 text-red-400 text-sm">{error}</p>}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              {creating ? 'Создание...' : 'Добавить карточку'}
            </button>
          </div>
        </form>
      </div>

      {/* Список карточек */}
      <div>
        <h2 className="text-white font-semibold mb-4">
          Все карточки
          {!loading && <span className="text-slate-400 font-normal text-sm ml-2">({cards.length})</span>}
        </h2>
        {loading ? (
          <p className="text-slate-400 text-sm">Загрузка...</p>
        ) : (
          <div className="space-y-2">
            {cards.map(card => (
              <div
                key={card.id}
                className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-3 border border-slate-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {card.image_url && (
                    <img src={card.image_url} className="w-9 h-9 rounded-lg object-cover object-top shrink-0" alt="" />
                  )}
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">{card.name}</p>
                    <p className="text-slate-400 text-xs">
                      {LEAGUE_LABEL[card.league]} · {RARITY_LABEL[card.rarity]}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="text-slate-500 hover:text-red-400 text-sm transition-colors ml-4 shrink-0"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
