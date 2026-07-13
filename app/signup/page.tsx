'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserPlus, Mail, Lock, User, ShieldAlert, Sparkles } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Account created successfully! Check your email for verification instructions, or try signing in.' 
        })
        setName('')
        setEmail('')
        setPassword('')
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Registration failed. Please check details and try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative bg-white text-[#222222]">
      
      <div className="max-w-md w-full space-y-8 bg-[#f8fafc] p-8 rounded-none border border-gray-200 relative z-10 shadow-sm">
        
        {/* Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#B8212E]/5 border border-[#B8212E]/10 text-[#B8212E] text-xs font-semibold mb-4">
            <Sparkles className="w-3 h-3" />
            Join Our Platform
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500 font-semibold">
            Or{' '}
            <Link href="/login" className="font-bold text-[#B8212E] hover:text-[#D62636] underline">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`p-4 rounded-none text-sm border ${
            message.type === 'error' 
              ? 'bg-rose-50 text-rose-600 border-rose-200' 
              : 'bg-emerald-50 text-emerald-600 border-emerald-200'
          }`}>
            <div className="flex gap-2 font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4 font-semibold text-gray-500">
            {/* Full Name */}
            <div className="relative">
              <label htmlFor="full-name" className="sr-only">Full Name</label>
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                id="full-name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-full relative block w-full pl-11 pr-4 py-3 border border-gray-200 bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 transition-all text-xs font-bold"
                placeholder="Full Name"
              />
            </div>
            
            {/* Email */}
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-full relative block w-full pl-11 pr-4 py-3 border border-gray-200 bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 transition-all text-xs font-bold"
                placeholder="Email address"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-full relative block w-full pl-11 pr-4 py-3 border border-gray-200 bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 transition-all text-xs font-bold"
                placeholder="Password (min 6 characters)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-[#B8212E] hover:bg-[#D62636] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#B8212E] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <UserPlus className="h-4.5 w-4.5 text-red-200 group-hover:text-white transition-colors" />
              </span>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
