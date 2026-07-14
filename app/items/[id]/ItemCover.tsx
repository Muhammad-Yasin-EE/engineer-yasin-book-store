'use client'

import { useState } from 'react'
import { Book, GraduationCap, Briefcase, Download, Hammer, PlayCircle } from 'lucide-react'

interface ItemCoverProps {
  coverUrl: string | null
  title: string
  category: string
  resourceType: string
  author: string
}

export default function ItemCover({ coverUrl, title, category, resourceType, author }: ItemCoverProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(coverUrl)
  const [hasError, setHasError] = useState(false)

  const hasCover = imgSrc && !imgSrc.includes('placeholder') && !imgSrc.includes('covers/')

  const getGradientClass = (titleStr: string) => {
    const len = titleStr.length
    if (len % 3 === 0) return 'from-red-900 to-red-950 text-red-100'
    if (len % 3 === 1) return 'from-gray-900 to-gray-950 text-gray-100'
    return 'from-[#7f1d1d] to-[#450a0a] text-red-100'
  }

  const getResourceIcon = () => {
    switch (resourceType) {
      case 'scholarship': return <GraduationCap className="w-8 h-8 text-white" />
      case 'job': return <Briefcase className="w-8 h-8 text-white" />
      case 'software': return <Download className="w-8 h-8 text-white" />
      case 'service': return <Hammer className="w-8 h-8 text-white" />
      case 'course': return <PlayCircle className="w-8 h-8 text-white" />
      default: return <Book className="w-8 h-8 text-white" />
    }
  }

  const getResourceIconColor = () => {
    switch (resourceType) {
      case 'scholarship': return <GraduationCap className="w-5 h-5 text-emerald-600" />
      case 'job': return <Briefcase className="w-5 h-5 text-blue-600" />
      case 'software': return <Download className="w-5 h-5 text-violet-600" />
      case 'service': return <Hammer className="w-5 h-5 text-amber-600" />
      case 'course': return <PlayCircle className="w-5 h-5 text-teal-600" />
      default: return <Book className="w-5 h-5 text-[#B8212E]" />
    }
  }

  const handleImageError = () => {
    if (imgSrc && !imgSrc.includes('google.com') && (imgSrc.includes('logo.clearbit.com') || imgSrc.includes('google.com/s2/favicons'))) {
      const parts = imgSrc.split('/')
      const domain = parts[parts.length - 1]
      if (domain) {
        setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`)
        return
      }
    }
    setHasError(true)
  }

  if (hasCover && !hasError) {
    const isLogo = imgSrc && (imgSrc.includes('logo.clearbit.com') || imgSrc.includes('google.com/s2/favicons'))
    
    if (isLogo) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50/80 p-8">
          <div className="w-28 h-28 bg-white rounded-3xl shadow-sm border border-gray-150 flex items-center justify-center p-5 transform hover:scale-103 transition-transform duration-300">
            <img
              src={imgSrc || ''}
              alt={title}
              className="w-full h-full object-contain"
              onError={handleImageError}
            />
          </div>
        </div>
      )
    }

    return (
      <img
        src={imgSrc || ''}
        alt={title}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
    )
  }

  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
      resourceType === 'scholarship' ? 'from-emerald-500 to-teal-600' :
      resourceType === 'job' ? 'from-blue-500 to-indigo-600' :
      resourceType === 'software' ? 'from-violet-500 to-purple-655' :
      resourceType === 'service' ? 'from-amber-500 to-orange-600' :
      resourceType === 'course' ? 'from-teal-500 to-cyan-600' : 'from-[#B8212E] to-rose-700'
    } relative overflow-hidden`}>
      {/* Tech grid dot pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Centered glassmorphism icon container */}
      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center z-10">
        {getResourceIcon()}
      </div>

      {/* Subtle branding coordinates */}
      <div className="absolute bottom-4 left-5 right-5 flex justify-between items-center text-[8px] font-mono tracking-wider text-white/40 uppercase z-10 select-none">
        <span className="truncate max-w-[120px]">{category}</span>
        <span>Yasin Portal</span>
      </div>
    </div>
  )
}
