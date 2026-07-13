'use client'

import React, { useState } from 'react'
import { Mail, Globe, MessageCircle, MessageSquareShare, BellRing, Share2, X } from 'lucide-react'

// Custom brand SVG components
const FacebookIcon = () => (
  <svg className="w-4.5 h-4.5 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-4.5 h-4.5 text-[#0a66c2]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

const GitHubIcon = () => (
  <svg className="w-4.5 h-4.5 text-[#24292e]" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const YouTubeIcon = () => (
  <svg className="w-4.5 h-4.5 text-[#ff0000]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

export default function SocialFloatingBar() {
  const [isOpen, setIsOpen] = useState(false)

  const socialLinks = [
    {
      name: 'Website',
      url: 'https://www.engineeryasin.xyz',
      icon: <Globe className="w-4.5 h-4.5 text-blue-600" />,
      hoverClass: 'hover:bg-blue-50 hover:scale-110'
    },
    {
      name: 'Email',
      url: 'mailto:engineeryasin2029@gmail.com',
      icon: <Mail className="w-4.5 h-4.5 text-rose-500" />,
      hoverClass: 'hover:bg-rose-50 hover:scale-110'
    },
    {
      name: 'Fiverr',
      url: 'https://www.fiverr.com/s/gDA4d19',
      icon: <span className="text-[10px] font-black font-sans text-emerald-600 tracking-tighter select-none">fi</span>,
      hoverClass: 'hover:bg-emerald-50 hover:scale-110'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@engineer_yasin?si=4Du0AQ-ca9ffW3Ek',
      icon: <YouTubeIcon />,
      hoverClass: 'hover:bg-red-50 hover:scale-110'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/muhammad-yasin-595633384',
      icon: <LinkedInIcon />,
      hoverClass: 'hover:bg-blue-50 hover:scale-110'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Muhammad-Yasin-EE',
      icon: <GitHubIcon />,
      hoverClass: 'hover:bg-gray-100 hover:scale-110'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/muhammad.yaseen.102260',
      icon: <FacebookIcon />,
      hoverClass: 'hover:bg-[#1877f2]/10 hover:scale-110'
    },
    {
      name: 'WhatsApp Group',
      url: 'https://chat.whatsapp.com/IzPd4vwXbrjGhAkanhYvTp',
      icon: <MessageSquareShare className="w-4.5 h-4.5 text-teal-600" />,
      hoverClass: 'hover:bg-teal-50 hover:scale-110'
    },
    {
      name: 'WhatsApp Channel',
      url: 'https://whatsapp.com/channel/0029Vb8VePo0QeakhuHAtn14',
      icon: <BellRing className="w-4.5 h-4.5 text-emerald-600" />,
      hoverClass: 'hover:bg-emerald-50 hover:scale-110'
    }
  ]

  return (
    <>
      {/* Left Sticky Social Dock Container */}
      <div className="fixed bottom-6 left-3 sm:left-6 z-50 flex flex-col items-center gap-3">
        
        {/* Expanded Vertical Social Menu */}
        <div className={`flex flex-col gap-2 bg-white/95 backdrop-blur-md border border-gray-200/80 p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 origin-bottom transform ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0 visible' 
            : 'opacity-0 scale-75 translate-y-4 invisible h-0 overflow-hidden p-0 border-0'
        }`}>
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.name}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border border-transparent hover:border-gray-200 ${link.hoverClass}`}
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Collapsed Single Social Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border cursor-pointer hover:scale-105 active:scale-95 ${
            isOpen 
              ? 'bg-[#B8212E] text-white border-transparent hover:bg-[#D62636]' 
              : 'bg-white text-gray-700 border-gray-200 hover:text-[#B8212E] hover:border-[#B8212E]/30'
          }`}
          title="Social Connections"
        >
          {isOpen ? <X className="w-5 h-5 animate-scale-in" /> : <Share2 className="w-5 h-5 animate-scale-in" />}
        </button>
      </div>

      {/* Right Sticky Floating WhatsApp Chat Button */}
      <div className="fixed bottom-6 right-3 sm:right-6 z-50 flex flex-col items-center">
        {/* Pulsing indicator */}
        <span className="absolute inline-flex h-11 w-11 rounded-full bg-[#25D366]/20 animate-ping z-0" />
        
        <a
          href="https://wa.me/923342806970"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
          className="relative z-10 w-11 h-11 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        </a>
      </div>
    </>
  )
}
