import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import BookCard from '@/components/BookCard'
import CategoryCard from '@/components/CategoryCard'
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
    <div className="space-y-16 pb-20 bg-white text-gray-800">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-[#0A192F] border-b border-[#0A192F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-white/10 border border-white/20 text-white text-[10px] uppercase tracking-wider font-bold mb-6">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Pakistan's Premier Preparation Portal
              </div>
          
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-2xl mx-auto lg:mx-0 leading-[1.15] mb-6">
                Gateway to <span className="text-[#D4AF37]">Excellence</span>
              </h1>
              
              <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                Professional mock tests for Armed Forces, Public Service, and Entry Exams. Integrated with VIP tech resources and engineering services.
              </p>

              {/* Quick Hub Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto lg:mx-0">
            <Link href="/prep/armed-forces" className="p-4 sm:p-5 bg-[#112240] border border-[#233554] hover:border-[#D4AF37] hover:bg-[#1A2D54] shadow-sm rounded-md text-center flex flex-col items-center gap-2.5 group transition-all duration-200">
              <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors duration-200">
                <ShieldCheck className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">Armed Forces</span>
            </Link>
            <Link href="/prep/public-service" className="p-4 sm:p-5 bg-[#112240] border border-[#233554] hover:border-[#D4AF37] hover:bg-[#1A2D54] shadow-sm rounded-md text-center flex flex-col items-center gap-2.5 group transition-all duration-200">
              <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors duration-200">
                <BookOpen className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">Public Service</span>
            </Link>
            <Link href="/software" className="p-4 sm:p-5 bg-[#112240] border border-[#233554] hover:border-[#D4AF37] hover:bg-[#1A2D54] shadow-sm rounded-md text-center flex flex-col items-center gap-2.5 group transition-all duration-200">
              <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors duration-200">
                <Download className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">Tech Apps</span>
            </Link>
            <Link href="/services" className="p-4 sm:p-5 bg-[#112240] border border-[#233554] hover:border-[#D4AF37] hover:bg-[#1A2D54] shadow-sm rounded-md text-center flex flex-col items-center gap-2.5 group transition-all duration-200">
              <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors duration-200">
                <Hammer className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">Services</span>
            </Link>
              </div>
            </div>

            {/* Right Content - 3D Illustration */}
            <div className="flex-1 w-full max-w-md lg:max-w-none relative">
              <div className="relative aspect-square w-full sm:w-4/5 lg:w-full mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-[#B8212E]/20 rounded-full blur-3xl opacity-50"></div>
                <Image 
                  src="/images/real-forces-illustration.jpg" 
                  alt="Official Armed Forces and Civil Service Preparation" 
                  fill
                  priority
                  className="object-cover rounded-2xl shadow-2xl relative z-10 border border-white/10"
                />
              </div>
            </div>

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
                className="bg-white border border-gray-200 p-5 rounded-md flex flex-col justify-between space-y-4 hover:border-[#B8212E] hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-8 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold bg-gray-50 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-sm">
                      {quiz.category || 'General'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug pt-2">{quiz.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium line-clamp-2">{quiz.description}</p>
                </div>
                <Link
                  href={`/prep/quiz/${quiz.id}`}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#B8212E] hover:bg-[#A31C28] text-white font-bold rounded-md text-xs shadow-sm transition-all uppercase tracking-wider mt-2"
                >
                  Start Practice
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

    </div>
  )
}
