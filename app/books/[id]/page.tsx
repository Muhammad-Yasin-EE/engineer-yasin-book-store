import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Book, Download, ShoppingBag, UserCheck, ShieldAlert, ArrowLeft } from 'lucide-react'
import AddToCartButton from './AddToCartButton'

export const revalidate = 0

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
    const { data: bookData, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !bookData) {
      return notFound()
    }
    
    book = bookData

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      isLoggedIn = true
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()
      
      if (profile?.is_admin) {
        hasPurchased = true
      } else {
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

  const getFreeDownloadUrl = () => {
    if (!book) return '#'
    if (book.file_path.startsWith('free/')) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/free-books/${book.file_path.substring(5)}`
    }
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/free-books/${book.file_path}`
  }

  const hasCover = book.cover_url && !book.cover_url.includes('placeholder') && !book.cover_url.includes('covers/')
  const getGradientClass = (titleStr: string) => {
    const len = titleStr.length
    if (len % 3 === 0) return 'from-red-900 to-red-950 text-red-100'
    if (len % 3 === 1) return 'from-gray-900 to-gray-950 text-gray-100'
    return 'from-[#7f1d1d] to-[#450a0a] text-red-100'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow bg-white text-[#222222]">
      
      {/* Back button */}
      <div className="mb-8">
        <Link 
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Book Cover Visual (Sharp corners) */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative aspect-[3/4] w-full max-w-[320px] rounded-none overflow-hidden border border-gray-250 bg-gray-50 shadow-md">
            <span className={`absolute top-3 left-3 z-10 text-[9px] font-bold px-2 py-0.5 tracking-wider ${
              book.type === 'free' 
                ? 'bg-[#2ecc71] text-white' 
                : 'bg-[#B8212E] text-white'
            }`}>
              {book.type === 'free' ? 'FREE' : 'PAID'}
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
                  <h3 className="font-extrabold text-xl leading-snug line-clamp-4 text-white tracking-tight">{book.title}</h3>
                  <p className="text-xs mt-2.5 opacity-75 line-clamp-1 italic">by {book.author}</p>
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
            <span className="inline-block text-[9px] font-bold text-[#B8212E] uppercase tracking-widest bg-[#B8212E]/5 px-2 py-0.5 rounded border border-[#B8212E]/10">
              {book.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight leading-tight">
              {book.title}
            </h1>
            <p className="text-sm text-gray-500">
              by <span className="font-semibold text-gray-700">{book.author}</span>
            </p>
          </div>

          {/* Book specifications info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-gray-150 py-4 text-xs font-semibold text-gray-500">
            <div>
              <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Format</span>
              <span className="text-gray-800 font-bold">Secure PDF / EPUB</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Category</span>
              <span className="text-gray-800 font-bold">{book.category}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">License Type</span>
              <span className={`font-bold ${book.type === 'free' ? 'text-emerald-600' : 'text-[#B8212E]'}`}>
                {book.type === 'free' ? 'Free (Open Library)' : 'Premium (Paid)'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">About This Book</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line font-medium">
              {book.description || 'No description available for this book yet. It will be added soon by the author.'}
            </p>
          </div>

          {/* Actions panel */}
          <div className="bg-[#f8fafc] border border-gray-200 rounded-none p-6 space-y-4">
            
            {/* FREE BOOK FLOW */}
            {book.type === 'free' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-600 font-bold">Free Download</span>
                    <p className="text-[10px] text-gray-400 font-semibold">No registration required. Instant download.</p>
                  </div>
                  <span className="text-base font-bold text-emerald-600">FREE</span>
                </div>
                
                <a
                  href={getFreeDownloadUrl()}
                  download
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm hover:shadow hover:-translate-y-0.5 transition-all"
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
                        <span className="text-xs text-[#B8212E] font-bold">Premium Ebook</span>
                        <p className="text-[10px] text-gray-400 font-semibold">Sign in to unlock download access in your library.</p>
                      </div>
                      <span className="text-xl font-bold text-gray-800">Rs. {book.price.toFixed(0)}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/login?redirectTo=/books/${book.id}`}
                        className="flex-grow inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-sm transition-all hover:-translate-y-0.5"
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
                    <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold">
                        <UserCheck className="w-4 h-4" />
                        <span className="text-xs">You own this resource</span>
                      </div>
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded">Purchased</span>
                    </div>

                    <a
                      href={`/api/download?bookId=${book.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-sm shadow-sm hover:shadow hover:-translate-y-0.5 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download Book File (PDF)
                    </a>
                  </div>
                )}

                {/* 3. If user is logged in & NOT purchased */}
                {isLoggedIn && !hasPurchased && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#B8212E] font-bold">Premium Resource</span>
                        <p className="text-[10px] text-gray-400 font-semibold">Pay once, own forever in your library database.</p>
                      </div>
                      <span className="text-xl font-bold text-gray-800">Rs. {book.price.toFixed(0)}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      
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
