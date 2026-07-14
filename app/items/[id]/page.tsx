import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Book, GraduationCap, Briefcase, Download, Hammer, PlayCircle, ArrowLeft, UserCheck, ShoppingBag, ExternalLink, Eye, DownloadCloud } from 'lucide-react'
import AddToCartButton from './AddToCartButton'
import ReviewSection from './ReviewSection'
import ItemCover from './ItemCover'
import DownloadActionBox from './DownloadActionBox'

export const revalidate = 60

interface ItemDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ItemDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  try {
    const { data: item } = await supabase
      .from('items')
      .select('title, description')
      .eq('id', id)
      .single()

    if (!item) return {}

    return {
      title: `${item.title} | Engineer Yasin Portal`,
      description: item.description ? item.description.substring(0, 160) : `Check out ${item.title} details on Engineer Yasin Portal.`,
    }
  } catch {
    return {}
  }
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params

  let item: any = null
  let hasPurchased = false
  let isLoggedIn = false
  let errorMsg = null

  const supabase = await createClient()

  // 1. Dynamic Server-side Page View Stats Increment
  try {
    const adminSupabase = createAdminClient()
    const { data: currentStats } = await adminSupabase
      .from('items')
      .select('views')
      .eq('id', id)
      .single()
    if (currentStats) {
      await adminSupabase
        .from('items')
        .update({ views: (currentStats.views || 0) + 1 })
        .eq('id', id)
    }
  } catch (err) {
    console.error('Stats view increment failure:', err)
  }

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
    if (item.file_path.startsWith('http://') || item.file_path.startsWith('https://')) {
      return item.file_path
    }
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

            <ItemCover
              coverUrl={item.cover_url}
              title={item.title}
              category={item.category}
              resourceType={item.resource_type}
              author={item.author}
            />
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

            {/* View & Download stats counters */}
            <div className="flex items-center gap-4 pt-1.5 text-xs text-gray-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-500 shrink-0" />
                {item.views || 0} Views
              </span>
              {(item.resource_type !== 'job' && item.resource_type !== 'scholarship') && (
                <span className="flex items-center gap-1.5">
                  <DownloadCloud className="w-4 h-4 text-emerald-500 shrink-0" />
                  {item.downloads || 0} Downloads
                </span>
              )}
            </div>
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

          {/* Action box wrapper */}
          <DownloadActionBox
            item={item}
            isLoggedIn={isLoggedIn}
            hasPurchased={hasPurchased}
            freeDownloadUrl={getFreeDownloadUrl()}
          />

        </div>

      </div>

      <ReviewSection itemId={item.id} hasPurchased={hasPurchased} />

    </div>
  )
}
