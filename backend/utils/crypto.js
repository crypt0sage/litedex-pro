import { randomBytes } from "crypto";

export function randomHex(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

export function generateTxHash() {
  return "0x" + randomHex(32);
}
