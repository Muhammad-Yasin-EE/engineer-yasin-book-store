import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BookCard from '@/components/BookCard'
import { Search, ChevronLeft, ChevronRight, X, Sparkles, Filter } from 'lucide-react'

// Hardcoded list of 25 categories as requested
const CATEGORIES = [
  "Academic Books", "Test Preparation", "Programming Books", "AI Books", "Engineering Books", 
  "Mathematics", "Science & Technology", "Medical Books", "Language Learning", "Story Books", 
  "Kids' Books", "Fairy Tales", "Short Stories", "Fiction", "Classic Literature", 
  "History", "Business & Finance", "Arts & Design", "Islamic Books", "Self Improvement", 
  "Magazines", "Research Papers", "New Arrivals", "Popular Books", "All Books"
]

interface SearchParams {
  search?: string
  category?: string
  filter?: 'free' | 'premium' | string
  page?: string
}

export const revalidate = 0 // Don't cache the browse page, load dynamically

export default async function BooksPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const search = params.search || ''
  const category = params.category || ''
  const filter = params.filter || 'all'
  const page = parseInt(params.page || '1', 10)
  const pageSize = 12

  let books: any[] = []
  let totalCount = 0
  let errorMsg = null

  try {
    const supabase = await createClient()
    const startRange = (page - 1) * pageSize
    const endRange = startRange + pageSize - 1

    let query = supabase
      .from('books')
      .select('*', { count: 'exact' })

    // Apply category filter
    if (category && category !== 'All Books') {
      query = query.eq('category', category)
    }

    // Apply free/premium filter
    if (filter === 'free') {
      query = query.eq('type', 'free')
    } else if (filter === 'premium') {
      query = query.eq('type', 'premium')
    }

    // Apply search filter (title or author)
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`)
    }

    // Sort by created date
    query = query.order('created_at', { ascending: false }).range(startRange, endRange)

    const { data, count, error } = await query

    if (error) throw error

    books = data || []
    totalCount = count || 0
  } catch (err: any) {
    console.error('Browse Books Fetch Error:', err)
    errorMsg = 'Could not retrieve books from database.'
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  // Construct URL query strings
  const getQueryString = (overrides: Partial<SearchParams>) => {
    const combined = { search, category, filter, page: page.toString(), ...overrides }
    const urlParams = new URLSearchParams()
    
    if (combined.search) urlParams.set('search', combined.search)
    if (combined.category && combined.category !== 'All Books') urlParams.set('category', combined.category)
    if (combined.filter && combined.filter !== 'all') urlParams.set('filter', combined.filter)
    if (combined.page && combined.page !== '1') urlParams.set('page', combined.page)
    
    const str = urlParams.toString()
    return str ? `?${str}` : ''
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col gap-8 bg-slate-950">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-900 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            Book Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {category || 'All Books'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Found {totalCount} books matching your preferences.
          </p>
        </div>

        {/* Selected Filters Summary */}
        <div className="flex flex-wrap gap-2">
          {category && category !== 'All Books' && (
            <Link 
              href={`/books${getQueryString({ category: '' })}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
            >
              Category: {category}
              <X className="w-3.5 h-3.5 text-slate-500 hover:text-rose-400" />
            </Link>
          )}
          {filter !== 'all' && (
            <Link 
              href={`/books${getQueryString({ filter: 'all' })}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
            >
              Type: {filter === 'free' ? 'Free Only' : 'Premium Only'}
              <X className="w-3.5 h-3.5 text-slate-500 hover:text-rose-400" />
            </Link>
          )}
          {search && (
            <Link 
              href={`/books${getQueryString({ search: '' })}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
            >
              Search: "{search}"
              <X className="w-3.5 h-3.5 text-slate-500 hover:text-rose-400" />
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar - Filters */}
        <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-20">
          
          {/* Search form (Alternative for quick updates) */}
          <div className="bg-[#0c1324]/50 border border-slate-900 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              Search Library
            </h3>
            <form action="/books" method="GET" className="relative">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Keywords..."
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-3 pr-9 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {category && category !== 'All Books' && <input type="hidden" name="category" value={category} />}
              {filter !== 'all' && <input type="hidden" name="filter" value={filter} />}
              <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Book Type Filter (Free vs Paid) */}
          <div className="bg-[#0c1324]/50 border border-slate-900 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-400" />
              Pricing Filter
            </h3>
            <div className="flex flex-col gap-2 text-xs font-medium">
              <Link 
                href={`/books${getQueryString({ filter: 'all', page: '1' })}`}
                className={`px-3 py-2 rounded-xl transition-all ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-950'}`}
              >
                All Resources
              </Link>
              <Link 
                href={`/books${getQueryString({ filter: 'free', page: '1' })}`}
                className={`px-3 py-2 rounded-xl transition-all ${filter === 'free' ? 'bg-emerald-600 text-white' : 'bg-slate-950/60 text-slate-400 hover:text-emerald-400 hover:bg-slate-950'}`}
              >
                Free Books
              </Link>
              <Link 
                href={`/books${getQueryString({ filter: 'premium', page: '1' })}`}
                className={`px-3 py-2 rounded-xl transition-all ${filter === 'premium' ? 'bg-indigo-600 text-white' : 'bg-slate-950/60 text-slate-400 hover:text-indigo-400 hover:bg-slate-950'}`}
              >
                Premium (Paid)
              </Link>
            </div>
          </div>

          {/* Categories Sidebar List */}
          <div className="bg-[#0c1324]/50 border border-slate-900 rounded-2xl p-5 space-y-3 hidden lg:block">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Categories</h3>
            <div className="max-h-[360px] overflow-y-auto pr-1 space-y-1.5 text-xs text-slate-400">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/books${getQueryString({ category: cat, page: '1' })}`}
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors truncate ${
                    (category === cat || (!category && cat === 'All Books'))
                      ? 'bg-slate-950 text-indigo-400 font-bold border-l-2 border-indigo-500' 
                      : 'hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Section - Books Grid */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
              {errorMsg} Check your database connection details.
            </div>
          )}

          {books.length === 0 ? (
            <div className="py-24 bg-[#0c1324]/20 border border-slate-900 rounded-3xl flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <span className="text-4xl mb-4">📚</span>
              <h3 className="text-lg font-bold text-slate-300">No Books Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                We couldn't find any results matching your filters or search keywords. Try clearing filters or typing other terms.
              </p>
              <Link 
                href="/books"
                className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
              >
                Reset All Filters
              </Link>
            </div>
          ) : (
            <>
              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {books.map((book) => (
                  <BookCard key={book.id} {...book} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-900 pt-6 mt-4">
                  <span className="text-xs text-slate-500">
                    Page <span className="font-semibold text-slate-300">{page}</span> of <span className="font-semibold text-slate-300">{totalPages}</span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {page > 1 ? (
                      <Link
                        href={`/books${getQueryString({ page: (page - 1).toString() })}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-900 rounded-xl text-xs font-semibold text-slate-600 cursor-not-allowed opacity-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                    )}

                    {page < totalPages ? (
                      <Link
                        href={`/books${getQueryString({ page: (page + 1).toString() })}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-900 rounded-xl text-xs font-semibold text-slate-600 cursor-not-allowed opacity-50"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
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
