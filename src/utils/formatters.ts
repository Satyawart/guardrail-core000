export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(2, '0').slice(0, 2);
  } catch {
    return '14:22:01.04';
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
