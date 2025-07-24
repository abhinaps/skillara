/**
 * Date and time utility functions
 */

export function formatDate(date: Date, format: 'ISO' | 'short' | 'long' = 'ISO'): string {
  switch (format) {
    case 'ISO':
      return date.toISOString();
    case 'short':
      return date.toLocaleDateString();
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    default:
      return date.toISOString();
  }
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function isExpired(expirationDate: Date): boolean {
  return expirationDate.getTime() < Date.now();
}

export function timeUntilExpiration(expirationDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = Date.now();
  const expiration = expirationDate.getTime();
  const diff = Math.max(0, expiration - now);

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds };
}
