import Link from 'next/link'
import { BookOpen, GraduationCap, Briefcase, Download, Hammer, PlayCircle } from 'lucide-react'

interface CategoryCardProps {
  name: string
  count?: number
  resourceType?: 'book' | 'scholarship' | 'job' | 'software' | 'service' | 'course'
}

export default function CategoryCard({ name, count, resourceType = 'book' }: CategoryCardProps) {
  
  // Custom navigation targets based on item types
  const getCategoryTarget = () => {
    switch (resourceType) {
      case 'scholarship': return `/scholarships?category=${encodeURIComponent(name)}`
      case 'job': return `/jobs?category=${encodeURIComponent(name)}`
      case 'software': return `/software?category=${encodeURIComponent(name)}`
      case 'service': return `/services?category=${encodeURIComponent(name)}`
      case 'course': return `/courses?category=${encodeURIComponent(name)}`
      default: return `/books?category=${encodeURIComponent(name)}`
    }
  }

  // Get matching icon based on resource type
  const getResourceIcon = () => {
    switch (resourceType) {
      case 'scholarship': return <GraduationCap className="w-4.5 h-4.5" />
      case 'job': return <Briefcase className="w-4.5 h-4.5" />
      case 'software': return <Download className="w-4.5 h-4.5" />
      case 'service': return <Hammer className="w-4.5 h-4.5" />
      case 'course': return <PlayCircle className="w-4.5 h-4.5" />
      default: return <BookOpen className="w-4.5 h-4.5" />
    }
  }

  return (
    <Link 
      href={getCategoryTarget()}
      className="group flex items-center justify-between p-4 bg-[#f8fafc] hover:bg-white border border-gray-200 hover:border-[#B8212E]/40 rounded-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 group-hover:text-white group-hover:bg-[#B8212E] group-hover:border-transparent transition-all">
          {getResourceIcon()}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 group-hover:text-[#B8212E] transition-colors text-sm sm:text-base">
            {name}
          </h4>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
            Explore {resourceType === 'job' ? 'Positions' : 'Category'}
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
