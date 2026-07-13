import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FileText, ArrowLeft, Calendar, User, Clock } from 'lucide-react'

export const revalidate = 0

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  try {
    const { data: post } = await supabase
      .from('blog_posts')
      .select('title, summary')
      .eq('slug', slug)
      .single()

    if (!post) return {}

    return {
      title: `${post.title} | Engineer Yasin Blog`,
      description: post.summary ? post.summary.substring(0, 160) : `Read ${post.title} on Engineer Yasin.`,
    }
  } catch {
    return {}
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  let post: any = null

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return notFound()
    }
    post = data
  } catch (err) {
    console.error('Fetch Blog Post Error:', err)
    return notFound()
  }

  const hasCover = post.cover_url && !post.cover_url.includes('placeholder')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow bg-white text-[#222222] space-y-8">
      
      {/* Back button */}
      <div>
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog directory
        </Link>
      </div>

      <div className="space-y-6">
        
        {/* Header Metadata */}
        <div className="border-b border-gray-150 pb-6 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8212E]/5 border border-[#B8212E]/10 text-[#B8212E] text-xs font-semibold">
            <FileText className="w-4 h-4" />
            Academic Guidelines
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-semibold pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-[#B8212E]" />
              Published: {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4 text-[#B8212E]" />
              Written by Admin
            </span>
          </div>
        </div>

        {/* Cover Photo */}
        {hasCover && (
          <div className="aspect-[16/8] w-full overflow-hidden bg-gray-50 border border-gray-200 shadow-sm rounded-none">
            <img 
              src={post.cover_url} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Summary Block */}
        <p className="text-base text-gray-600 font-bold border-l-4 border-[#B8212E] pl-4 italic leading-relaxed py-1">
          {post.summary}
        </p>

        {/* Article Body Content */}
        <article className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium pt-2">
          {post.content}
        </article>

      </div>

    </div>
  )
}
