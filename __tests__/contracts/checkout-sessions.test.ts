import { describe, expect, it } from "vitest";
import {
  checkoutSessionCreated,
  checkoutSession,
  checkoutReceiptAccepted,
  checkoutStatusVerifying,
  checkoutStatusApproved,
} from "@/lib/examples/responses";
import {
  checkoutSessionCreatedSchema,
  checkoutSessionSchema,
  checkoutReceiptAcceptedSchema,
  checkoutStatusSchema,
} from "@/lib/schemas";

/** Shallow schema check: required keys + primitive types (same as siblings). */
function assertMatchesSchema(
  value: Record<string, unknown>,
  schema: { required?: readonly string[]; properties?: Record<string, { type?: unknown }> },
  path = "$",
) {
  expect(value, `${path} must be an object`).toBeTypeOf("object");
  expect(value).not.toBeNull();
  for (const key of schema.required ?? []) {
    expect(value, `${path}.${key} is required`).toHaveProperty(key);
  }
  for (const [key, prop] of Object.entries(schema.properties ?? {})) {
    if (!(key in value)) continue;
    const v = value[key];
    if (v === null || v === undefined) continue;
    const types = Array.isArray(prop.type) ? prop.type : [prop.type];
    if (types.includes("null")) continue;
    const ok = types.some((t) => {
      if (t === "array") return Array.isArray(v);
      if (t === "object") return typeof v === "object" && !Array.isArray(v);
      if (t === "integer") return Number.isInteger(v) || typeof v === "number";
      return typeof v === t;
    });
    expect(ok, `${path}.${key} should be ${types.join("|")}`).toBe(true);
  }
}

describe("checkout session contract", () => {
  it("session creation response matches the documented schema", () => {
    assertMatchesSchema(checkoutSessionCreated, checkoutSessionCreatedSchema);
  });

  it("exposes hosted + embed URLs on the checkout origin and a client secret", () => {
    expect(checkoutSessionCreated.hostedUrl).toMatch(/^https:\/\/checkout\./);
    expect(checkoutSessionCreated.embedUrl).toBe(
      checkoutSessionCreated.hostedUrl.replace("/pay/", "/embed/"),
    );
    expect(checkoutSessionCreated.clientSecret.length).toBeGreaterThan(20);
    expect(checkoutSessionCreated.order.amountMinor).toBe(
      checkoutSessionCreated.order.amount * 100,
    );
    expect(new Date(checkoutSessionCreated.expiresAt).toString()).not.toBe(
      "Invalid Date",
    );
  });

  it("session read exposes payment methods with receipt capabilities", () => {
    assertMatchesSchema(checkoutSession, checkoutSessionSchema);
    expect(checkoutSession.status).toBe("PENDING");
    expect(checkoutSession.bankAccounts.length).toBeGreaterThan(0);
    const [account] = checkoutSession.bankAccounts;
    expect(account.receiptTypes.length).toBeGreaterThan(0);
    for (const type of account.receiptTypes) {
      expect(["IMAGE", "SMS_TEXT", "TRANSACTION_NUMBER"]).toContain(type);
    }
    expect(checkoutSession.shortReference).toMatch(/^PY-\d{6}-[A-Z0-9]{3}$/);
    expect(checkoutSession.amountMinor).toBe(checkoutSession.amount * 100);
  });

  it("receipt acceptance is PENDING (verification is asynchronous)", () => {
    assertMatchesSchema(checkoutReceiptAccepted, checkoutReceiptAcceptedSchema);
    expect(checkoutReceiptAccepted.status).toBe("PENDING");
  });

  it("status payloads carry the documented stage/code vocabulary", () => {
    assertMatchesSchema(checkoutStatusVerifying, checkoutStatusSchema);
    assertMatchesSchema(checkoutStatusApproved, checkoutStatusSchema);

    expect(checkoutStatusVerifying.status).toBe("PENDING");
    expect(["VERIFYING", "NEEDS_REVIEW", "FINALIZING"]).toContain(
      checkoutStatusVerifying.stage,
    );
    expect(checkoutStatusApproved.status).toBe("APPROVED");
    expect(checkoutStatusApproved.stage).toBeNull();
    expect(checkoutStatusApproved.code).toBe("approved");
    expect(checkoutStatusApproved.adminNote).toBeNull();
  });

  it("only rejected payloads carry an admin note", () => {
    for (const payload of [checkoutStatusVerifying, checkoutStatusApproved]) {
      if (payload.status !== "REJECTED") expect(payload.adminNote).toBeNull();
    }
  });

  it("documented status codes cover the shared verdict vocabulary", () => {
    const documented = [
      "approved",
      "duplicate_reference",
      "missing_reference",
      "amount_mismatch",
      "stale_receipt",
      "replay_receipt",
      "provider_mismatch",
      "receiver_mismatch",
      "gate_rejected",
      "pending_review",
      "verification_failed",
      "not_pending",
    ];
    expect(documented).toContain(checkoutStatusVerifying.code);
    expect(documented).toContain(checkoutStatusApproved.code);
  });
});
