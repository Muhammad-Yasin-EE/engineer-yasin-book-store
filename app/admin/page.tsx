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
  
  // Tabs: 'orders' | 'books'
  const [activeTab, setActiveTab] = useState<'orders' | 'books'>('orders')
  
  // Data lists
  const [orders, setOrders] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  
  // Loading states
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingBooks, setLoadingBooks] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null) // holds orderId being processed
  
  // Form states for Book Add/Edit
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
  
  // Rejection prompts
  const [rejectionOrderId, setRejectionOrderId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  // Fetch orders
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

  // Fetch books
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

  // Verify Order API trigger
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
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'verified' } : o))
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  // Open Rejection dialogue
  const startRejection = (orderId: string) => {
    setRejectionOrderId(orderId)
    setRejectionReason('')
  }

  // Submit Rejection API trigger
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
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === currentOrderId ? { ...o, status: 'rejected' } : o))
    } catch (err: any) {
      alert(`Rejection failed: ${err.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  // Delete Book DML
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

  // Setup Book Edit modal
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

  // Setup Book Add modal
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

  // Submit Book Add/Edit form
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

    // Require file inputs on brand-new books
    if (!editingBookId && !bookFile) {
      setFormError('Please upload the book PDF/EPUB document file.')
      return
    }

    setFormSubmitting(true)

    try {
      let finalCoverUrl = existingCoverUrl
      let finalFilePath = existingFilePath

      // 1. Upload Cover if selected
      if (coverFile) {
        const ext = coverFile.name.split('.').pop()
        const path = `covers/${Date.now()}.${ext}`
        const { error: coverErr } = await supabase.storage.from('book-covers').upload(path, coverFile, { upsert: true })
        if (coverErr) throw new Error(`Cover upload error: ${coverErr.message}`)
        
        // Public file access URL
        finalCoverUrl = `${supabase.storage.from('book-covers').getPublicUrl(path).data.publicUrl}`
      }

      // 2. Upload Book Document if selected
      if (bookFile) {
        const ext = bookFile.name.split('.').pop()
        const bucket = type === 'free' ? 'free-books' : 'premium-books'
        const prefix = type === 'free' ? 'free' : 'premium'
        const path = `${prefix}/${Date.now()}.${ext}`
        
        const { error: docErr } = await supabase.storage.from(bucket).upload(path, bookFile, { upsert: true })
        if (docErr) throw new Error(`Document upload error: ${docErr.message}`)
        
        finalFilePath = path
      }

      // 3. Save details to PostgreSQL
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

      // Refresh list and close
      fetchBooks()
      setShowBookModal(false)
    } catch (err: any) {
      console.error(err)
      setFormError(err.message || 'Database write failure.')
    } finally {
      setFormSubmitting(false)
    }
  }

  // Get Payment proof URL for visual review
  const getProofUrl = (path: string) => {
    return `${supabase.storage.from('payment-proofs').getPublicUrl(path).data.publicUrl}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow bg-slate-950 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-amber-500" />
            Admin Operations Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your books catalog database and verify manual bank/wallet transfer receipts.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-[#0c1324] border border-slate-800 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Manual Orders ({orders.filter(o => o.status === 'payment_submitted').length} pending)
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'books'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
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
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Submitted Verification Requests</h2>
            <button 
              onClick={fetchOrders}
              disabled={loadingOrders}
              className="p-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingOrders ? (
            <div className="py-20 text-center text-slate-500 text-sm">Loading orders database...</div>
          ) : orders.length === 0 ? (
            <div className="py-16 bg-[#0c1324]/20 border border-slate-900 rounded-3xl flex flex-col items-center justify-center text-slate-500 text-center px-4">
              <span className="text-3xl mb-2">🎉</span>
              <h4 className="text-sm font-bold text-slate-400">All caught up</h4>
              <p className="text-xs text-slate-500 mt-0.5">No client orders have been submitted for verification yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className={`p-6 rounded-3xl border bg-[#0d1324]/30 flex flex-col lg:flex-row gap-6 transition-colors ${
                    order.status === 'payment_submitted' 
                      ? 'border-indigo-500/20 shadow-lg shadow-indigo-950/10 bg-[#0d1324]/50' 
                      : 'border-slate-900'
                  }`}
                >
                  {/* Screenshot Display */}
                  <div className="shrink-0 w-full lg:w-48 aspect-[3/4] bg-slate-950 rounded-2xl overflow-hidden border border-slate-850 flex items-center justify-center relative group">
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
                          className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs text-indigo-400 font-semibold gap-1"
                        >
                          <ExternalLink className="w-5 h-5 text-white" />
                          View Full Size
                        </a>
                      </>
                    ) : (
                      <span className="text-xs text-slate-600 font-mono">No Receipt Screenshot</span>
                    )}
                  </div>

                  {/* Order metadata and buyer details */}
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500">ID: {order.id}</span>
                        <h3 className="font-bold text-slate-200 text-sm sm:text-base">
                          {order.profiles?.name || 'Customer Account'} 
                          <span className="text-xs text-slate-400 font-normal ml-1.5">({order.profiles?.email})</span>
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-850 text-slate-400">
                          {order.payment_method}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-400">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Transaction ID</span>
                        <span className="font-mono text-slate-200 font-bold tracking-wider">{order.transaction_ref || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Total price</span>
                        <span className="text-slate-200 font-bold">${order.total_price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Submitted Date</span>
                        <span className="text-slate-300">
                          {new Date(order.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Items details */}
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-900 space-y-2">
                      <span className="block text-[10px] uppercase font-bold text-slate-500">Purchased Books</span>
                      <div className="text-xs text-slate-300 space-y-1.5">
                        {order.order_items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between border-b border-slate-900/40 pb-1 last:border-0 last:pb-0 gap-2">
                            <span>{item.books?.title || 'Ebook document'} <span className="text-[10px] text-slate-500 font-normal">(by {item.books?.author})</span></span>
                            <span className="font-semibold text-slate-200 shrink-0">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Approve / Reject Controls */}
                    {order.status === 'payment_submitted' && (
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          onClick={() => handleVerifyOrder(order.id)}
                          disabled={actionLoading !== null}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          Verify & Unlock
                        </button>
                        <button
                          onClick={() => startRejection(order.id)}
                          disabled={actionLoading !== null}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
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
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Manage Bookstore Books ({books.length})</h2>
            <button
              onClick={openAddBook}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs hover:-translate-y-0.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              Add New Book
            </button>
          </div>

          {loadingBooks ? (
            <div className="py-20 text-center text-slate-500 text-sm">Loading books catalog...</div>
          ) : books.length === 0 ? (
            <div className="py-12 bg-[#0c1324]/20 border border-slate-900 rounded-3xl text-center text-slate-500 text-xs">
              No books found in the catalog database. Click "Add New Book" to begin.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.map((book) => (
                <div 
                  key={book.id}
                  className="p-4 bg-[#0c1324]/30 border border-slate-900 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="truncate flex items-center gap-3">
                    <div className="w-10 h-13 rounded bg-slate-950 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center text-[7px] text-center p-1 font-extrabold text-slate-500">
                      {book.cover_url ? <img src={book.cover_url} className="w-full h-full object-cover" /> : 'NO COVER'}
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-slate-200 text-sm truncate hover:text-white">{book.title}</h4>
                      <p className="text-xs text-slate-400 truncate">by {book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-slate-900 text-slate-450 border border-slate-850 px-1.5 py-0.5 rounded uppercase font-bold truncate max-w-[120px]">
                          {book.category}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${book.type === 'free' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                          {book.type === 'free' ? 'FREE' : `$${book.price}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditBook(book)}
                      className="p-2 border border-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/5 transition-colors cursor-pointer"
                      title="Edit Book details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-2 border border-slate-800 text-slate-500 hover:text-rose-450 rounded-lg hover:bg-rose-500/5 transition-colors cursor-pointer"
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

      {/* DIALOG 1: BOOK ADD / EDIT DIALOG MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1324] border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowBookModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-200">
                {editingBookId ? 'Edit Book Details' : 'Add New Book to Catalog'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Please provide correct details and upload files to storage.</p>
            </div>

            {formError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBook} className="space-y-4 text-xs font-semibold text-slate-400">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">Book Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-xs"
                    placeholder="e.g. Mastering Next.js 15"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">Author Name</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-xs"
                    placeholder="e.g. Lee Robinson"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">Category</label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-xs"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">Pricing Mode</label>
                  <div className="flex bg-slate-950 border border-slate-850 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setType('free')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${type === 'free' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                    >
                      FREE
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('premium')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${type === 'premium' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                    >
                      PREMIUM (PAID)
                    </button>
                  </div>
                </div>
              </div>

              {type === 'premium' && (
                <div className="space-y-1 w-full sm:w-1/2">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required={type === 'premium'}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-xs resize-none"
                  placeholder="Summarize book contents, target audience, format sizes..."
                />
              </div>

              {/* Upload cover file */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">Cover Image</label>
                  <div className="relative border border-dashed border-slate-800 rounded-xl p-3 bg-slate-950/60 hover:bg-slate-950 flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) setCoverFile(e.target.files[0])
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-4 h-4 text-slate-500 mb-1" />
                    <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[200px]">
                      {coverFile ? coverFile.name : existingCoverUrl ? 'Keep Existing Cover' : 'Upload Cover Image'}
                    </span>
                    <span className="text-[8px] text-slate-600">JPG/PNG</span>
                  </div>
                </div>

                {/* Upload PDF/EPUB file */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">Book File Document</label>
                  <div className="relative border border-dashed border-slate-800 rounded-xl p-3 bg-slate-950/60 hover:bg-slate-950 flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px]">
                    <input
                      type="file"
                      accept=".pdf,.epub"
                      required={!editingBookId}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) setBookFile(e.target.files[0])
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-4 h-4 text-slate-500 mb-1" />
                    <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[200px]">
                      {bookFile ? bookFile.name : existingFilePath ? 'Keep Existing File' : 'Upload Document'}
                    </span>
                    <span className="text-[8px] text-slate-600">PDF or EPUB formats</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 border border-slate-850 hover:bg-slate-900 text-slate-300 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1324] border border-slate-850 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl relative">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Rejection Reason</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Please explain why the payment receipt was rejected. This text will be emailed to the client.</p>
            </div>

            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none font-medium"
              placeholder="e.g. Transaction ID was not found in our JazzCash ledger / Image uploaded was blurry..."
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectionOrderId(null)}
                className="px-3.5 py-1.5 border border-slate-850 hover:bg-slate-900 text-slate-400 font-semibold rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-xs cursor-pointer"
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
