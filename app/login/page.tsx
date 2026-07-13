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
    // Check if user is already logged in, redirect to library/account
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
    <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative bg-slate-950 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-[#0d1324]/50 p-8 rounded-3xl border border-slate-800/80 backdrop-blur-md relative z-10">
        
        {/* Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3 h-3" />
            Welcome Back
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Sign In</h2>
          <p className="mt-2 text-sm text-slate-400">
            Or{' '}
            <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 underline">
              create a new account
            </Link>
          </p>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`p-4 rounded-xl text-sm border ${
            message.type === 'error' 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            <div className="flex gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-2xl relative block w-full pl-11 pr-4 py-3 border border-slate-800 bg-slate-950/60 placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition-all text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-2xl relative block w-full pl-11 pr-4 py-3 border border-slate-800 bg-slate-950/60 placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition-all text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-slate-400">
                Remember me
              </label>
            </div>
            <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
              Forgot password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-indigo-200 group-hover:text-indigo-100 transition-colors" />
              </span>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#090d16] px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        {/* Social logins */}
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-800 rounded-2xl bg-slate-950/40 text-slate-300 hover:text-white hover:bg-slate-950/80 transition-colors text-sm font-medium disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.05,3.1v2.58h3.31c1.94,-1.78 3.06,-4.42 3.06,-7.48C21.7,11.9 21.58,11.5 21.35,11.1z" fill="#4285F4" />
                <path d="M12,20.7c2.43,0 4.47,-0.8 5.96,-2.2l-3.31,-2.58c-0.92,0.62 -2.1,0.98 -3.65,0.98 -2.81,0 -5.19,-1.9 -6.04,-4.46H1.54v2.66C3.07,18.15 7.23,20.7 12,20.7z" fill="#34A853" />
                <path d="M5.96,12.44c-0.22,-0.66 -0.35,-1.37 -0.35,-2.09c0,-0.72 0.13,-1.43 0.35,-2.09V5.6H1.54C0.77,7.14 0.3,8.87 0.3,10.75c0,1.88 0.47,3.61 1.24,5.15L5.96,12.44z" fill="#FBBC05" />
                <path d="M12,4.72c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.47,2.1 14.43,1.3 12,1.3C7.23,1.3 3.07,3.85 1.54,6.96L5.96,9.62c0.85,-2.56 3.23,-4.46 6.04,-4.46z" fill="#EA4335" />
              </g>
            </svg>
            Google
          </button>
        </div>

      </div>
    </div>
  )
}
