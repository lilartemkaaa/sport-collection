export type League = 'football' | 'nba' | 'nhl'
export type Rarity = 'common' | 'rare' | 'legendary'
export type Role = 'user' | 'admin'

export interface User {
  id: number
  username: string
  role: Role
  tickets_balance: number
}

export interface Card {
  id: number
  name: string
  team: string | null
  league: League
  rarity: Rarity
  position: string | null
  image_url: string | null
}

export interface QuizSession {
  session_id: number
  question_id: number
  question: string
  option_1: string
  option_2: string
  option_3: string
  option_4: string
  created_at: string
}

export interface QuizResult {
  correct: boolean
  correct_option: number
  tickets_earned: number
  tickets_balance: number
}

export interface PackResult {
  card: Card
  tickets_balance: number
}
