import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import BookCard from '@/components/BookCard'
import CategoryCard from '@/components/CategoryCard'
import Newsletter from '@/components/Newsletter'
import { GraduationCap, Briefcase, Download, Hammer, BookOpen, Sparkles, Layers, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let scholarships: any[] = []
  let jobs: any[] = []
  let software: any[] = []
  let errorMsg = null

  try {
    const supabase = createAdminClient()

    // Fetch all active directory items in parallel
    const [
      scholRes,
      jobRes,
      softRes
    ] = await Promise.all([
      supabase.from('items').select('*').eq('resource_type', 'scholarship').order('created_at', { ascending: false }).limit(3),
      supabase.from('items').select('*').eq('resource_type', 'job').order('created_at', { ascending: false }).limit(3),
      supabase.from('items').select('*').eq('resource_type', 'software').order('created_at', { ascending: false }).limit(3)
    ])

    scholarships = scholRes.data || []
    jobs = jobRes.data || []
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
            Scholarships, Jobs & Software Resource Portal
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-800 max-w-4xl mx-auto leading-tight mb-6">
            Engineer <span className="text-[#B8212E]">Yasin</span> Resources
          </h1>
          
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get instant access to free scholarships database, active jobs & internships, engineering software downloads, and professional web coding & design services.
          </p>

          {/* Quick Hub Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <Link href="/scholarships" className="p-4 bg-white border border-gray-200 hover:border-emerald-500/40 text-center flex flex-col items-center gap-2 group transition-all">
              <GraduationCap className="w-6 h-6 text-emerald-600 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-gray-800">Scholarships</span>
            </Link>
            <Link href="/jobs" className="p-4 bg-white border border-gray-200 hover:border-blue-500/40 text-center flex flex-col items-center gap-2 group transition-all">
              <Briefcase className="w-6 h-6 text-blue-600 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-gray-800">Jobs & Interns</span>
            </Link>
            <Link href="/software" className="p-4 bg-white border border-gray-200 hover:border-violet-500/40 text-center flex flex-col items-center gap-2 group transition-all">
              <Download className="w-6 h-6 text-violet-600 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-gray-800">Apps & Software</span>
            </Link>
            <Link href="/services" className="p-4 bg-white border border-gray-200 hover:border-amber-500/40 text-center flex flex-col items-center gap-2 group transition-all">
              <Hammer className="w-6 h-6 text-amber-600 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-gray-800">Services</span>
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

      {/* Scholarships Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Latest Scholarships</h2>
          </div>
          <Link href="/scholarships" className="text-xs sm:text-sm font-semibold text-[#B8212E] hover:text-[#D62636] flex items-center gap-1 transition-colors">
            See All Scholarships <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {scholarships.length === 0 ? (
          <div className="py-12 bg-gray-50 border border-gray-150 rounded-none flex items-center justify-center text-gray-400 text-xs">
            No scholarships published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {scholarships.map(item => (
              <BookCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </section>

      {/* Jobs Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Jobs & Internships</h2>
          </div>
          <Link href="/jobs" className="text-xs sm:text-sm font-semibold text-[#B8212E] hover:text-[#D62636] flex items-center gap-1 transition-colors">
            See All Careers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="py-12 bg-gray-50 border border-gray-150 rounded-none flex items-center justify-center text-gray-400 text-xs">
            No active job openings published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {jobs.map(item => (
              <BookCard key={item.id} {...item} />
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
