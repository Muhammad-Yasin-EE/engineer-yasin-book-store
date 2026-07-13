import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic' // Disable static optimization for API route

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Fetch book record (accessible by anyone)
    const { data: book, error: bookErr } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single()

    if (bookErr || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // 2. FREE BOOKS FLOW (Public download)
    if (book.type === 'free') {
      const adminClient = createAdminClient()
      
      // Increment download count
      await adminClient
        .from('books')
        .update({ download_count: (book.download_count || 0) + 1 })
        .eq('id', bookId)

      // Generate public URL redirect
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/free-books/${book.file_path}`
      return NextResponse.redirect(publicUrl)
    }

    // 3. PREMIUM BOOKS FLOW (Security checks)
    // A. Check user authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    // B. Check user authorization (Purchase or Admin)
    let isAuthorized = false

    // Fetch user profile to see if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profile?.is_admin) {
      isAuthorized = true
    } else {
      // Check if purchase verified
      const { data: purchase, error: purchaseErr } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .maybeSingle()

      if (purchase) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden. You do not own this resource.' }, { status: 403 })
    }

    // C. Authorized! Generate signed URL from private bucket 'premium-books'
    const adminClient = createAdminClient()

    // Increment download count
    await adminClient
      .from('books')
      .update({ download_count: (book.download_count || 0) + 1 })
      .eq('id', bookId)

    // Generate signed download link (valid for 60 seconds)
    const { data: signedData, error: signedErr } = await adminClient.storage
      .from('premium-books')
      .createSignedUrl(book.file_path, 60, {
        download: true, // Forces content-disposition download headers
      })

    if (signedErr || !signedData?.signedUrl) {
      console.error('Signed URL generation error:', signedErr)
      return NextResponse.json({ error: 'Failed to generate secure download link.' }, { status: 500 })
    }

    // D. Redirect to signed URL download
    return NextResponse.redirect(signedData.signedUrl)
  } catch (err: any) {
    console.error('Download Handler Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
