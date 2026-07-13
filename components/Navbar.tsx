'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useCart } from '@/lib/context/CartContext'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, ShoppingCart, User, ShieldAlert, LogOut, Search, Menu, X } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cart } = useCart()
  const supabase = createClient()
  
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const q = searchParams.get('search')
    if (q) setSearchQuery(q)

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
        if (profile) {
          setIsAdmin(profile.is_admin)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
        if (profile) {
          setIsAdmin(profile.is_admin)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [searchParams])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/books')
    }
    setMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-150 text-[#222222] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8.5 h-8.5 rounded-full bg-[#B8212E] flex items-center justify-center shadow-sm shadow-[#B8212E]/20 group-hover:scale-105 transition-all">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#222222]">
                Engineer Yasin <span className="text-[#B8212E]">Books</span>
              </span>
            </Link>
          </div>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-md relative">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f5f5f5] border border-transparent rounded-full py-2 pl-4 pr-10 text-sm text-[#222222] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 transition-all"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B8212E] transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/books" className="text-sm font-semibold text-gray-600 hover:text-[#B8212E] transition-colors">
              Browse Books
            </Link>
            
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-500 transition-colors">
                <ShieldAlert className="w-4 h-4" />
                Admin Panel
              </Link>
            )}

            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-[#B8212E] transition-colors flex items-center">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#B8212E] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/account" className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#B8212E] transition-colors">
                  <User className="w-4 h-4" />
                  My Library
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs font-bold bg-[#B8212E] text-white hover:bg-[#D62636] shadow-sm hover:shadow transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-4">
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-[#B8212E] transition-colors flex items-center">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#B8212E] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cart.length}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-[#B8212E] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-150 bg-white px-4 pt-4 pb-6 space-y-4 shadow-inner">
          {/* Search bar - Mobile */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-sm text-[#222222] focus:outline-none focus:border-[#B8212E]"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-3">
            <Link
              href="/books"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-600 hover:text-[#B8212E] py-2 border-b border-gray-100"
            >
              Browse Books
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-semibold text-amber-600 hover:text-amber-500 py-2 border-b border-gray-100"
              >
                <ShieldAlert className="w-5 h-5" />
                Admin Panel
              </Link>
            )}

            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-semibold text-gray-600 hover:text-[#B8212E] py-2 border-b border-gray-100"
                >
                  <User className="w-5 h-5" />
                  My Library
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 text-base font-semibold text-rose-600 hover:text-rose-500 py-2 text-left cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full text-base font-bold bg-[#B8212E] text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
