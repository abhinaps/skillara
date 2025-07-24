import { z } from 'zod';
export declare const SessionIdSchema: z.ZodString;
export declare class SessionId {
    private readonly _value;
    constructor(value: string);
    static generate(): SessionId;
    static fromString(value: string): SessionId;
    get value(): string;
    equals(other: SessionId): boolean;
    toString(): string;
    toJSON(): string;
}
