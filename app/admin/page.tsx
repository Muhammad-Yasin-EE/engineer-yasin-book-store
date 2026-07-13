'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import { ShieldCheck, ShieldAlert, Layers, BookMarked, Plus, Edit, Trash2, Check, X, Upload, ExternalLink, RefreshCw } from 'lucide-react'

// Hardcoded list of 25 categories as requested
const CATEGORIES = [
  "Academic Books", "Test Preparation", "Programming Books", "AI Books", "Engineering Books", 
  "Mathematics", "Science & Technology", "Medical Books", "Language Learning", "Story Books", 
  "Kids' Books", "Fairy Tales", "Short Stories", "Fiction", "Classic Literature", 
  "History", "Business & Finance", "Arts & Design", "Islamic Books", "Self Improvement", 
  "Magazines", "Research Papers", "New Arrivals", "Popular Books", "All Books"
]

export default function AdminDashboard() {
  const supabase = createClient()
  
  const [activeTab, setActiveTab] = useState<'orders' | 'books'>('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingBooks, setLoadingBooks] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  const [showBookModal, setShowBookModal] = useState(false)
  const [editingBookId, setEditingBookId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Programming Books')
  const [type, setType] = useState<'free' | 'premium'>('free')
  const [price, setPrice] = useState('0.00')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [bookFile, setBookFile] = useState<File | null>(null)
  const [existingCoverUrl, setExistingCoverUrl] = useState('')
  const [existingFilePath, setExistingFilePath] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  
  const [rejectionOrderId, setRejectionOrderId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(email, name), order_items(*, books(*))')
        .order('created_at', { ascending: false })
      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error('Fetch Orders Error:', err)
    } finally {
      setLoadingOrders(false)
    }
  }

  const fetchBooks = async () => {
    setLoadingBooks(true)
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setBooks(data || [])
    } catch (err) {
      console.error('Fetch Books Error:', err)
    } finally {
      setLoadingBooks(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchBooks()
  }, [])

  const handleVerifyOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to verify this manual transfer? The buyer will receive confirmation links.')) return
    setActionLoading(orderId)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: 'verify' })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'verified' } : o))
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const startRejection = (orderId: string) => {
    setRejectionOrderId(orderId)
    setRejectionReason('')
  }

  const handleRejectOrder = async () => {
    if (!rejectionOrderId) return
    setActionLoading(rejectionOrderId)
    const currentOrderId = rejectionOrderId
    setRejectionOrderId(null)

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: currentOrderId, 
          action: 'reject', 
          rejectionReason: rejectionReason.trim() || undefined 
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setOrders(prev => prev.map(o => o.id === currentOrderId ? { ...o, status: 'rejected' } : o))
    } catch (err: any) {
      alert(`Rejection failed: ${err.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book? This will break download links for past purchases.')) return
    try {
      const { error } = await supabase.from('books').delete().eq('id', id)
      if (error) throw error
      setBooks(prev => prev.filter(b => b.id !== id))
    } catch (err: any) {
      alert(`Failed to delete book: ${err.message}`)
    }
  }

  const openEditBook = (book: any) => {
    setEditingBookId(book.id)
    setTitle(book.title)
    setAuthor(book.author)
    setDescription(book.description || '')
    setCategory(book.category)
    setType(book.type)
    setPrice(book.price.toString())
    setExistingCoverUrl(book.cover_url || '')
    setExistingFilePath(book.file_path || '')
    setCoverFile(null)
    setBookFile(null)
    setFormError(null)
    setShowBookModal(true)
  }

  const openAddBook = () => {
    setEditingBookId(null)
    setTitle('')
    setAuthor('')
    setDescription('')
    setCategory('Programming Books')
    setType('free')
    setPrice('0.00')
    setExistingCoverUrl('')
    setExistingFilePath('')
    setCoverFile(null)
    setBookFile(null)
    setFormError(null)
    setShowBookModal(true)
  }

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!title.trim() || !author.trim() || !category) {
      setFormError('Please fill out Title, Author, and Category.')
      return
    }

    if (type === 'premium' && parseFloat(price) <= 0) {
      setFormError('Premium books must have a price greater than 0.')
      return
    }

    if (!editingBookId && !bookFile) {
      setFormError('Please upload the book PDF/EPUB document file.')
      return
    }

    setFormSubmitting(true)

    try {
      let finalCoverUrl = existingCoverUrl
      let finalFilePath = existingFilePath

      if (coverFile) {
        const ext = coverFile.name.split('.').pop()
        const path = `covers/${Date.now()}.${ext}`
        const { error: coverErr } = await supabase.storage.from('book-covers').upload(path, coverFile, { upsert: true })
        if (coverErr) throw new Error(`Cover upload error: ${coverErr.message}`)
        finalCoverUrl = `${supabase.storage.from('book-covers').getPublicUrl(path).data.publicUrl}`
      }

      if (bookFile) {
        const ext = bookFile.name.split('.').pop()
        const bucket = type === 'free' ? 'free-books' : 'premium-books'
        const prefix = type === 'free' ? 'free' : 'premium'
        const path = `${prefix}/${Date.now()}.${ext}`
        
        const { error: docErr } = await supabase.storage.from(bucket).upload(path, bookFile, { upsert: true })
        if (docErr) throw new Error(`Document upload error: ${docErr.message}`)
        finalFilePath = path
      }

      const bookData = {
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
        category,
        type,
        price: type === 'free' ? 0.00 : parseFloat(price),
        cover_url: finalCoverUrl,
        file_path: finalFilePath
      }

      if (editingBookId) {
        const { error: updateErr } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', editingBookId)
        if (updateErr) throw updateErr
      } else {
        const { error: insertErr } = await supabase
          .from('books')
          .insert(bookData)
        if (insertErr) throw insertErr
      }

      fetchBooks()
      setShowBookModal(false)
    } catch (err: any) {
      console.error(err)
      setFormError(err.message || 'Database write failure.')
    } finally {
      setFormSubmitting(false)
    }
  }

  const getProofUrl = (path: string) => {
    return `${supabase.storage.from('payment-proofs').getPublicUrl(path).data.publicUrl}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow bg-white text-[#222222] space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-150 pb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#B8212E]" />
            Admin Operations Panel
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage your books catalog database and verify manual bank/wallet transfer receipts.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-gray-50 border border-gray-200 rounded-full p-1 shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#B8212E] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            Manual Orders ({orders.filter(o => o.status === 'payment_submitted').length} pending)
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'books'
                ? 'bg-[#B8212E] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            Books Catalog ({books.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: MANUAL PAYMENTS ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-xs font-bold text-gray-450 uppercase tracking-widest">Submitted Verification Requests</h2>
            <button 
              onClick={fetchOrders}
              disabled={loadingOrders}
              className="p-2 border border-gray-250 hover:bg-gray-50 rounded-full text-gray-500 hover:text-[#B8212E] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingOrders ? (
            <div className="py-20 text-center text-gray-500 text-sm">Loading orders database...</div>
          ) : orders.length === 0 ? (
            <div className="py-16 bg-gray-50 border border-gray-200 rounded-none flex flex-col items-center justify-center text-gray-400 text-center px-4">
              <span className="text-3xl mb-2">🎉</span>
              <h4 className="text-sm font-bold text-gray-650">All caught up</h4>
              <p className="text-xs text-gray-400 mt-0.5">No client orders have been submitted for verification yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className={`p-6 rounded-none border flex flex-col lg:flex-row gap-6 transition-colors ${
                    order.status === 'payment_submitted' 
                      ? 'border-[#B8212E]/30 bg-white hover:border-[#B8212E]/50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Screenshot Display (Sharp corners) */}
                  <div className="shrink-0 w-full lg:w-48 aspect-[3/4] bg-gray-50 rounded-none overflow-hidden border border-gray-200 flex items-center justify-center relative group">
                    {order.proof_image_url ? (
                      <>
                        <img 
                          src={getProofUrl(order.proof_image_url)} 
                          alt="Payment Receipt screenshot" 
                          className="w-full h-full object-cover" 
                        />
                        <a 
                          href={getProofUrl(order.proof_image_url)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="absolute inset-0 bg-[#B8212E]/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs text-white font-bold gap-1"
                        >
                          <ExternalLink className="w-5 h-5 text-white" />
                          View Full Size
                        </a>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 font-mono">No Receipt Screenshot</span>
                    )}
                  </div>

                  {/* Order metadata and buyer details */}
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[9px] font-mono text-gray-400 font-bold">ID: {order.id}</span>
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                          {order.profiles?.name || 'Customer Account'} 
                          <span className="text-xs text-gray-400 font-normal ml-1.5">({order.profiles?.email})</span>
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase bg-gray-50 px-2.5 py-1 rounded border border-gray-200 text-gray-500 font-bold">
                          {order.payment_method}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-555">
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">Transaction ID</span>
                        <span className="font-mono text-gray-800 font-bold tracking-wider">{order.transaction_ref || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">Total price</span>
                        <span className="text-[#B8212E] font-bold">Rs. {order.total_price.toFixed(0)}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">Submitted Date</span>
                        <span className="text-gray-600">
                          {new Date(order.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Items details */}
                    <div className="bg-gray-50 p-4 rounded-none border border-gray-200 space-y-2">
                      <span className="block text-[9px] uppercase font-bold text-gray-400">Purchased Books</span>
                      <div className="text-xs text-gray-700 space-y-1.5">
                        {order.order_items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between border-b border-gray-150 pb-1 last:border-0 last:pb-0 gap-2 font-semibold">
                            <span>{item.books?.title || 'Ebook document'} <span className="text-[10px] text-gray-400 font-normal">(by {item.books?.author})</span></span>
                            <span className="font-bold text-gray-800 shrink-0">Rs. {item.price.toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Approve / Reject Controls (Pill buttons) */}
                    {order.status === 'payment_submitted' && (
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          onClick={() => handleVerifyOrder(order.id)}
                          disabled={actionLoading !== null}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          Verify & Unlock
                        </button>
                        <button
                          onClick={() => startRejection(order.id)}
                          disabled={actionLoading !== null}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          Reject Transfer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: BOOKS CATALOG CRUD MANAGER */}
      {activeTab === 'books' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-150 pb-4">
            <h2 className="text-xs font-bold text-gray-450 uppercase tracking-widest">Manage Bookstore Books ({books.length})</h2>
            <button
              onClick={openAddBook}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-5 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-xs hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Book
            </button>
          </div>

          {loadingBooks ? (
            <div className="py-20 text-center text-gray-500 text-sm">Loading books catalog...</div>
          ) : books.length === 0 ? (
            <div className="py-12 bg-gray-50 border border-gray-200 rounded-none text-center text-gray-400 text-xs">
              No books found in the catalog database. Click "Add New Book" to begin.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.map((book) => (
                <div 
                  key={book.id}
                  className="p-4 bg-white border border-gray-200 rounded-none flex items-center justify-between gap-4"
                >
                  <div className="truncate flex items-center gap-3">
                    <div className="w-10 h-13 rounded-none bg-gray-50 border border-gray-250 shrink-0 overflow-hidden flex items-center justify-center text-[7px] text-center p-1 font-extrabold text-gray-400">
                      {book.cover_url ? <img src={book.cover_url} className="w-full h-full object-cover" /> : 'NO COVER'}
                    </div>
                    <div className="truncate font-semibold text-gray-600">
                      <h4 className="font-bold text-gray-800 text-sm truncate hover:text-[#B8212E]">{book.title}</h4>
                      <p className="text-xs text-gray-550 truncate">by {book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-gray-50 text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-none uppercase font-bold truncate max-w-[120px]">
                          {book.category}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-none font-mono font-bold ${book.type === 'free' ? 'bg-emerald-50 text-emerald-650' : 'bg-red-50 text-[#B8212E]'}`}>
                          {book.type === 'free' ? 'FREE' : `Rs. ${book.price}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditBook(book)}
                      className="p-2 border border-gray-200 text-gray-450 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors cursor-pointer"
                      title="Edit Book details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-2 border border-gray-200 text-gray-450 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DIALOG 1: BOOK ADD / EDIT DIALOG MODAL (Clean white background, pill inputs) */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-250 rounded-none w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowBookModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {editingBookId ? 'Edit Book Details' : 'Add New Book to Catalog'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Please provide correct details and upload files to storage.</p>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-none flex gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBook} className="space-y-4 text-xs font-bold text-gray-500">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Book Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 text-xs font-semibold"
                    placeholder="e.g. Mastering Next.js 15"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Author Name</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 text-xs font-semibold"
                    placeholder="e.g. Lee Robinson"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Category</label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 text-xs font-semibold"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Pricing Mode</label>
                  <div className="flex bg-gray-50 border border-gray-200 rounded-full p-1">
                    <button
                      type="button"
                      onClick={() => setType('free')}
                      className={`flex-1 py-1.5 rounded-full font-bold text-xs cursor-pointer ${type === 'free' ? 'bg-[#B8212E] text-white' : 'text-gray-550'}`}
                    >
                      FREE
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('premium')}
                      className={`flex-1 py-1.5 rounded-full font-bold text-xs cursor-pointer ${type === 'premium' ? 'bg-[#B8212E] text-white' : 'text-gray-555'}`}
                    >
                      PREMIUM (PAID)
                    </button>
                  </div>
                </div>
              </div>

              {type === 'premium' && (
                <div className="space-y-1 w-full sm:w-1/2">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Price (PKR)</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required={type === 'premium'}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 font-mono text-xs font-bold"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 text-xs font-semibold resize-none"
                  placeholder="Summarize book contents, format sizes..."
                />
              </div>

              {/* Upload cover file */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Cover Image</label>
                  <div className="relative border border-dashed border-gray-200 rounded-none p-3 bg-gray-50 hover:bg-gray-100/50 flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) setCoverFile(e.target.files[0])
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-[10px] text-gray-600 font-bold truncate max-w-[200px]">
                      {coverFile ? coverFile.name : existingCoverUrl ? 'Keep Existing Cover' : 'Upload Cover Image'}
                    </span>
                    <span className="text-[8px] text-gray-400">JPG/PNG</span>
                  </div>
                </div>

                {/* Upload PDF/EPUB file */}
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Book File Document</label>
                  <div className="relative border border-dashed border-gray-200 rounded-none p-3 bg-gray-50 hover:bg-gray-100/50 flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px]">
                    <input
                      type="file"
                      accept=".pdf,.epub"
                      required={!editingBookId}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) setBookFile(e.target.files[0])
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-[10px] text-gray-600 font-bold truncate max-w-[200px]">
                      {bookFile ? bookFile.name : existingFilePath ? 'Keep Existing File' : 'Upload Document'}
                    </span>
                    <span className="text-[8px] text-gray-400 font-normal">PDF or EPUB formats</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-5 py-2 border border-gray-250 hover:bg-gray-50 text-gray-600 font-bold rounded-full text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {formSubmitting ? 'Saving changes...' : 'Save Book'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DIALOG 2: REJECTION REASON PROMPT */}
      {rejectionOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-250 rounded-none w-full max-w-sm p-6 space-y-4 shadow-2xl relative">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Rejection Reason</h3>
              <p className="text-[11px] text-gray-400 mt-0.5 font-semibold">Please explain why the payment receipt was rejected. This text will be emailed to the client.</p>
            </div>

            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-white border border-gray-250 rounded-xl py-2.5 px-3 text-gray-800 text-xs focus:outline-none focus:border-rose-500 resize-none font-semibold"
              placeholder="e.g. Transaction ID was not found in our JazzCash ledger..."
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectionOrderId(null)}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-550 font-bold rounded-full text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-full text-xs cursor-pointer"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
