'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, ExternalLink, ShoppingBag, UserCheck, MessageSquare, X, PlayCircle } from 'lucide-react'
import AddToCartButton from './AddToCartButton'

interface DownloadActionBoxProps {
  item: any
  isLoggedIn: boolean
  hasPurchased: boolean
  freeDownloadUrl: string
}

export default function DownloadActionBox({ item, isLoggedIn, hasPurchased, freeDownloadUrl }: DownloadActionBoxProps) {
  const [showLockModal, setShowLockModal] = useState(false)
  const [pendingUrl, setPendingUrl] = useState('')

  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/GzB2X8wN2dD3B6Z8j9u9d9'

  const handleActionClick = (e: React.MouseEvent<HTMLAnchorElement>, targetUrl: string) => {
    e.preventDefault()
    setPendingUrl(targetUrl)
    setShowLockModal(true)
  }

  const handleUnlockAndProceed = () => {
    // 1. Set joined state in localStorage to prevent global popup prompts
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasJoinedWhatsapp', 'true')
    }

    // 2. Open WhatsApp group link in a new window/tab
    window.open(whatsappUrl, '_blank')

    // 3. Wait a split second, then trigger the original download/redirect URL
    setTimeout(() => {
      window.location.href = pendingUrl
    }, 300)

    // 4. Close the modal
    setShowLockModal(false)
  }

  return (
    <div className="bg-[#f8fafc] border border-gray-200 rounded-none p-6 space-y-4">
      {/* FREE FLOW (Jobs, Scholarships, Internships, free Books, Courses, Software) */}
      {item.type === 'free' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-600 font-bold">
                {item.resource_type === 'scholarship' || item.resource_type === 'job' ? 'Public Resource' : 'Free Resource Access'}
              </span>
              <p className="text-[10px] text-gray-400 font-semibold">
                {item.resource_type === 'scholarship' || item.resource_type === 'job' 
                  ? 'Official application portal.' 
                  : 'No account required. Instant access.'
                }
              </p>
            </div>
            {item.resource_type !== 'scholarship' && item.resource_type !== 'job' && (
              <span className="text-base font-bold text-emerald-600">FREE</span>
            )}
          </div>
          
          {item.resource_type === 'scholarship' || item.resource_type === 'job' ? (
            <a
              href={item.file_path}
              onClick={(e) => handleActionClick(e, item.file_path)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Apply on Official Website
            </a>
          ) : (
            <a
              href={freeDownloadUrl}
              onClick={(e) => handleActionClick(e, freeDownloadUrl)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              {item.resource_type === 'course' ? (
                <>
                  <PlayCircle className="w-4 h-4" />
                  Start Course
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download / Access File
                </>
              )}
            </a>
          )}
        </div>
      )}

      {/* PREMIUM FLOW (Software, Courses, Services, Books) */}
      {item.type === 'premium' && (
        <div className="space-y-4">
          {/* 1. User not logged in */}
          {!isLoggedIn && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#B8212E] font-bold">Premium Purchase</span>
                  <p className="text-[10px] text-gray-400 font-semibold">Sign in to checkout and permanent library access.</p>
                </div>
                <span className="text-xl font-bold text-gray-800">Rs. {item.price.toFixed(0)}</span>
              </div>

              <Link
                href={`/login?redirectTo=/items/${item.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-sm transition-all hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4" />
                Sign In to Purchase
              </Link>
            </div>
          )}

          {/* 2. User logged in & already purchased */}
          {isLoggedIn && hasPurchased && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <UserCheck className="w-4 h-4" />
                  <span className="text-xs">Access unlocked in library</span>
                </div>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded">Unlocked</span>
              </div>

              <a
                href={`/api/download?bookId=${item.id}`}
                onClick={(e) => handleActionClick(e, `/api/download?bookId=${item.id}`)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                {item.resource_type === 'course' ? (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    Access Course Material
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Resource File
                  </>
                )}
              </a>
            </div>
          )}

          {/* 3. User logged in & not purchased */}
          {isLoggedIn && !hasPurchased && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#B8212E] font-bold">Premium Option</span>
                  <p className="text-[10px] text-gray-400 font-semibold">Make payment to unlock in your accounts list.</p>
                </div>
                <span className="text-xl font-bold text-gray-800">Rs. {item.price.toFixed(0)}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <AddToCartButton 
                  item={{
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    price: item.price,
                    cover_url: item.cover_url || '',
                    category: item.category
                  }} 
                  buyNow={true}
                />

                <AddToCartButton 
                  item={{
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    price: item.price,
                    cover_url: item.cover_url || '',
                    category: item.category
                  }} 
                  buyNow={false}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Access Verification Lock Modal Overlay */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-slide-up">
            
            {/* Header */}
            <div className="bg-[#25D366] px-6 py-6 text-white relative">
              <button 
                onClick={() => setShowLockModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-white/85">Verification Required</span>
                  <h3 className="text-lg font-bold">Join WhatsApp Group</h3>
                </div>
              </div>
            </div>

            {/* Contents */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                Step 1 of 1: Join Community
              </p>
              <h4 className="text-sm font-bold text-gray-800">
                Aap ko is resource ko access karne ke liye hamara group join karna hoga:
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Niche green button par click karein. Yeh hamara official WhatsApp Group new tab me open karega aur aap ka download automatically shuru kar dega!
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleUnlockAndProceed}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md transition-all hover:scale-102 active:scale-98 animate-pulse"
                >
                  <MessageSquare className="w-4 h-4" />
                  Join Group & Access File
                </button>
                <button
                  onClick={() => setShowLockModal(false)}
                  className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
