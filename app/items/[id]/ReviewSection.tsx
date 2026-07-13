'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star, MessageSquare, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

interface ReviewSectionProps {
  itemId: string
  hasPurchased: boolean
}

export default function ReviewSection({ itemId, hasPurchased }: ReviewSectionProps) {
  const supabase = createClient()

  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Submit Form States
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(name)')
        .eq('item_id', itemId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error('Fetch Reviews Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [itemId])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setSubmitStatus('loading')
    setSubmitMessage('')

    try {
      const res = await fetch('/api/items/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, rating, comment: comment.trim() })
      })

      const data = await res.json()
      if (data.error) {
        setSubmitStatus('error')
        setSubmitMessage(data.error)
      } else {
        setSubmitStatus('success')
        setSubmitMessage(data.message || 'Review submitted successfully!')
        setComment('')
        fetchReviews()
      }
    } catch (err: any) {
      setSubmitStatus('error')
      setSubmitMessage('Failed to submit review. Check network connection.')
    }
  }

  // Calculate Average Rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0

  return (
    <div className="border-t border-gray-150 pt-12 mt-12 space-y-8 text-[#222222]">
      
      {/* Header and Average Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#B8212E]" />
            Student Reviews ({reviews.length})
          </h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Read feedback or share your study experience with this material.</p>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 w-fit">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-700">
              {averageRating.toFixed(1)} / 5.0
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Review Submission Form (if unlocked) */}
        <div className="lg:col-span-5 space-y-4">
          {hasPurchased ? (
            <div className="bg-[#f8fafc] border border-gray-250/80 p-5 space-y-4 rounded-none">
              <div>
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Leave feedback review</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Your rating will help other students.</p>
              </div>

              {submitStatus === 'success' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-none text-xs font-semibold flex items-center gap-2 animate-scale-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{submitMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-bold text-gray-550">
                  
                  {/* Interactive Star Inputs */}
                  <div className="space-y-1">
                    <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-400">Your Rating</label>
                    <div className="flex items-center gap-1 text-gray-300">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              (hoverRating !== null ? star <= hoverRating : star <= rating)
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-1">
                    <label className="block text-[8px] uppercase tracking-wider font-bold text-gray-400">Review details</label>
                    <textarea
                      rows={4}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts on content quality, examples clarity, or download configurations..."
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-[#B8212E] resize-none font-semibold"
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-semibold rounded-none flex items-center gap-1.5 animate-scale-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{submitMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="w-full py-2.5 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitStatus === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 text-gray-400 text-center text-xs rounded-none">
              Only verified buyers of this resource can write reviews.
            </div>
          )}
        </div>

        {/* Right: Review List */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="py-8 text-center text-xs text-gray-450">Loading reviews database...</div>
          ) : reviews.length === 0 ? (
            <div className="py-12 bg-gray-50 border border-gray-200 border-dashed text-center text-gray-400 text-xs rounded-none flex flex-col items-center justify-center p-6">
              <Star className="w-8 h-8 mb-2 opacity-30 text-gray-500" />
              <h4 className="font-bold text-gray-650">No Reviews Yet</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Be the first to review this resource after purchase.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-white border border-gray-200 rounded-none space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-800 text-xs">{rev.profiles?.name || 'Student'}</span>
                      <span className="text-[10px] text-gray-400 font-semibold block sm:inline sm:ml-2">
                        {new Date(rev.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-250'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed font-semibold whitespace-pre-line">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
