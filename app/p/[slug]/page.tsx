import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { FileText, ArrowLeft, Calendar } from 'lucide-react'

export const revalidate = 60

interface CustomPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CustomPageProps) {
  const { slug } = await params
  const supabase = createAdminClient()

  try {
    const { data: page } = await supabase
      .from('custom_pages')
      .select('title, content')
      .eq('slug', slug)
      .single()

    if (!page) return {}

    return {
      title: `${page.title} | Engineer Yasin Portal`,
      description: page.content ? page.content.substring(0, 160) : `View ${page.title} details on Engineer Yasin Portal.`,
    }
  } catch {
    return {}
  }
}

export default async function CustomPage({ params }: CustomPageProps) {
  const { slug } = await params
  const supabase = createAdminClient()

  let pageData: any = null

  try {
    const { data, error } = await supabase
      .from('custom_pages')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return notFound()
    }
    pageData = data
  } catch (err) {
    console.error('Fetch Custom Page Error:', err)
    return notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow bg-white text-[#222222]">
      
      {/* Back button */}
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal Home
        </Link>
      </div>

      <div className="space-y-6">
        
        {/* Header info */}
        <div className="border-b border-gray-150 pb-6 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8212E]/5 border border-[#B8212E]/10 text-[#B8212E] text-xs font-semibold">
            <FileText className="w-4 h-4" />
            Informational Bulletin
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight leading-tight">
            {pageData.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated: {new Date(pageData.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Content detail */}
        <article className="prose max-w-none text-gray-650 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium pt-2">
          {pageData.content}
        </article>

      </div>

    </div>
  )
}
