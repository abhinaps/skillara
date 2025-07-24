/**
 * String manipulation utility functions
 */
export function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
export function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
export function truncate(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - suffix.length) + suffix;
}
export function normalizeWhitespace(text) {
    return text.replace(/\s+/g, ' ').trim();
}
export function removeSpecialChars(text) {
    return text.replace(/[^\w\s]/g, '');
}
export function extractWords(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0);
}
export function similarity(text1, text2) {
    const words1 = new Set(extractWords(text1));
    const words2 = new Set(extractWords(text2));
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    return union.size === 0 ? 0 : intersection.size / union.size;
}
export function maskEmail(email) {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) {
        return email;
    }
    const maskedLocal = localPart.length > 2
        ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
        : '*'.repeat(localPart.length);
    return `${maskedLocal}@${domain}`;
}
//# sourceMappingURL=string-utils.js.map