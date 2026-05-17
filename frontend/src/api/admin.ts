import api from './client'
import type { Card, League, Rarity } from './types'

export const adminListCards = () => api.get<Card[]>('/admin/cards').then(r => r.data)
export const adminCreateCard = (data: { name: string; league: League; rarity: Rarity; image_url: string }) =>
  api.post<Card>('/admin/cards', data).then(r => r.data)
export const adminDeleteCard = (id: number) => api.delete(`/admin/cards/${id}`)
