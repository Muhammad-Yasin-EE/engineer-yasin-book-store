'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart, CartItem } from '@/lib/context/CartContext'
import { ShoppingCart, ShoppingBag, Check } from 'lucide-react'

interface AddToCartButtonProps {
  book: CartItem
  buyNow: boolean
}

export default function AddToCartButton({ book, buyNow }: AddToCartButtonProps) {
  const router = useRouter()
  const { addToCart, isInCart } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const isAlreadyInCart = isInCart(book.id)

  const handleAction = () => {
    addToCart(book)

    if (buyNow) {
      router.push('/checkout')
    } else {
      setJustAdded(true)
      setTimeout(() => {
        setJustAdded(false)
      }, 2000)
    }
  }

  if (buyNow) {
    return (
      <button
        onClick={handleAction}
        className="flex-grow inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm hover:-translate-y-0.5 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
      >
        <ShoppingBag className="w-4.5 h-4.5" />
        Buy Now
      </button>
    )
  }

  return (
    <button
      onClick={handleAction}
      disabled={justAdded}
      className={`flex-grow inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border font-semibold text-sm transition-all hover:-translate-y-0.5 cursor-pointer ${
        justAdded
          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
          : isAlreadyInCart
          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          : 'bg-slate-900 border-indigo-500/30 hover:border-indigo-500/80 text-indigo-400 hover:text-indigo-300 shadow-md shadow-indigo-950/10'
      }`}
    >
      {justAdded ? (
        <>
          <Check className="w-4.5 h-4.5" />
          Added to Cart!
        </>
      ) : isAlreadyInCart ? (
        <>
          <Check className="w-4.5 h-4.5 text-slate-500" />
          In Cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-4.5 h-4.5" />
          Add to Cart
        </>
      )}
    </button>
  )
}
