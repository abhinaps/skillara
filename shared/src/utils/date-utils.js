/**
 * Date and time utility functions
 */
export function formatDate(date, format = 'ISO') {
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
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
export function addWeeks(date, weeks) {
    return addDays(date, weeks * 7);
}
export function isExpired(expirationDate) {
    return expirationDate.getTime() < Date.now();
}
export function timeUntilExpiration(expirationDate) {
    const now = Date.now();
    const expiration = expirationDate.getTime();
    const diff = Math.max(0, expiration - now);
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds };
}
//# sourceMappingURL=date-utils.js.map