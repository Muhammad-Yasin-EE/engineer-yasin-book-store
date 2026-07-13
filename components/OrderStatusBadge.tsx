interface OrderStatusBadgeProps {
  status: 'pending_payment' | 'payment_submitted' | 'verified' | 'rejected' | string
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  let badgeStyles = '';
  let label = '';

  switch (status) {
    case 'pending_payment':
      badgeStyles = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      label = 'Pending Payment';
      break;
    case 'payment_submitted':
      badgeStyles = 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 animate-pulse';
      label = 'Payment Submitted (Under Review)';
      break;
    case 'verified':
      badgeStyles = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      label = 'Verified & Confirmed';
      break;
    case 'rejected':
      badgeStyles = 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      label = 'Rejected';
      break;
    default:
      badgeStyles = 'bg-slate-500/10 text-slate-400 border border-slate-500/30';
      label = status;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeStyles}`}>
      {label}
    </span>
  )
}
