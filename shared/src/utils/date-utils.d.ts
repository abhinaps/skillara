/**
 * Date and time utility functions
 */
export declare function formatDate(date: Date, format?: 'ISO' | 'short' | 'long'): string;
export declare function addDays(date: Date, days: number): Date;
export declare function addWeeks(date: Date, weeks: number): Date;
export declare function isExpired(expirationDate: Date): boolean;
export declare function timeUntilExpiration(expirationDate: Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};
