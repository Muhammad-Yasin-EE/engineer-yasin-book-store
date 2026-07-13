'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/context/CartContext'
import { createClient } from '@/lib/supabase/client'
import { Clipboard, Check, ShieldAlert, Upload, CreditCard, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react'

// Wallets configurations
const MOBILE_WALLETS = [
  { brand: 'JazzCash', name: 'Muhammad Yasin', number: '0309-8158572', emoji: '📱', color: 'border-red-500/20 text-red-400 bg-red-500/5' },
  { brand: 'EasyPaisa', name: 'Muhammad Yasin', number: '0331-9731598', emoji: '🟢', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' },
  { brand: 'NayaPay', name: 'Muhammad Yasin', number: '0309-8158572', emoji: '🔵', color: 'border-blue-500/20 text-blue-400 bg-blue-500/5' },
  { brand: 'SadaPay', name: 'Muhammad Yasin', number: '0309-8158572', emoji: '🟠', color: 'border-orange-500/20 text-orange-400 bg-orange-500/5' }
]

const BANK_TRANSFERS = [
  { brand: 'Allied Bank Limited (ABL)', name: 'Muhammad Yasin', number: '57690010139951020017', emoji: '🏦', color: 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5' }
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const supabase = createClient()

  // States
  const [user, setUser] = useState<any>(null)
  const [selectedWallet, setSelectedWallet] = useState('')
  const [transactionRef, setTransactionRef] = useState('')
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [confirmedOrderId, setConfirmedOrderId] = useState('')

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0)

  useEffect(() => {
    // Authenticate and protect checkout route
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push(`/login?redirectTo=/checkout`)
      } else {
        setUser(session.user)
      }
    }
    checkSession()
  }, [])

  // Clipboard copy helper
  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num.replace(/-/g, ''))
    setCopiedNumber(num)
    setTimeout(() => setCopiedNumber(null), 2000)
  }

  // Handle Form Submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) {
      setErrorMsg('Your cart is empty.')
      return
    }
    if (!selectedWallet) {
      setErrorMsg('Please select the payment method you used.')
      return
    }
    if (!transactionRef.trim()) {
      setErrorMsg('Please provide your transaction reference ID.')
      return
    }
    if (!screenshotFile) {
      setErrorMsg('Please upload a proof of payment screenshot.')
      return
    }

    setLoading(true)
    setErrorMsg(null)

    try {
      // 1. Upload proof-of-payment screenshot to storage bucket 'payment-proofs'
      // Path format: user_id/timestamp_filename
      const fileExt = screenshotFile.name.split('.').pop()
      const cleanFileName = `${Date.now()}.${fileExt}`
      const storagePath = `${user.id}/${cleanFileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(storagePath, screenshotFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Failed to upload screenshot: ${uploadError.message}`)
      }

      // Get public URL path
      const proofImageUrl = storagePath

      // 2. Create Order in orders table (status: payment_submitted)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_price: subtotal,
          status: 'payment_submitted',
          payment_method: selectedWallet,
          transaction_ref: transactionRef.trim(),
          proof_image_url: proofImageUrl
        })
        .select('id')
        .single()

      if (orderError || !orderData) {
        throw new Error(`Order insertion failed: ${orderError?.message}`)
      }

      // 3. Create items in order_items table
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        book_id: item.id,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        throw new Error(`Failed to record order items: ${itemsError.message}`)
      }

      // 4. Success state trigger
      setConfirmedOrderId(orderData.id)
      setOrderConfirmed(true)
      clearCart()
    } catch (err: any) {
      console.error('Checkout Error:', err)
      setErrorMsg(err.message || 'Payment submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Confirmation Success Screen
  if (orderConfirmed) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-md w-full space-y-8 bg-[#0d1324]/50 p-8 rounded-3xl border border-slate-800/80 backdrop-blur-md text-center relative z-10">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-100">Payment Submitted!</h2>
          
          <div className="space-y-4 text-sm text-slate-400 text-left bg-slate-950/50 p-5 rounded-2xl border border-slate-900 font-medium">
            <p className="text-slate-300">
              Your order is under review. You'll receive an email once verified, usually within <span className="text-indigo-400 font-bold">1 to 12 hours</span>.
            </p>
            <div className="border-t border-slate-900 pt-3 text-xs font-mono space-y-1">
              <div>Order ID: <span className="text-slate-200">{confirmedOrderId}</span></div>
              <div>Verification status: <span className="text-amber-400">Payment Submitted</span></div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link 
              href="/account"
              className="w-full inline-flex items-center justify-center py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20"
            >
              Go to My Orders
            </Link>
            <Link 
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
            >
              Return to Bookstore Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow bg-slate-950">
      
      {/* Title */}
      <div className="border-b border-slate-900 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-indigo-400" />
          Manual Payment Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Follow instructions below to complete your transfer and submit verification.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="py-12 bg-[#0c1324]/20 border border-slate-900 rounded-3xl flex flex-col items-center justify-center text-slate-500 text-sm">
          No items found in your checkout cart.
          <Link href="/books" className="text-indigo-400 underline font-semibold mt-2">Browse catalog &rarr;</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Account Details Grid */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Wallets Group */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-slate-500 font-bold border-b border-slate-900 pb-2">
                MOBILE WALLETS
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOBILE_WALLETS.map((wallet) => (
                  <div 
                    key={wallet.brand}
                    className="p-5 rounded-2xl border border-slate-900 bg-[#0c1324]/30 hover:border-slate-800 transition-colors relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span>{wallet.emoji}</span>
                        {wallet.brand}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">Mobile Wallet</span>
                    </div>
                    
                    <div className="text-xs text-slate-400 mb-4">
                      Account Name: <span className="text-slate-200 font-semibold">{wallet.name}</span>
                    </div>

                    <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                      <span className="font-mono text-xs text-slate-200 tracking-wider font-semibold">
                        {wallet.number}
                      </span>
                      <button
                        onClick={() => handleCopy(wallet.number)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-colors cursor-pointer"
                        title="Copy Account Number"
                      >
                        {copiedNumber === wallet.number ? (
                          <Check className="w-4 h-4 text-emerald-400 animate-scale-in" />
                        ) : (
                          <Clipboard className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Transfer Group */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-slate-500 font-bold border-b border-slate-900 pb-2">
                BANK TRANSFER
              </h2>
              
              {BANK_TRANSFERS.map((bank) => (
                <div 
                  key={bank.brand}
                  className="p-5 rounded-2xl border border-slate-900 bg-[#0c1324]/30 hover:border-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>{bank.emoji}</span>
                      {bank.brand}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Bank Account</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="text-xs text-slate-400">
                      Account Name: <span className="text-slate-200 font-semibold">{bank.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                      <span className="font-mono text-xs text-slate-200 tracking-wider font-semibold">
                        {bank.number}
                      </span>
                      <button
                        onClick={() => handleCopy(bank.number)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-colors cursor-pointer"
                        title="Copy Account Number"
                      >
                        {copiedNumber === bank.number ? (
                          <Check className="w-4 h-4 text-emerald-400 animate-scale-in" />
                        ) : (
                          <Clipboard className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-slate-300 text-xs leading-relaxed space-y-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Transfer Instructions
              </span>
              <p>
                Transfer the exact amount to one of the accounts above, then submit your transaction ID and a screenshot of the payment below.
              </p>
            </div>

          </div>

          {/* Right Column: Submission Form */}
          <div className="lg:col-span-5 bg-[#0d1324]/60 border border-slate-900 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Confirm Verification</h3>
            
            {/* Summary */}
            <div className="text-xs sm:text-sm text-slate-400 font-medium pb-4 border-b border-slate-900 space-y-2">
              <div className="flex justify-between">
                <span>Items in Cart</span>
                <span className="text-slate-200">{cart.length}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-200">Amount Payable</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submission Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs font-semibold text-slate-400">
              
              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-slate-500">Method Used</label>
                <select
                  required
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                >
                  <option value="" disabled>-- Select Payment Method --</option>
                  <option value="JazzCash">JazzCash (0309-8158572)</option>
                  <option value="EasyPaisa">EasyPaisa (0331-9731598)</option>
                  <option value="NayaPay">NayaPay (0309-8158572)</option>
                  <option value="SadaPay">SadaPay (0309-8158572)</option>
                  <option value="ABL Bank">ABL Bank (57690010139951020017)</option>
                </select>
              </div>

              {/* Transaction ID */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-slate-500">Transaction ID / Reference Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12053185938"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-sm tracking-wider"
                />
              </div>

              {/* Upload Screenshot File */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-slate-500">Upload Receipt Screenshot</label>
                <div className="relative border border-dashed border-slate-800 rounded-xl p-6 bg-slate-950/60 hover:bg-slate-950 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setScreenshotFile(e.target.files[0])
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-slate-500 mb-2" />
                  <span className="text-xs text-slate-400 font-semibold truncate max-w-[200px]">
                    {screenshotFile ? screenshotFile.name : 'Select JPG/PNG image'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Max size: 5MB</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Submitting Receipt...' : 'Submit Verification Claim'}
                <ChevronRight className="w-4 h-4" />
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}
