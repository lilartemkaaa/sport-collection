import api from './client'
import type { QuizSession, QuizResult } from './types'

export const startQuiz = () => api.post<QuizSession>('/quiz/start').then(r => r.data)
export const submitQuiz = (session_id: number, selected_option: number) =>
  api.post<QuizResult>('/quiz/submit', { session_id, selected_option }).then(r => r.data)
