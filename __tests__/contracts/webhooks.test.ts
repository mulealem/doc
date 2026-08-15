import { describe, expect, it } from "vitest";
import { createHmac, timingSafeEqual } from "node:crypto";
import { computeSignature } from "@/lib/signing";
import {
  payloadPaymentApproved,
  payloadPaymentRejected,
  webhookSecretCreate,
} from "@/lib/examples/webhooks";

function verifyPyGateSignature(
  rawBody: string,
  timestamp: string,
  signatureHeader: string,
  secret: string,
): boolean {
  const sig = signatureHeader.replace(/^sha256=/, "");
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  const sigBuf = Buffer.from(sig, "hex");
  const expBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length) return false;
  return timingSafeEqual(sigBuf, expBuf);
}

describe("webhook payload envelope", () => {
  it("payment.approved payload has a string id, type, createdAt", () => {
    expect(payloadPaymentApproved.id).toMatch(/^evt_/);
    expect(payloadPaymentApproved.type).toBe("payment.approved");
    expect(Number.isFinite(Date.parse(payloadPaymentApproved.createdAt))).toBe(
      true,
    );
  });

  it("payment.approved payload has data.orderId and data.amountMinor", () => {
    expect(payloadPaymentApproved.data.orderId).toMatch(/^ord_/);
    expect(payloadPaymentApproved.data.amountMinor).toBe(
      payloadPaymentApproved.data.amount * 100,
    );
  });

  it("payment.rejected payload has a string reason", () => {
    expect(payloadPaymentRejected.data.reason).toBeTruthy();
    expect(typeof payloadPaymentRejected.data.reason).toBe("string");
  });
});

describe("HMAC signature is reproducible", () => {
  const timestamp = "1723563008";
  const rawBody = JSON.stringify(payloadPaymentApproved);

  it("matches the signing.example formula", () => {
    const expected = computeSignature(rawBody, webhookSecretCreate, timestamp);
    const reSig = createHmac("sha256", webhookSecretCreate)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");
    expect(reSig).toBe(expected);
  });

  it("verifies the same way the docs say", () => {
    const signature = `sha256=${createHmac("sha256", webhookSecretCreate)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex")}`;
    expect(verifyPyGateSignature(rawBody, timestamp, signature, webhookSecretCreate)).toBe(true);
  });

  it("rejects a tampered body", () => {
    const signature = `sha256=${createHmac("sha256", webhookSecretCreate)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex")}`;
    const tampered = rawBody.replace("APPROVED", "REJECTED");
    expect(verifyPyGateSignature(tampered, timestamp, signature, webhookSecretCreate)).toBe(false);
  });

  it("rejects the wrong secret", () => {
    const signature = `sha256=${createHmac("sha256", "wrong-secret")
      .update(`${timestamp}.${rawBody}`)
      .digest("hex")}`;
    expect(verifyPyGateSignature(rawBody, timestamp, signature, webhookSecretCreate)).toBe(false);
  });
});

describe("idempotency primitives", () => {
  it("delivery IDs are unique per delivery", () => {
    const ids = new Set([payloadPaymentApproved.id, payloadPaymentRejected.id]);
    expect(ids.size).toBe(2);
  });
});
