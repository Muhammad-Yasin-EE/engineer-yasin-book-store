import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Book, GraduationCap, Briefcase, Download, Hammer, PlayCircle, ArrowLeft, UserCheck, ShoppingBag, ExternalLink } from 'lucide-react'
import AddToCartButton from './AddToCartButton'
import ReviewSection from './ReviewSection'

export const revalidate = 0

interface ItemDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params

  let item: any = null
  let hasPurchased = false
  let isLoggedIn = false
  let errorMsg = null

  const supabase = await createClient()

  try {
    const { data: itemData, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !itemData) {
      return notFound()
    }
    
    item = itemData

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
          .eq('item_id', id)
          .maybeSingle()

        if (purchase) {
          hasPurchased = true
        }
      }
    }
  } catch (err: any) {
    console.error('Item Detail Fetch Error:', err)
    errorMsg = 'Could not load payment status.'
  }

  // Get directory back link based on resource type
  const getDirectoryBackLink = () => {
    switch (item.resource_type) {
      case 'scholarship': return '/scholarships'
      case 'job': return '/jobs'
      case 'software': return '/software'
      case 'service': return '/services'
      case 'course': return '/courses'
      default: return '/books'
    }
  }

  const getFreeDownloadUrl = () => {
    if (!item) return '#'
    if (item.file_path.startsWith('free/')) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/free-books/${item.file_path.substring(5)}`
    }
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/free-books/${item.file_path}`
  }

  const hasCover = item.cover_url && !item.cover_url.includes('placeholder') && !item.cover_url.includes('covers/')
  
  const getGradientClass = (titleStr: string) => {
    const len = titleStr.length
    if (len % 3 === 0) return 'from-red-900 to-red-950 text-red-100'
    if (len % 3 === 1) return 'from-gray-900 to-gray-950 text-gray-100'
    return 'from-[#7f1d1d] to-[#450a0a] text-red-100'
  }

  const getResourceIcon = () => {
    switch (item.resource_type) {
      case 'scholarship': return <GraduationCap className="w-5 h-5 text-emerald-600" />
      case 'job': return <Briefcase className="w-5 h-5 text-blue-600" />
      case 'software': return <Download className="w-5 h-5 text-violet-600" />
      case 'service': return <Hammer className="w-5 h-5 text-amber-600" />
      case 'course': return <PlayCircle className="w-5 h-5 text-teal-600" />
      default: return <Book className="w-5 h-5 text-[#B8212E]" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow bg-white text-[#222222]">
      
      {/* Back button */}
      <div className="mb-8">
        <Link 
          href={getDirectoryBackLink()}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {item.resource_type.charAt(0).toUpperCase() + item.resource_type.slice(1)}s Directory
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Visual Cover */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative aspect-[3/4] w-full max-w-[320px] rounded-none overflow-hidden border border-gray-250 bg-gray-50 shadow-md">
            <span className={`absolute top-3 left-3 z-10 text-[8px] font-bold px-2 py-0.5 tracking-wider uppercase text-white ${
              item.resource_type === 'scholarship' ? 'bg-emerald-600' :
              item.resource_type === 'job' ? 'bg-blue-600' :
              item.resource_type === 'software' ? 'bg-violet-600' :
              item.resource_type === 'service' ? 'bg-amber-600' :
              item.resource_type === 'course' ? 'bg-teal-600' : 'bg-[#B8212E]'
            }`}>
              {item.resource_type}
            </span>

            {hasCover ? (
              <img
                src={item.cover_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br ${getGradientClass(item.title)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-widest opacity-60 truncate max-w-[150px]">{item.category}</span>
                  {getResourceIcon()}
                </div>
                
                <div className="my-auto py-6">
                  <h3 className="font-extrabold text-xl leading-snug line-clamp-4 text-white tracking-tight">{item.title}</h3>
                  <p className="text-xs mt-2.5 opacity-75 line-clamp-1 italic">by {item.author}</p>
                </div>
                
                <div className="border-t border-white/10 pt-3 flex justify-between items-center text-xs font-mono opacity-50">
                  <span className="uppercase">{item.resource_type}</span>
                  <span>ENGINEER YASIN</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Information details */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <span className="inline-block text-[9px] font-bold text-[#B8212E] uppercase tracking-widest bg-[#B8212E]/5 px-2 py-0.5 rounded border border-[#B8212E]/10">
              {item.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight leading-tight">
              {item.title}
            </h1>
            <p className="text-sm text-gray-500">
              {item.resource_type === 'job' ? 'Company: ' : item.resource_type === 'scholarship' ? 'Organization: ' : 'Provider: '}
              <span className="font-semibold text-gray-700">{item.author}</span>
            </p>
          </div>

          {/* Specifications Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-gray-150 py-4 text-xs font-semibold text-gray-555">
            <div>
              <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Type</span>
              <span className="text-gray-800 font-bold uppercase">{item.resource_type}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Category</span>
              <span className="text-gray-800 font-bold">{item.category}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">
                {item.resource_type === 'scholarship' || item.resource_type === 'job' ? 'Status' : 'Access Fee'}
              </span>
              <span className={`font-bold ${item.type === 'free' ? 'text-emerald-600' : 'text-[#B8212E]'}`}>
                {item.resource_type === 'scholarship' || item.resource_type === 'job' 
                  ? 'Open & Free' 
                  : (item.type === 'free' ? 'Free Access' : 'Premium Paid')
                }
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Resource Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line font-medium">
              {item.description || 'No description available for this resource at this moment. Detailed outline will follow.'}
            </p>
          </div>

          {/* Action boxes */}
          <div className="bg-[#f8fafc] border border-gray-200 rounded-none p-6 space-y-4">
            
            {/* FREE FLOW (Jobs, Scholarships, Internships always follow this) */}
            {item.type === 'free' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-600 font-bold">
                      {item.resource_type === 'scholarship' || item.resource_type === 'job' ? 'Public Resource' : 'Free Resource Access'}
                    </span>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      {item.resource_type === 'scholarship' || item.resource_type === 'job' 
                        ? 'Official application portal.' 
                        : 'No account required. Instant access.'
                      }
                    </p>
                  </div>
                  {item.resource_type !== 'scholarship' && item.resource_type !== 'job' && (
                    <span className="text-base font-bold text-emerald-600">FREE</span>
                  )}
                </div>
                
                {item.resource_type === 'scholarship' || item.resource_type === 'job' ? (
                  <a
                    href={item.file_path}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply on Official Website
                  </a>
                ) : (
                  <a
                    href={getFreeDownloadUrl()}
                    download
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5"
                  >
                    <Download className="w-4 h-4" />
                    Download / Access File
                  </a>
                )}
              </div>
            )}

            {/* PREMIUM FLOW (Software, Courses, Services, Books) */}
            {item.type === 'premium' && (
              <div className="space-y-4">
                
                {/* 1. User not logged in */}
                {!isLoggedIn && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#B8212E] font-bold">Premium Purchase</span>
                        <p className="text-[10px] text-gray-400 font-semibold">Sign in to checkout and permanent library access.</p>
                      </div>
                      <span className="text-xl font-bold text-gray-800">Rs. {item.price.toFixed(0)}</span>
                    </div>

                    <Link
                      href={`/login?redirectTo=/items/${item.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-sm transition-all hover:-translate-y-0.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Sign In to Purchase
                    </Link>
                  </div>
                )}

                {/* 2. User logged in & already purchased */}
                {isLoggedIn && hasPurchased && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                      <div className="flex items-center gap-2 text-emerald-605 font-bold">
                        <UserCheck className="w-4 h-4" />
                        <span className="text-xs">Access unlocked in library</span>
                      </div>
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded">Unlocked</span>
                    </div>

                    <a
                      href={`/api/download?bookId=${item.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5"
                    >
                      {item.resource_type === 'course' ? (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          Access Course Material
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download Resource File
                        </>
                      )}
                    </a>
                  </div>
                )}

                {/* 3. User logged in & not purchased */}
                {isLoggedIn && !hasPurchased && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#B8212E] font-bold">Premium Option</span>
                        <p className="text-[10px] text-gray-400 font-semibold">Make payment to unlock in your accounts list.</p>
                      </div>
                      <span className="text-xl font-bold text-gray-800">Rs. {item.price.toFixed(0)}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <AddToCartButton 
                        item={{
                          id: item.id,
                          title: item.title,
                          author: item.author,
                          price: item.price,
                          cover_url: item.cover_url || '',
                          category: item.category
                        }} 
                        buyNow={true}
                      />

                      <AddToCartButton 
                        item={{
                          id: item.id,
                          title: item.title,
                          author: item.author,
                          price: item.price,
                          cover_url: item.cover_url || '',
                          category: item.category
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

      <ReviewSection itemId={item.id} hasPurchased={hasPurchased} />

    </div>
  )
}
