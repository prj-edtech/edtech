// api\src\utils\base62.ts

import { customAlphabet } from "nanoid";

// 62 chars: 0-9, a-z, A-Z
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 22); // 22 chars for base62-like length

export const base62Encode = () => {
  return nanoid();
};
