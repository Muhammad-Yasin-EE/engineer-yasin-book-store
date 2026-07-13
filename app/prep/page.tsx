import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, Award, ArrowRight, HelpCircle } from 'lucide-react'

export const revalidate = 0

export default async function QuizListPage() {
  const supabase = await createClient()
  let quizzes: any[] = []
  let errorMsg = null

  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    quizzes = data || []
  } catch (err) {
    console.error('Fetch quizzes error:', err)
    errorMsg = 'Could not load prep quizzes from database.'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow bg-white text-[#222222] space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-150 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B8212E]/5 border border-[#B8212E]/10 text-[#B8212E] text-[10px] font-bold uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5" />
          Test Preparation Hub
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
          Interactive MCQs Quizzes
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Select a subject test below to practice entry exam questions and check your knowledge instantly.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-none">
          {errorMsg}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="py-20 bg-gray-50 border border-gray-200 border-dashed rounded-none flex flex-col items-center justify-center text-gray-400 text-center p-6">
          <HelpCircle className="w-12 h-12 mb-3 opacity-30 text-gray-500" />
          <h3 className="text-base font-bold text-gray-700">No Quizzes Active</h3>
          <p className="text-xs text-gray-400 mt-0.5 max-w-xs">Prep quizzes are being prepared by our academic team. Stay tuned!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              className="bg-white border border-gray-200 p-6 rounded-none flex flex-col justify-between space-y-4 hover:border-[#B8212E]/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#B8212E] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-800 text-base leading-snug">{quiz.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">{quiz.description}</p>
              </div>

              <Link
                href={`/prep/${quiz.id}`}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs shadow-sm hover:shadow-md transition-all uppercase tracking-wider"
              >
                Start Practice Quiz
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
