import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    // 1. Authenticate user as Admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Parse request payload
    const { orderId, action, rejectionReason } = await request.json()

    if (!orderId || !action || !['verify', 'reject', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    // 3. Retrieve order information with profile email
    const { data: order, error: orderFetchErr } = await adminSupabase
      .from('orders')
      .select('*, profiles(email, name)')
      .eq('id', orderId)
      .single()

    if (orderFetchErr || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const buyerEmail = order.profiles?.email
    const buyerName = order.profiles?.name || 'Customer'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (action === 'verify') {
      // 4. Update order status to verified
      const { error: updateErr } = await adminSupabase
        .from('orders')
        .update({ status: 'verified', updated_at: new Date().toISOString() })
        .eq('id', orderId)

      if (updateErr) throw updateErr

      // 5. Fetch order items (items purchased)
      const { data: items, error: itemsErr } = await adminSupabase
        .from('order_items')
        .select('item_id, items(title)')
        .eq('order_id', orderId)

      if (itemsErr || !items) throw new Error('Could not fetch order items')

      // 6. Insert purchases linking user and items
      const purchasesToInsert = items.map((item) => ({
        user_id: order.user_id,
        item_id: item.item_id,
        order_id: orderId,
      }))

      const { error: purchaseErr } = await adminSupabase
        .from('purchases')
        .insert(purchasesToInsert)
        .select()

      if (purchaseErr) {
        // Handle unique constraint conflict (user already owns the item)
        if (!purchaseErr.message.includes('unique constraint')) {
          throw purchaseErr
        }
      }

      // 7. Generate email content and trigger Resend
      if (resend && buyerEmail) {
        const itemLinks = items
          .map((item: any) => {
            const title = Array.isArray(item.items) ? item.items[0]?.title : item.items?.title;
            return `<li><strong>${title || 'Premium Resource'}</strong>: <a href="${appUrl}/api/download?itemId=${item.item_id}" style="color: #B8212E; font-weight: bold; text-decoration: underline;">Access / Download Link</a></li>`;
          })
          .join('')

        try {
          await resend.emails.send({
            from: 'Engineer Yasin <portal@engineeryasin.com>',
            to: [buyerEmail],
            subject: 'Your Engineer Yasin order is confirmed',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
                <h2 style="color: #B8212E; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Engineer Yasin</h2>
                <p>Dear ${buyerName},</p>
                <p>We are pleased to inform you that your manual payment for order <strong>#${orderId.substring(0, 8)}</strong> has been verified successfully!</p>
                <p>The premium resources listed below are now permanently available in your library dashboard. Click the links below to access/download them securely:</p>
                <ul style="padding-left: 20px; line-height: 1.6;">
                  ${itemLinks}
                </ul>
                <p style="margin-top: 25px;">You can also access your downloads at any time by logging into your account library at <a href="${appUrl}/account" style="color: #B8212E;">engineeryasin.com/account</a>.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 11px; color: #64748b; text-align: center;">For assistance, please reply to this email or contact yasinofficial03098158572@gmail.com.</p>
              </div>
            `,
          })
        } catch (resendError) {
          console.error('Resend email sending failure (verification):', resendError)
          // Do not fail the request, payment verification is already committed in DB
        }
      }

      return NextResponse.json({ success: true, message: 'Order verified successfully' })
    }

    if (action === 'reject') {
      // 8. Update order status to rejected
      const reasonStr = rejectionReason || 'The transaction reference number or receipt screenshot could not be matched with our bank statements.'
      
      const { error: updateErr } = await adminSupabase
        .from('orders')
        .update({ 
          status: 'rejected', 
          rejection_reason: reasonStr,
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId)

      if (updateErr) throw updateErr

      // 9. Send rejection email
      if (resend && buyerEmail) {
        const reasonStr = rejectionReason || 'The transaction reference number or receipt screenshot could not be matched with our bank statements.'
        
        try {
          await resend.emails.send({
            from: 'Engineer Yasin <portal@engineeryasin.com>',
            to: [buyerEmail],
            subject: 'Update regarding your Engineer Yasin order',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
                <h2 style="color: #ef4444; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Engineer Yasin</h2>
                <p>Dear ${buyerName},</p>
                <p>We are writing to update you regarding your manual payment submission for order <strong>#${orderId.substring(0, 8)}</strong>.</p>
                <p style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; font-size: 14px; color: #991b1b; border-radius: 4px;">
                  <strong>Rejection Reason:</strong><br/>
                  ${reasonStr}
                </p>
                <p>If you believe this is a mistake, or if you need to submit correct transaction details, please re-submit your receipt or contact our support team at <strong style="color: #B8212E;">yasinofficial03098158572@gmail.com</strong> with your transaction ID and order number.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 11px; color: #64748b; text-align: center;">This is an automated notification. For assistance, contact yasinofficial03098158572@gmail.com.</p>
              </div>
            `,
          })
        } catch (resendError) {
          console.error('Resend email sending failure (rejection):', resendError)
        }
      }

      return NextResponse.json({ success: true, message: 'Order rejected successfully' })
    }

    if (action === 'delete') {
      const { error: deleteErr } = await adminSupabase
        .from('orders')
        .delete()
        .eq('id', orderId)

      if (deleteErr) throw deleteErr

      return NextResponse.json({ success: true, message: 'Order deleted successfully' })
    }

    return NextResponse.json({ error: 'Action not matched' }, { status: 400 })
  } catch (err: any) {
    console.error('Admin Order Status Update Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
