import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getMe } from '../api/auth'
import type { User } from '../api/types'

interface AuthCtx {
  user: User | null
  setUser: (u: User | null) => void
  loading: boolean
}

const Ctx = createContext<AuthCtx>({ user: null, setUser: () => {}, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getMe().then(setUser).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  return <Ctx.Provider value={{ user, setUser, loading }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
