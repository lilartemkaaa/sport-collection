import api from './client'
import type { PackResult, League } from './types'

export const openPack = (league: League) =>
  api.post<PackResult>('/packs/open', { league }).then(r => r.data)
