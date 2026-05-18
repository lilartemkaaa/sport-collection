import api from './client'
import type { Card, League, Rarity } from './types'

export const adminListCards = () => api.get<Card[]>('/admin/cards').then(r => r.data)
export const adminCreateCard = (data: {
  name: string
  team?: string | null
  league: League
  rarity: Rarity
  position?: string | null
  image_url?: string | null
}) => api.post<Card>('/admin/cards', data).then(r => r.data)
export const adminDeleteCard = (id: number) => api.delete(`/admin/cards/${id}`)
