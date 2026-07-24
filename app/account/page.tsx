import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import { User, Library, FileText, Download, ShieldAlert, Sparkles, BookOpen, Target, Trophy, Clock } from 'lucide-react'
import ProfileEditor from '@/components/ProfileEditor'

export const revalidate = 0

export default async function AccountPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    return redirect('/login')
  }

  const user = session.user
  let profile: any = null
  let purchases: any[] = []
  let orders: any[] = []
  let userScores: any[] = []
  let errorMsg = null

  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = profileData

    const { data: purchaseData } = await supabase
      .from('purchases')
      .select('id, created_at, item_id, items(*)')
      .eq('user_id', user.id)
    purchases = purchaseData || []

    const { data: rawOrderData } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    let orderData = rawOrderData || []
    if (orderData.length > 0) {
      const itemIds = orderData.flatMap(o => o.order_items?.map((oi: any) => oi.item_id) || [])
      if (itemIds.length > 0) {
        const { data: catItems } = await supabase.from('items').select('id, title').in('id', itemIds)
        const { data: quizItems } = await supabase.from('quizzes').select('id, title').in('id', itemIds)
        const titleMap: any = {}
        catItems?.forEach((i: any) => titleMap[i.id] = i.title)
        quizItems?.forEach((i: any) => titleMap[i.id] = i.title)
        orderData = orderData.map(o => ({
          ...o,
          order_items: o.order_items?.map((oi: any) => ({
            ...oi,
            items: { title: titleMap[oi.item_id] || 'Unknown Item' }
          }))
        }))
      }
    }
    orders = orderData

    const { data: scoreData } = await supabase
      .from('user_scores')
      .select('*, quizzes(title)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    userScores = scoreData || []

    // Fetch unlocked quizzes from verified orders
    const verifiedOrders = orders.filter(o => o.status === 'verified' || o.status === 'completed')
    const unlockedQuizIds = verifiedOrders.flatMap(o => o.order_items.map((i: any) => i.item_id))
    
    let unlockedQuizzes: any[] = []
    if (unlockedQuizIds.length > 0) {
      const { data: qData } = await supabase
        .from('quizzes')
        .select('*')
        .in('id', unlockedQuizIds)
      unlockedQuizzes = qData || []
    }
    
    // Inject unlocked quizzes into purchases array so they render in the library
    unlockedQuizzes.forEach(quiz => {
      // Avoid duplicates if already in purchases somehow
      if (!purchases.some(p => p.item_id === quiz.id)) {
        purchases.push({
          id: `quiz-${quiz.id}`,
          item_id: quiz.id,
          created_at: new Date().toISOString(),
          items: {
            id: quiz.id,
            title: quiz.title,
            author: 'Engineer Yasin Prep',
            cover_url: '',
            isQuiz: true // flag to render Take Test instead of Download
          }
        })
      }
    })

  } catch (err: any) {
    console.error('Account Page Fetch Error:', err)
    errorMsg = 'Could not load library details. Database connection error.'
  }

  const getGradientClass = (titleStr: string) => {
    const len = titleStr.length
    if (len % 3 === 0) return 'from-red-900 to-red-950 text-red-100'
    if (len % 3 === 1) return 'from-gray-900 to-gray-950 text-gray-100'
    return 'from-[#7f1d1d] to-[#450a0a] text-red-100'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow bg-white text-gray-800 space-y-12">
      
      {/* Profile Editor Component */}
      <ProfileEditor profile={profile} userEmail={user.email || ''} />

      {/* My Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-150 pb-2">
          <h2 className="text-[10px] font-bold text-emerald-400 bg-gray-900 px-3 py-1.5 rounded-md uppercase tracking-widest flex items-center gap-2 shadow-sm">
            <Target className="w-4 h-4 text-emerald-500" />
            My Quiz Progress
          </h2>
          <Link href="/leaderboard" className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400 bg-gray-900 hover:bg-black px-3 py-1.5 rounded-md shadow-sm transition-colors flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> View Leaderboard
          </Link>
        </div>

        {userScores.length === 0 ? (
          <div className="py-8 bg-gray-50 border border-gray-200 border-dashed rounded-none flex flex-col items-center justify-center text-gray-400 text-center px-4">
            <Target className="w-8 h-8 mb-2 opacity-30 text-gray-500" />
            <h4 className="text-xs font-bold text-gray-650">No Tests Taken Yet</h4>
            <p className="text-[10px] mt-1">Start practicing mock tests to see your progress here.</p>
            <Link href="/prep" className="mt-3 text-[10px] font-bold text-[#B8212E] hover:underline">Go to Prep Hub &rarr;</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userScores.map((score) => (
              <div key={score.id} className="p-4 border border-gray-200 bg-white hover:border-[#B8212E]/30 transition-colors">
                <h4 className="text-xs font-bold text-gray-800 truncate mb-2" title={score.quizzes?.title}>
                  {score.quizzes?.title || 'Unknown Quiz'}
                </h4>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span className={score.percentage >= 50 ? 'text-emerald-600' : 'text-rose-600'}>
                      {score.percentage}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                    <Clock className="w-3 h-3" />
                    {score.time_taken_seconds ? `${Math.floor(score.time_taken_seconds / 60)}m ${score.time_taken_seconds % 60}s` : 'N/A'}
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-1.5 mt-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${score.percentage >= 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                    style={{ width: `${score.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Saved Materials & My Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: My Library (Purchased Items) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2 border-b border-gray-150 pb-2">
            <Library className="w-4 h-4 text-[#B8212E]" />
            Saved Materials ({purchases.length})
          </h2>

          {purchases.length === 0 ? (
            <div className="py-16 bg-gray-50 border border-gray-200 border-dashed rounded-none flex flex-col items-center justify-center text-gray-400 text-center px-4">
              <BookOpen className="w-10 h-10 mb-3 opacity-30 text-gray-500" />
              <h4 className="text-sm font-bold text-gray-700">Library Empty</h4>
              <p className="text-xs text-gray-400 max-w-xs mt-1">
                You haven't acquired any premium resources yet. Once your manual payments are verified, purchased courses, software, services, or books will appear here permanently.
              </p>
              <Link 
                href="/" 
                className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold bg-[#B8212E] hover:bg-[#D62636] text-white"
              >
                Browse Portal Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {purchases.map((pur) => {
                const item = pur.items
                if (!item) return null
                const hasCover = item.cover_url && !item.cover_url.includes('placeholder') && !item.cover_url.includes('covers/')
                
                return (
                  <div 
                    key={pur.id}
                    className="p-4 bg-white border border-gray-200 rounded-none flex gap-3.5 hover:border-[#B8212E]/30 transition-colors"
                  >
                    {/* Tiny Cover Visual (Sharp corners) */}
                    <div className="relative aspect-[3/4] w-14 shrink-0 rounded-none overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center text-center">
                      {hasCover ? (
                        <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex flex-col justify-center p-1 bg-gradient-to-br ${getGradientClass(item.title)}`}>
                          <h4 className="font-extrabold text-[6px] leading-tight line-clamp-3 text-white">{item.title}</h4>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Download Trigger */}
                    <div className="flex flex-col justify-between truncate w-full">
                      <div className="truncate">
                        <h4 className="font-bold text-gray-800 text-xs sm:text-sm hover:text-[#B8212E] truncate">
                          <Link href={`/items/${item.id}`}>{item.title}</Link>
                        </h4>
                        <p className="text-[10px] text-gray-400 truncate">by {item.author}</p>
                      </div>
                      
                      {item.isQuiz ? (
                        <Link
                          href={`/prep/category/${item.id}`} // We should link to the exam prep page, but for now we'll just link to the quiz page if we had one. Actually, quizzes don't have standalone pages yet, but we can direct them to /prep
                          className="mt-2 inline-flex items-center justify-center gap-1 py-1.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] w-fit shadow-sm"
                        >
                          <Sparkles className="w-3 h-3" />
                          Take Premium Test
                        </Link>
                      ) : (
                        <a
                          href={`/api/download?itemId=${item.id}`}
                          className="mt-2 inline-flex items-center justify-center gap-1 py-1.5 px-4 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-[9px] w-fit shadow-sm"
                        >
                          <Download className="w-3 h-3" />
                          Download / Access
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-150 pb-2">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#B8212E]" />
              My Orders ({orders.length})
            </h2>
            {orders.some(o => o.status === 'pending_payment' || o.status === 'payment_submitted') && (
              <Link href="/track" className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500 hover:text-[#B8212E] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-sm transition-colors">
                Track Pending Order
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="py-12 bg-gray-50 border border-gray-200 border-dashed rounded-none flex flex-col items-center justify-center text-gray-400 text-center px-4">
              <FileText className="w-8 h-8 mb-2 opacity-30 text-gray-500" />
              <h4 className="text-xs font-bold text-gray-650">No Orders Placed</h4>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="p-5 rounded-none bg-white border border-gray-200 hover:border-gray-300 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                    <span className="font-mono">ID: {order.id.substring(0, 8)}...</span>
                    <span>
                      {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] text-gray-400 font-bold uppercase">Payment Ref</span>
                      <span className="font-mono text-xs text-gray-700 font-bold tracking-wider">
                        {order.transaction_ref || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-400 font-bold uppercase text-right">Total Price</span>
                      <span className="text-xs text-[#B8212E] font-bold block text-right">
                        Rs. {order.total_price.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* List of items purchased */}
                  <div className="bg-gray-50 p-2.5 rounded-none border border-gray-200 text-[10px] text-gray-500 space-y-1 font-semibold">
                    {order.order_items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between gap-2 truncate">
                        <span className="truncate text-gray-700">{item.items?.title || 'Resource'}</span>
                        <span className="shrink-0 text-gray-400">Rs. {item.price.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">{order.payment_method}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
