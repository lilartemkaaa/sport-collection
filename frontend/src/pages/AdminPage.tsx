import { useEffect, useState, FormEvent } from 'react'
import { adminListCards, adminCreateCard, adminDeleteCard } from '../api/admin'
import type { Card, League, Rarity } from '../api/types'

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
      setName(''); setImageUrl('')
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

  const sel = 'bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:border-purple-500'

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Панель администратора</h1>

      {/* Форма создания */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-white font-bold text-lg mb-4">Новая карточка</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wide">Имя игрока</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              placeholder="Имя спортсмена" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wide">Лига</label>
            <select value={league} onChange={e => setLeague(e.target.value as League)} className={sel}>
              <option value="football">⚽ Футбол</option>
              <option value="nba">🏀 NBA</option>
              <option value="nhl">🏒 NHL</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wide">Редкость</label>
            <select value={rarity} onChange={e => setRarity(e.target.value as Rarity)} className={sel}>
              <option value="common">Обычная</option>
              <option value="rare">Редкая</option>
              <option value="legendary">Легендарная</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wide">URL картинки</label>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              placeholder="https://..." />
          </div>
          {error && <p className="sm:col-span-2 text-red-400 text-sm">{error}</p>}
          <div className="sm:col-span-2">
            <button type="submit" disabled={creating}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
              {creating ? 'Создание...' : '+ Создать карточку'}
            </button>
          </div>
        </form>
      </div>

      {/* Список карточек */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4">Все карточки ({cards.length})</h2>
        {loading ? (
          <p className="text-slate-400">Загрузка...</p>
        ) : (
          <div className="space-y-2">
            {cards.map(card => (
              <div key={card.id} className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-3 border border-slate-700">
                <div className="flex items-center gap-3">
                  {card.image_url && <img src={card.image_url} className="w-10 h-10 rounded-lg object-cover object-top" alt="" />}
                  <div>
                    <p className="text-white font-medium text-sm">{card.name}</p>
                    <p className="text-slate-400 text-xs">{card.league} · {card.rarity}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(card.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-1.5 rounded-lg text-sm transition-colors">
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
