'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, Award, CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react'

export default function InteractiveQuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.quizId as string
  const supabase = createClient()

  const [quiz, setQuiz] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Quiz State Machine
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        // Fetch Quiz details
        const { data: quizData } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single()
        setQuiz(quizData)

        // Fetch Quiz Questions
        const { data: questionsData } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', quizId)
        setQuestions(questionsData || [])
      } catch (err) {
        console.error('Fetch quiz questions error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizDetails()
  }, [quizId])

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswered) return
    setSelectedOption(optionIdx)
    setIsAnswered(true)

    const currentQuestion = questions[currentIndex]
    if (optionIdx === currentQuestion.correct_option_index) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    setIsAnswered(false)
    setSelectedOption(null)
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setCompleted(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3 text-xs text-gray-550">
        <Loader2 className="w-8 h-8 animate-spin text-[#B8212E]" />
        <span>Loading quiz details...</span>
      </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4 text-xs font-bold text-gray-500">
        <XCircle className="w-12 h-12 mx-auto text-rose-500" />
        <h3>Quiz Not Ready</h3>
        <p className="font-semibold text-gray-400">There are no questions uploaded for this quiz yet. Try another test.</p>
        <Link href="/prep" className="inline-block px-5 py-2.5 bg-[#B8212E] text-white rounded-full uppercase tracking-wider text-[10px]">
          Back to List
        </Link>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow bg-white text-[#222222] space-y-6">
      
      {/* Back button */}
      <div>
        <Link 
          href="/prep"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Prep List
        </Link>
      </div>

      {completed ? (
        /* Result Score Card */
        <div className="bg-[#f8fafc] border border-gray-200 p-8 text-center space-y-6 rounded-none animate-scale-in">
          <div className="w-14 h-14 bg-red-50 text-[#B8212E] rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-gray-800">Quiz Completed!</h2>
            <p className="text-xs text-gray-400 font-semibold">{quiz.title} final results</p>
          </div>

          <div className="py-4 border-y border-gray-200 max-w-xs mx-auto">
            <span className="block text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">Your Score</span>
            <span className="text-3xl font-black text-gray-800">
              {score} <span className="text-sm font-bold text-gray-400">/ {questions.length}</span>
            </span>
          </div>

          <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-sm mx-auto">
            {score / questions.length >= 0.7 
              ? 'Great job! You possess deep concept mastery on this exam subject. Keep up the high standard!' 
              : 'Review your mistakes and read technical book guidelines to score higher next time.'}
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 border border-gray-250 hover:bg-gray-50 text-gray-650 font-bold rounded-full text-xs cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </button>
            <Link
              href="/prep"
              className="px-6 py-2.5 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
            >
              Finish Prep
            </Link>
          </div>
        </div>
      ) : (
        /* Active Question Screen */
        <div className="space-y-6">
          
          {/* Progress Indicators */}
          <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
            <span>Subject: <strong className="text-gray-800">{quiz.title}</strong></span>
            <span className="font-mono bg-gray-50 border border-gray-200 px-2 py-0.5 font-bold">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Progress bar line */}
          <div className="w-full h-1 bg-gray-100">
            <div 
              className="h-full bg-[#B8212E] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="p-5 bg-[#f8fafc] border border-gray-200 rounded-none">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-relaxed">
              {currentQuestion.question_text}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="flex flex-col gap-2.5">
            {currentQuestion.options.map((option: string, idx: number) => {
              const isCorrectOption = idx === currentQuestion.correct_option_index
              const isSelectedOption = idx === selectedOption
              
              let optionClass = 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              let iconElement = null

              if (isAnswered) {
                if (isCorrectOption) {
                  optionClass = 'bg-emerald-50 border-emerald-500 text-emerald-800 hover:bg-emerald-50'
                  iconElement = <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                } else if (isSelectedOption) {
                  optionClass = 'bg-rose-50 border-rose-500 text-rose-800 hover:bg-rose-50'
                  iconElement = <XCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                } else {
                  optionClass = 'bg-white border-gray-100 text-gray-300 opacity-60'
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full p-4 border rounded-none text-left font-semibold text-xs transition-all flex items-center justify-between gap-4 ${
                    isAnswered ? '' : 'cursor-pointer'
                  } ${optionClass}`}
                >
                  <span className="leading-relaxed">{option}</span>
                  {iconElement}
                </button>
              )
            })}
          </div>

          {/* Next Button Row */}
          {isAnswered && (
            <div className="flex justify-end pt-4 border-t border-gray-100 animate-fade-in">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs shadow-sm flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                {currentIndex + 1 < questions.length ? 'Next Question' : 'View Score'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
