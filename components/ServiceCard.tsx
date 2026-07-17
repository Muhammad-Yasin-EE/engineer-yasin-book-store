'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/context/CartContext'
import { createClient } from '@/lib/supabase/client'
import {
  Hammer, ShoppingCart, Zap, Check, Lock, X, LogIn, UserPlus, Shield,
  Code2, Box, Cpu, GraduationCap, BookOpen, Layers
} from 'lucide-react'

// ── Price tiers by category ──────────────────────────────────────────────────
const CATEGORY_PRICES: Record<string, number> = {
  'Programming':          1500,
  '3D Modeling':          1800,
  'MATLAB & Simulink':    2500,
  'Hardware & PCB':       2000,
  'Tutoring':              900,
  'Some Completed Projects': 1200,
}

const DEFAULT_PRICE = 1200

function getPriceForService(category: string, id: string): number {
  const base = CATEGORY_PRICES[category] ?? DEFAULT_PRICE
  // Add slight variation per item so not every card shows identical price
  const seed = id.charCodeAt(id.length - 1) % 5
  return base + seed * 100
}

// ── Category icons ────────────────────────────────────────────────────────────
function CategoryIcon({ category }: { category: string }) {
  const cls = 'w-7 h-7 text-white'
  switch (category) {
    case 'Programming':           return <Code2 className={cls} />
    case '3D Modeling':           return <Box className={cls} />
    case 'MATLAB & Simulink':     return <Cpu className={cls} />
    case 'Hardware & PCB':        return <Layers className={cls} />
    case 'Tutoring':              return <GraduationCap className={cls} />
    case 'Some Completed Projects': return <BookOpen className={cls} />
    default:                      return <Hammer className={cls} />
  }
}

// ── Gradient per category ─────────────────────────────────────────────────────
function getCategoryGradient(category: string): string {
  switch (category) {
    case 'Programming':           return 'from-violet-600 to-purple-700'
    case '3D Modeling':           return 'from-sky-500 to-blue-700'
    case 'MATLAB & Simulink':     return 'from-orange-500 to-amber-600'
    case 'Hardware & PCB':        return 'from-teal-500 to-cyan-700'
    case 'Tutoring':              return 'from-emerald-500 to-green-700'
    case 'Some Completed Projects': return 'from-rose-500 to-pink-700'
    default:                      return 'from-amber-500 to-orange-600'
  }
}

// ── Auth Modal (reused from AuthGateButton design) ───────────────────────────
function AuthModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'auth-modal-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#B8212E] via-rose-500 to-orange-400" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
        <div className="px-8 pb-8 pt-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B8212E] to-rose-600 flex items-center justify-center shadow-lg mb-5">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight">Sign in to continue</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Create a free account or sign in to order this service.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold mb-6">
            <Shield className="w-3 h-3" />
            Free &amp; Secure — No spam, ever
          </div>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => { onClose(); router.push('/signup') }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#B8212E] to-rose-600 text-white font-bold text-sm shadow-md hover:shadow-lg hover:from-[#a01c27] hover:to-rose-700 transition-all duration-200 active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              Create Free Account
            </button>
            <button
              onClick={() => { onClose(); router.push('/login') }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:border-[#B8212E] hover:text-[#B8212E] transition-all duration-200 active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes auth-modal-in {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Main ServiceCard ─────────────────────────────────────────────────────────
interface ServiceCardProps {
  id: string
  title: string
  author: string  // provider / company
  category: string
  cover_url: string | null
}

export default function ServiceCard({ id, title, author, category, cover_url }: ServiceCardProps) {
  const router = useRouter()
  const { addToCart, isInCart } = useCart()
  const [checking, setChecking] = useState(false)
  const [cartAction, setCartAction] = useState<'cart' | 'buy' | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const price = getPriceForService(category, id)
  const originalPrice = Math.round(price * 1.35)
  const gradient = getCategoryGradient(category)
  const alreadyInCart = isInCart(id)

  const hasCover = cover_url &&
    !cover_url.includes('placeholder') &&
    !cover_url.includes('covers/')

  const checkAuthThen = async (action: 'cart' | 'buy') => {
    setChecking(true)
    setCartAction(action)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setChecking(false)
    setCartAction(null)

    if (!user) {
      setShowAuthModal(true)
      return
    }

    const cartItem = {
      id,
      title,
      author,
      price,
      cover_url: cover_url || '',
      category,
    }

    if (action === 'cart') {
      addToCart(cartItem)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } else {
      addToCart(cartItem)
      router.push('/checkout')
    }
  }

  return (
    <>
      <div className="group relative bg-white border border-gray-200 rounded-none overflow-hidden hover:border-amber-400/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

        {/* Cover / Visual */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100">

          {/* Service badge */}
          <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded shadow-sm bg-amber-500">
            Service
          </span>

          {/* PREMIUM badge */}
          <span className="absolute top-2.5 right-2.5 z-10 text-[8px] font-bold px-1.5 py-0.5 tracking-wider rounded-none bg-white text-gray-800 border border-gray-200 shadow-sm">
            PREMIUM
          </span>

          {hasCover ? (
            cover_url!.includes('logo.clearbit.com') || cover_url!.includes('ui-avatars.com') ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50/80 p-8">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center p-4 transform group-hover:scale-105 transition-transform duration-300">
                  <img src={cover_url!} alt={title} loading="lazy" className="w-full h-full object-contain" />
                </div>
              </div>
            ) : (
              <img src={cover_url!} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            )
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient} relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-300 z-10">
                <CategoryIcon category={category} />
              </div>
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[7px] font-mono tracking-wider text-white/40 uppercase z-10 select-none">
                <span className="truncate max-w-[80px]">{category}</span>
                <span>Yasin Portal</span>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">
            {category}
          </span>
          <h4 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors line-clamp-2 text-sm sm:text-base mb-1 leading-snug">
            {title}
          </h4>
          <p className="text-xs text-gray-500 mb-3 truncate">
            Provider: <span className="font-semibold">{author}</span>
          </p>

          {/* Price */}
          <div className="mb-4">
            <span className="text-sm sm:text-base font-black text-[#B8212E]">
              Rs. {price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 line-through ml-2 font-medium">
              Rs. {originalPrice.toLocaleString()}
            </span>
            <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              {Math.round((1 - price / originalPrice) * 100)}% OFF
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex gap-2">

            {/* Add to Cart */}
            <button
              onClick={() => checkAuthThen('cart')}
              disabled={checking && cartAction === 'cart'}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-all duration-200 disabled:opacity-60 disabled:cursor-wait ${
                alreadyInCart || justAdded
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                  : 'border-gray-300 text-gray-700 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50'
              }`}
              aria-label="Add to cart"
            >
              {checking && cartAction === 'cart' ? (
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : alreadyInCart || justAdded ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5" />
              )}
              {alreadyInCart || justAdded ? 'Added' : 'Cart'}
            </button>

            {/* Buy Now */}
            <button
              onClick={() => checkAuthThen('buy')}
              disabled={checking && cartAction === 'buy'}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold bg-[#B8212E] text-white hover:bg-[#D62636] shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60 disabled:cursor-wait"
              aria-label="Buy now"
            >
              {checking && cartAction === 'buy' ? (
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Zap className="w-3.5 h-3.5" />
              )}
              Buy Now
            </button>

          </div>
        </div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
