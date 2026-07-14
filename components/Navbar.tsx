'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { useCart } from '@/lib/context/CartContext'
import { createClient } from '@/lib/supabase/client'
import { 
  BookOpen, ShoppingCart, User, ShieldAlert, LogOut, Search, Menu, X, 
  ChevronDown, GraduationCap, Briefcase, Download, Hammer, FileText, 
  Clock, Newspaper, Bell, Sun, Moon, Sparkles, BookMarked, Globe, Award
} from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cart } = useCart()
  const supabase = createClient()
  
  const [session, setSession] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [customPages, setCustomPages] = useState<any[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Search Autocomplete Suggestion States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Dark Mode States
  const [darkMode, setDarkMode] = useState(false)

  // Notification States
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<'careers' | 'resources' | 'books' | 'blog' | null>(null)

  useEffect(() => {
    // 1. Fetch Auth Session & Admin Level Checks
    const checkAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)
      
      if (currentSession?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', currentSession.user.id)
          .single()
        setIsAdmin(profile?.is_admin || false)
      }
    }
    
    // 2. Fetch Dynamic informational pages
    const fetchCustomPages = async () => {
      const { data } = await supabase
        .from('custom_pages')
        .select('slug, title')
        .order('title', { ascending: true })
      setCustomPages(data || [])
    }

    // 3. Fetch Notifications count
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      const dismissed = JSON.parse(localStorage.getItem('dismissed_notifications') || '[]')
      const activeNotifications = (data || []).filter(n => !dismissed.includes(n.id))
      
      setNotifications(activeNotifications)
      setUnreadCount(activeNotifications.length)
    }

    // 4. Initialize Dark Mode Theme Settings
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    checkAuth()
    fetchCustomPages()
    fetchNotifications()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setIsAdmin(data?.is_admin || false))
      } else {
        setIsAdmin(false)
      }
    })

    // Outside clicks listener for suggestions & notifications
    const handleOutsideClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      subscription.unsubscribe()
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  // Dark Mode Trigger
  const toggleDarkMode = () => {
    const isDark = !darkMode
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Instant Search Autocomplete Suggestion Fetcher (with basic debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const query = searchQuery.trim()
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      setLoadingSuggestions(true)
      try {
        const { data } = await supabase
          .from('items')
          .select('id, title, resource_type')
          .ilike('title', `%${query}%`)
          .limit(5)
        setSuggestions(data || [])
      } catch (err) {
        console.error('Fetch autocomplete suggestions error:', err)
      } finally {
        setLoadingSuggestions(false)
      }
    }, 300) // 300ms debounce delay to optimize database calls

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    if (searchQuery.trim()) {
      router.push(`/software?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-150 text-[#222222] shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border border-gray-250 shadow-sm group-hover:scale-105 transition-all bg-white">
                <img src="/logo.jpg" alt="Engineer Yasin Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-800">
                Engineer <span className="text-[#B8212E]">Yasin</span>
              </span>
            </Link>
          </div>

          {/* Search bar with Autocomplete Suggestions */}
          <div ref={suggestionsRef} className="hidden md:block flex-grow max-w-xs relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                className="w-full bg-[#f5f5f5] border border-transparent rounded-full py-1.5 pl-4 pr-10 text-xs text-[#222222] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 transition-all font-semibold"
              />
              <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B8212E] transition-colors">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Suggestions Overlay Dropdown */}
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-none py-2 z-50 text-xs animate-scale-in">
                {loadingSuggestions ? (
                  <div className="px-4 py-2 text-gray-400 font-semibold">Searching database...</div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-2 text-gray-400 font-semibold">No results match query</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {suggestions.map((item) => (
                      <Link
                        key={item.id}
                        href={`/items/${item.id}`}
                        onClick={() => {
                          setShowSuggestions(false)
                          setSearchQuery(item.title)
                        }}
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-[#B8212E] font-bold truncate transition-colors"
                      >
                        <span className="inline-block text-[8px] uppercase tracking-wider font-extrabold text-[#B8212E] mr-1.5 border border-[#B8212E]/20 px-1 rounded-sm bg-[#B8212E]/5">
                          {item.resource_type}
                        </span>
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* Category Dropdown 1: Careers */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown('careers')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="text-xs font-bold text-gray-600 hover:text-[#B8212E] flex items-center gap-0.5 cursor-pointer transition-colors">
                <Briefcase className="w-3.5 h-3.5" />
                Careers
                <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'careers' && (
                <div className="absolute left-0 mt-0 w-44 bg-white border border-gray-150 rounded-none shadow-lg py-1.5 z-50 animate-scale-in">
                  <Link href="/scholarships" prefetch={false} className="block px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#B8212E] font-bold transition-all">
                    Scholarships
                  </Link>
                  <Link href="/jobs" prefetch={false} className="block px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#B8212E] font-bold transition-all">
                    Jobs & Internships
                  </Link>
                </div>
              )}
            </div>

            {/* Standalone Software Link */}
            <Link href="/software" prefetch={false} className="text-xs font-bold text-gray-600 hover:text-[#B8212E] transition-colors flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              Apps & Software
            </Link>

            {/* Standalone Prep Link */}
            <Link href="/prep" prefetch={false} className="text-xs font-bold text-gray-600 hover:text-[#B8212E] transition-colors flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5" />
              MCQ Prep
            </Link>

            {/* Standalone Services Link */}
            <Link href="/services" prefetch={false} className="text-xs font-bold text-gray-600 hover:text-[#B8212E] transition-colors flex items-center gap-1">
              <Hammer className="w-3.5 h-3.5" />
              Services
            </Link>

            {/* Standalone Track Order Link */}
            <Link href="/track" prefetch={false} className="text-xs font-bold text-gray-600 hover:text-[#B8212E] transition-colors flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Track Order
            </Link>

            {/* Category Dropdown 2: Blog & Guidelines */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown('blog')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="text-xs font-bold text-gray-600 hover:text-[#B8212E] flex items-center gap-0.5 cursor-pointer transition-colors">
                <Newspaper className="w-3.5 h-3.5" />
                Blog
                <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'blog' && (
                <div className="absolute left-0 mt-0 w-44 bg-white border border-gray-150 rounded-none shadow-lg py-1.5 z-50 animate-scale-in">
                  <Link href="/blog" prefetch={false} className="block px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#B8212E] font-bold transition-all">
                    Blog Updates
                  </Link>
                  {customPages.map(page => (
                    <Link
                      key={page.slug}
                      href={`/p/${page.slug}`}
                      prefetch={false}
                      className="block px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#B8212E] font-bold transition-all"
                    >
                      {page.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-500 transition-colors">
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}

          </div>

          {/* User Controls and Widgets (Right) */}
          <div className="flex items-center gap-3">
            
            {/* Dark Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              className="hidden sm:block p-2 rounded-full border border-gray-200 text-gray-500 hover:text-[#B8212E] hover:border-[#B8212E]/30 transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Live Notifications Bell Dropdown */}
            <div ref={notificationsRef} className="hidden sm:block relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications)
                }}
                className="p-2 rounded-full border border-gray-200 text-gray-500 hover:text-[#B8212E] hover:border-[#B8212E]/30 relative transition-all cursor-pointer"
                title="Notifications Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#B8212E] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white border border-gray-200 shadow-xl rounded-none py-2.5 z-50 text-xs animate-scale-in">
                  <div className="px-4 pb-2 border-b border-gray-100 flex justify-between items-center text-[10px] uppercase tracking-wider font-extrabold text-gray-450">
                    <span>Recent Updates</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#B8212E]" />
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-4 text-center text-gray-400 font-semibold">No new alerts</div>
                  ) : (
                    <>
                      <div className="divide-y divide-gray-150 max-h-[300px] overflow-y-auto">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="p-3 hover:bg-gray-50 space-y-1 font-semibold text-gray-650 transition-colors">
                            <h4 className="font-bold text-gray-800">{notif.title}</h4>
                            <p className="text-[10px] text-gray-400 leading-normal">{notif.message}</p>
                            {notif.link && (
                              <Link
                                href={notif.link}
                                onClick={() => setShowNotifications(false)}
                                className="text-[9px] font-bold text-[#B8212E] hover:underline flex items-center gap-0.5 mt-1"
                              >
                                Check Details &rarr;
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="p-2 border-t border-gray-100 bg-gray-50">
                        <button 
                          onClick={() => {
                            const dismissed = JSON.parse(localStorage.getItem('dismissed_notifications') || '[]')
                            const newDismissed = [...dismissed, ...notifications.map(n => n.id)]
                            localStorage.setItem('dismissed_notifications', JSON.stringify(newDismissed))
                            setNotifications([])
                            setUnreadCount(0)
                            setShowNotifications(false)
                          }}
                          className="w-full py-1.5 text-center text-[10px] font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Widget */}
            <Link href="/cart" className="relative p-2 rounded-full border border-gray-200 text-gray-500 hover:text-[#B8212E] hover:border-[#B8212E]/30 transition-all flex items-center">
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#B8212E] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-1 px-4.5 py-1.5 rounded-full border border-gray-200 hover:border-[#B8212E]/30 text-xs font-bold text-gray-650 hover:text-[#B8212E] shadow-sm transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  Library
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full border border-gray-200 text-gray-500 hover:text-[#B8212E] hover:border-[#B8212E]/30 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex px-4.5 py-1.5 bg-[#B8212E] hover:bg-[#D62636] text-white text-xs font-bold rounded-full shadow-sm shadow-[#B8212E]/10 hover:shadow-md transition-all items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-gray-200 text-gray-500 hover:text-[#B8212E] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-150 bg-white px-4 pt-4 pb-6 space-y-4 shadow-inner">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search website..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-xs text-[#222222] focus:outline-none focus:border-[#B8212E]"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick settings row at the top of the menu */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:text-[#B8212E] cursor-pointer"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {session ? (
              <div className="flex gap-2">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  prefetch={false}
                  className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700"
                >
                  Library
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-500 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                prefetch={false}
                className="px-4 py-1.5 bg-[#B8212E] hover:bg-[#D62636] text-white text-xs font-bold rounded-full shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-2 text-xs font-bold text-gray-650">
            <div className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold pb-0.5 border-b border-gray-100 mb-1">Directories</div>

            {/* Careers collapsible group */}
            <details className="group border-b border-gray-100 pb-2">
              <summary className="flex items-center justify-between py-1.5 cursor-pointer hover:text-[#B8212E] select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2 text-gray-600 hover:text-[#B8212E]">
                  <Briefcase className="w-4 h-4 text-[#B8212E]" /> Careers
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="pl-6 flex flex-col gap-2 mt-1.5 pb-1">
                <Link href="/scholarships" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#B8212E] py-1 block text-gray-500 font-semibold">
                  Scholarships
                </Link>
                <Link href="/jobs" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#B8212E] py-1 block text-gray-500 font-semibold">
                  Jobs & Internships
                </Link>
              </div>
            </details>

            {/* Standalone Software Link */}
            <Link href="/software" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#B8212E] py-2.5 border-b border-gray-100 flex items-center gap-2 text-gray-600 font-bold">
              <Download className="w-4 h-4 text-[#B8212E]" /> Apps & Software
            </Link>

            {/* Standalone Prep Link */}
            <Link href="/prep" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#B8212E] py-2.5 border-b border-gray-100 flex items-center gap-2 text-gray-600 font-bold">
              <BookMarked className="w-4 h-4 text-[#B8212E]" /> MCQ Prep
            </Link>

            {/* Standalone Services Link */}
            <Link href="/services" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#B8212E] py-2.5 border-b border-gray-100 flex items-center gap-2 text-gray-600 font-bold">
              <Hammer className="w-4 h-4 text-[#B8212E]" /> Services
            </Link>

            {/* Standalone Track Order Link */}
            <Link href="/track" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#B8212E] py-2.5 border-b border-gray-100 flex items-center gap-2 text-gray-600 font-bold">
              <Clock className="w-4 h-4 text-[#B8212E]" /> Track Order
            </Link>

            {/* Blog collapsible group (Info pages inside) */}
            <details className="group border-b border-gray-100 pb-2">
              <summary className="flex items-center justify-between py-1.5 cursor-pointer hover:text-[#B8212E] select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2 text-gray-600 hover:text-[#B8212E]">
                  <Newspaper className="w-4 h-4 text-[#B8212E]" /> Blog
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="pl-6 flex flex-col gap-2 mt-1.5 pb-1">
                <Link href="/blog" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#B8212E] py-1 block text-gray-500 font-semibold">
                  Blog Updates
                </Link>
                {customPages.map(page => (
                  <Link 
                    key={page.slug}
                    href={`/p/${page.slug}`} 
                    onClick={() => setMobileMenuOpen(false)} 
                    prefetch={false}
                    className="hover:text-[#B8212E] py-1 block text-gray-400 font-medium"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      )}
    </nav>
  )
}
