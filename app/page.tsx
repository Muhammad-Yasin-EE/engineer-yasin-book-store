import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BookCard from '@/components/BookCard'
import CategoryCard from '@/components/CategoryCard'
import { BookOpen, Sparkles, BookMarked, Layers } from 'lucide-react'

const CATEGORIES = [
  "Academic Books", "Test Preparation", "Programming Books", "AI Books", "Engineering Books", 
  "Mathematics", "Science & Technology", "Medical Books", "Language Learning", "Story Books", 
  "Kids' Books", "Fairy Tales", "Short Stories", "Fiction", "Classic Literature", 
  "History", "Business & Finance", "Arts & Design", "Islamic Books", "Self Improvement", 
  "Magazines", "Research Papers", "New Arrivals", "Popular Books", "All Books"
]

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let newArrivals: any[] = []
  let popularBooks: any[] = []
  let errorMsg = null

  try {
    const supabase = await createClient()

    const { data: newArrData } = await supabase
      .from('books')
      .select('*')
      .eq('category', 'New Arrivals')
      .limit(6)
    
    if (!newArrData || newArrData.length === 0) {
      const { data: latestData } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)
      newArrivals = latestData || []
    } else {
      newArrivals = newArrData
    }

    const { data: popData } = await supabase
      .from('books')
      .select('*')
      .eq('category', 'Popular Books')
      .limit(6)

    if (!popData || popData.length === 0) {
      const { data: downloadedData } = await supabase
        .from('books')
        .select('*')
        .order('download_count', { ascending: false })
        .limit(6)
      popularBooks = downloadedData || []
    } else {
      popularBooks = popData
    }
  } catch (err: any) {
    console.error('Home Page Data Fetching Error:', err)
    errorMsg = 'Could not load live bookstore contents. Displaying placeholder info.'
  }

  return (
    <div className="space-y-16 pb-20 bg-white text-[#222222]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 bg-[#f8fafc] border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8212E]/5 border border-[#B8212E]/20 text-[#B8212E] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Pakistan's Student Resource Portal
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-800 max-w-4xl mx-auto leading-tight mb-6">
            Engineer Yasin <span className="text-[#B8212E]">Books</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Access a vast library of free and premium resources compiled across engineering, computer science, academic preparation, and classical literature.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/books" 
              className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-bold bg-[#B8212E] hover:bg-[#D62636] text-white shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
            >
              Browse All Books
            </Link>
            <Link 
              href="/books?filter=free" 
              className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              Explore Free Library
            </Link>
          </div>
        </div>
      </section>

      {/* Network Alert */}
      {errorMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-[#B8212E]/5 border border-[#B8212E]/10 rounded-none text-gray-600 text-sm text-center">
            {errorMsg} Check the <Link href="/admin" className="text-[#B8212E] underline font-semibold">Admin Panel</Link> to configure details, or proceed by signing in.
          </div>
        </div>
      )}

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#B8212E]" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">New Arrivals</h2>
          </div>
          <Link href="/books?category=New Arrivals" className="text-xs sm:text-sm font-semibold text-[#B8212E] hover:text-[#D62636] transition-colors">
            See All &rarr;
          </Link>
        </div>

        {newArrivals.length === 0 ? (
          <div className="py-12 bg-gray-50 border border-gray-150 rounded-none flex flex-col items-center justify-center text-gray-400 text-sm">
            No books found. Seed records through the admin panel.
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
            {newArrivals.map((book) => (
              <div key={book.id} className="w-[250px] sm:w-[270px] shrink-0 snap-start">
                <BookCard {...book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#B8212E]" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Popular Books</h2>
          </div>
          <Link href="/books?category=Popular Books" className="text-xs sm:text-sm font-semibold text-[#B8212E] hover:text-[#D62636] transition-colors">
            See All &rarr;
          </Link>
        </div>

        {popularBooks.length === 0 ? (
          <div className="py-12 bg-gray-50 border border-gray-150 rounded-none flex flex-col items-center justify-center text-gray-400 text-sm">
            No books found. Seed records through the admin panel.
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
            {popularBooks.map((book) => (
              <div key={book.id} className="w-[250px] sm:w-[270px] shrink-0 snap-start">
                <BookCard {...book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left border-b border-gray-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center justify-center sm:justify-start gap-2">
            <BookOpen className="w-5 h-5 text-[#B8212E]" />
            Browse by Category
          </h2>
          <p className="text-gray-400 text-sm mt-1">Select from 25 organized library topics to find your study materials.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category} name={category} />
          ))}
        </div>
      </section>

    </div>
  )
}
