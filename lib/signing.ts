import { createHash, createHmac } from "node:crypto";

/**
 * Compute the PyGate webhook signature.
 *
 * Algorithm: sha256 = HMAC-SHA256(key=secret, msg=`${timestamp}.${rawBody}`)
 *
 * The body is passed as an object or string. Objects are stringified with the
 * same serializer the webhook handler will use on the receiving side.
 */
export function computeSignature(
  payload: object | string,
  secret: string,
  timestamp: string | number = Math.floor(Date.now() / 1000).toString(),
): string {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  return createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
}

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}
