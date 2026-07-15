import Link from 'next/link'
import { BookOpen, ShieldCheck, FileText, ArrowRight, BookMarked, GraduationCap } from 'lucide-react'

export const revalidate = 60

export default function PrepDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col gap-10 bg-white text-gray-800">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center border-b border-gray-150 pb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8212E]/5 border border-[#B8212E]/10 text-[#B8212E] text-xs font-bold uppercase tracking-wider mb-4">
          <BookMarked className="w-4 h-4" />
          Test Preparation Hub
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-800 tracking-tight mb-4">
          Master Your Next Big Exam
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Select your target organization below. Get access to free and premium mock tests, solved past papers, interview experiences, and study notes tailored for your success.
        </p>
      </div>

      {/* Main Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Armed Forces */}
        <div className="bg-white border border-gray-150 p-6 sm:p-8 rounded-3xl flex flex-col items-center text-center hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-emerald-500/80"></div>
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">Armed Forces</h2>
          <p className="text-sm text-gray-500 mb-8 flex-grow">
            Join Pak Army, Navy, or PAF. Prepare for PMA Long Course, GD Pilot, PN Cadet, DSSC, AFNS, and more.
          </p>
          <Link 
            href="/prep/armed-forces" 
            className="w-full py-3.5 bg-gray-50 hover:bg-emerald-600 text-gray-700 hover:text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            Explore Forces Exams <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Public Service */}
        <div className="bg-white border border-gray-150 p-6 sm:p-8 rounded-3xl flex flex-col items-center text-center hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-blue-500/80"></div>
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">Public Service</h2>
          <p className="text-sm text-gray-500 mb-8 flex-grow">
            CSS, FPSC, PPSC, BPSC, SPSC, KPPSC. Ace your provincial and federal commission tests with past papers.
          </p>
          <Link 
            href="/prep/public-service" 
            className="w-full py-3.5 bg-gray-50 hover:bg-blue-600 text-gray-700 hover:text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            Explore Service Exams <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Entry Tests */}
        <div className="bg-white border border-gray-150 p-6 sm:p-8 rounded-3xl flex flex-col items-center text-center hover:border-amber-500/40 hover:shadow-[0_8px_30px_rgb(245,158,11,0.12)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-amber-500/80"></div>
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">Entry Tests</h2>
          <p className="text-sm text-gray-500 mb-8 flex-grow">
            Secure admission in top universities. Preparation material for ECAT, MDCAT, NTS, NUST, PIEAS, UET.
          </p>
          <Link 
            href="/prep/entry-tests" 
            className="w-full py-3.5 bg-gray-50 hover:bg-amber-600 text-gray-700 hover:text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            Explore Entry Tests <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Freemium Banner */}
      <div className="mt-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 sm:p-12 text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#B8212E]/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-white/90 text-xs font-bold uppercase tracking-wider border border-white/20">
            <FileText className="w-4 h-4 text-amber-400" /> Premium Materials
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Yasin <span className="text-amber-400">Pro Pass</span></h2>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            While basic quizzes are free, the Yasin Pro Pass gives you lifetime access to top-secret interview notes, completely solved past papers, and premium mock tests with anti-cheat analysis.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link href="/pricing" className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-black rounded-full transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] uppercase tracking-wider text-sm">
              View Pricing
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
