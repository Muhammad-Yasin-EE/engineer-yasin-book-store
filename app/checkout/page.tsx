'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/context/CartContext'
import { createClient } from '@/lib/supabase/client'
import { Clipboard, Check, ShieldAlert, Upload, CreditCard, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react'

const MOBILE_WALLETS = [
  { brand: 'JazzCash', name: 'Muhammad Yasin', number: '0309-8158572', emoji: '📱', color: 'border-red-200 text-red-600 bg-red-50/50' },
  { brand: 'EasyPaisa', name: 'Muhammad Yasin', number: '0331-9731598', emoji: '🟢', color: 'border-emerald-200 text-emerald-600 bg-emerald-50/50' },
  { brand: 'NayaPay', name: 'Muhammad Yasin', number: '0309-8158572', emoji: '🔵', color: 'border-blue-200 text-blue-600 bg-blue-50/50' },
  { brand: 'SadaPay', name: 'Muhammad Yasin', number: '0309-8158572', emoji: '🟠', color: 'border-orange-200 text-orange-600 bg-orange-50/50' }
]

const BANK_TRANSFERS = [
  { brand: 'Allied Bank Limited (ABL)', name: 'Muhammad Yasin', number: '57690010139951020017', emoji: '🏦', color: 'border-indigo-200 text-indigo-600 bg-indigo-50/50' }
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const supabase = createClient()

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

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num.replace(/-/g, ''))
    setCopiedNumber(num)
    setTimeout(() => setCopiedNumber(null), 2000)
  }

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
      const fileExt = screenshotFile.name.split('.').pop()
      const cleanFileName = `${Date.now()}.${fileExt}`
      const storagePath = `${user.id}/${cleanFileName}`

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(storagePath, screenshotFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Failed to upload screenshot: ${uploadError.message}`)
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_price: subtotal,
          status: 'payment_submitted',
          payment_method: selectedWallet,
          transaction_ref: transactionRef.trim(),
          proof_image_url: storagePath
        })
        .select('id')
        .single()

      if (orderError || !orderData) {
        throw new Error(`Order insertion failed: ${orderError?.message}`)
      }

      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        item_id: item.id,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        throw new Error(`Failed to record order items: ${itemsError.message}`)
      }

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

  if (orderConfirmed) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-white text-[#222222]">
        <div className="max-w-md w-full space-y-8 bg-[#f8fafc] p-8 rounded-none border border-gray-200 text-center relative z-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">Payment Submitted!</h2>
          
          <div className="space-y-4 text-sm text-gray-600 text-left bg-white p-5 rounded-none border border-gray-200 font-medium">
            <p className="text-gray-600 leading-relaxed">
              Your order is under review. You'll receive an email once verified, usually within <span className="text-[#B8212E] font-bold">1 to 12 hours</span>.
            </p>
            <div className="border-t border-gray-150 pt-3 text-xs font-mono space-y-1">
              <div>Order ID: <span className="text-gray-800 font-semibold">{confirmedOrderId}</span></div>
              <div>Verification status: <span className="text-amber-600 font-semibold">Payment Submitted</span></div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link 
              href="/account"
              className="w-full inline-flex items-center justify-center py-3 px-4 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-sm shadow-sm"
            >
              Go to My Orders
            </Link>
            <Link 
              href="/"
              className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Return to Bookstore Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow bg-white text-[#222222]">
      
      {/* Title */}
      <div className="border-b border-gray-150 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-[#B8212E]" />
          Manual Payment Checkout
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Follow instructions below to complete your transfer and submit verification.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="py-12 bg-gray-50 border border-gray-200 rounded-none flex flex-col items-center justify-center text-gray-400 text-sm">
          No items found in your checkout cart.
          <Link href="/books" className="text-[#B8212E] underline font-semibold mt-2">Browse catalog &rarr;</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Account Details Grid */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Wallets Group */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-gray-450 font-bold border-b border-gray-150 pb-2">
                MOBILE WALLETS
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOBILE_WALLETS.map((wallet) => (
                  <div 
                    key={wallet.brand}
                    className="p-5 rounded-none border border-gray-200 bg-white hover:border-gray-300 transition-colors relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span>{wallet.emoji}</span>
                        {wallet.brand}
                      </span>
                      <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Mobile Wallet</span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-4">
                      Account Name: <span className="text-gray-700 font-semibold">{wallet.name}</span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-none border border-gray-200">
                      <span className="font-mono text-xs text-gray-800 tracking-wider font-bold">
                        {wallet.number}
                      </span>
                      <button
                        onClick={() => handleCopy(wallet.number)}
                        className="p-1.5 rounded-full text-gray-400 hover:text-[#B8212E] hover:bg-[#B8212E]/5 transition-colors cursor-pointer"
                        title="Copy Account Number"
                      >
                        {copiedNumber === wallet.number ? (
                          <Check className="w-4 h-4 text-emerald-600 animate-scale-in" />
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
              <h2 className="text-xs uppercase tracking-widest text-gray-450 font-bold border-b border-gray-150 pb-2">
                BANK TRANSFER
              </h2>
              
              {BANK_TRANSFERS.map((bank) => (
                <div 
                  key={bank.brand}
                  className="p-5 rounded-none border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span>{bank.emoji}</span>
                      {bank.brand}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Bank Account</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="text-xs text-gray-500">
                      Account Name: <span className="text-gray-700 font-semibold">{bank.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-none border border-gray-200">
                      <span className="font-mono text-xs text-gray-800 tracking-wider font-bold">
                        {bank.number}
                      </span>
                      <button
                        onClick={() => handleCopy(bank.number)}
                        className="p-1.5 rounded-full text-gray-400 hover:text-[#B8212E] hover:bg-[#B8212E]/5 transition-colors cursor-pointer"
                        title="Copy Account Number"
                      >
                        {copiedNumber === bank.number ? (
                          <Check className="w-4 h-4 text-emerald-600 animate-scale-in" />
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
            <div className="p-5 rounded-none bg-[#B8212E]/5 border border-[#B8212E]/10 text-gray-600 text-xs leading-relaxed space-y-2 font-semibold">
              <span className="font-bold text-gray-850 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#B8212E]" />
                Transfer Instructions
              </span>
              <p>
                Transfer the exact amount to one of the accounts above, then submit your transaction ID and a screenshot of the payment below.
              </p>
            </div>

          </div>

          {/* Right Column: Submission Form */}
          <div className="lg:col-span-5 bg-[#f8fafc] border border-gray-200 rounded-none p-6 space-y-6">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest border-b border-gray-200 pb-2">Confirm Verification</h3>
            
            {/* Summary */}
            <div className="text-xs sm:text-sm text-gray-600 font-medium pb-4 border-b border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span>Items in Cart</span>
                <span className="text-gray-800 font-bold">{cart.length}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-gray-800">Amount Payable</span>
                <span className="text-[#B8212E] font-black">Rs. {subtotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 text-rose-600 text-xs rounded-none flex gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submission Form (Inputs and Dropdown styled in pill-shapes) */}
            <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs font-bold text-gray-500">
              
              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Method Used</label>
                <select
                  required
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-full py-3 px-4 text-gray-700 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 font-semibold"
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
                <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Transaction ID / Reference Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12053185938"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-full py-3 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 font-mono text-sm tracking-wider font-bold"
                />
              </div>

              {/* Upload Screenshot File */}
              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Upload Receipt Screenshot</label>
                <div className="relative border border-dashed border-gray-200 rounded-none p-6 bg-white hover:bg-gray-50/50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
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
                  <Upload className="w-5 h-5 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-600 font-bold truncate max-w-[200px]">
                    {screenshotFile ? screenshotFile.name : 'Select JPG/PNG receipt image'}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 font-normal">Max size: 5MB</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-sm shadow-sm hover:shadow hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
