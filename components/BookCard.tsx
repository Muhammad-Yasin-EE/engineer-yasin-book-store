import Link from 'next/link'
import { Book, GraduationCap, Briefcase, Download, Hammer, PlayCircle } from 'lucide-react'

interface BookCardProps {
  id: string
  title: string
  author: string // Stores provider, author, or company
  category: string
  type: 'free' | 'premium'
  price: number
  cover_url: string | null
  resource_type?: 'book' | 'scholarship' | 'job' | 'software' | 'service' | 'course'
}

export default function BookCard({ id, title, author, category, type, price, cover_url, resource_type = 'book' }: BookCardProps) {
  const hasCover = cover_url && !cover_url.includes('placeholder') && !cover_url.includes('covers/')
  
  const getGradientClass = (titleStr: string) => {
    const len = titleStr.length
    if (len % 3 === 0) return 'from-red-900 to-red-950 text-red-100'
    if (len % 3 === 1) return 'from-gray-900 to-gray-950 text-gray-100'
    return 'from-[#7f1d1d] to-[#450a0a] text-red-100'
  }

  // Get matching icon based on resource type
  const getResourceIcon = () => {
    switch (resource_type) {
      case 'scholarship': return <GraduationCap className="w-4 h-4 text-emerald-600" />
      case 'job': return <Briefcase className="w-4 h-4 text-blue-600" />
      case 'software': return <Download className="w-4 h-4 text-violet-600" />
      case 'service': return <Hammer className="w-4 h-4 text-amber-600" />
      case 'course': return <PlayCircle className="w-4 h-4 text-teal-600" />
      default: return <Book className="w-4 h-4 text-[#B8212E]" />
    }
  }

  // Button text based on type
  const getActionButtonText = () => {
    switch (resource_type) {
      case 'scholarship': return 'Apply Scholarship'
      case 'job': return 'Apply Job'
      case 'software': return type === 'free' ? 'Download Software' : 'Get Software'
      case 'service': return 'Order Service'
      case 'course': return type === 'free' ? 'Start Course' : 'Enroll Course'
      default: return 'View Book'
    }
  }

  return (
    <div className="group relative bg-white border border-gray-200 rounded-none overflow-hidden hover:border-[#B8212E]/40 hover:shadow-[0_10px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100">
        
        {/* Resource Type Tag Badge */}
        <span className={`absolute top-2.5 left-2.5 z-10 text-[8px] font-bold px-2 py-0.5 tracking-wider uppercase text-white ${
          resource_type === 'scholarship' ? 'bg-emerald-600' :
          resource_type === 'job' ? 'bg-blue-600' :
          resource_type === 'software' ? 'bg-violet-600' :
          resource_type === 'service' ? 'bg-amber-600' :
          resource_type === 'course' ? 'bg-teal-600' : 'bg-[#B8212E]'
        }`}>
          {resource_type}
        </span>

        {/* Paid / Free badge */}
        {resource_type !== 'scholarship' && resource_type !== 'job' && (
          <span className="absolute top-2.5 right-2.5 z-10 text-[8px] font-bold px-1.5 py-0.5 tracking-wider rounded-none bg-white text-gray-800 border border-gray-200 shadow-sm">
            {type === 'free' ? 'FREE' : 'PREMIUM'}
          </span>
        )}

        {/* Visual Render */}
        {hasCover ? (
          <img
            src={cover_url || ''}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
            resource_type === 'scholarship' ? 'from-emerald-500 to-teal-600' :
            resource_type === 'job' ? 'from-blue-500 to-indigo-600' :
            resource_type === 'software' ? 'from-violet-500 to-purple-655' :
            resource_type === 'service' ? 'from-amber-500 to-orange-600' :
            resource_type === 'course' ? 'from-teal-500 to-cyan-600' : 'from-[#B8212E] to-rose-700'
          } relative overflow-hidden`}>
            {/* Tech grid dot pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Centered glassmorphism icon container */}
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center transform group-hover:scale-108 group-hover:rotate-2 transition-all duration-300 z-10">
              {resource_type === 'scholarship' ? <GraduationCap className="w-7 h-7 text-white" /> :
               resource_type === 'job' ? <Briefcase className="w-7 h-7 text-white" /> :
               resource_type === 'software' ? <Download className="w-7 h-7 text-white" /> :
               resource_type === 'service' ? <Hammer className="w-7 h-7 text-white" /> :
               resource_type === 'course' ? <PlayCircle className="w-7 h-7 text-white" /> : <Book className="w-7 h-7 text-white" />}
            </div>

            {/* Subtle branding coordinates */}
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[7px] font-mono tracking-wider text-white/40 uppercase z-10 select-none">
              <span className="truncate max-w-[80px]">{category}</span>
              <span>Yasin Portal</span>
            </div>
          </div>
        )}
      </div>

      {/* Details Footer */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">
          {category}
        </span>
        <h4 className="font-semibold text-gray-800 group-hover:text-[#B8212E] transition-colors line-clamp-1 text-sm sm:text-base mb-1">
          {title}
        </h4>
        <p className="text-xs text-gray-500 mb-3 truncate">
          {resource_type === 'job' ? 'Company: ' : resource_type === 'scholarship' ? 'Host: ' : 'Author: '}
          <span className="font-semibold">{author}</span>
        </p>

        {/* Price layout */}
        {resource_type !== 'scholarship' && resource_type !== 'job' && (
          <div className="mb-4">
            {type === 'free' ? (
              <span className="text-sm sm:text-base font-bold text-emerald-600">
                Rs. 0 (Free)
              </span>
            ) : (
              <>
                <span className="text-sm sm:text-base font-bold text-[#B8212E]">
                  Rs. {price.toFixed(0)}
                </span>
                <span className="text-xs text-gray-450 line-through ml-2 font-medium">
                  Rs. {(price * 1.4).toFixed(0)}
                </span>
              </>
            )}
          </div>
        )}

        {/* Action Button */}
        <Link 
          href={`/items/${id}`}
          prefetch={false}
          className="mt-auto w-full inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold border border-[#B8212E] text-[#B8212E] group-hover:bg-[#B8212E] group-hover:text-white transition-all duration-200"
        >
          {getActionButtonText()}
        </Link>
      </div>

    </div>
  )
}
