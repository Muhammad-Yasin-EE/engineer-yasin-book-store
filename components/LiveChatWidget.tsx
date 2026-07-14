'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
// No uuid import needed, we use crypto.randomUUID()

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize Session
  useEffect(() => {
    let currentSessionId = localStorage.getItem('chat_session_id')
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID()
      localStorage.setItem('chat_session_id', currentSessionId)
    }
    setSessionId(currentSessionId)

    // Ensure session exists in DB
    const initSession = async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', currentSessionId)
        .single()
      
      if (error && error.code === 'PGRST116') {
        // Doesn't exist, create it
        await supabase.from('chat_sessions').insert({
          id: currentSessionId,
          user_identifier: 'Visitor ' + currentSessionId!.substring(0, 5)
        })
      } else if (data) {
        setUnreadCount(data.unread_user_count || 0)
      }
    }
    initSession()

    // Load old messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
    }
    fetchMessages()

    // Realtime subscription
    const channel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${currentSessionId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
          if (payload.new.sender_role === 'admin' && !isOpen) {
            setUnreadCount((prev) => prev + 1)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isOpen])

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      if (unreadCount > 0) {
        setUnreadCount(0)
        if (sessionId) {
          supabase.from('chat_sessions').update({ unread_user_count: 0 }).eq('id', sessionId)
        }
      }
    }
  }, [messages, isOpen, unreadCount, sessionId, supabase])

  // Tooltip bouncing attention grabber
  useEffect(() => {
    if (isOpen) return
    
    // Initial delay before first pop-up
    const initialTimeout = setTimeout(() => {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 5000)
    }, 3000)

    const interval = setInterval(() => {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 5000) // Show for 5 seconds
    }, 15000) // Every 15 seconds
    
    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [isOpen])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !sessionId || isSubmitting) return

    setIsSubmitting(true)
    const text = newMessage.trim()
    setNewMessage('')

    try {
      // Create session if it doesn't exist
      const { data: sessionData } = await supabase.from('chat_sessions').select('id').eq('id', sessionId).single()
      if (!sessionData) {
        await supabase.from('chat_sessions').insert({
          id: sessionId,
          user_identifier: 'Visitor ' + sessionId.substring(0, 5)
        })
      }

      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender_role: 'user',
        message: text
      })

      // Increment admin unread count using update
      const { data } = await supabase.from('chat_sessions').select('unread_admin_count').eq('id', sessionId).single()
      await supabase.from('chat_sessions').update({ 
        unread_admin_count: (data?.unread_admin_count || 0) + 1,
        last_message: text,
        updated_at: new Date().toISOString()
      }).eq('id', sessionId)

    } catch (err) {
      console.error('Failed to send message', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed bottom-[80px] right-3 sm:right-6 z-[60] flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-80 h-96 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in origin-bottom-right">
          {/* Header */}
          <div className="bg-[#222222] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                <img src="/logo.jpg" alt="Support" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-tight">Live Support</h3>
                <p className="text-gray-400 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
            {messages.length === 0 ? (
              <div className="text-center text-xs text-gray-400 mt-10 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto opacity-50" />
                <p>Hi! How can we help you today?</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs font-medium shadow-sm ${
                    msg.sender_role === 'user' 
                      ? 'bg-[#B8212E] text-white rounded-br-sm' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#B8212E] focus:bg-white"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newMessage.trim()}
              className="w-8 h-8 rounded-full bg-[#B8212E] text-white flex items-center justify-center shrink-0 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 -ml-0.5" />
            </button>
          </form>
        </div>
      )}

      {/* Chat Bubble Toggle */}
      <div className="relative">
        <span className="absolute inline-flex h-12 w-12 rounded-full bg-[#B8212E]/30 animate-ping z-0" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-white text-[#222222] rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 relative border-2 border-[#B8212E] z-10"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-white">
            <img src="/logo.jpg" alt="Chat" className="w-full h-full object-cover rounded-full" />
          </div>
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 bg-[#B8212E] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {showTooltip && !isOpen && (
          <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white text-[#B8212E] border border-[#B8212E]/20 shadow-lg px-3 py-2 rounded-xl rounded-br-sm text-[11px] font-bold whitespace-nowrap animate-bounce z-50 flex items-center gap-2">
            <span>Need help? Chat with us!</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}
