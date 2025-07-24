import { z } from 'zod';
export const EmailSchema = z.string().email();
export class Email {
    _value;
    constructor(value) {
        const result = EmailSchema.safeParse(value);
        if (!result.success) {
            throw new Error(`Invalid Email: ${value}`);
        }
        this._value = value.toLowerCase().trim();
    }
    static fromString(value) {
        return new Email(value);
    }
    get value() {
        return this._value;
    }
    get domain() {
        return this._value.split('@')[1] ?? '';
    }
    get localPart() {
        return this._value.split('@')[0] ?? '';
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
//# sourceMappingURL=Email.js.map