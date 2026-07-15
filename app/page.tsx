import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BookCard from '@/components/BookCard'
import CategoryCard from '@/components/CategoryCard'
import Newsletter from '@/components/Newsletter'
import { GraduationCap, Briefcase, Download, Hammer, BookOpen, Sparkles, Layers, ArrowRight, ShieldCheck, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let quizzes: any[] = []
  let software: any[] = []
  let errorMsg = null

  try {
    const supabase = await createClient()

    const [
      quizRes,
      softRes
    ] = await Promise.all([
      supabase.from('quizzes').select('*').order('created_at', { ascending: false }).limit(6),
      supabase.from('items').select('*').eq('resource_type', 'software').order('created_at', { ascending: false }).limit(3)
    ])

    quizzes = quizRes.data || []
    software = softRes.data || []

  } catch (err: any) {
    console.error('Home Page Data Fetching Error:', err)
    errorMsg = 'Could not load portal directories.'
  }

  return (
    <div className="space-y-16 pb-20 bg-white text-[#222222]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-24 bg-[#f8fafc] border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8212E]/5 border border-[#B8212E]/20 text-[#B8212E] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Pakistan's #1 Preparation & Tech Portal
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-800 max-w-4xl mx-auto leading-tight mb-6">
            Gateway to <span className="text-[#B8212E]">Success</span> & Tech
          </h1>
          
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Free and premium interactive mock tests for Armed Forces, Public Service, and Entry Exams. Plus VIP Android APKs and professional coding services.
          </p>

          {/* Quick Hub Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <Link href="/prep/armed-forces" className="p-4 bg-white border border-gray-200 hover:border-emerald-500/40 text-center flex flex-col items-center gap-2 group transition-all">
              <ShieldCheck className="w-6 h-6 text-emerald-600 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-gray-800">Armed Forces</span>
            </Link>
            <Link href="/prep/public-service" className="p-4 bg-white border border-gray-200 hover:border-blue-500/40 text-center flex flex-col items-center gap-2 group transition-all">
              <BookOpen className="w-6 h-6 text-blue-600 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-gray-800">Public Service</span>
            </Link>
            <Link href="/software" className="p-4 bg-white border border-gray-200 hover:border-violet-500/40 text-center flex flex-col items-center gap-2 group transition-all">
              <Download className="w-6 h-6 text-violet-600 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-gray-800">Apps & Software</span>
            </Link>
            <Link href="/services" className="p-4 bg-white border border-gray-200 hover:border-amber-500/40 text-center flex flex-col items-center gap-2 group transition-all">
              <Hammer className="w-6 h-6 text-amber-600 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-gray-800">Tech Services</span>
            </Link>
          </div>
        </div>
      </section>

      {errorMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-[#B8212E]/5 border border-[#B8212E]/10 text-gray-600 text-sm text-center">
            {errorMsg} Check connection configurations.
          </div>
        </div>
      )}

      {/* Quizzes Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#B8212E]" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Latest Mock Tests</h2>
          </div>
          <Link href="/prep" className="text-xs sm:text-sm font-semibold text-[#B8212E] hover:text-[#D62636] flex items-center gap-1 transition-colors">
            See All Tests <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="py-12 bg-gray-50 border border-gray-150 rounded-none flex items-center justify-center text-gray-400 text-xs">
            No mock tests published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <div 
                key={quiz.id} 
                className="bg-white border border-gray-200 p-6 rounded-none flex flex-col justify-between space-y-4 hover:border-[#B8212E]/40 hover:shadow-lg transition-all"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-[#B8212E] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {quiz.category || 'General'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-base leading-snug pt-2">{quiz.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold line-clamp-2">{quiz.description}</p>
                </div>
                <Link
                  href={`/prep/quiz/${quiz.id}`}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs shadow-sm hover:shadow-md transition-all uppercase tracking-wider mt-2"
                >
                  Start Practice Quiz
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Software Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Featured Apps & Software</h2>
          </div>
          <Link href="/software" className="text-xs sm:text-sm font-semibold text-[#B8212E] hover:text-[#D62636] flex items-center gap-1 transition-colors">
            Browse Apps & Software <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {software.length === 0 ? (
          <div className="py-12 bg-gray-50 border border-gray-150 rounded-none flex items-center justify-center text-gray-400 text-xs">
            No software uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {software.map(item => (
              <BookCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </section>

      {/* Category Index Quick Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 pt-16">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center justify-center sm:justify-start gap-2">
            <Layers className="w-5 h-5 text-[#B8212E]" />
            Engineering & Programming Services
          </h2>
          <p className="text-gray-400 text-sm mt-1">Hire us for Matlab simulations, web scripting, tutoring, or 3D mechanical drawings.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryCard name="Programming" resourceType="service" />
          <CategoryCard name="3D Modeling" resourceType="service" />
          <CategoryCard name="MATLAB & Simulink" resourceType="service" />
          <CategoryCard name="Tutoring" resourceType="service" />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>

    </div>
  )
}
