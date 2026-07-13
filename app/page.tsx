import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BookCard from '@/components/BookCard'
import CategoryCard from '@/components/CategoryCard'
import { BookOpen, Sparkles, BookMarked, Layers } from 'lucide-react'

// Hardcoded list of 25 categories as requested
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

    // 1. Fetch New Arrivals (explicitly tagged or latest)
    const { data: newArrData } = await supabase
      .from('books')
      .select('*')
      .eq('category', 'New Arrivals')
      .limit(6)
    
    // Fallback to latest books if none tagged
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

    // 2. Fetch Popular Books (explicitly tagged or ordered by downloads)
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
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-slate-950">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Minds Through Knowledge
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight mb-6">
            Engineer Yasin Books
          </h1>
          
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Access a vast library of free and premium resources compiled across engineering, computer science, academic preparation, and classical literature.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/books" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all"
            >
              Browse All Books
            </Link>
            <Link 
              href="/books?filter=free" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
            >
              Explore Free Library
            </Link>
          </div>
        </div>
      </section>

      {/* Network Alert (if Supabase credentials are missing / database down) */}
      {errorMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-indigo-950/20 border border-indigo-800/30 rounded-2xl text-slate-300 text-sm text-center">
            {errorMsg} Check the <Link href="/admin" className="text-indigo-400 underline font-semibold">Admin Panel</Link> to configure details, or proceed by signing in.
          </div>
        </div>
      )}

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">New Arrivals</h2>
          </div>
          <Link href="/books?category=New Arrivals" className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            See All &rarr;
          </Link>
        </div>

        {newArrivals.length === 0 ? (
          <div className="py-12 bg-[#090d16]/30 border border-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-sm">
            No books found. Please execute the DDL seed script or upload via the Admin Dashboard.
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800/60">
            {newArrivals.map((book) => (
              <div key={book.id} className="w-[260px] sm:w-[280px] shrink-0 snap-start">
                <BookCard {...book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Popular Books</h2>
          </div>
          <Link href="/books?category=Popular Books" className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            See All &rarr;
          </Link>
        </div>

        {popularBooks.length === 0 ? (
          <div className="py-12 bg-[#090d16]/30 border border-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-sm">
            No books found. Seed records through the admin panel.
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800/60">
            {popularBooks.map((book) => (
              <div key={book.id} className="w-[260px] sm:w-[280px] shrink-0 snap-start">
                <BookCard {...book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center justify-center sm:justify-start gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Browse by Category
          </h2>
          <p className="text-slate-400 text-sm mt-1">Select from 25 organized library topics to find your study materials.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category} name={category} />
          ))}
        </div>
      </section>

    </div>
  )
}
