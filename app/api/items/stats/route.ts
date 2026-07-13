import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { itemId, action } = await request.json()

    if (!itemId || !action || !['view', 'download'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters.' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Read current stats
    const { data: item, error: fetchErr } = await adminClient
      .from('items')
      .select('views, downloads')
      .eq('id', itemId)
      .single()

    if (fetchErr || !item) {
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 })
    }

    // Prepare update payload
    const updateData: any = {}
    if (action === 'view') {
      updateData.views = (item.views || 0) + 1
    } else if (action === 'download') {
      updateData.downloads = (item.downloads || 0) + 1
    }

    // Commit update
    const { error: updateErr } = await adminClient
      .from('items')
      .update(updateData)
      .eq('id', itemId)

    if (updateErr) throw updateErr

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Stats Counter Update Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
