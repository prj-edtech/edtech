import { randomBytes } from "crypto";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const alphabetLength = alphabet.length;

export const base62Encode = (length = 22) => {
  const bytes = randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += alphabet[bytes[i] % alphabetLength];
  }
  return result;
};
