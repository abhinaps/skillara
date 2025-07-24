/**
 * String manipulation utility functions
 */
export declare function slugify(text: string): string;
export declare function capitalize(text: string): string;
export declare function truncate(text: string, maxLength: number, suffix?: string): string;
export declare function normalizeWhitespace(text: string): string;
export declare function removeSpecialChars(text: string): string;
export declare function extractWords(text: string): string[];
export declare function similarity(text1: string, text2: string): number;
export declare function maskEmail(email: string): string;
