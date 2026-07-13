'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import { ShieldCheck, ShieldAlert, Layers, BookMarked, Plus, Edit, Trash2, Check, X, Upload, ExternalLink, RefreshCw, FileText, Users, Mail } from 'lucide-react'

const CATEGORIES = [
  "Academic Books", "Test Preparation", "Programming Books", "AI Books", "Engineering Books", 
  "Mathematics", "Science & Technology", "Medical Books", "Language Learning", "Story Books", 
  "Kids' Books", "Fairy Tales", "Short Stories", "Fiction", "Classic Literature", 
  "History", "Business & Finance", "Arts & Design", "Islamic Books", "Self Improvement", 
  "Magazines", "Research Papers", "New Arrivals", "Popular Books", "All Books",
  "Undergraduate", "Graduate (Master's)", "PhD & Research",
  "Government Jobs", "Private Jobs", "Internships",
  "Download Software", "Programming", "3D Modeling", "MATLAB & Simulink", "Tutoring", "Courses"
]

const RESOURCE_TYPES = [
  { value: 'book', label: 'Book Store Ebook' },
  { value: 'scholarship', label: 'Scholarship Posting' },
  { value: 'job', label: 'Job / Internship Opening' },
  { value: 'software', label: 'Software Download' },
  { value: 'service', label: 'Professional Service' },
  { value: 'course', label: 'Academic Course' }
]

