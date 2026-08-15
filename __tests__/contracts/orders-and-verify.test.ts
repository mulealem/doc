import { describe, expect, it } from "vitest";
import {
  errorInvalidKey,
  errorRateLimited,
  orderCreated,
  orderGetApproved,
  orderGetPending,
  verifySuccess,
} from "@/lib/examples/responses";
import { orderSchema, verifyResponseSchema } from "@/lib/schemas";

// Schemas are declared `as const`, so `required` is a readonly tuple.
type Schema = {
  required: readonly string[];
  properties: Record<string, { type: string; format?: string }>;
};

function assertMatchesSchema(value: unknown, schema: Schema, path = "$") {
  if (typeof value !== "object" || value === null) {
    throw new Error(`${path}: expected object, got ${typeof value}`);
  }
  const obj = value as Record<string, unknown>;
  for (const key of schema.required) {
    if (!(key in obj)) {
      throw new Error(`${path}: missing required field "${key}"`);
    }
  }
  for (const [key, propSchema] of Object.entries(schema.properties)) {
    if (!(key in obj)) continue;
    const v = obj[key];
    const t = propSchema.type;
    if (t === "string" && typeof v !== "string") {
      throw new Error(`${path}.${key}: expected string, got ${typeof v}`);
    }
    if (t === "number" && typeof v !== "number") {
      throw new Error(`${path}.${key}: expected number, got ${typeof v}`);
    }
    if (t === "integer" && !Number.isInteger(v)) {
      throw new Error(`${path}.${key}: expected integer, got ${typeof v}`);
    }
    if (t === "boolean" && typeof v !== "boolean") {
      throw new Error(`${path}.${key}: expected boolean, got ${typeof v}`);
    }
  }
}

describe("POST /api/v1/orders response", () => {
  it("matches the documented schema", () => {
    expect(() => assertMatchesSchema(orderCreated, orderSchema)).not.toThrow();
  });

  it("returns paymentUrl hosted on checkout origin", () => {
    expect(orderCreated.paymentUrl).toMatch(/^https:\/\/checkout\./);
  });

  it("exposes amountMinor = amount * 100 for ETB", () => {
    expect(orderCreated.amountMinor).toBe(orderCreated.amount * 100);
  });

  it("expiresAt is a valid ISO 8601 timestamp", () => {
    expect(Number.isFinite(Date.parse(orderCreated.expiresAt))).toBe(true);
  });

  it("expiresInSeconds is between 60 and 86400", () => {
    expect(orderCreated.expiresInSeconds).toBeGreaterThanOrEqual(60);
    expect(orderCreated.expiresInSeconds).toBeLessThanOrEqual(86400);
  });
});

describe("GET /api/v1/orders/{orderId} response", () => {
  it("pending order has no payment object", () => {
    expect(orderGetPending.status).toBe("PENDING");
    expect(orderGetPending.payment).toBeNull();
  });

  it("approved order carries the full extracted data", () => {
    expect(orderGetApproved.status).toBe("PAID");
    expect(orderGetApproved.payment).not.toBeNull();
    expect(orderGetApproved.payment?.status).toBe("APPROVED");
    expect(orderGetApproved.payment?.extractedData).toBeTruthy();
    expect(orderGetApproved.payment?.submittedAt).toBeTruthy();
    expect(orderGetApproved.payment?.approvedAt).toBeTruthy();
  });

  it("payment.extractedData has a non-empty referenceId", () => {
    expect(orderGetApproved.payment?.extractedData.referenceId).toMatch(
      /^TXN[A-Z0-9]+$/,
    );
  });
});

describe("POST /api/v1/verify response", () => {
  it("matches the documented schema", () => {
    expect(() =>
      assertMatchesSchema(verifySuccess, verifyResponseSchema),
    ).not.toThrow();
  });

  it("ok=true and provider is one of the supported banks", () => {
    expect(verifySuccess.ok).toBe(true);
    expect([
      "telebirr",
      "cbe",
      "boa",
      "dashen",
      "zemen",
      "abyssinia",
    ]).toContain(verifySuccess.provider);
  });

  it("extracts payer and receiver", () => {
    expect(verifySuccess.data.payerName).toBeTruthy();
    expect(verifySuccess.data.receiverName).toBeTruthy();
  });
});

describe("error envelope", () => {
  it("invalid API key returns { error: string }", () => {
    expect(typeof errorInvalidKey.error).toBe("string");
    expect(errorInvalidKey.error.length).toBeGreaterThan(0);
  });

  it("rate limit returns { error: string }", () => {
    expect(typeof errorRateLimited.error).toBe("string");
    expect(errorRateLimited.error.toLowerCase()).toContain("too many");
  });
});
