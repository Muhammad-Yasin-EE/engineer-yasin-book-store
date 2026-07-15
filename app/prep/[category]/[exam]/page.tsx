import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, BookOpen, FileText, CheckCircle, Lock, LayoutGrid, Clock, ArrowRight } from 'lucide-react'

// Helper to format exam titles
const formatTitle = (slug: string) => {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export const revalidate = 60

export default async function ExamPage({ params }: { params: Promise<{ category: string, exam: string }> }) {
  const { category, exam } = await params
  const title = formatTitle(exam)
  
  const supabase = await createClient()

  // Find quizzes matching this exam. For example if exam is 'pma-long-course', we look for 'PMA'
  let searchPrefix = ''
  if (exam === 'pma-long-course') searchPrefix = 'PMA'
  else if (exam === 'gd-pilot') searchPrefix = 'GD Pilot'
  else searchPrefix = title // Fallback

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*')
    .ilike('title', `${searchPrefix}%`)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col gap-10 bg-white text-gray-800">
      
      {/* Breadcrumb / Back */}
      <Link href={`/prep/${category}`} className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to {formatTitle(category)}
      </Link>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-150 pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-[10px] font-extrabold uppercase tracking-wider mb-3 border border-gray-200">
            <LayoutGrid className="w-3.5 h-3.5" />
            Exam Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            {title} Preparation
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-medium max-w-2xl">
            Everything you need to crack the {title} exam. Practice with real mock tests, read notes, and review past papers.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar gap-5 sm:gap-8 pb-1">
        <button className="whitespace-nowrap pb-4 border-b-2 border-[#B8212E] text-[#B8212E] font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 px-1">
          <CheckCircle className="w-4 h-4" /> Interactive Mock Tests
        </button>
        <button className="whitespace-nowrap pb-4 border-b-2 border-transparent text-gray-400 hover:text-gray-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 px-1 transition-colors cursor-not-allowed" title="Coming soon">
          <BookOpen className="w-4 h-4" /> Study Notes <Lock className="w-3 h-3 text-gray-300" />
        </button>
        <button className="whitespace-nowrap pb-4 border-b-2 border-transparent text-gray-400 hover:text-gray-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 px-1 transition-colors cursor-not-allowed" title="Coming soon">
          <FileText className="w-4 h-4" /> Past Papers <Lock className="w-3 h-3 text-gray-300" />
        </button>
      </div>

      {/* Tab Content: Mock Tests */}
      <div className="min-h-[400px]">
        {quizzes && quizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {quizzes.map((quiz, index) => (
              <div 
                key={quiz.id}
                className="group p-5 border border-gray-200 rounded-xl hover:border-[#B8212E]/40 hover:shadow-lg transition-all bg-white flex flex-col justify-between h-full relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 group-hover:bg-[#B8212E] transition-colors"></div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-400">Test {index + 1}</span>
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                      <Clock className="w-3 h-3" /> {quiz.time_limit_minutes || 15}m
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-base group-hover:text-[#B8212E] transition-colors line-clamp-2">
                    {quiz.title}
                  </h3>
                </div>
                <div className="mt-6">
                  <Link 
                    href={`/prep/quiz/${quiz.id}`}
                    className="w-full py-2 bg-gray-50 hover:bg-[#B8212E] text-gray-600 hover:text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Start Test <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-150 border-dashed">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <CheckCircle className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">No mock tests available</h3>
            <p className="text-sm text-gray-500 mt-2">We are currently preparing interactive tests for this exam.</p>
          </div>
        )}
      </div>

    </div>
  )
}
