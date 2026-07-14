'use client'

import { useState, useEffect } from 'react'
import { X, MessageSquare } from 'lucide-react'

export default function WhatsappPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/GzB2X8wN2dD3B6Z8j9u9d9'

  useEffect(() => {
    // Show popup every 20 seconds
    const interval = setInterval(() => {
      // Check if modal is already open
      setIsOpen((prev) => {
        if (!prev) {
          return true
        }
        return prev
      })
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform scale-100 transition-all duration-300 animate-slide-up">
        
        {/* WhatsApp Brand Banner */}
        <div className="bg-[#25D366] px-6 py-8 text-white relative">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">Official Community</span>
              <h3 className="text-xl font-bold">Join Engineer Yasin</h3>
            </div>
          </div>
        </div>

        {/* Popup Contents */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Hamare official **WhatsApp Group** ko join karein taake aap ko latest Updates, Software Free keys, Ebooks, aur new Courses ki alerts foran milti rahein!
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md transition-all hover:scale-102 active:scale-98"
            >
              <MessageSquare className="w-4 h-4" />
              Join WhatsApp Group
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 font-bold transition-colors"
            >
              No thanks, close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
