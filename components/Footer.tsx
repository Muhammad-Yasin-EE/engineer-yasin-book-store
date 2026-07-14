'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GraduationCap, Mail, Phone, MessageCircle } from 'lucide-react'
import NewsletterWidget from './NewsletterWidget'

export default function Footer() {
  const supabase = createClient()
  const [customPages, setCustomPages] = useState<any[]>([])

  useEffect(() => {
    const fetchCustomPages = async () => {
      const { data } = await supabase
        .from('custom_pages')
        .select('slug, title')
        .order('title', { ascending: true })
      if (data) {
        setCustomPages(data)
      }
    }
    fetchCustomPages()
  }, [])

  return (
    <footer className="bg-[#f8fafc] border-t border-gray-200 text-gray-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-gray-255 bg-white">
                <img src="/logo.jpg" alt="Engineer Yasin Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-800">
                Engineer Yasin
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your comprehensive portal for academic, technical, and engineering resources. Download software, apply for scholarships and jobs, or order digital coding & design services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-4">Explore Portal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/scholarships" className="hover:text-[#B8212E] transition-colors">
                  Scholarships
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-[#B8212E] transition-colors">
                  Jobs & Internships
                </Link>
              </li>
              <li>
                <Link href="/software" className="hover:text-[#B8212E] transition-colors">
                  Software Downloads
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#B8212E] transition-colors">
                  Engineering Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Portal Support</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We verify custom checkout claims (JazzCash, EasyPaisa, NayaPay, SadaPay, and ABL Bank) within 1-12 hours.
            </p>
            <div className="space-y-2.5 text-xs text-gray-500 font-semibold">
              <a href="mailto:yasinofficial03098158572@gmail.com" className="flex items-center gap-2 hover:text-[#B8212E] transition-colors">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="truncate">yasinofficial03098158572@gmail.com</span>
              </a>
              <a href="https://wa.me/923342806970" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>WhatsApp: +923342806970</span>
              </a>
              <a href="tel:+923098158572" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Call: +923098158572</span>
              </a>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <NewsletterWidget />
          </div>

        </div>

        {/* Dynamic bottom links */}
        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>&copy; {new Date().getFullYear()} Engineer Yasin. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {customPages.map(page => (
              <Link 
                key={page.slug} 
                href={`/p/${page.slug}`} 
                className="hover:text-[#B8212E] font-bold"
              >
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
