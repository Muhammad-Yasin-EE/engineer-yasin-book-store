'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/context/CartContext'
import { ShoppingCart, Trash2, ArrowRight, BookOpen, AlertCircle } from 'lucide-react'

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart()

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0)

  const getGradientClass = (titleStr: string) => {
    const len = titleStr.length
    if (len % 3 === 0) return 'from-red-900 to-red-950 text-red-100'
    if (len % 3 === 1) return 'from-gray-900 to-gray-950 text-gray-100'
    return 'from-[#7f1d1d] to-[#450a0a] text-red-100'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow flex flex-col bg-white text-[#222222]">
      
      {/* Title */}
      <div className="border-b border-gray-150 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
          <ShoppingCart className="w-7 h-7 text-[#B8212E]" />
          Shopping Cart
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Review premium materials selected for purchase.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mb-6">
            <ShoppingCart className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">Your Cart is Empty</h3>
          <p className="text-xs text-gray-450 max-w-sm mt-1">
            You haven't added any premium books to your checkout list yet. Browse our categories to find your study materials.
          </p>
          <Link
            href="/books"
            className="mt-6 inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-bold bg-[#B8212E] hover:bg-[#D62636] text-white shadow-sm hover:shadow"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider pb-2 border-b border-gray-100 px-2">
              <span>Book Details</span>
              <span>Price</span>
            </div>

            {cart.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-none gap-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-4 truncate">
                  
                  {/* Small Cover Preview (Sharp corners) */}
                  <div className="relative aspect-[3/4] w-12 sm:w-16 shrink-0 rounded-none overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center text-center">
                    {item.cover_url && !item.cover_url.includes('placeholder') && !item.cover_url.includes('covers/') ? (
                      <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex flex-col justify-center p-1.5 bg-gradient-to-br ${getGradientClass(item.title)}`}>
                        <h4 className="font-extrabold text-[7px] leading-tight line-clamp-2 text-white">{item.title}</h4>
                      </div>
                    )}
                  </div>

                  {/* Title & Author Info */}
                  <div className="truncate">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base hover:text-[#B8212E] transition-colors truncate">
                      <Link href={`/items/${item.id}`}>{item.title}</Link>
                    </h3>
                    <p className="text-xs text-gray-500 truncate">by {item.author}</p>
                    <span className="inline-block text-[9px] font-bold text-[#B8212E] uppercase tracking-widest bg-[#B8212E]/5 px-1.5 py-0.5 rounded border border-[#B8212E]/10 mt-1">
                      {item.category}
                    </span>
                  </div>

                </div>

                <div className="flex items-center gap-4 sm:gap-6 shrink-0 font-medium text-gray-800">
                  <span className="text-sm sm:text-base font-bold">Rs. {item.price.toFixed(0)}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button 
                onClick={clearCart}
                className="text-xs font-bold text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear All Items
              </button>
              <Link 
                href="/books" 
                className="text-xs font-bold text-[#B8212E] hover:text-[#D62636] transition-colors"
              >
                &larr; Keep Browsing
              </Link>
            </div>

          </div>

          {/* Checkout Order Summary Card */}
          <div className="lg:col-span-4 bg-[#f8fafc] border border-gray-200 rounded-none p-6 space-y-6">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest border-b border-gray-200 pb-2">Order Summary</h3>
            
            <div className="space-y-3 text-xs sm:text-sm text-gray-600 font-semibold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-800 font-bold">Rs. {subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery (Signed Links)</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-sm sm:text-base">
                <span className="text-gray-800">Total Price</span>
                <span className="text-[#B8212E] font-black">Rs. {subtotal.toFixed(0)}</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#B8212E]/5 border border-[#B8212E]/10 rounded-none flex gap-2">
              <AlertCircle className="w-4 h-4 text-[#B8212E] shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-500 leading-normal font-semibold">
                This is a manual payment verification system. Once you place the order, you must transfer this total to our account and upload your payment reference receipt.
              </p>
            </div>

            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-sm shadow-sm hover:shadow hover:-translate-y-0.5 transition-all"
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
