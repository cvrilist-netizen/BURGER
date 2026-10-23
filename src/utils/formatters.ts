export function formatPrice(price: number): string {
  if (isNaN(price)) return '0 so‘m';
  return `${price.toLocaleString('uz-UZ').replace(/,/g, ' ')} so‘m`;
}

export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('uz-UZ', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function getStatusText(status: string): { label: string; color: string; bg: string; border: string } {
  switch (status) {
    case 'pending':
      return {
        label: 'Yangi buyurtma',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30'
      };
    case 'accepted':
      return {
        label: 'Qabul qilindi',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30'
      };
    case 'preparing':
      return {
        label: 'Tayyorlanmoqda',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30'
      };
    case 'ready':
      return {
        label: 'Buyurtma tayyor',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30'
      };
    case 'completed':
      return {
        label: 'Yetkazildi / Yakunlandi',
        color: 'text-neutral-400',
        bg: 'bg-neutral-800',
        border: 'border-neutral-700'
      };
    case 'cancelled':
      return {
        label: 'Bekor qilingan',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30'
      };
    default:
      return {
        label: 'Kutilmoqda',
        color: 'text-neutral-300',
        bg: 'bg-neutral-850',
        border: 'border-neutral-700'
      };
  }
}
