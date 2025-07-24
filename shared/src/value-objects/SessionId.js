import { z } from 'zod';
export const SessionIdSchema = z.string().uuid();
export class SessionId {
    _value;
    constructor(value) {
        const result = SessionIdSchema.safeParse(value);
        if (!result.success) {
            throw new Error(`Invalid SessionId: ${value}`);
        }
        this._value = value;
    }
    static generate() {
        return new SessionId(crypto.randomUUID());
    }
    static fromString(value) {
        return new SessionId(value);
    }
    get value() {
        return this._value;
    }
    equals(other) {
        return this._value === other._value;
    }
    toString() {
        return this._value;
    }
    toJSON() {
        return this._value;
    }
}
//# sourceMappingURL=SessionId.js.map