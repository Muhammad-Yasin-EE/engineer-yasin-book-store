import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BookCard from '@/components/BookCard'
import { Search, ChevronLeft, ChevronRight, Hammer, Sparkles, Filter } from 'lucide-react'

const CATEGORIES = ["Programming", "3D Modeling", "MATLAB & Simulink", "Hardware & PCB", "Tutoring", "Completed Projects"]

interface SearchParams {
  search?: string
  category?: string
  page?: string
}

export const revalidate = 60

export default async function ServicesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const search = params.search || ''
  const category = params.category || ''
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
      .eq('resource_type', 'service')

    if (category) {
      query = query.eq('category', category)
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
    console.error('Fetch Services Error:', err)
    errorMsg = 'Could not retrieve services directory from database.'
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Hammer className="w-3.5 h-3.5" />
            Engineering & Coding Services
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            {category || 'Professional Services'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Hire us for custom MATLAB setups, 3D modeling, coding, or academic tutoring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          
          {/* Custom Order Banner */}
          <div className="bg-[#B8212E] text-white p-5 rounded-none shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all"></div>
            <Sparkles className="w-6 h-6 text-amber-300 mb-3" />
            <h3 className="text-sm font-extrabold tracking-wide mb-1">Custom Project?</h3>
            <p className="text-xs text-rose-100 font-medium mb-4 leading-relaxed">
              Have a unique requirement? Tell us exactly what you need built or designed.
            </p>
            <a 
              href="https://wa.me/923342806970?text=Hi,%20I%20want%20to%20request%20a%20Custom%20Order%20for%20a%20project." 
              target="_blank" 
              rel="noreferrer"
              className="inline-block w-full text-center px-4 py-2 bg-white text-[#B8212E] text-xs font-bold shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
            >
              Request Custom Order
            </a>
          </div>
          {/* Search form */}
          <div className="bg-gray-50 border border-gray-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-605" />
              Search Services
            </h3>
            <form action="/services" method="GET" className="relative">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Keywords..."
                className="w-full bg-white border border-gray-200 rounded-full py-2 pl-3 pr-9 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
              />
              {category && <input type="hidden" name="category" value={category} />}
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Service Categories */}
          <div className="bg-gray-50 border border-gray-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-600" />
              Service Field
            </h3>
            <div className="flex flex-col gap-1.5 text-xs text-gray-505 font-bold">
              <Link 
                href="/services" 
                className={`block px-2.5 py-1.5 rounded-none transition-all ${!category ? 'bg-white text-amber-650 border-l-2 border-amber-650 shadow-sm' : 'hover:text-gray-800'}`}
              >
                All Services
              </Link>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  href={`/services${getQueryString({ category: cat, page: '1' })}`}
                  className={`block px-2.5 py-1.5 rounded-none transition-all ${category === cat ? 'bg-white text-amber-650 border-l-2 border-amber-650 shadow-sm' : 'hover:text-gray-800'}`}
                >
                  {cat}
                </Link>
              ))}
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
              <Hammer className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-700">No Services Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mt-1">We couldn't find any engineering services matching your search criteria.</p>
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
                        href={`/services${getQueryString({ page: (page - 1).toString() })}`}
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
                        href={`/services${getQueryString({ page: (page + 1).toString() })}`}
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
