"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base62Encode = void 0;
const crypto_1 = require("crypto");
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const alphabetLength = alphabet.length;
const base62Encode = (length = 22) => {
    const bytes = (0, crypto_1.randomBytes)(length);
    let result = "";
    for (let i = 0; i < length; i++) {
        result += alphabet[bytes[i] % alphabetLength];
    }
    return result;
};
exports.base62Encode = base62Encode;
