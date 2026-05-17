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
    if (!result) return 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white hover:border-slate-500'
    if (num === result.correct_option) return 'bg-green-900 border-green-600 text-white'
    if (num === selected && !result.correct) return 'bg-red-900 border-red-600 text-white'
    return 'bg-slate-800 border-slate-700 text-slate-500'
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">Загрузка вопроса...</div>
  )

  const timerColor = timeLeft <= 5 ? 'text-red-400' : 'text-slate-300'
  const barColor = timeLeft <= 5 ? 'bg-red-500' : 'bg-blue-500'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Шапка с таймером */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg">Викторина</h2>
        <div className={`text-xl font-bold tabular-nums ${timerColor}`}>
          {timeLeft} сек
        </div>
      </div>

      {/* Прогресс-бар таймера */}
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-1000 rounded-full`}
          style={{ width: `${(timeLeft / 20) * 100}%` }}
        />
      </div>

      {/* Вопрос */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <p className="text-white text-base font-medium leading-relaxed">{session?.question}</p>
      </div>

      {/* Варианты ответов */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSubmit(i + 1)}
            disabled={!!result || submitting || timeLeft === 0}
            className={`border-2 rounded-xl px-5 py-4 text-left font-medium transition-all disabled:cursor-default text-sm ${getOptionStyle(i)}`}
          >
            <span className="text-slate-500 mr-3 font-normal">{i + 1}.</span>
            {opt}
          </button>
        ))}
      </div>

      {/* Результат */}
      {result && (
        <div className={`rounded-2xl p-5 text-center border-2 ${
          result.correct ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'
        }`}>
          <p className={`font-bold text-lg ${result.correct ? 'text-green-400' : 'text-red-400'}`}>
            {result.correct ? 'Правильно!' : 'Неверно'}
          </p>
          {result.tickets_earned > 0 && (
            <p className="text-yellow-400 text-sm mt-1">+{result.tickets_earned} билетов</p>
          )}
          {!result.correct && timeLeft === 0 && (
            <p className="text-slate-400 text-sm mt-1">Время вышло</p>
          )}
          <button
            onClick={() => nav('/')}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-semibold transition-colors text-sm"
          >
            На главную
          </button>
        </div>
      )}
    </div>
  )
}
