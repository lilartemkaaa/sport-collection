import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { startQuiz, submitQuiz } from '../api/quiz'
import { getMe } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import type { QuizSession, QuizResult } from '../api/types'

export default function QuizPage() {
  const nav = useNavigate()
  const { setUser } = useAuth()
  const [session, setSession] = useState<QuizSession | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(20)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    startQuiz().then(s => { setSession(s); setLoading(false) }).catch(() => nav('/'))
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [nav])

  useEffect(() => {
    if (!session || result) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleSubmit(0); return 0 }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [session, result])

  const handleSubmit = async (option: number) => {
    if (!session || submitting || result) return
    if (timerRef.current) clearInterval(timerRef.current)
    setSelected(option)
    setSubmitting(true)
    try {
      const res = await submitQuiz(session.session_id, option)
      setResult(res)
      const me = await getMe()
      setUser(me)
    } finally {
      setSubmitting(false)
    }
  }

  const options = session ? [session.option_1, session.option_2, session.option_3, session.option_4] : []

  const getOptionStyle = (idx: number) => {
    const num = idx + 1
    if (!result) return 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white'
    if (num === result.correct_option) return 'bg-green-700 border-green-500 text-white'
    if (num === selected && !result.correct) return 'bg-red-700 border-red-500 text-white'
    return 'bg-slate-800 border-slate-700 text-slate-400'
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-lg">Загрузка вопроса...</div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Таймер */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Викторина</h2>
        <div className={`text-2xl font-bold tabular-nums ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
          ⏱ {timeLeft}с
        </div>
      </div>

      {/* Прогресс-бар таймера */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 transition-all duration-1000 rounded-full"
          style={{ width: `${(timeLeft / 20) * 100}%`, backgroundColor: timeLeft <= 5 ? '#f87171' : undefined }} />
      </div>

      {/* Вопрос */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <p className="text-white text-lg font-medium leading-relaxed">{session?.question}</p>
      </div>

      {/* Варианты */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleSubmit(i + 1)}
            disabled={!!result || submitting || timeLeft === 0}
            className={`border-2 rounded-xl px-5 py-4 text-left font-medium transition-all disabled:cursor-default ${getOptionStyle(i)}`}>
            <span className="text-slate-400 mr-3">{i + 1}.</span>{opt}
          </button>
        ))}
      </div>

      {/* Результат */}
      {result && (
        <div className={`rounded-2xl p-5 text-center border-2 ${result.correct ? 'bg-green-900/40 border-green-600' : 'bg-red-900/40 border-red-600'}`}>
          <p className="text-2xl mb-1">{result.correct ? '🎉' : '😔'}</p>
          <p className="text-white font-bold text-lg">
            {result.correct ? 'Правильно!' : 'Неверно'}
          </p>
          {result.tickets_earned > 0 && (
            <p className="text-yellow-400 mt-1">+{result.tickets_earned} 🎟 билетов</p>
          )}
          {!result.correct && timeLeft === 0 && (
            <p className="text-slate-400 text-sm mt-1">Время вышло</p>
          )}
          <button onClick={() => nav('/')}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-semibold transition-colors">
            На главную
          </button>
        </div>
      )}
    </div>
  )
}
