import api from './client'
import type { Card } from './types'

export const getCollection = () => api.get<Card[]>('/user/collection').then(r => r.data)
