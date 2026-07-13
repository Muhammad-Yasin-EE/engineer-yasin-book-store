import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BookCard from '@/components/BookCard'
import { Search, ChevronLeft, ChevronRight, BookOpen, Sparkles, Filter } from 'lucide-react'

interface SearchParams {
  search?: string
  filter?: 'free' | 'premium' | string
  page?: string
}

export const revalidate = 0

export default async function CoursesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const search = params.search || ''
  const filter = params.filter || 'all'
  const page = parseInt(params.page || '1', 10)
  const pageSize = 9

  let items: any[] = []
  let totalCount = 0
  let errorMsg = null

  try {
    const supabase = await createClient()
    const startRange = (page - 1) * pageSize
    const endRange = startRange + pageSize - 1

    let query = supabase
      .from('items')
      .select('*', { count: 'exact' })
      .eq('resource_type', 'course')

    if (filter === 'free') {
      query = query.eq('type', 'free')
    } else if (filter === 'premium') {
      query = query.eq('type', 'premium')
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`)
    }

    query = query.order('created_at', { ascending: false }).range(startRange, endRange)

    const { data, count, error } = await query
    if (error) throw error

    items = data || []
    totalCount = count || 0
  } catch (err: any) {
    console.error('Fetch Courses Error:', err)
    errorMsg = 'Could not retrieve courses from database.'
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  const getQueryString = (overrides: Partial<SearchParams>) => {
    const combined = { search, filter, page: page.toString(), ...overrides }
    const urlParams = new URLSearchParams()
    if (combined.search) urlParams.set('search', combined.search)
    if (combined.filter && combined.filter !== 'all') urlParams.set('filter', combined.filter)
    if (combined.page && combined.page !== '1') urlParams.set('page', combined.page)
    const str = urlParams.toString()
    return str ? `?${str}` : ''
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col gap-8 bg-white text-[#222222]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-150 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-600 text-[10px] font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Educational Courses
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            Academic Courses & Coding Bootcamps
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Enroll in Next.js development bootcamps, Python classes, and circuit design workshops.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Search form */}
          <div className="bg-gray-50 border border-gray-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-600" />
              Search Courses
            </h3>
            <form action="/courses" method="GET" className="relative">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Keywords..."
                className="w-full bg-white border border-gray-200 rounded-full py-2 pl-3 pr-9 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
              />
              {filter !== 'all' && <input type="hidden" name="filter" value={filter} />}
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Pricing Filter */}
          <div className="bg-gray-50 border border-gray-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-600" />
              Enrollment Mode
            </h3>
            <div className="flex flex-col gap-1.5 text-xs text-gray-505 font-bold">
              <Link 
                href={`/courses${getQueryString({ filter: 'all', page: '1' })}`} 
                className={`block px-2.5 py-1.5 rounded-none transition-all ${filter === 'all' ? 'bg-white text-teal-650 border-l-2 border-teal-650 shadow-sm' : 'hover:text-gray-800'}`}
              >
                All Courses
              </Link>
              <Link 
                href={`/courses${getQueryString({ filter: 'free', page: '1' })}`} 
                className={`block px-2.5 py-1.5 rounded-none transition-all ${filter === 'free' ? 'bg-white text-emerald-605 border-l-2 border-emerald-605 shadow-sm' : 'hover:text-gray-800'}`}
              >
                Free Courses
              </Link>
              <Link 
                href={`/courses${getQueryString({ filter: 'premium', page: '1' })}`} 
                className={`block px-2.5 py-1.5 rounded-none transition-all ${filter === 'premium' ? 'bg-white text-teal-600 border-l-2 border-teal-600 shadow-sm' : 'hover:text-gray-800'}`}
              >
                Premium Enrollments
              </Link>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-none">
              {errorMsg}
            </div>
          )}

          {items.length === 0 ? (
            <div className="py-20 bg-gray-50 border border-gray-200 rounded-none flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-700">No Courses Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mt-1">We couldn't find any courses matching your search criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {items.map(item => (
                  <BookCard key={item.id} {...item} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-150 pt-6 mt-4">
                  <span className="text-xs text-gray-400 font-semibold">
                    Page <span className="font-bold text-gray-750">{page}</span> of <span className="font-bold text-gray-750">{totalPages}</span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {page > 1 ? (
                      <Link
                        href={`/courses${getQueryString({ page: (page - 1).toString() })}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </Link>
                    ) : (
                      <button disabled className="px-4 py-2 border border-gray-100 rounded-full text-xs font-bold text-gray-300 cursor-not-allowed">
                        Previous
                      </button>
                    )}

                    {page < totalPages ? (
                      <Link
                        href={`/courses${getQueryString({ page: (page + 1).toString() })}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        Next
                      </Link>
                    ) : (
                      <button disabled className="px-4 py-2 border border-gray-100 rounded-full text-xs font-bold text-gray-300 cursor-not-allowed">
                        Next
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
