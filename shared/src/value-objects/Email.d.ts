import { z } from 'zod';
export declare const EmailSchema: z.ZodString;
export declare class Email {
    private readonly _value;
    constructor(value: string);
    static fromString(value: string): Email;
    get value(): string;
    get domain(): string;
    get localPart(): string;
    equals(other: Email): boolean;
    toString(): string;
    toJSON(): string;
}
