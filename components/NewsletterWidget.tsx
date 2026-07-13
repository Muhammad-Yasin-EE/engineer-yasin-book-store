'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'

export default function NewsletterWidget() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })

      const data = await res.json()
      if (data.error) {
        setStatus('error')
        setMessage(data.error)
      } else {
        setStatus('success')
        setMessage(data.message || 'Thank you for subscribing!')
        setEmail('')
      }
    } catch (err: any) {
      setStatus('error')
      setMessage('Failed to connect to portal server. Try again.')
    }
  }

  return (
    <div className="bg-white border border-gray-200/80 p-6 rounded-none space-y-4 shadow-sm">
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#B8212E]" />
          Portal Alerts Newsletter
        </h4>
        <p className="text-xs text-gray-400 font-semibold leading-relaxed">
          Get daily email notifications whenever a new fully-funded scholarship or active government/private job is posted.
        </p>
      </div>

      {status === 'success' ? (
        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-none text-xs font-semibold flex items-center gap-2 animate-scale-in">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              disabled={status === 'loading'}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full bg-[#f8fafc] border border-gray-200 rounded-full py-2.5 pl-4 pr-12 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 transition-all font-semibold"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white flex items-center justify-center shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {status === 'error' && (
            <div className="p-2 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-semibold rounded-none flex items-center gap-1.5 animate-scale-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}
        </form>
      )}
    </div>
  )
}
