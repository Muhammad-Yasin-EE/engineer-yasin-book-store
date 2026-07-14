import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to write a review.' }, { status: 401 })
    }

    const { itemId, rating, comment } = await request.json()

    if (!itemId || !rating || rating < 1 || rating > 5 || !comment || !comment.trim()) {
      return NextResponse.json({ error: 'Please complete all fields and choose a rating.' }, { status: 400 })
    }

    // 2. Authorize user (Must be Admin or own a verified purchase)
    let isAuthorized = false

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profile?.is_admin) {
      isAuthorized = true
    } else {
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .maybeSingle()

      if (purchase) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'You must purchase this resource before leaving a review.' }, { status: 403 })
    }

    // 3. Save review to database using admin client (bypasses RLS triggers)
    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('reviews')
      .insert({
        user_id: user.id,
        item_id: itemId,
        rating: Math.floor(rating),
        comment: comment.trim()
      })

    if (error) {
      if (error.message.includes('unique constraint') || error.code === '23505') {
        return NextResponse.json({ error: 'You have already submitted a review for this item.' }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json({ success: true, message: 'Review submitted successfully!' })
  } catch (err: any) {
    console.error('Review Save Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('reviews')
      .select('*, profiles(name)')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error('Fetch Reviews Error:', err)
    return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 })
  }
}
