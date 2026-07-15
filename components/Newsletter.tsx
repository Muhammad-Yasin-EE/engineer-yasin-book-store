'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, Mail } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage('Thank you for subscribing! You will receive updates soon.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error. Please try again later.')
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden my-12">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 mb-2 shadow-lg">
          <Mail className="w-8 h-8 text-blue-400" />
        </div>
        
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Get Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Opportunities</span>
        </h3>
        
        <p className="text-gray-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Join 10,000+ professionals and students. Get the latest Jobs, Internships, and fully-funded Scholarships directly in your inbox.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
          <div className="relative flex items-center group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status !== 'idle') setStatus('idle')
              }}
              placeholder="Enter your email address"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-full py-4 pl-6 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
              disabled={status === 'loading' || status === 'success'}
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success' || !email}
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold px-6 rounded-full transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Join</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          
          {status === 'success' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-4 h-4" />
              <p>{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-red-400 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-4 h-4" />
              <p>{message}</p>
            </div>
          )}
        </form>
        
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-6">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  )
}
