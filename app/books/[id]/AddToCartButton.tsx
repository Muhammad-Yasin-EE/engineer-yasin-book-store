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
        className="flex-grow inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
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
      className={`flex-grow inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full border font-bold text-sm transition-all hover:-translate-y-0.5 cursor-pointer ${
        justAdded
          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
          : isAlreadyInCart
          ? 'bg-gray-150 border-gray-200 text-gray-500'
          : 'bg-white border-[#B8212E] text-[#B8212E] hover:bg-[#B8212E] hover:text-white'
      }`}
    >
      {justAdded ? (
        <>
          <Check className="w-4.5 h-4.5" />
          Added!
        </>
      ) : isAlreadyInCart ? (
        <>
          <Check className="w-4.5 h-4.5" />
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
