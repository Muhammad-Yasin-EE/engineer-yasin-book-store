'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Search, Loader2, ArrowLeft, ShieldAlert, CheckCircle2, XCircle, Clock, Receipt } from 'lucide-react'
import OrderStatusBadge from '@/components/OrderStatusBadge'

export default function OrderTrackerPage() {
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanId = orderId.trim()
    if (!cleanId) return

    setLoading(true)
    setError(null)
    setOrder(null)

    const supabase = createClient()

    try {
      // Allow searching by exact full UUID or starting part
      let query = supabase
        .from('orders')
        .select('*, order_items(*, items(*))')

      if (cleanId.length === 36) {
        query = query.eq('id', cleanId)
      } else {
        query = query.ilike('id', `${cleanId}%`)
      }

      const { data, error: fetchErr } = await query

      if (fetchErr) throw fetchErr

      if (!data || data.length === 0) {
        setError('No order found matching this ID. Double check the character string.')
      } else if (data.length > 1) {
        setError('Multiple orders matched this starting ID string. Enter more characters.')
      } else {
        setOrder(data[0])
      }
    } catch (err: any) {
      console.error('Order Track Error:', err)
      setError('Could not retrieve tracking details. Check network connection.')
    } finally {
      setLoading(false)
    }
  }

  // Get status stage step index
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending_payment': return 1
      case 'payment_submitted': return 2
      case 'verified': return 3
      case 'rejected': return 3
      default: return 1
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow bg-white text-[#222222] space-y-8">
      
      {/* Back button */}
      <div>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal Home
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-lg mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
          Track Manual Order Status
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-semibold leading-relaxed">
          Enter your Order ID (available in checkouts or confirmation emails) to check the live status of our verification team.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 639c1b7c..."
            className="w-full bg-[#f8fafc] border border-gray-200 rounded-full py-3 pl-4 pr-12 text-xs text-gray-850 placeholder-gray-450 focus:outline-none focus:bg-white focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 transition-all font-semibold font-mono"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Track Status
        </button>
      </form>

      {/* Error View */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold rounded-none flex gap-2 max-w-md mx-auto animate-scale-in">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Order Details */}
      {order && (
        <div className="bg-[#f8fafc] border border-gray-200 p-6 sm:p-8 space-y-8 animate-scale-in">
          
          {/* Progress Timeline Tracker */}
          <div className="relative flex items-center justify-between max-w-md mx-auto pt-4">
            
            {/* Timeline connectors */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#B8212E] transition-all duration-500 z-0"
              style={{ width: `${((getStepIndex(order.status) - 1) / 2) * 100}%` }}
            />

            {/* Step 1: Placed */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-7 h-7 rounded-full bg-[#B8212E] text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Order Placed</span>
            </div>

            {/* Step 2: Submitted */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                getStepIndex(order.status) >= 2 ? 'bg-[#B8212E] text-white' : 'bg-gray-250 text-gray-400'
              }`}>
                2
              </div>
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Receipt Uploaded</span>
            </div>

            {/* Step 3: Verified / Rejected */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                order.status === 'verified' ? 'bg-emerald-600 text-white' :
                order.status === 'rejected' ? 'bg-rose-600 text-white' : 'bg-gray-250 text-gray-400'
              }`}>
                {order.status === 'verified' ? <CheckCircle2 className="w-4 h-4" /> :
                 order.status === 'rejected' ? <XCircle className="w-4 h-4" /> : '3'}
              </div>
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                {order.status === 'rejected' ? 'Rejected' : 'Verified'}
              </span>
            </div>

          </div>

          {/* Details breakdown */}
          <div className="border-t border-gray-200/80 pt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-3 gap-2">
              <div>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Tracking Reference</span>
                <h3 className="font-mono text-xs font-bold text-gray-800 tracking-wider uppercase">{order.id}</h3>
              </div>
              <div className="flex items-center gap-2">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-505">
              <div>
                <span className="block text-[8px] uppercase text-gray-400 font-bold mb-0.5">Payment Method</span>
                <span className="font-mono text-gray-700 font-bold">{order.payment_method}</span>
              </div>
              <div>
                <span className="block text-[8px] uppercase text-gray-400 font-bold mb-0.5">Reference ID</span>
                <span className="font-mono text-gray-700 tracking-wider font-bold">{order.transaction_ref || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[8px] uppercase text-gray-400 font-bold mb-0.5">Order Value</span>
                <span className="text-[#B8212E] font-bold">Rs. {order.total_price.toFixed(0)}</span>
              </div>
            </div>

            {/* Rejection Alert */}
            {order.status === 'rejected' && (
              <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-none text-xs text-rose-800 space-y-1 font-semibold animate-scale-in">
                <h4 className="font-bold flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  Review Rejection Details
                </h4>
                <p className="text-rose-700 italic font-medium leading-relaxed pt-1 whitespace-pre-line">
                  {order.rejection_reason || 'No detailed reason provided. Contact support.'}
                </p>
              </div>
            )}

            {/* Verified Success Alert */}
            {order.status === 'verified' && (
              <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-none text-xs text-emerald-800 space-y-1 font-semibold animate-scale-in">
                <h4 className="font-bold flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Access Granted!
                </h4>
                <p className="text-emerald-700 font-medium pt-1">
                  Your manual payment was verified. The resources are unlocked and available inside your account dashboard. Log in to download.
                </p>
                <Link href="/account" className="inline-block mt-3 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-[9px] hover:bg-emerald-500 transition-colors uppercase">
                  Library Dashboard
                </Link>
              </div>
            )}

            {/* List items */}
            <div className="space-y-2">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Ordered Items</span>
              <div className="space-y-1.5">
                {order.order_items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white border border-gray-200/80 rounded-none flex justify-between gap-4 font-semibold text-xs text-gray-600">
                    <span className="truncate">{item.items?.title}</span>
                    <span className="shrink-0 text-gray-800">Rs. {item.price.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}
