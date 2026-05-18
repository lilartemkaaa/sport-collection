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

  const loadQuestion = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setLoading(true)
    setResult(null)
    setSelected(null)
    setTimeLeft(20)
    setSession(null)
    startQuiz()
      .then(s => { setSession(s); setLoading(false) })
      .catch(() => nav('/'))
  }

  useEffect(() => {
    loadQuestion()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

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

  const options = session
    ? [session.option_1, session.option_2, session.option_3, session.option_4]
    : []

  const getOptionStyle = (idx: number) => {
    const num = idx + 1
    if (!result) {
      return 'bg-slate-700/30 border-slate-700 text-slate-200 hover:border-indigo-500 hover:bg-slate-700/60 hover:text-white'
    }
    if (num === result.correct_option) return 'bg-green-900/30 border-green-600 text-green-300'
    if (num === selected && !result.correct) return 'bg-red-900/30 border-red-600 text-red-300'
    return 'bg-slate-800/20 border-slate-700/40 text-slate-600'
  }

  if (loading) return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center text-slate-500 text-sm">
      Загрузка вопроса...
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-8 shadow-2xl">

          {/* Шапка: заголовок + таймер-плашка */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-semibold text-base">Викторина</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-mono tabular-nums
                             bg-slate-700/50 ${timeLeft <= 5 ? 'text-red-400' : 'text-indigo-400'}`}>
              {timeLeft}с
            </span>
          </div>

          {/* Полоса таймера */}
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-8">
            <div
              className={`h-full rounded-full transition-all duration-1000
                          ${timeLeft <= 5 ? 'bg-red-500' : 'bg-indigo-500'}`}
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            />
          </div>

          {/* Текст вопроса */}
          <p className="text-xl font-semibold text-white text-center leading-relaxed mb-8">
            {session?.question}
          </p>

          {/* Варианты ответов: 1 столбец → 2 столбца на sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(i + 1)}
                disabled={!!result || submitting || timeLeft === 0}
                className={`w-full p-5 text-left rounded-xl border font-medium text-sm
                            transition-all duration-200 active:scale-[0.98] disabled:cursor-default
                            ${getOptionStyle(i)}`}
              >
                <span className="text-slate-500 text-xs font-mono mr-2">{i + 1}.</span>
                {opt}
              </button>
            ))}
          </div>

          {/* Результат */}
          {result && (
            <div className={`mt-6 rounded-xl p-5 border text-center ${
              result.correct
                ? 'bg-green-900/20 border-green-800/60'
                : 'bg-red-900/20 border-red-800/60'
            }`}>
              <p className={`font-semibold text-lg ${
                result.correct ? 'text-green-400' : 'text-red-400'
              }`}>
                {result.correct ? 'Правильно' : 'Неверно'}
              </p>
              {result.tickets_earned > 0 && (
                <p className="text-indigo-400 text-sm mt-1">
                  +{result.tickets_earned} билетов
                </p>
              )}
              {!result.correct && timeLeft === 0 && (
                <p className="text-slate-500 text-sm mt-1">Время вышло</p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
                <button
                  onClick={loadQuestion}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5
                             rounded-xl font-medium transition-all duration-200 text-sm"
                >
                  Следующий вопрос
                </button>
                <button
                  onClick={() => nav('/')}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-6 py-2.5
                             rounded-xl font-medium transition-all duration-200 text-sm"
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
