'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/context/CartContext'
import { ShoppingCart, Trash2, ArrowRight, BookOpen, AlertCircle } from 'lucide-react'

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart()

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0)

  // Generate gradient cover placeholder
  const getGradientClass = (titleStr: string) => {
    const len = titleStr.length
    if (len % 3 === 0) return 'from-violet-900 to-indigo-950 text-indigo-200'
    if (len % 3 === 1) return 'from-fuchsia-950 to-purple-950 text-purple-200'
    return 'from-blue-950 to-slate-900 text-sky-200'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow flex flex-col bg-slate-950">
      
      {/* Title */}
      <div className="border-b border-slate-900 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <ShoppingCart className="w-7 h-7 text-indigo-400" />
          Shopping Cart
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review premium materials selected for purchase.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-6">
            <ShoppingCart className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-300">Your Cart is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            You haven't added any premium books to your checkout list yet. Browse our categories to find your study materials.
          </p>
          <Link
            href="/books"
            className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/20"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider pb-2 border-b border-slate-900 px-2">
              <span>Book Details</span>
              <span>Price</span>
            </div>

            {cart.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 bg-[#0c1324]/40 border border-slate-800/80 rounded-2xl gap-4 hover:border-slate-800 transition-colors"
              >
                <div className="flex items-center gap-4 truncate">
                  
                  {/* Small Cover Preview */}
                  <div className="relative aspect-[3/4] w-12 sm:w-16 shrink-0 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center text-center">
                    {item.cover_url && !item.cover_url.includes('placeholder') && !item.cover_url.includes('covers/') ? (
                      <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex flex-col justify-center p-1.5 bg-gradient-to-br ${getGradientClass(item.title)}`}>
                        <h4 className="font-extrabold text-[7px] leading-tight line-clamp-2 text-white">{item.title}</h4>
                        <span className="text-[5px] opacity-60 font-mono mt-0.5 uppercase">PDF</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Author Info */}
                  <div className="truncate">
                    <h3 className="font-bold text-slate-200 text-sm sm:text-base hover:text-white transition-colors truncate">
                      <Link href={`/books/${item.id}`}>{item.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-400 truncate">by {item.author}</p>
                    <span className="inline-block text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10 mt-1">
                      {item.category}
                    </span>
                  </div>

                </div>

                <div className="flex items-center gap-4 sm:gap-6 shrink-0 font-medium text-slate-200">
                  <span className="text-sm sm:text-base">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/5 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button 
                onClick={clearCart}
                className="text-xs font-semibold text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear All Items
              </button>
              <Link 
                href="/books" 
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                &larr; Keep Browsing
              </Link>
            </div>

          </div>

          {/* Checkout Order Summary Card */}
          <div className="lg:col-span-4 bg-[#0d1324]/60 border border-slate-900 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Order Summary</h3>
            
            <div className="space-y-3 text-xs sm:text-sm text-slate-400 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery (Signed Links)</span>
                <span className="text-emerald-400">FREE</span>
              </div>
              <div className="border-t border-slate-900 pt-3 flex justify-between font-bold text-sm sm:text-base">
                <span className="text-slate-200">Total Price</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-normal">
                This is a manual payment verification system. Once you place the order, you must transfer this total to our account and upload your payment reference receipt.
              </p>
            </div>

            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-all"
            >
              Proceed to Payment
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

        </div>
      )}

    </div>
  )
}