export default function AdminDashboard() {
  const supabase = createClient()
  
  const [activeTab, setActiveTab] = useState<'orders' | 'items' | 'pages' | 'blog' | 'subscribers'>('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [customPages, setCustomPages] = useState<any[]>([])
  
  // Blog posts states
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loadingBlog, setLoadingBlog] = useState(false)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogSlug, setBlogSlug] = useState('')
  const [blogSummary, setBlogSummary] = useState('')
  const [blogContent, setBlogContent] = useState('')
  const [blogCoverUrl, setBlogCoverUrl] = useState('')
  const [editingBlogPostId, setEditingBlogPostId] = useState<string | null>(null)
  const [blogFormError, setBlogFormError] = useState<string | null>(null)
  const [blogSubmitting, setBlogSubmitting] = useState(false)
  const [showBlogModal, setShowBlogModal] = useState(false)

  // Subscribers states
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loadingSubscribers, setLoadingSubscribers] = useState(false)
  
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingItems, setLoadingItems] = useState(false)
  const [loadingPages, setLoadingPages] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  // Catalog Item CRUD Modal States
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Programming Books')
  const [resourceType, setResourceType] = useState<'book' | 'scholarship' | 'job' | 'software' | 'service' | 'course'>('book')
  const [type, setType] = useState<'free' | 'premium'>('free')
  const [price, setPrice] = useState('0.00')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [docFile, setDocFile] = useState<File | null>(null)
  const [externalUrl, setExternalUrl] = useState('') // For jobs/scholarships URLs
  const [existingCoverUrl, setExistingCoverUrl] = useState('')
  const [existingFilePath, setExistingFilePath] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  
  // Custom Pages CRUD Modal States
  const [showPageModal, setShowPageModal] = useState(false)
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [pageTitle, setPageTitle] = useState('')
  const [pageSlug, setPageSlug] = useState('')
  const [pageContent, setPageContent] = useState('')
  const [pageFormError, setPageFormError] = useState<string | null>(null)
  const [pageSubmitting, setPageSubmitting] = useState(false)
  
  // Rejection Dialog States
  const [rejectionOrderId, setRejectionOrderId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(email, name), order_items(*, items(*))')
        .order('created_at', { ascending: false })
      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error('Fetch Orders Error:', err)
    } finally {
      setLoadingOrders(false)
    }
  }

  const fetchItems = async () => {
    setLoadingItems(true)
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.error('Fetch Items Error:', err)
    } finally {
      setLoadingItems(false)
    }
  }

  const fetchCustomPages = async () => {
    setLoadingPages(true)
    try {
      const { data, error } = await supabase
        .from('custom_pages')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setCustomPages(data || [])
    } catch (err) {
      console.error('Fetch Custom Pages Error:', err)
    } finally {
      setLoadingPages(false)
    }
  }

  const fetchBlogPosts = async () => {
    setLoadingBlog(true)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setBlogPosts(data || [])
    } catch (err) {
      console.error('Fetch Blog Posts Error:', err)
    } finally {
      setLoadingBlog(false)
    }
  }

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true)
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setSubscribers(data || [])
    } catch (err) {
      console.error('Fetch Subscribers Error:', err)
    } finally {
      setLoadingSubscribers(false)
    }
  }

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Delete this blog post? It will go offline instantly.')) return
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
      setBlogPosts(prev => prev.filter(post => post.id !== id))
    } catch (err: any) {
      alert(`Failed to delete post: ${err.message}`)
    }
  }

  const openAddBlogPost = () => {
    setEditingBlogPostId(null)
    setBlogTitle('')
    setBlogSlug('')
    setBlogSummary('')
    setBlogContent('')
    setBlogCoverUrl('')
    setBlogFormError(null)
    setShowBlogModal(true)
  }

  const openEditBlogPost = (post: any) => {
    setEditingBlogPostId(post.id)
    setBlogTitle(post.title)
    setBlogSlug(post.slug)
    setBlogSummary(post.summary)
    setBlogContent(post.content)
    setBlogCoverUrl(post.cover_url || '')
    setBlogFormError(null)
    setShowBlogModal(true)
  }

  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setBlogFormError(null)

    if (!blogTitle.trim() || !blogSlug.trim() || !blogSummary.trim() || !blogContent.trim()) {
      setBlogFormError('Please fill out Title, Slug, Summary, and Content.')
      return
    }

    setBlogSubmitting(true)

    try {
      const postData = {
        title: blogTitle.trim(),
        slug: blogSlug.trim().toLowerCase().replace(/\s+/g, '-'),
        summary: blogSummary.trim(),
        content: blogContent.trim(),
        cover_url: blogCoverUrl.trim() || null,
        updated_at: new Date().toISOString()
      }

      if (editingBlogPostId) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingBlogPostId)
        if (error) throw error
        setBlogPosts(prev => prev.map(p => p.id === editingBlogPostId ? { ...p, ...postData } : p))
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert(postData)
        if (error) throw error
        fetchBlogPosts()
      }

      setShowBlogModal(false)
    } catch (err: any) {
      console.error(err)
      setBlogFormError(err.message || 'Failed to save blog post.')
    } finally {
      setBlogSubmitting(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchItems()
    fetchCustomPages()
    fetchBlogPosts()
    fetchSubscribers()
  }, [])

  const handleVerifyOrder = async (orderId: string) => {
    if (!confirm('Verify manual transfer? This unlocks resource links for the client.')) return
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

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this catalog item? This will break downloads for past buyers.')) return
    try {
      const { error } = await supabase.from('items').delete().eq('id', id)
      if (error) throw error
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err: any) {
      alert(`Failed to delete item: ${err.message}`)
    }
  }

  const handleDeletePage = async (id: string) => {
    if (!confirm('Delete this custom page? It will go offline instantly.')) return
    try {
      const { error } = await supabase.from('custom_pages').delete().eq('id', id)
      if (error) throw error
      setCustomPages(prev => prev.filter(page => page.id !== id))
    } catch (err: any) {
      alert(`Failed to delete page: ${err.message}`)
    }
  }

  const openEditItem = (item: any) => {
    setEditingItemId(item.id)
    setTitle(item.title)
    setAuthor(item.author)
    setDescription(item.description || '')
    setCategory(item.category)
    setResourceType(item.resource_type)
    setType(item.type)
    setPrice(item.price.toString())
    setExistingCoverUrl(item.cover_url || '')
    setExistingFilePath(item.file_path || '')
    
    // Set external URL if job/scholarship
    if (item.resource_type === 'job' || item.resource_type === 'scholarship') {
      setExternalUrl(item.file_path)
    } else {
      setExternalUrl('')
    }
    
    setCoverFile(null)
    setDocFile(null)
    setFormError(null)
    setShowItemModal(true)
  }

  const openAddItem = () => {
    setEditingItemId(null)
    setTitle('')
    setAuthor('')
    setDescription('')
    setCategory('Programming Books')
    setResourceType('book')
    setType('free')
    setPrice('0.00')
    setExistingCoverUrl('')
    setExistingFilePath('')
    setExternalUrl('')
    setCoverFile(null)
    setDocFile(null)
    setFormError(null)
    setShowItemModal(true)
  }

  const openAddPage = () => {
    setEditingPageId(null)
    setPageTitle('')
    setPageSlug('')
    setPageContent('')
    setPageFormError(null)
    setShowPageModal(true)
  }

  const openEditPage = (page: any) => {
    setEditingPageId(page.id)
    setPageTitle(page.title)
    setPageSlug(page.slug)
    setPageContent(page.content)
    setPageFormError(null)
    setShowPageModal(true)
  }

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validation
    if (!title.trim() || !author.trim() || !category) {
      setFormError('Please fill out Title, Provider/Author, and Category.')
      return
    }

    const isLinkRequired = resourceType === 'job' || resourceType === 'scholarship'
    if (isLinkRequired && !externalUrl.trim()) {
      setFormError('Jobs and Scholarships require an application website link URL.')
      return
    }

    if (!isLinkRequired && type === 'premium' && parseFloat(price) <= 0) {
      setFormError('Premium resources must have a price greater than 0.')
      return
    }

    if (!isLinkRequired && !editingItemId && !docFile) {
      setFormError('Please upload the resource document file.')
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

      if (isLinkRequired) {
        finalFilePath = externalUrl.trim()
      } else if (docFile) {
        const ext = docFile.name.split('.').pop()
        const bucket = type === 'free' ? 'free-books' : 'premium-books'
        const prefix = type === 'free' ? 'free' : 'premium'
        const path = `${prefix}/${Date.now()}.${ext}`
        
        const { error: docErr } = await supabase.storage.from(bucket).upload(path, docFile, { upsert: true })
        if (docErr) throw new Error(`File upload error: ${docErr.message}`)
        finalFilePath = path
      }

      const itemData = {
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
        category,
        resource_type: resourceType,
        type: isLinkRequired ? 'free' : type,
        price: (isLinkRequired || type === 'free') ? 0.00 : parseFloat(price),
        cover_url: finalCoverUrl,
        file_path: finalFilePath
      }

      if (editingItemId) {
        const { error: updateErr } = await supabase
          .from('items')
          .update(itemData)
          .eq('id', editingItemId)
        if (updateErr) throw updateErr
      } else {
        const { error: insertErr } = await supabase
          .from('items')
          .insert(itemData)
        if (insertErr) throw insertErr
      }

      fetchItems()
      setShowItemModal(false)
    } catch (err: any) {
      console.error(err)
      setFormError(err.message || 'Database write failure.')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault()
    setPageFormError(null)

    const cleanSlug = pageSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')
    if (!pageTitle.trim() || !cleanSlug || !pageContent.trim()) {
      setPageFormError('All fields are required.')
      return
    }

    setPageSubmitting(true)
    try {
      const pageData = {
        title: pageTitle.trim(),
        slug: cleanSlug,
        content: pageContent.trim()
      }

      if (editingPageId) {
        const { error } = await supabase
          .from('custom_pages')
          .update(pageData)
          .eq('id', editingPageId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('custom_pages')
          .insert(pageData)
        if (error) throw error
      }

      fetchCustomPages()
      setShowPageModal(false)
    } catch (err: any) {
      console.error(err)
      setPageFormError(err.message || 'Failed to save page.')
    } finally {
      setPageSubmitting(false)
    }
  }

  const getProofUrl = (path: string) => {
    return `${supabase.storage.from('payment-proofs').getPublicUrl(path).data.publicUrl}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow bg-white text-[#222222] space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-150 pb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#B8212E]" />
            Admin Operations Panel
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage your courses, software, scholarships, jobs, books, and custom informational pages.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-1 bg-gray-50 border border-gray-200 rounded-full p-1 shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-[#B8212E] text-white shadow-sm' : 'text-gray-550'}`}
          >
            <Layers className="w-4 h-4" />
            Orders ({orders.filter(o => o.status === 'payment_submitted').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === 'items' ? 'bg-[#B8212E] text-white shadow-sm' : 'text-gray-550'}`}
          >
            <BookMarked className="w-4 h-4" />
            Catalog ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === 'pages' ? 'bg-[#B8212E] text-white shadow-sm' : 'text-gray-550'}`}
          >
            <FileText className="w-4 h-4" />
            Pages ({customPages.length})
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === 'blog' ? 'bg-[#B8212E] text-white shadow-sm' : 'text-gray-550'}`}
          >
            <FileText className="w-4 h-4" />
            Blog ({blogPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === 'subscribers' ? 'bg-[#B8212E] text-white shadow-sm' : 'text-gray-550'}`}
          >
            <Users className="w-4 h-4" />
            Subscribers ({subscribers.length})
          </button>
        </div>
      </div>

      {/* Analytics Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-[#f8fafc] border border-gray-200 p-5 rounded-none space-y-2">
          <span className="block text-[8px] uppercase text-gray-400 font-bold tracking-wider">Total Verified Earnings</span>
          <span className="text-xl font-extrabold text-emerald-600 block">
            PKR {orders.filter(o => o.status === 'verified').reduce((sum, o) => sum + o.total_price, 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold block">Unlocked premium orders</span>
        </div>

        {/* Card 2: Pending verifications */}
        <div className="bg-[#f8fafc] border border-gray-200 p-5 rounded-none space-y-2">
          <span className="block text-[8px] uppercase text-gray-400 font-bold tracking-wider">Pending Verifications</span>
          <span className="text-xl font-extrabold text-amber-600 block">
            {orders.filter(o => o.status === 'payment_submitted').length} Claims
          </span>
          <span className="text-[10px] text-gray-400 font-semibold block">Awaiting receipt verification</span>
        </div>

        {/* Card 3: Catalog Size */}
        <div className="bg-[#f8fafc] border border-gray-200 p-5 rounded-none space-y-2">
          <span className="block text-[8px] uppercase text-gray-400 font-bold tracking-wider">Active Catalog</span>
          <span className="text-xl font-extrabold text-blue-600 block">
            {items.length} Resources
          </span>
          <span className="text-[10px] text-gray-400 font-semibold block">Ebooks, courses, software & services</span>
        </div>

        {/* Card 4: Newsletter Subscribers */}
        <div className="bg-[#f8fafc] border border-gray-200 p-5 rounded-none space-y-2">
          <span className="block text-[8px] uppercase text-gray-400 font-bold tracking-wider">Newsletter Subscribers</span>
          <span className="text-xl font-extrabold text-rose-600 block">
            {subscribers.length} Emails
          </span>
          <span className="text-[10px] text-gray-400 font-semibold block">Subscribed for update notifications</span>
        </div>
      </div>

      {/* TAB 1: ORDERS REVIEW */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-xs font-bold text-gray-450 uppercase tracking-widest">Manual Order Submissions</h2>
            <button onClick={fetchOrders} className="p-2 border border-gray-250 hover:bg-gray-50 rounded-full text-gray-500 cursor-pointer">
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingOrders ? (
            <div className="py-20 text-center text-gray-555 text-sm">Querying database...</div>
          ) : orders.length === 0 ? (
            <div className="py-16 bg-gray-50 border border-gray-200 text-center text-gray-400 text-xs">No order claims found.</div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className={`p-6 bg-white border flex flex-col lg:flex-row gap-6 ${order.status === 'payment_submitted' ? 'border-[#B8212E]/30' : 'border-gray-200'}`}>
                  {/* Proof receipt screenshot preview */}
                  <div className="shrink-0 w-full lg:w-44 aspect-[3/4] bg-gray-50 border border-gray-200 relative group overflow-hidden">
                    {order.proof_image_url ? (
                      <>
                        <img src={getProofUrl(order.proof_image_url)} alt="Invoice scan" className="w-full h-full object-cover" />
                        <a href={getProofUrl(order.proof_image_url)} target="_blank" rel="noreferrer" className="absolute inset-0 bg-[#B8212E]/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white font-bold gap-1">
                          <ExternalLink className="w-4 h-4 text-white" /> View Full Receipt
                        </a>
                      </>
                    ) : (
                      <span className="text-[10px] text-gray-400">No receipt scan</span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-2">
                      <div>
                        <span className="text-[8px] font-mono text-gray-400">Order ID: {order.id}</span>
                        <h3 className="font-bold text-gray-800 text-sm">
                          {order.profiles?.name || 'Client'} <span className="text-xs text-gray-450 font-normal">({order.profiles?.email})</span>
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono bg-gray-150 px-2 py-0.5 border border-gray-250 text-gray-600 font-bold">{order.payment_method}</span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-555">
                      <div>
                        <span className="block text-[8px] uppercase text-gray-400 font-bold mb-0.5">Reference ID</span>
                        <span className="font-mono text-gray-800 tracking-wider font-bold">{order.transaction_ref || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase text-gray-400 font-bold mb-0.5">Payment Total</span>
                        <span className="text-[#B8212E] font-bold">Rs. {order.total_price.toFixed(0)}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase text-gray-400 font-bold mb-0.5">Submission Date</span>
                        <span>{new Date(order.created_at).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Items table */}
                    <div className="bg-gray-50 p-4 border border-gray-200 text-xs font-semibold text-gray-555 space-y-2">
                      <span className="block text-[8px] uppercase text-gray-400">Order Items</span>
                      <div className="space-y-1">
                        {order.order_items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between border-b border-gray-150 pb-1 last:border-0 last:pb-0 gap-2">
                            <span>{item.items?.title} <span className="text-[10px] text-gray-400">({item.items?.resource_type})</span></span>
                            <span className="font-bold text-gray-800">Rs. {item.price.toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verify controls */}
                    {order.status === 'payment_submitted' && (
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => handleVerifyOrder(order.id)} disabled={actionLoading !== null} className="inline-flex items-center gap-1 py-2 px-5 rounded-full bg-emerald-650 hover:bg-emerald-550 text-white font-bold text-xs shadow-sm transition-all cursor-pointer">
                          <Check className="w-4 h-4" /> Verify Order
                        </button>
                        <button onClick={() => startRejection(order.id)} disabled={actionLoading !== null} className="inline-flex items-center gap-1 py-2 px-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer">
                          <X className="w-4 h-4" /> Reject Order
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

      {/* TAB 2: MULTI-RESOURCE CATALOG CRUD */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-150 pb-4">
            <h2 className="text-xs font-bold text-gray-450 uppercase tracking-widest">Portal Catalog Catalog Items ({items.length})</h2>
            <button onClick={openAddItem} className="inline-flex items-center gap-1 py-2.5 px-5 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-xs shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer">
              <Plus className="w-4 h-4" /> Add Portal Item
            </button>
          </div>

          {loadingItems ? (
            <div className="py-20 text-center text-gray-500 text-sm">Querying database...</div>
          ) : items.length === 0 ? (
            <div className="py-12 bg-gray-50 border border-gray-200 text-center text-gray-400 text-xs">No resources cataloged yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-none flex items-center justify-between gap-4">
                  <div className="truncate flex items-center gap-3">
                    <div className="w-10 h-13 rounded-none bg-gray-50 border border-gray-250 overflow-hidden shrink-0 flex items-center justify-center text-[7px] text-gray-400">
                      {item.cover_url ? <img src={item.cover_url} className="w-full h-full object-cover" /> : 'NO COVER'}
                    </div>
                    <div className="truncate font-semibold text-gray-600">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{item.title}</h4>
                      <p className="text-xs text-gray-500 truncate">{item.author}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[8px] bg-red-50 text-[#B8212E] border border-red-100 px-1.5 py-0.5 rounded-none font-bold uppercase">{item.resource_type}</span>
                        <span className="text-[8px] bg-gray-50 text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-none font-bold truncate max-w-[120px]">{item.category}</span>
                        <span className="text-[8px] font-mono font-bold text-gray-600">
                          {item.type === 'free' ? 'FREE' : `Rs. ${item.price}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEditItem(item)} className="p-2 border border-gray-200 text-gray-450 hover:text-indigo-600 rounded-full hover:bg-indigo-50 cursor-pointer">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)} className="p-2 border border-gray-200 text-gray-450 hover:text-rose-600 rounded-full hover:bg-rose-50 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUSTOM PAGES CRUD */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-150 pb-4">
            <h2 className="text-xs font-bold text-gray-450 uppercase tracking-widest">Dynamic Custom Pages ({customPages.length})</h2>
            <button onClick={openAddPage} className="inline-flex items-center gap-1 py-2.5 px-5 rounded-full bg-[#B8212E] hover:bg-[#D62636] text-white font-bold text-xs shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer">
              <Plus className="w-4 h-4" /> Create Custom Page
            </button>
          </div>

          {loadingPages ? (
            <div className="py-20 text-center text-gray-500 text-sm">Querying database...</div>
          ) : customPages.length === 0 ? (
            <div className="py-12 bg-gray-50 border border-gray-200 text-center text-gray-400 text-xs">No custom pages created yet.</div>
          ) : (
            <div className="space-y-4">
              {customPages.map((page) => (
                <div key={page.id} className="p-4 bg-white border border-gray-200 rounded-none flex items-center justify-between gap-4 hover:border-[#B8212E]/30 transition-colors">
                  <div className="truncate font-semibold">
                    <h4 className="font-bold text-gray-800 text-sm">{page.title}</h4>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                      <span>Slug link: <span className="text-[#B8212E] font-bold">/p/{page.slug}</span></span>
                      <span>&bull;</span>
                      <span>Created: {new Date(page.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" className="p-2 border border-gray-200 text-gray-450 hover:text-[#B8212E] rounded-full hover:bg-[#B8212E]/5 cursor-pointer" title="View Page">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => openEditPage(page)} className="p-2 border border-gray-200 text-gray-450 hover:text-indigo-600 rounded-full hover:bg-indigo-50 cursor-pointer" title="Edit Content">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeletePage(page.id)} className="p-2 border border-gray-200 text-gray-450 hover:text-rose-600 rounded-full hover:bg-rose-50 cursor-pointer" title="Delete Page">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: RESOURCE CATALOG ITEM (ADD / EDIT) */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-250 rounded-none w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <button onClick={() => setShowItemModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-800">{editingItemId ? 'Edit Resource Details' : 'Add New Resource to Portal'}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Setup catalog tags, pricing settings, and file assets.</p>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-none flex gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs font-bold text-gray-500">
              
              {/* Type Selection */}
              <div className="space-y-1">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Resource Type</label>
                <select
                  required
                  value={resourceType}
                  onChange={(e: any) => setResourceType(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-700 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 text-xs font-semibold"
                >
                  {RESOURCE_TYPES.map(rt => (
                    <option key={rt.value} value={rt.value}>{rt.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Title / Name</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 text-xs font-semibold"
                    placeholder="e.g. HEC PhD Grant / Matlab 2026"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">
                    {resourceType === 'job' ? 'Company Name' : resourceType === 'scholarship' ? 'Organization' : 'Author / Provider'}
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 text-xs font-semibold"
                    placeholder="e.g. Higher Education Commission"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Category Tag</label>
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
                
                {/* Pricing settings (hidden for jobs and scholarships which are free) */}
                {resourceType !== 'job' && resourceType !== 'scholarship' ? (
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Pricing Mode</label>
                    <div className="flex bg-gray-50 border border-gray-200 rounded-full p-1">
                      <button type="button" onClick={() => setType('free')} className={`flex-1 py-1.5 rounded-full font-bold text-xs cursor-pointer ${type === 'free' ? 'bg-[#B8212E] text-white' : 'text-gray-550'}`}>FREE</button>
                      <button type="button" onClick={() => setType('premium')} className={`flex-1 py-1.5 rounded-full font-bold text-xs cursor-pointer ${type === 'premium' ? 'bg-[#B8212E] text-white' : 'text-gray-555'}`}>PREMIUM</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 bg-emerald-50 border border-emerald-100 p-2 text-center text-emerald-600 flex flex-col justify-center rounded-xl text-xs font-semibold">
                    This resource type is free by default.
                  </div>
                )}
              </div>

              {resourceType !== 'job' && resourceType !== 'scholarship' && type === 'premium' && (
                <div className="space-y-1 w-full sm:w-1/2">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Price (PKR)</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
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
                  placeholder="Details, specifications, links guidelines..."
                />
              </div>

              {/* Upload settings: Link vs File upload */}
              {resourceType === 'job' || resourceType === 'scholarship' ? (
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Application Website Link URL</label>
                  <input
                    type="url"
                    required
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] focus:ring-1 focus:ring-[#B8212E]/20 text-xs font-semibold"
                    placeholder="e.g. https://www.hec.gov.pk/apply"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Cover Image</label>
                    <div className="relative border border-dashed border-gray-200 p-3 bg-gray-50 hover:bg-gray-100/50 flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px]">
                      <input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setCoverFile(e.target.files[0]) }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Upload className="w-4 h-4 text-gray-400 mb-1" />
                      <span className="text-[10px] text-gray-600 font-bold truncate max-w-[200px]">
                        {coverFile ? coverFile.name : existingCoverUrl ? 'Keep Existing Cover' : 'Upload Cover'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Resource File Document</label>
                    <div className="relative border border-dashed border-gray-200 p-3 bg-gray-50 hover:bg-gray-100/50 flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px]">
                      <input type="file" accept=".pdf,.zip,.epub,.rar" required={!editingItemId} onChange={(e) => { if (e.target.files && e.target.files[0]) setDocFile(e.target.files[0]) }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Upload className="w-4 h-4 text-gray-400 mb-1" />
                      <span className="text-[10px] text-gray-600 font-bold truncate max-w-[200px]">
                        {docFile ? docFile.name : existingFilePath ? 'Keep Existing File' : 'Upload PDF/ZIP'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowItemModal(false)} className="px-5 py-2 border border-gray-250 hover:bg-gray-50 text-gray-650 font-bold rounded-full text-xs cursor-pointer">Cancel</button>
                <button type="submit" disabled={formSubmitting} className="inline-flex items-center px-6 py-2 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer">{formSubmitting ? 'Saving...' : 'Save Item'}</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CUSTOM PAGES (ADD / EDIT) */}
      {showPageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-250 rounded-none w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <button onClick={() => setShowPageModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-800">{editingPageId ? 'Edit Custom Page' : 'Create Custom Informational Page'}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Write details, set up the web link slug (e.g. disclaimer).</p>
            </div>

            {pageFormError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-none flex gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{pageFormError}</span>
              </div>
            )}

            <form onSubmit={handleSavePage} className="space-y-4 text-xs font-bold text-gray-500">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Page Title</label>
                  <input
                    type="text"
                    required
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] text-xs font-semibold"
                    placeholder="e.g. Disclaimer / Terms of Service"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">URL Slug link</label>
                  <input
                    type="text"
                    required
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                    disabled={editingPageId !== null}
                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] text-xs font-semibold disabled:opacity-50"
                    placeholder="e.g. disclaimer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Page Content</label>
                <textarea
                  rows={8}
                  required
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-850 focus:outline-none focus:border-[#B8212E] text-xs font-semibold resize-none"
                  placeholder="Write descriptive page paragraph text here..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowPageModal(false)} className="px-5 py-2 border border-gray-250 hover:bg-gray-50 text-gray-650 font-bold rounded-full text-xs cursor-pointer">Cancel</button>
                <button type="submit" disabled={pageSubmitting} className="inline-flex items-center px-6 py-2 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer">{pageSubmitting ? 'Saving...' : 'Save Page'}</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* TAB 4: BLOG POSTS MANAGER */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div>
              <h2 className="text-xs font-bold text-gray-450 uppercase tracking-widest">Active Blog Guidelines</h2>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Write guidelines, university alerts, or career update posts.</p>
            </div>
            <button
              onClick={openAddBlogPost}
              className="px-4 py-1.5 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Write Article
            </button>
          </div>

          {loadingBlog ? (
            <div className="py-20 text-center text-gray-555 text-sm">Querying blog database...</div>
          ) : blogPosts.length === 0 ? (
            <div className="py-16 bg-gray-50 border border-gray-200 text-center text-gray-400 text-xs">No blog posts found. Write your first article!</div>
          ) : (
            <div className="bg-white border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 text-left text-xs font-semibold text-gray-650">
                <thead className="bg-gray-50 text-[10px] text-gray-450 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Cover</th>
                    <th className="px-6 py-3">Title & Slug</th>
                    <th className="px-6 py-3">Summary</th>
                    <th className="px-6 py-3">Published Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {blogPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {post.cover_url ? (
                          <img src={post.cover_url} alt="" className="w-12 h-8 object-cover border border-gray-200" />
                        ) : (
                          <div className="w-12 h-8 bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]">No image</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="block font-bold text-gray-850">{post.title}</span>
                        <span className="block font-mono text-[10px] text-gray-400">/blog/{post.slug}</span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">{post.summary}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button onClick={() => openEditBlogPost(post)} className="p-1 text-gray-450 hover:text-blue-650 inline-block cursor-pointer">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteBlogPost(post.id)} className="p-1 text-gray-455 hover:text-rose-655 inline-block cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: NEWSLETTER SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div>
              <h2 className="text-xs font-bold text-gray-455 uppercase tracking-widest">Portal Alerts Subscriptions</h2>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">List of student email subscriptions for job/scholarship alerts.</p>
            </div>
            <button onClick={fetchSubscribers} className="p-2 border border-gray-250 hover:bg-gray-50 rounded-full text-gray-500 cursor-pointer">
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSubscribers ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingSubscribers ? (
            <div className="py-20 text-center text-gray-555 text-sm">Querying subscribers...</div>
          ) : subscribers.length === 0 ? (
            <div className="py-16 bg-gray-50 border border-gray-200 text-center text-gray-400 text-xs">No email subscribers found.</div>
          ) : (
            <div className="bg-white border border-gray-200 overflow-hidden max-w-lg">
              <table className="min-w-full divide-y divide-gray-200 text-left text-xs font-semibold text-gray-650">
                <thead className="bg-gray-50 text-[10px] text-gray-450 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Email Address</th>
                    <th className="px-6 py-3">Signup Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-800">{sub.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-450">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL 3: WRITE BLOG POST (ADD / EDIT) */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-250 rounded-none w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative animate-scale-in">
            <button onClick={() => setShowBlogModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-650 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-800">{editingBlogPostId ? 'Edit Article' : 'Write Blog Guideline Post'}</h3>
              <p className="text-xs text-gray-400 mt-0.5 font-semibold">Fill in metadata and body text. Content supports formatted paragraphs.</p>
            </div>

            {blogFormError && (
              <div className="p-3 bg-rose-50 border border-rose-250 text-rose-600 text-xs rounded-none flex gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{blogFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBlogPost} className="space-y-4 text-xs font-bold text-gray-550">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Post Title</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => {
                      setBlogTitle(e.target.value)
                      if (!editingBlogPostId) {
                        setBlogSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                      }
                    }}
                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] text-xs font-semibold"
                    placeholder="e.g. HEC Scholarships Guide 2026"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] text-xs font-semibold font-mono"
                    placeholder="e.g. hec-scholarships-guide-2026"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Short Summary</label>
                <input
                  type="text"
                  required
                  value={blogSummary}
                  onChange={(e) => setBlogSummary(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] text-xs font-semibold"
                  placeholder="e.g. A comprehensive walk-through on how to apply for fully funded PhD grants."
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Cover Image URL</label>
                <input
                  type="url"
                  value={blogCoverUrl}
                  onChange={(e) => setBlogCoverUrl(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] text-xs font-semibold"
                  placeholder="e.g. https://images.unsplash.com/... (optional)"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Article Content</label>
                <textarea
                  rows={10}
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-800 focus:outline-none focus:border-[#B8212E] text-xs font-semibold resize-none"
                  placeholder="Write full article body. Double enter creates paragraph spacing..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowBlogModal(false)} className="px-5 py-2 border border-gray-250 hover:bg-gray-50 text-gray-650 font-bold rounded-full text-xs cursor-pointer">Cancel</button>
                <button type="submit" disabled={blogSubmitting} className="inline-flex items-center px-6 py-2 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer">
                  {blogSubmitting ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DIALOG: REJECTION DIALOG */}
      {rejectionOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-250 rounded-none w-full max-w-sm p-6 space-y-4 shadow-2xl relative">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Rejection Reason</h3>
              <p className="text-[11px] text-gray-400 mt-0.5 font-semibold">Describe receipt issue. An email copy is sent to the client.</p>
            </div>

            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-white border border-gray-250 rounded-xl py-2.5 px-3 text-gray-800 text-xs focus:outline-none focus:border-rose-500 resize-none font-semibold"
              placeholder="e.g. Transaction ID was not found in our EasyPaisa log ledger..."
            />

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setRejectionOrderId(null)} className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-550 font-bold rounded-full text-xs cursor-pointer">Cancel</button>
              <button onClick={handleRejectOrder} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-full text-xs cursor-pointer">Submit Rejection</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
