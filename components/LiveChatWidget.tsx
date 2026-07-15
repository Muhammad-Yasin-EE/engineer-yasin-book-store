'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Send, MessageCircle, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ChatMessage {
  id: string
  session_id: string
  sender_role: 'user' | 'admin'
  message: string
  created_at: string
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Initialize session
  useEffect(() => {
    let sid = localStorage.getItem('chat_session_id')
    const createdAt = localStorage.getItem('chat_session_created_at')
    
    // Reset after 3 days
    const THREE_DAYS = 3 * 24 * 60 * 60 * 1000
    if (sid && createdAt && (Date.now() - parseInt(createdAt)) > THREE_DAYS) {
      localStorage.removeItem('chat_session_id')
      localStorage.removeItem('chat_session_created_at')
      sid = null
    }

    if (!sid) {
      sid = crypto.randomUUID()
      localStorage.setItem('chat_session_id', sid)
      localStorage.setItem('chat_session_created_at', Date.now().toString())
    }
    setSessionId(sid)

    // Load existing messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sid)
        .order('created_at', { ascending: true })
      if (data) setMessages(data as ChatMessage[])
    }
    loadMessages()

    // Get unread count from session
    const loadSession = async () => {
      const { data } = await supabase
        .from('chat_sessions')
        .select('unread_user_count')
        .eq('id', sid)
        .single()
      if (data) setUnreadCount(data.unread_user_count || 0)
    }
    loadSession()
  }, [])

  // Real-time subscription
  useEffect(() => {
    if (!sessionId) return

    const channel = supabase
      .channel(`chat_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
          if (newMsg.sender_role === 'admin' && !isOpen) {
            setUnreadCount((prev) => prev + 1)
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId, isOpen])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Clear unread when opening
  useEffect(() => {
    if (isOpen && sessionId && unreadCount > 0) {
      setUnreadCount(0)
      supabase
        .from('chat_sessions')
        .update({ unread_user_count: 0 })
        .eq('id', sessionId)
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Tooltip animation
  useEffect(() => {
    const show = () => {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 4000)
    }
    const t1 = setTimeout(show, 3000)
    const interval = setInterval(show, 18000)
    return () => {
      clearTimeout(t1)
      clearInterval(interval)
    }
  }, [])

  const ensureSession = async (sid: string) => {
    const { data } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sid)
      .single()

    if (!data) {
      await supabase.from('chat_sessions').insert({
        id: sid,
        user_identifier: 'Visitor ' + sid.substring(0, 6),
        unread_admin_count: 0,
        unread_user_count: 0,
      })
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !sessionId || isSubmitting) return

    setIsSubmitting(true)
    const text = newMessage.trim()
    setNewMessage('')

    // Optimistic update
    const tempId = crypto.randomUUID()
    const tempMsg: ChatMessage = {
      id: tempId,
      session_id: sessionId,
      sender_role: 'user',
      message: text,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempMsg])

    try {
      await ensureSession(sessionId)

      const { error } = await supabase.from('chat_messages').insert({
        id: tempId,
        session_id: sessionId,
        sender_role: 'user',
        message: text,
      })

      if (error) throw error

      // Update session unread for admin
      const { data: sess } = await supabase
        .from('chat_sessions')
        .select('unread_admin_count')
        .eq('id', sessionId)
        .single()

      await supabase
        .from('chat_sessions')
        .update({
          unread_admin_count: (sess?.unread_admin_count || 0) + 1,
          last_message: text,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
    } catch (err) {
      console.error('Send failed:', err)
      // Don't restore - keep optimistic message shown, user can retry if needed
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[998] sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Window - Messenger Style */}
      {isOpen && (
        <div style={{background: '#ffffff', color: '#111111'}} className="
          fixed z-[9999]
          inset-x-0 bottom-0 top-0
          sm:inset-auto sm:bottom-24 sm:right-4
          sm:w-[360px] sm:h-[520px] sm:rounded-2xl
          flex flex-col overflow-hidden
          shadow-2xl
        ">
          {/* Header */}
          <div className="bg-[#222222] px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                <img
                  src="/logo.jpg"
                  alt="Support"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#222] ${isConnected ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm leading-tight">Engineer Yasin</h3>
              <p className="text-gray-400 text-[11px]">{isConnected ? 'Online — reply karein' : 'Connecting...'}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div style={{background: '#f0f2f5'}} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 pb-10">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img src="/logo.jpg" alt="Support" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p style={{color: '#374151'}} className="font-bold text-sm">Engineer Yasin Portal</p>
                  <p style={{color: '#6b7280'}} className="text-xs mt-1">Aapka koi bhi sawaal poochein!</p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender_role === 'admin' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-gray-200 shadow-sm">
                    <img src="/logo.jpg" alt="Admin" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={`max-w-[75%] flex flex-col ${msg.sender_role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div style={msg.sender_role === 'user' 
                    ? {background: '#0084FF', color: '#ffffff'} 
                    : {background: '#ffffff', color: '#111111', border: '1px solid #e5e7eb'}
                  } className={`px-4 py-2.5 text-sm font-medium leading-relaxed shadow-sm ${
                    msg.sender_role === 'user'
                      ? 'rounded-[20px] rounded-br-[4px]'
                      : 'rounded-[20px] rounded-bl-[4px]'
                  }`}>
                    {msg.message}
                  </div>
                  <span style={{color: '#9ca3af'}} className="text-[10px] mt-1 px-1">{formatTime(msg.created_at)}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            style={{background: '#ffffff', borderTop: '1px solid #e5e7eb'}}
            className="flex items-center gap-2 px-3 py-3 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Yahan apna message likhein..."
              style={{background: '#f0f2f5', color: '#111111'}}
              className="flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newMessage.trim()}
              style={{background: '#0084FF', color: '#ffffff'}}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-[74px] right-3 sm:right-6 z-[997] flex flex-col items-end">
        {/* Tooltip */}
        {showTooltip && !isOpen && (
          <div className="mb-3 bg-white text-gray-800 border border-gray-200 shadow-xl px-4 py-2.5 rounded-2xl rounded-br-sm text-xs font-semibold whitespace-nowrap animate-bounce flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            Need help? Chat with us! 💬
          </div>
        )}

        {/* Button */}
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-[#0084FF]/30 animate-ping" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-14 h-14 rounded-full overflow-hidden shadow-2xl border-4 border-white hover:scale-105 active:scale-95 transition-transform duration-200 z-10"
          >
            <img src="/logo.jpg" alt="Chat" className="w-full h-full object-cover" />
          </button>
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 border-2 border-white z-20 animate-bounce">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </>
  )
}
