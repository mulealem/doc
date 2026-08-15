export const orderSchema = {
  type: "object",
  required: [
    "orderId",
    "paymentUrl",
    "expiresInSeconds",
    "expiresAt",
    "amount",
    "amountMinor",
    "currency",
    "description",
  ],
  properties: {
    orderId: { type: "string", description: "cuid identifier" },
    paymentUrl: { type: "string", format: "uri" },
    expiresInSeconds: { type: "integer", minimum: 60, maximum: 86400 },
    expiresAt: { type: "string", format: "date-time" },
    amount: { type: "number", exclusiveMinimum: 0 },
    amountMinor: { type: "integer", exclusiveMinimum: 0 },
    currency: { type: "string", pattern: "^[A-Z]{3}$" },
    description: { type: "string" },
  },
} as const;

export const verifyRequestSchema = {
  type: "object",
  required: ["reference"],
  properties: {
    reference: { type: "string", description: "Bank or telebirr reference" },
    suffix: {
      type: "string",
      description: "Optional amount suffix for telebirr references",
    },
    phoneNumber: {
      type: "string",
      description: "Optional payer phone number",
    },
  },
} as const;

export const verifyResponseSchema = {
  type: "object",
  required: ["ok", "provider", "data"],
  properties: {
    ok: { type: "boolean", enum: [true] },
    provider: {
      type: "string",
      enum: ["telebirr", "cbe", "boa", "dashen", "zemen", "abyssinia"],
    },
    data: {
      type: "object",
      required: [
        "referenceId",
        "amount",
        "currency",
        "payerName",
        "receiverName",
      ],
      properties: {
        referenceId: { type: "string" },
        amount: { type: "number" },
        currency: { type: "string" },
        paymentDate: { type: "string", format: "date-time" },
        payerName: { type: "string" },
        payerAccount: { type: "string" },
        payerPhone: { type: "string" },
        receiverName: { type: "string" },
        receiverAccount: { type: "string" },
        receiverBank: { type: "string" },
        serviceFee: { type: "number" },
        vat: { type: "number" },
        totalPaid: { type: "number" },
        transactionType: { type: "string" },
        paymentMode: { type: "string" },
        paymentReason: { type: "string" },
        paymentChannel: { type: "string" },
        narrative: { type: "string" },
        extractionMethod: { type: ["string", "null"] },
      },
    },
  },
} as const;
