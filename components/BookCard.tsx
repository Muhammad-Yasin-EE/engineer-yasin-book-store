import Link from 'next/link'
import { Book } from 'lucide-react'

interface BookCardProps {
  id: string
  title: string
  author: string
  category: string
  type: 'free' | 'premium'
  price: number
  cover_url: string | null
}

export default function BookCard({ id, title, author, category, type, price, cover_url }: BookCardProps) {
  const hasCover = cover_url && !cover_url.includes('placeholder') && !cover_url.includes('covers/')
  
  const getGradientClass = (titleStr: string) => {
    const len = titleStr.length
    if (len % 3 === 0) return 'from-red-900 to-red-950 text-red-100'
    if (len % 3 === 1) return 'from-gray-900 to-gray-950 text-gray-100'
    return 'from-[#7f1d1d] to-[#450a0a] text-red-100'
  }

  return (
    <div className="group relative bg-white border border-gray-200 rounded-none overflow-hidden hover:border-[#B8212E]/40 hover:shadow-[0_10px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Book Cover Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100">
        
        {/* Badge on cover (Sharp corners matching studentstore.pk) */}
        <span className={`absolute top-2.5 left-2.5 z-10 text-[9px] font-bold px-2 py-0.5 tracking-wider ${
          type === 'free' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-[#B8212E] text-white'
        }`}>
          {type === 'free' ? 'FREE' : 'PAID'}
        </span>

        {/* Book cover rendering */}
        {hasCover ? (
          <img
            src={cover_url}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br ${getGradientClass(title)}`}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 truncate max-w-[120px]">{category}</span>
              <Book className="w-3.5 h-3.5 opacity-50" />
            </div>
            
            <div className="my-auto py-2">
              <h3 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-3 text-white">{title}</h3>
              <p className="text-[10px] mt-1 opacity-75 line-clamp-1 italic">by {author}</p>
            </div>
            
            <div className="border-t border-white/10 pt-2 flex justify-between items-center text-[9px] font-mono opacity-50">
              <span>YASIN BOOKS</span>
              <span>PDF / EPUB</span>
            </div>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">
          {category}
        </span>
        <h4 className="font-semibold text-gray-800 group-hover:text-[#B8212E] transition-colors line-clamp-1 text-sm sm:text-base mb-1">
          {title}
        </h4>
        <p className="text-xs text-gray-500 mb-3 truncate">
          by {author}
        </p>

        {/* Pricing Display */}
        <div className="mb-4">
          <span className="text-sm sm:text-base font-bold text-[#B8212E]">
            {type === 'free' ? 'Rs. 0' : `Rs. ${price.toFixed(0)}`}
          </span>
          {type === 'premium' && (
            <span className="text-xs text-gray-450 line-through ml-2 font-medium">
              Rs. ${(price * 1.4).toFixed(0)}
            </span>
          )}
        </div>

        {/* Action Button (Pill shape rounded-full) */}
        <Link 
          href={`/books/${id}`}
          className="mt-auto w-full inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold border border-[#B8212E] text-[#B8212E] group-hover:bg-[#B8212E] group-hover:text-white transition-all duration-200"
        >
          View Book
        </Link>
      </div>

    </div>
  )
}
