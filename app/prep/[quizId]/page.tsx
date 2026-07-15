'use client'

import React, { useEffect, useState, useRef, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, Award, CheckCircle2, XCircle, ChevronRight, ChevronLeft, RotateCcw, AlertTriangle, Clock, User, ShieldAlert, CheckSquare } from 'lucide-react'

// Constants
const QUIZ_TIME_LIMIT_MINUTES = 15
const MAX_QUESTIONS = 30

export default function InteractiveQuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const router = useRouter()
  const { quizId } = use(params)
  const supabase = createClient()

  // Data States
  const [quiz, setQuiz] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // System States
  const [studentName, setStudentName] = useState('')
  const [examStarted, setExamStarted] = useState(false)
  const [examState, setExamState] = useState<'intro' | 'active' | 'completed'>('intro')
  
  // Timer & Anti-Cheat
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT_MINUTES * 60)
  const [autoSubmittedDueToCheat, setAutoSubmittedDueToCheat] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Exam States
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({}) // { questionIndex: selectedOptionIndex }
  const [finalScore, setFinalScore] = useState(0)

  // 1. Fetch Quiz Data
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const { data: quizData } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single()
        setQuiz(quizData)

        const { data: questionsData } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', quizId)
        
        // Shuffle and limit questions to MAX_QUESTIONS
        let fetchedQuestions = questionsData || []
        fetchedQuestions = fetchedQuestions.sort(() => 0.5 - Math.random()).slice(0, MAX_QUESTIONS)
        setQuestions(fetchedQuestions)

      } catch (err) {
        console.error('Fetch quiz questions error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizDetails()
  }, [quizId, supabase])

  // 2. Timer & Anti-Cheat Logic
  useEffect(() => {
    if (examState !== 'active') return

    // Timer Interval
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          submitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Anti-Cheat: Visibility Change (Tab Switch Detection)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // User switched tabs or minimized!
        setAutoSubmittedDueToCheat(true)
        submitExam()
      }
    }

    // Anti-Cheat: Window Blur
    const handleWindowBlur = () => {
      setAutoSubmittedDueToCheat(true)
      submitExam()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleWindowBlur)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleWindowBlur)
    }
  }, [examState])

  const submitExam = () => {
    setExamState('completed')
    if (timerRef.current) clearInterval(timerRef.current)
    
    // Calculate Score
    let calculatedScore = 0
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_option_index) {
        calculatedScore += 1
      }
    })
    setFinalScore(calculatedScore)
  }

  const startExam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentName.trim()) return
    setExamState('active')
    setExamStarted(true)
  }

  const handleOptionSelect = (optionIdx: number) => {
    if (examState !== 'active') return
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIdx }))
  }

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setAnswers({})
    setFinalScore(0)
    setExamState('intro')
    setExamStarted(false)
    setTimeLeft(QUIZ_TIME_LIMIT_MINUTES * 60)
    setAutoSubmittedDueToCheat(false)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Formatting grades
  const getGradeDetails = () => {
    const percentage = questions.length > 0 ? (finalScore / questions.length) * 100 : 0
    if (percentage < 50) return { title: 'Needs Improvement / Hard Work Required', color: 'text-rose-600 dark:text-rose-600', bg: 'bg-rose-50 dark:bg-rose-50', icon: <XCircle className="w-8 h-8" /> }
    if (percentage < 70) return { title: 'Good Effort, but you can do better', color: 'text-amber-600 dark:text-amber-600', bg: 'bg-amber-50 dark:bg-amber-50', icon: <AlertTriangle className="w-8 h-8" /> }
    if (percentage < 85) return { title: `Congratulations ${studentName}, Passed!`, color: 'text-emerald-600 dark:text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-50', icon: <CheckCircle2 className="w-8 h-8" /> }
    return { title: `Outstanding Performance ${studentName}! Excellent Concept Mastery.`, color: 'text-indigo-600 dark:text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-50', icon: <Award className="w-8 h-8" /> }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3 text-xs text-gray-550">
        <Loader2 className="w-8 h-8 animate-spin text-[#B8212E]" />
        <span>Loading secure exam environment...</span>
      </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4 text-xs font-bold text-gray-500">
        <XCircle className="w-12 h-12 mx-auto text-rose-500" />
        <h3>Quiz Not Ready</h3>
        <p className="font-semibold text-gray-400">There are no questions uploaded for this quiz yet.</p>
        <Link href="/prep" className="inline-block px-5 py-2.5 bg-[#B8212E] text-white rounded-full uppercase tracking-wider text-[10px]">
          Back to List
        </Link>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const hasAnsweredCurrent = answers[currentIndex] !== undefined

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-16 flex-grow bg-white dark:bg-white text-[#222222] dark:text-[#222222] space-y-6 min-h-screen overflow-x-hidden">
      
      {/* Show Back Button ONLY if exam hasn't started */}
      {!examStarted && (
        <div>
          <Link href="/prep" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Prep List
          </Link>
        </div>
      )}

      {/* STATE 1: INTRO RULES SCREEN */}
      {examState === 'intro' && (
        <div className="bg-gray-50 dark:bg-gray-50 border border-gray-200 dark:border-gray-200 p-5 sm:p-8 rounded-2xl shadow-sm space-y-6 sm:space-y-8 max-w-xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#B8212E]/10 text-[#B8212E] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <ShieldAlert className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-900 uppercase tracking-tight">Exam Rules & Regulations</h1>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-500">{quiz.title}</p>
          </div>

          <div className="bg-white dark:bg-white border border-gray-200 dark:border-gray-200 p-4 sm:p-5 rounded-xl space-y-3 sm:space-y-4 text-[11px] sm:text-xs font-semibold text-gray-600 dark:text-gray-600">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 shrink-0" />
              <p>Strict Time Limit of <strong className="text-gray-900 dark:text-gray-900">{QUIZ_TIME_LIMIT_MINUTES} Minutes</strong>. The exam will auto-submit when time is up.</p>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />
              <p><strong>Anti-Cheat Enabled:</strong> If you open a new tab, switch apps, or minimize the window, your exam will immediately Auto-Submit with 0 warning.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
              <p><strong>Navigation:</strong> You can skip questions and come back to them later using the Next/Back buttons or the Question Grid at the bottom.</p>
            </div>
          </div>

          <form onSubmit={startExam} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 dark:text-gray-400 tracking-wider">Candidate Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name to begin..."
                  className="w-full pl-9 pr-4 py-3 bg-white dark:bg-white border border-gray-300 dark:border-gray-300 rounded-lg text-sm font-bold text-gray-900 dark:text-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B8212E] focus:border-[#B8212E]"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!studentName.trim()}
              className="w-full py-3 sm:py-3.5 bg-[#B8212E] hover:bg-[#D62636] disabled:opacity-50 text-white font-black rounded-lg text-xs sm:text-sm shadow-md transition-all uppercase tracking-widest"
            >
              Start Secure Exam
            </button>
          </form>
        </div>
      )}

      {/* STATE 2: ACTIVE EXAM */}
      {examState === 'active' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header Bar */}
          <div className="bg-gray-900 text-white p-3 sm:p-4 rounded-xl flex items-center justify-between sticky top-2 sm:top-4 z-50 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider">Candidate</p>
                <p className="text-[10px] sm:text-xs font-bold truncate max-w-[80px] sm:max-w-[150px]">{studentName}</p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> Time Remaining
              </p>
              <p className={`text-lg sm:text-xl font-mono font-black ${timeLeft < 60 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-500 px-1">
            <span className="truncate pr-2">Subject: <strong className="text-gray-800 dark:text-gray-800">{quiz.title}</strong></span>
            <span className="font-mono bg-gray-50 dark:bg-gray-50 border border-gray-200 dark:border-gray-200 px-2 py-0.5 font-bold shrink-0">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-gray-100 dark:bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#B8212E] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="p-5 sm:p-8 bg-gray-50 dark:bg-gray-50 border border-gray-200 dark:border-gray-200 rounded-xl sm:rounded-2xl shadow-sm min-h-[120px] sm:min-h-[160px] flex items-center">
            <h3 className="font-extrabold text-gray-900 dark:text-gray-900 text-base sm:text-xl leading-relaxed w-full">
              {currentQuestion.question_text}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            {currentQuestion.options.map((option: string, idx: number) => {
              const isSelectedOption = answers[currentIndex] === idx
              const optionClass = isSelectedOption
                ? 'bg-red-50 dark:bg-red-50 border-[#B8212E] text-red-900 dark:text-red-900 ring-1 ring-[#B8212E]'
                : 'bg-white dark:bg-white border-gray-200 dark:border-gray-200 text-gray-700 dark:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-50 hover:border-[#B8212E]/50'

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full p-3.5 sm:p-5 border-2 rounded-xl text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${optionClass}`}
                >
                  <span className="leading-relaxed">{option}</span>
                  {isSelectedOption && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8212E] shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Action Buttons Row */}
          <div className="flex justify-between items-center pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-100">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-gray-100 text-gray-800 dark:text-gray-800 font-bold rounded-xl text-[10px] sm:text-sm flex items-center gap-1 sm:gap-2 transition-all uppercase tracking-wider"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Back
            </button>

            {currentIndex + 1 < questions.length ? (
              <button
                onClick={handleNext}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-[10px] sm:text-sm shadow-md flex items-center gap-1 sm:gap-2 transition-all uppercase tracking-wider"
              >
                {hasAnsweredCurrent ? 'Next' : 'Skip'}
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                onClick={submitExam}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#B8212E] hover:bg-[#D62636] text-white font-black rounded-xl text-[10px] sm:text-sm shadow-md flex items-center gap-1 sm:gap-2 transition-all uppercase tracking-wider animate-pulse"
              >
                Submit
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Question Navigator Grid */}
          <div className="pt-6 sm:pt-8 space-y-2 sm:space-y-3">
            <h4 className="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">Question Navigator</h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {questions.map((_, idx) => {
                const isAnswered = answers[idx] !== undefined
                const isCurrent = idx === currentIndex
                
                let btnClass = 'border-gray-200 dark:border-gray-200 text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-100 bg-white dark:bg-white'
                
                if (isAnswered) {
                  btnClass = 'bg-[#B8212E] border-[#B8212E] text-white shadow-sm'
                }
                if (isCurrent) {
                  btnClass = 'ring-2 ring-offset-1 ring-gray-900 border-gray-900 text-gray-900 bg-gray-50 dark:bg-gray-50 font-black'
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 border rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-400 font-semibold italic">Red = Answered, White = Skipped</p>
          </div>
        </div>
      )}

      {/* STATE 3: COMPLETED RESULT */}
      {examState === 'completed' && (() => {
        const grade = getGradeDetails()
        const percentage = questions.length > 0 ? (finalScore / questions.length) * 100 : 0

        return (
          <div className="bg-white dark:bg-white border border-gray-200 dark:border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl animate-scale-in">
            {/* Top Color Banner */}
            <div className={`p-6 sm:p-10 text-center space-y-3 sm:space-y-4 ${grade.bg}`}>
              <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-white dark:bg-white rounded-full flex items-center justify-center shadow-sm ${grade.color}`}>
                {grade.icon}
              </div>
              <h2 className={`text-xl sm:text-3xl font-black ${grade.color}`}>{grade.title}</h2>
              <p className="text-gray-600 dark:text-gray-600 font-bold text-xs sm:text-sm">Candidate: <span className="text-gray-900 dark:text-gray-900">{studentName}</span></p>
            </div>

            <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
              {/* Anti-Cheat Warning */}
              {autoSubmittedDueToCheat && (
                <div className="p-3 sm:p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs sm:text-sm font-bold flex items-start gap-2 sm:gap-3">
                  <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
                  <p><strong>Exam Violation Detected:</strong> You switched tabs or minimized the browser during the exam. The system automatically submitted your quiz to prevent cheating.</p>
                </div>
              )}

              {/* Time Expired Warning */}
              {timeLeft <= 0 && !autoSubmittedDueToCheat && (
                <div className="p-3 sm:p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700 text-xs sm:text-sm font-bold flex items-start gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
                  <p><strong>Time Expired:</strong> Your 15 minutes were up, so the exam was automatically submitted.</p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gray-50 dark:bg-gray-50 border border-gray-200 dark:border-gray-200 p-4 sm:p-5 rounded-xl text-center space-y-1 col-span-2 sm:col-span-1">
                  <span className="block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-400">Total Score</span>
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-900">{finalScore}<span className="text-sm sm:text-lg text-gray-400 dark:text-gray-400">/{questions.length}</span></span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-50 border border-gray-200 dark:border-gray-200 p-4 sm:p-5 rounded-xl text-center space-y-1">
                  <span className="block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-400">Percentage</span>
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-900">{percentage.toFixed(1)}%</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-50 border border-gray-200 dark:border-gray-200 p-4 sm:p-5 rounded-xl text-center space-y-1">
                  <span className="block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-400">Time Taken</span>
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-900">{formatTime((QUIZ_TIME_LIMIT_MINUTES * 60) - Math.max(0, timeLeft))}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-100">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 border-2 border-gray-200 dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-50 text-gray-700 dark:text-gray-700 font-bold rounded-xl text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" /> Retake Exam
                </button>
                <Link
                  href="/prep"
                  className="px-6 py-3 bg-[#B8212E] hover:bg-[#D62636] text-white font-black rounded-xl text-xs sm:text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
                >
                  Exit to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )
      })()}

    </div>
  )
}

