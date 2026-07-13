import Link from 'next/link'
import { BookOpen } from 'lucide-react'

interface CategoryCardProps {
  name: string
  count?: number
}

export default function CategoryCard({ name, count }: CategoryCardProps) {
  return (
    <Link 
      href={`/books?category=${encodeURIComponent(name)}`}
      className="group flex items-center justify-between p-4 bg-[#f8fafc] hover:bg-white border border-gray-200 hover:border-[#B8212E]/40 rounded-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 group-hover:text-white group-hover:bg-[#B8212E] group-hover:border-transparent transition-all">
          <BookOpen className="w-4.5 h-4.5" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 group-hover:text-[#B8212E] transition-colors text-sm sm:text-base">
            {name}
          </h4>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
            Explore Category
          </span>
        </div>
      </div>
      
      {count !== undefined && (
        <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-full text-gray-500 border border-gray-200">
          {count}
        </span>
      )}
    </Link>
  )
}
