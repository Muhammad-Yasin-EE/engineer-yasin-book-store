import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import { User, Library, FileText, Download, ShieldAlert, Sparkles, BookOpen } from 'lucide-react'

export const revalidate = 0 // Dynamic page

export default async function AccountPage() {
  const supabase = await createClient()

  // 1. Authenticate user
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
    // 2. Fetch profile metadata
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = profileData

    // 3. Fetch purchased books (Permanent library)
    const { data: purchaseData } = await supabase
      .from('purchases')
      .select('id, created_at, book_id, books(*)')
      .eq('user_id', user.id)
    purchases = purchaseData || []

    // 4. Fetch orders history
    const { data: orderData } = await supabase
      .from('orders')
      .select('*, order_items(*, books(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    orders = orderData || []

  } catch (err: any) {
    console.error('Account Page Fetch Error:', err)
    errorMsg = 'Could not load library details. Database connection error.'
  }

  // Cover placeholder details helper
  const getGradientClass = (titleStr: string) => {
    const len = titleStr.length
    if (len % 3 === 0) return 'from-violet-900 to-indigo-950 text-indigo-200'
    if (len % 3 === 1) return 'from-fuchsia-950 to-purple-950 text-purple-200'
    return 'from-blue-950 to-slate-900 text-sky-200'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow bg-slate-950 space-y-12">
      
      {/* Profile Overview Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-900 pb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {profile?.name || user.email?.split('@')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Registered email: <span className="text-slate-300">{user.email}</span>
            </p>
          </div>
        </div>
        
        {profile?.is_admin && (
          <Link 
            href="/admin"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            Admin Dashboard Access
          </Link>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid: My Library & My Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: My Library (Purchased Books) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-widest flex items-center gap-2 border-b border-slate-900 pb-2">
            <Library className="w-4 h-4 text-indigo-400" />
            My Library ({purchases.length})
          </h2>

          {purchases.length === 0 ? (
            <div className="py-16 bg-[#0c1324]/20 border border-slate-900 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-500 text-center px-4">
              <BookOpen className="w-10 h-10 mb-3 opacity-30" />
              <h4 className="text-sm font-bold text-slate-400">Library Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                You haven't acquired any premium resources yet. Once your manual payments are verified, purchased books will appear here permanently.
              </p>
              <Link 
                href="/books" 
                className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-indigo-400 hover:text-indigo-300"
              >
                Explore Books Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {purchases.map((pur) => {
                const book = pur.books
                if (!book) return null
                const hasCover = book.cover_url && !book.cover_url.includes('placeholder') && !book.cover_url.includes('covers/')
                
                return (
                  <div 
                    key={pur.id}
                    className="p-4 bg-[#0c1324]/30 border border-slate-800/80 rounded-2xl flex gap-3.5 hover:border-indigo-500/30 transition-colors"
                  >
                    {/* Tiny Cover Visual */}
                    <div className="relative aspect-[3/4] w-14 shrink-0 rounded-lg overflow-hidden border border-slate-850 bg-slate-950 flex items-center justify-center text-center">
                      {hasCover ? (
                        <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex flex-col justify-center p-1 bg-gradient-to-br ${getGradientClass(book.title)}`}>
                          <h4 className="font-extrabold text-[6px] leading-tight line-clamp-3 text-white">{book.title}</h4>
                        </div>
                      )}
                    </div>

                    {/* Book Metadata & Download Trigger */}
                    <div className="flex flex-col justify-between truncate w-full">
                      <div className="truncate">
                        <h4 className="font-bold text-slate-200 text-xs sm:text-sm hover:text-white truncate">
                          <Link href={`/books/${book.id}`}>{book.title}</Link>
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">by {book.author}</p>
                      </div>
                      
                      {/* Secure API trigger download */}
                      <a
                        href={`/api/download?bookId=${book.id}`}
                        className="mt-2 inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] w-fit shadow-md transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        Download
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
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-widest flex items-center gap-2 border-b border-slate-900 pb-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            My Orders ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <div className="py-12 bg-[#0c1324]/20 border border-slate-900 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-500 text-center px-4">
              <FileText className="w-8 h-8 mb-2 opacity-30" />
              <h4 className="text-xs font-bold text-slate-450">No Orders Placed</h4>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="p-5 rounded-2xl bg-[#0c1324]/30 border border-slate-850 hover:border-slate-800 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500">ID: {order.id.substring(0, 8)}...</span>
                    <span className="text-slate-400 font-medium">
                      {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="border-t border-slate-900/50 pt-2 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">Payment Ref</span>
                      <span className="font-mono text-xs text-slate-300 font-semibold tracking-wider">
                        {order.transaction_ref || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase text-right">Total Price</span>
                      <span className="text-xs text-slate-200 font-bold block text-right">
                        ${order.total_price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* List of items purchased */}
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900 text-[10px] text-slate-400 space-y-1">
                    {order.order_items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between gap-2 truncate">
                        <span className="truncate text-slate-300">{item.books?.title || 'Ebook'}</span>
                        <span className="shrink-0 text-slate-500">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{order.payment_method}</span>
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
