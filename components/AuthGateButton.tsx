'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, X, LogIn, UserPlus, Shield } from 'lucide-react'

interface AuthGateButtonProps {
  href: string
  label: string
  className?: string
  children?: React.ReactNode
}

export default function AuthGateButton({ href, label, className, children }: AuthGateButtonProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [checking, setChecking] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setChecking(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setChecking(false)
    if (user) {
      router.push(href)
    } else {
      setShowModal(true)
    }
  }

  return (
    <>
      <button onClick={handleClick} disabled={checking} className={className} aria-label={label}>
        {checking ? (
          <span className="inline-flex items-center gap-1.5">
            <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Checking...
          </span>
        ) : (
          children || label
        )}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.55)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ animation: 'auth-modal-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-[#B8212E] via-rose-500 to-orange-400" />
            <button
              onClick={() => setShowModal(false)}
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
                Create a free account or sign in to access this feature. It only takes a minute!
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold mb-6">
                <Shield className="w-3 h-3" />
                Free &amp; Secure — No spam, ever
              </div>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => { setShowModal(false); router.push('/signup') }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#B8212E] to-rose-600 text-white font-bold text-sm shadow-md hover:shadow-lg hover:from-[#a01c27] hover:to-rose-700 transition-all duration-200 active:scale-[0.98]"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Free Account
                </button>
                <button
                  onClick={() => { setShowModal(false); router.push('/login') }}
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
      )}
    </>
  )
}
