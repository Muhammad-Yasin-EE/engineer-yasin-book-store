import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { FileText, ArrowRight, Calendar, User, Sparkles } from 'lucide-react'

export const revalidate = 60

export default async function BlogDirectoryPage() {
  let posts: any[] = []
  let errorMsg = null

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    posts = data || []
  } catch (err: any) {
    console.error('Fetch Blog Posts Error:', err)
    errorMsg = 'Could not load blog posts. Database connection error.'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow bg-white text-[#222222] space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-150 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B8212E]/5 border border-[#B8212E]/10 text-[#B8212E] text-[10px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Academic & Careers Blog
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
          Latest Guidelines & Updates
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Read expert tips, exam guides, application instructions, and career advice.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-none">
          {errorMsg}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="py-20 bg-gray-50 border border-gray-200 border-dashed rounded-none flex flex-col items-center justify-center text-gray-400 text-center p-6">
          <FileText className="w-12 h-12 mb-3 opacity-30 text-gray-500" />
          <h3 className="text-base font-bold text-gray-700">No Blog Posts Yet</h3>
          <p className="text-xs text-gray-400 mt-0.5 max-w-xs">We haven't published any guidelines yet. Career updates will follow soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const hasCover = post.cover_url && !post.cover_url.includes('placeholder')
            
            return (
              <div 
                key={post.id} 
                className="group bg-white border border-gray-200 rounded-none overflow-hidden hover:border-[#B8212E]/40 hover:shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all flex flex-col h-full"
              >
                {/* Cover visual */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 border-b border-gray-100">
                  {hasCover ? (
                    <img 
                      src={post.cover_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#7f1d1d] to-[#450a0a] flex items-center justify-center p-6 text-center">
                      <FileText className="w-8 h-8 text-red-200 opacity-40" />
                    </div>
                  )}
                </div>

                {/* Metadata details */}
                <div className="p-5 flex flex-col flex-grow space-y-3">
                  <div className="flex items-center gap-3 text-[10px] text-gray-405 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#B8212E]" />
                      {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#B8212E]" />
                      By Admin
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 text-base group-hover:text-[#B8212E] transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-3 font-semibold leading-relaxed">
                    {post.summary}
                  </p>

                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#B8212E] hover:text-[#D62636] transition-colors w-fit"
                  >
                    Read Full Article
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
