import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Book, Download, ShoppingBag, ShoppingCart, UserCheck, ShieldAlert, ArrowLeft } from 'lucide-react'
import AddToCartButton from './AddToCartButton' // We'll create this client component below

export const revalidate = 0 // Dynamic page

interface BookDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params

  let book: any = null
  let hasPurchased = false
  let isLoggedIn = false
  let errorMsg = null

  const supabase = await createClient()

  try {
    // 1. Fetch book details
    const { data: bookData, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !bookData) {
      return notFound()
    }
    
    book = bookData

    // 2. Check if logged in & purchased
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      isLoggedIn = true
      
      // Check admin status (admins can download all premium books)
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()
      
      if (profile?.is_admin) {
        hasPurchased = true
      } else {
        // Check purchases table
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('book_id', id)
          .maybeSingle()

        if (purchase) {
          hasPurchased = true
        }
      }
    }
  } catch (err: any) {
    console.error('Book Detail Fetch Error:', err)
    errorMsg = 'Could not load payment status.'
  }

  // Generate public download URL for free books
  const getFreeDownloadUrl = () => {
    if (!book) return '#'
    // If it's a relative path in free-books bucket
    if (book.file_path.startsWith('free/')) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/free-books/${book.file_path.substring(5)}`
    }
    // Fallback if full path or other storage layout
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/free-books/${book.file_path}`
  }

  // Cover placeholder details
  const hasCover = book.cover_url && !book.cover_url.includes('placeholder') && !book.cover_url.includes('covers/')
  const getGradientClass = (titleStr: string) => {
    const len = titleStr.length
    if (len % 3 === 0) return 'from-violet-900 to-indigo-950 text-indigo-200'
    if (len % 3 === 1) return 'from-fuchsia-950 to-purple-950 text-purple-200'
    return 'from-blue-950 to-slate-900 text-sky-200'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow bg-slate-950">
      
      {/* Back button */}
      <div className="mb-8">
        <Link 
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Book Cover Visual */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative aspect-[3/4] w-full max-w-[340px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl shadow-indigo-950/20 group">
            <span className={`absolute top-4 right-4 z-10 text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-md ${
              book.type === 'free' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
            }`}>
              {book.type === 'free' ? 'FREE' : `$${book.price.toFixed(2)}`}
            </span>

            {hasCover ? (
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br ${getGradientClass(book.title)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-widest opacity-60 truncate max-w-[150px]">{book.category}</span>
                  <Book className="w-5 h-5 opacity-50" />
                </div>
                
                <div className="my-auto py-6">
                  <h3 className="font-extrabold text-xl sm:text-2xl leading-snug line-clamp-4 text-white tracking-tight">{book.title}</h3>
                  <p className="text-sm mt-2.5 opacity-75 line-clamp-1 italic">by {book.author}</p>
                </div>
                
                <div className="border-t border-white/10 pt-3 flex justify-between items-center text-xs font-mono opacity-50">
                  <span>YASIN BOOKS</span>
                  <span>PDF / EPUB</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Book Details Info */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Metadata Header */}
          <div className="space-y-2">
            <span className="inline-block text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/5 px-2.5 py-1 rounded-md border border-indigo-500/10">
              {book.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
              {book.title}
            </h1>
            <p className="text-base text-slate-400">
              by <span className="font-semibold text-slate-200">{book.author}</span>
            </p>
          </div>

          {/* Book specifications info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-slate-900 py-4 text-xs font-medium text-slate-400">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Format</span>
              <span className="text-slate-200">Secure PDF / EPUB</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Category</span>
              <span className="text-slate-200">{book.category}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">License Type</span>
              <span className={book.type === 'free' ? 'text-emerald-400' : 'text-indigo-400'}>
                {book.type === 'free' ? 'Free (Open Library)' : 'Premium (Paid)'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">About This Book</h3>
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
              {book.description || 'No description available for this book yet. It will be added soon by the author.'}
            </p>
          </div>

          {/* Actions panel */}
          <div className="bg-[#0c1324]/40 border border-slate-900 rounded-3xl p-6 space-y-4">
            
            {/* FREE BOOK FLOW */}
            {book.type === 'free' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-400 font-semibold">Free Download</span>
                    <p className="text-[11px] text-slate-500">No login or registration required. Start reading now.</p>
                  </div>
                  <span className="text-lg font-bold text-emerald-400">FREE</span>
                </div>
                
                <a
                  href={getFreeDownloadUrl()}
                  download
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Now (PDF)
                </a>
              </div>
            )}

            {/* PREMIUM BOOK FLOW */}
            {book.type === 'premium' && (
              <div className="space-y-4">
                
                {/* 1. If user is NOT logged in */}
                {!isLoggedIn && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-indigo-400 font-semibold">Premium Ebook</span>
                        <p className="text-[11px] text-slate-500">Sign in to unlock download access in your library.</p>
                      </div>
                      <span className="text-xl font-extrabold text-white">${book.price.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/login?redirectTo=/books/${book.id}`}
                        className="flex-grow inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-indigo-500 transition-all hover:-translate-y-0.5"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Log In to Buy Now
                      </Link>
                    </div>
                  </div>
                )}

                {/* 2. If user is logged in & ALREADY purchased */}
                {isLoggedIn && hasPurchased && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <UserCheck className="w-4 h-4" />
                        <span className="text-xs font-semibold">You own this resource</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Purchased</span>
                    </div>

                    <a
                      href={`/api/download?bookId=${book.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download Book File
                    </a>
                  </div>
                )}

                {/* 3. If user is logged in & NOT purchased */}
                {isLoggedIn && !hasPurchased && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-indigo-400 font-semibold">Premium Resource</span>
                        <p className="text-[11px] text-slate-500">Pay once, own forever in your library database.</p>
                      </div>
                      <span className="text-xl font-extrabold text-white">${book.price.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      
                      {/* Buy Now (Client interactive redirection) */}
                      <AddToCartButton 
                        book={{
                          id: book.id,
                          title: book.title,
                          author: book.author,
                          price: book.price,
                          cover_url: book.cover_url || '',
                          category: book.category
                        }} 
                        buyNow={true}
                      />

                      {/* Add to Cart (Client interactive store) */}
                      <AddToCartButton 
                        book={{
                          id: book.id,
                          title: book.title,
                          author: book.author,
                          price: book.price,
                          cover_url: book.cover_url || '',
                          category: book.category
                        }} 
                        buyNow={false}
                      />

                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}
