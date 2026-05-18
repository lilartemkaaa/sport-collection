import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { startQuiz, submitQuiz } from '../api/quiz'
import { getMe } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import type { QuizSession, QuizResult } from '../api/types'

const TIMER_TOTAL = 20

export default function QuizPage() {
  const nav = useNavigate()
  const { setUser } = useAuth()
  const [session, setSession] = useState<QuizSession | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(TIMER_TOTAL)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const loadQuestion = () => {
    clearTimer()
    setLoading(true)
    setResult(null)
    setSelected(null)
    setTimeLeft(TIMER_TOTAL)
    setSession(null)
    startQuiz()
      .then(s => { setSession(s); setLoading(false) })
      .catch(() => nav('/'))
  }

  useEffect(() => {
    loadQuestion()
    return clearTimer
  }, [])

  useEffect(() => {
    if (!session || result) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleSubmit(0); return 0 }
        return t - 1
      })
    }, 1000)
    return clearTimer
  }, [session, result])

  const handleSubmit = async (option: number) => {
    if (!session || submitting || result) return
    clearTimer()
    setSelected(option)
    setSubmitting(true)
    try {
      const res = await submitQuiz(session.session_id, option)
      setResult(res)
      setUser(await getMe())
    } finally {
      setSubmitting(false)
    }
  }

  const options = session
    ? [session.option_1, session.option_2, session.option_3, session.option_4]
    : []

  const optionCls = (idx: number) => {
    const n = idx + 1
    const base = 'w-full p-5 text-left rounded-xl border text-sm font-medium transition-all duration-150 disabled:cursor-default'
    if (!result) return `${base} border-slate-700 bg-slate-700/20 text-slate-200 hover:border-indigo-500 hover:bg-slate-700/50`
    if (n === result.correct_option) return `${base} border-green-600 bg-green-900/25 text-green-300`
    if (n === selected && !result.correct) return `${base} border-red-600 bg-red-900/25 text-red-300`
    return `${base} border-slate-700/40 bg-slate-800/30 text-slate-600`
  }

  if (loading) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center text-slate-500 text-sm">
      Загрузка вопроса...
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-8 shadow-xl">

          {/* Шапка */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-base">Викторина</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-mono tabular-nums
                             border ${timeLeft <= 5
              ? 'text-red-400 border-red-900 bg-red-950/30'
              : 'text-indigo-400 border-slate-700 bg-slate-900/50'
            }`}>
              {timeLeft} с
            </span>
          </div>

          {/* Прогресс-бар таймера */}
          <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden mb-8">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-red-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${(timeLeft / TIMER_TOTAL) * 100}%` }}
            />
          </div>

          {/* Вопрос */}
          <p className="text-white text-lg font-medium text-center leading-relaxed mb-8">
            {session?.question}
          </p>

          {/* Варианты ответов */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(i + 1)}
                disabled={!!result || submitting || timeLeft === 0}
                className={optionCls(i)}
              >
                <span className="text-slate-500 text-xs font-mono mr-2">{i + 1}.</span>
                {opt}
              </button>
            ))}
          </div>

          {/* Блок результата */}
          {result && (
            <div className={`mt-6 rounded-xl border p-5 text-center ${
              result.correct
                ? 'bg-green-950/30 border-green-800/50'
                : 'bg-red-950/30 border-red-800/50'
            }`}>
              <p className={`font-bold text-lg ${result.correct ? 'text-green-400' : 'text-red-400'}`}>
                {result.correct ? 'Правильно' : 'Неверно'}
              </p>
              {result.tickets_earned > 0 && (
                <p className="text-indigo-400 text-sm mt-1">+{result.tickets_earned} билетов</p>
              )}
              {!result.correct && selected === 0 && (
                <p className="text-slate-500 text-sm mt-1">Время вышло</p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
                <button
                  onClick={loadQuestion}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white
                             text-sm font-semibold rounded-xl transition-all active:scale-[0.98]"
                >
                  Следующий вопрос
                </button>
                <button
                  onClick={() => nav('/')}
                  className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300
                             text-sm font-medium rounded-xl transition-all"
                >
                  На главную
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
