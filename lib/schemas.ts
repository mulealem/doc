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

// ─── Project management API ────────────────────────────────────────────────

export const projectObjectSchema = {
  type: "object",
  required: [
    "id",
    "name",
    "description",
    "callbackUrl",
    "theme",
    "apiKey",
    "ownerId",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "string", description: "cuid identifier" },
    name: { type: "string" },
    description: { type: ["string", "null"] },
    callbackUrl: { type: "string", format: "uri" },
    theme: { type: "string", enum: ["violet", "emerald", "rose", "amber", "blue", "slate"] },
    apiKey: { type: "string", description: "pgk_ project key" },
    ownerId: { type: "string", description: "owner user id" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

export const projectCreatedSchema = {
  type: "object",
  required: ["project"],
  properties: {
    project: projectObjectSchema,
  },
} as const;

export const projectListSchema = {
  type: "object",
  required: ["data", "total", "limit", "offset"],
  properties: {
    data: { type: "array" },
    total: { type: "integer" },
    limit: { type: "integer" },
    offset: { type: "integer" },
  },
} as const;

export const projectRotatedKeySchema = {
  type: "object",
  required: ["apiKey"],
  properties: {
    apiKey: { type: "string", description: "pgk_ project key" },
  },
} as const;

export const bankAccountObjectSchema = {
  type: "object",
  required: ["id", "type", "accountName", "accountNumber", "phoneNumber", "createdAt"],
  properties: {
    id: { type: "string" },
    type: {
      type: "string",
      enum: ["CBE", "TELEBIRR", "ABYSSINIA", "DASHEN", "AWASH", "ZEMEN", "CBE_BIRR", "MPESA", "SIINQEE", "KAAFI_BIRR", "OTHER"],
    },
    accountName: { type: "string" },
    accountNumber: { type: "string" },
    phoneNumber: { type: ["string", "null"] },
    createdAt: { type: "string", format: "date-time" },
  },
} as const;

export const bankAccountCreatedSchema = {
  type: "object",
  required: ["bankAccount"],
  properties: {
    bankAccount: bankAccountObjectSchema,
  },
} as const;

export const webhookObjectSchema = {
  type: "object",
  required: ["id", "url", "label", "events", "active", "secretPrefix", "lastDeliveredAt", "createdAt"],
  properties: {
    id: { type: "string" },
    url: { type: "string", format: "uri" },
    label: { type: ["string", "null"] },
    events: { type: "array" },
    active: { type: "boolean" },
    secretPrefix: { type: "string" },
    lastDeliveredAt: { type: ["string", "null"] },
    createdAt: { type: "string", format: "date-time" },
  },
} as const;

export const webhookCreatedSchema = {
  type: "object",
  required: ["webhook"],
  properties: {
    webhook: {
      ...webhookObjectSchema,
      required: [...webhookObjectSchema.required, "signingSecret"],
      properties: {
        ...webhookObjectSchema.properties,
        signingSecret: { type: "string", description: "whsec_ signing secret, shown once" },
      },
    },
  },
} as const;

export const inviteCreatedSchema = {
  type: "object",
  required: ["inviteId", "token", "inviteUrl", "permissions", "expiresAt"],
  properties: {
    inviteId: { type: "string" },
    token: { type: "string" },
    inviteUrl: { type: "string", format: "uri" },
    permissions: { type: "array" },
    expiresAt: { type: "string", format: "date-time" },
  },
} as const;

export const teamListSchema = {
  type: "object",
  required: ["members", "invites"],
  properties: {
    members: { type: "array" },
    invites: { type: "array" },
  },
} as const;
