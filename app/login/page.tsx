'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogIn, Mail, Lock, ShieldAlert, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        router.push('/account')
        router.refresh()
      }
    }
    checkUser()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Logged in successfully! Redirecting...' })
        router.push('/account')
        router.refresh()
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Google Auth initiation failed.' })
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
            Welcome Back
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Sign In</h2>
          <p className="mt-2 text-sm text-gray-500 font-semibold">
            Or{' '}
            <Link href="/signup" className="font-bold text-[#B8212E] hover:text-[#D62636] underline">
              create a new account
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
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 font-semibold text-gray-500">
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-full relative block w-full pl-11 pr-4 py-3 border border-gray-200 bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 transition-all text-xs font-bold"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#B8212E] focus:ring-[#B8212E]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-550">
                Remember me
              </label>
            </div>
            <a href="#" className="font-bold text-[#B8212E] hover:text-[#D62636] hover:underline">
              Forgot password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-[#B8212E] hover:bg-[#D62636] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#B8212E] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <LogIn className="h-4.5 w-4.5 text-red-200 group-hover:text-white transition-colors" />
              </span>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold">
            <span className="bg-[#f8fafc] px-2.5 text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* Social logins */}
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-50 transition-colors text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.05,3.1v2.58h3.31c1.94,-1.78 3.06,-4.42 3.06,-7.48C21.7,11.9 21.58,11.5 21.35,11.1z" fill="#4285F4" />
                <path d="M12,20.7c2.43,0 4.47,-0.8 5.96,-2.2l-3.31,-2.58c-0.92,0.62 -2.1,0.98 -3.65,0.98 -2.81,0 -5.19,-1.9 -6.04,-4.46H1.54v2.66C3.07,18.15 7.23,20.7 12,20.7z" fill="#34A853" />
                <path d="M5.96,12.44c-0.22,-0.66 -0.35,-1.37 -0.35,-2.09c0,-0.72 0.13,-1.43 0.35,-2.09V5.6H1.54C0.77,7.14 0.3,8.87 0.3,10.75c0,1.88 0.47,3.61 1.24,5.15L5.96,12.44z" fill="#FBBC05" />
                <path d="M12,4.72c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.47,2.1 14.43,1.3 12,1.3C7.23,1.3 3.07,3.85 1.54,6.96L5.96,9.62c0.85,-2.56 3.23,-4.46 6.04,-4.46z" fill="#EA4335" />
              </g>
            </svg>
            Google OAuth
          </button>
        </div>

      </div>
    </div>
  )
}
