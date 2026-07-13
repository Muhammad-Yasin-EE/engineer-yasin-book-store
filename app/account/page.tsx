import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import { User, Library, FileText, Download, ShieldAlert, Sparkles, BookOpen } from 'lucide-react'

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

    const { data: orderData } = await supabase
      .from('orders')
      .select('*, order_items(*, items(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    orders = orderData || []

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow bg-white text-[#222222] space-y-12">
      
      {/* Profile Overview Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-150 pb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#B8212E] rounded-full flex items-center justify-center shadow-sm">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
              {profile?.name || user.email?.split('@')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-semibold">
              Registered email: <span className="text-gray-600">{user.email}</span>
            </p>
          </div>
        </div>
        
        {profile?.is_admin && (
          <Link 
            href="/admin"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold rounded-full hover:bg-amber-100 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            Admin Dashboard Access
          </Link>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-none flex gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid: My Library & My Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: My Library (Purchased Items) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2 border-b border-gray-150 pb-2">
            <Library className="w-4 h-4 text-[#B8212E]" />
            My Library ({purchases.length})
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
                      
                      <a
                        href={`/api/download?itemId=${item.id}`}
                        className="mt-2 inline-flex items-center justify-center gap-1 py-1.5 px-4 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-[9px] w-fit shadow-sm"
                      >
                        <Download className="w-3 h-3" />
                        Download / Access
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2 border-b border-gray-150 pb-2">
            <FileText className="w-4 h-4 text-[#B8212E]" />
            My Orders ({orders.length})
          </h2>

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
