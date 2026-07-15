import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, Award, ArrowRight, HelpCircle, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

export const revalidate = 60

const CATEGORIES = ["MDCAT", "ECAT", "NTS", "CSS", "FPSC", "Engineering", "General Knowledge", "USAT", "HAT", "LAT"]

interface SearchParams {
  search?: string
  category?: string
  page?: string
}

export default async function QuizListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const search = params.search || ''
  const category = params.category || ''
  const page = parseInt(params.page || '1', 10)
  const pageSize = 12

  const supabase = await createClient()
  let quizzes: any[] = []
  let totalCount = 0
  let errorMsg = null

  try {
    const startRange = (page - 1) * pageSize
    const endRange = startRange + pageSize - 1

    let query = supabase
      .from('quizzes')
      .select('*', { count: 'exact' })

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    query = query.order('created_at', { ascending: false }).range(startRange, endRange)

    const { data, count, error } = await query
    if (error) throw error

    quizzes = data || []
    totalCount = count || 0
  } catch (err) {
    console.error('Fetch quizzes error:', err)
    errorMsg = 'Could not load prep quizzes from database.'
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  const getQueryString = (overrides: Partial<SearchParams>) => {
    const combined = { search, category, page: page.toString(), ...overrides }
    const urlParams = new URLSearchParams()
    if (combined.search) urlParams.set('search', combined.search)
    if (combined.category) urlParams.set('category', combined.category)
    if (combined.page && combined.page !== '1') urlParams.set('page', combined.page)
    const str = urlParams.toString()
    return str ? `?${str}` : ''
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col gap-8 bg-white text-[#222222]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-150 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B8212E]/5 border border-[#B8212E]/10 text-[#B8212E] text-[10px] font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            Test Preparation Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            {category ? `${category} Quizzes` : 'Interactive MCQs Quizzes'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Select a subject test below to practice entry exam questions and check your knowledge instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Search form */}
          <div className="bg-gray-50 border border-gray-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Search className="w-4 h-4 text-[#B8212E]" />
              Search Quizzes
            </h3>
            <form action="/prep" method="GET" className="relative">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="e.g. Physics Chapter 1"
                className="w-full bg-white border border-gray-200 rounded-none py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#B8212E]"
              />
              {category && <input type="hidden" name="category" value={category} />}
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-gray-400 hover:text-[#B8212E] cursor-pointer">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Categories */}
          <div className="bg-gray-50 border border-gray-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#B8212E]" />
              Exam Categories
            </h3>
            <div className="flex flex-col gap-1.5">
              <Link 
                href="/prep" 
                className={`text-xs py-1.5 px-3 border-l-2 transition-all ${!category ? 'border-[#B8212E] text-[#B8212E] font-bold bg-[#B8212E]/5' : 'border-transparent text-gray-500 hover:text-gray-800 font-semibold hover:bg-white'}`}
              >
                All Subjects
              </Link>
              {CATEGORIES.map(cat => (
                <Link 
                  key={cat}
                  href={`/prep${getQueryString({ category: cat, page: '1' })}`}
                  className={`text-xs py-1.5 px-3 border-l-2 transition-all ${category === cat ? 'border-[#B8212E] text-[#B8212E] font-bold bg-[#B8212E]/5' : 'border-transparent text-gray-500 hover:text-gray-800 font-semibold hover:bg-white'}`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-none">
              {errorMsg}
            </div>
          )}

          {!errorMsg && quizzes.length === 0 ? (
            <div className="py-20 bg-gray-50 border border-gray-200 border-dashed rounded-none flex flex-col items-center justify-center text-gray-400 text-center p-6">
              <HelpCircle className="w-12 h-12 mb-3 opacity-30 text-gray-500" />
              <h3 className="text-base font-bold text-gray-700">No Quizzes Active</h3>
              <p className="text-xs text-gray-400 mt-0.5 max-w-xs">Prep quizzes are being prepared by our academic team. Stay tuned!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <div 
                    key={quiz.id} 
                    className="bg-white border border-gray-200 p-6 rounded-none flex flex-col justify-between space-y-4 hover:border-[#B8212E]/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-[#B8212E] flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          {quiz.category || 'General'}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-base leading-snug pt-2">{quiz.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-semibold line-clamp-2">{quiz.description}</p>
                    </div>

                    <Link
                      href={`/prep/${quiz.id}`}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs shadow-sm hover:shadow-md transition-all uppercase tracking-wider mt-2"
                    >
                      Start Practice Quiz
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-8 border-t border-gray-150 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {page > 1 ? (
                      <Link 
                        href={`/prep${getQueryString({ page: (page - 1).toString() })}`}
                        className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Prev
                      </Link>
                    ) : (
                      <button disabled className="px-3 py-1.5 border border-gray-100 text-gray-300 font-bold text-xs flex items-center gap-1 cursor-not-allowed">
                        <ChevronLeft className="w-3.5 h-3.5" /> Prev
                      </button>
                    )}

                    {page < totalPages ? (
                      <Link 
                        href={`/prep${getQueryString({ page: (page + 1).toString() })}`}
                        className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button disabled className="px-3 py-1.5 border border-gray-100 text-gray-300 font-bold text-xs flex items-center gap-1 cursor-not-allowed">
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}
