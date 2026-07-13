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
  // Use a reliable, beautiful placeholder cover if cover_url is not set or placeholder
  const hasCover = cover_url && !cover_url.includes('placeholder') && !cover_url.includes('covers/')
  
  // Render placeholder cover with dynamic gradient based on title length
  const getGradientClass = (titleStr: string) => {
    const len = titleStr.length;
    if (len % 3 === 0) return 'from-violet-900 to-indigo-950 text-indigo-200';
    if (len % 3 === 1) return 'from-fuchsia-950 to-purple-950 text-purple-200';
    return 'from-blue-950 to-slate-900 text-sky-200';
  }

  return (
    <div className="group relative bg-[#0d1527]/40 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
      
      {/* Book Cover Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950 flex items-center justify-center border-b border-slate-900">
        
        {/* Badge on cover */}
        <span className={`absolute top-3 right-3 z-10 text-xs font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
          type === 'free' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
        }`}>
          {type === 'free' ? 'FREE' : `$${price.toFixed(2)}`}
        </span>

        {/* Book cover rendering */}
        {hasCover ? (
          <img
            src={cover_url}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex flex-col justify-between p-5 bg-gradient-to-br ${getGradientClass(title)}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 truncate max-w-[120px]">{category}</span>
              <Book className="w-4 h-4 opacity-50" />
            </div>
            
            <div className="my-auto py-4">
              <h3 className="font-extrabold text-base leading-snug line-clamp-3 text-white tracking-tight">{title}</h3>
              <p className="text-xs mt-1.5 opacity-75 line-clamp-1 italic">by {author}</p>
            </div>
            
            <div className="border-t border-white/10 pt-2 flex justify-between items-center text-[10px] font-mono opacity-50">
              <span>YASIN BOOKS</span>
              <span>EPUB/PDF</span>
            </div>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1 truncate">
          {category}
        </span>
        <h4 className="font-bold text-slate-100 group-hover:text-white transition-colors line-clamp-1 mb-0.5">
          {title}
        </h4>
        <p className="text-xs text-slate-400 mb-4 truncate">
          by {author}
        </p>

        {/* Action Button */}
        <Link 
          href={`/books/${id}`}
          className="mt-auto w-full inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent transition-all duration-300"
        >
          View Book
        </Link>
      </div>

    </div>
  )
}
