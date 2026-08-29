export const orderCreated = {
  orderId: "ord_3x4mpl3t3st0rd3r1d2",
  paymentUrl: "https://checkout.example.com/pay/ord_3x4mpl3t3st0rd3r1d2",
  expiresInSeconds: 600,
  expiresAt: "2026-08-13T15:30:00.000Z",
  amount: 250,
  amountMinor: 25000,
  currency: "ETB",
  description: "Test order",
} as const;

export const orderGetPending = {
  orderId: "ord_3x4mpl3t3st0rd3r1d2",
  status: "PENDING",
  amount: 250,
  currency: "ETB",
  description: "Test order",
  expiresAt: "2026-08-13T15:30:00.000Z",
  payment: null,
} as const;

export const orderGetApproved = {
  orderId: "ord_3x4mpl3t3st0rd3r1d2",
  status: "PAID",
  amount: 250,
  currency: "ETB",
  description: "Test order",
  expiresAt: "2026-08-13T15:30:00.000Z",
  payment: {
    status: "APPROVED",
    submittedAt: "2026-08-13T15:25:12.000Z",
    approvedAt: "2026-08-13T15:26:48.000Z",
    extractedData: {
      amount: 250,
      currency: "ETB",
      payerName: "Abel Tadesse",
      payerAccount: "1000123456789",
      receiverName: "Demo Merchant",
      receiverAccount: "1000987654321",
      receiverBank: "CBE",
      referenceId: "TXN9X9K7M",
      paymentDate: "2026-08-13T15:24:50.000Z",
      transactionType: "INTERNAL_TRANSFER",
      paymentMode: "MOBILE_BANKING",
      paymentReason: "Payment for Test order",
      extractionMethod: "API",
    },
  },
} as const;

export const verifySuccess = {
  ok: true,
  provider: "telebirr",
  data: {
    referenceId: "TXN9X9K7M",
    amount: 250,
    currency: "ETB",
    paymentDate: "2026-08-13T15:24:50.000Z",
    payerName: "Abel Tadesse",
    payerAccount: "1000123456789",
    payerPhone: "+251911000000",
    receiverName: "Demo Merchant",
    receiverAccount: "1000987654321",
    receiverBank: "CBE",
    serviceFee: 0,
    vat: 0,
    totalPaid: 250,
    transactionType: "INTERNAL_TRANSFER",
    paymentMode: "MOBILE_BANKING",
    paymentReason: "Payment for Test order",
    paymentChannel: "MOBILE",
    narrative: "Sent 250 ETB to Demo Merchant",
    extractionMethod: "API",
  },
} as const;

export const errorInvalidKey = {
  error: "Invalid API key",
} as const;

export const errorRateLimited = {
  error: "Too many order creations. Try again shortly.",
} as const;

// ─── Project management API ────────────────────────────────────────────────

export const projectCreated = {
  project: {
    id: "prj_3x4mpl3t3st0rd3r1d2",
    name: "Coffee Shop Demo",
    description: null,
    callbackUrl: "https://merchant.example.com/payments/callback",
    theme: "violet",
    apiKey: "pgk_9f8e7d6c5b4a39281706f5e4d3c2b1a0",
    ownerId: "usr_3x4mpl3t3st0rd3r1d2",
    createdAt: "2026-08-13T15:30:00.000Z",
    updatedAt: "2026-08-13T15:30:00.000Z",
  },
} as const;

export const projectList = {
  data: [
    {
      id: "prj_3x4mpl3t3st0rd3r1d2",
      name: "Coffee Shop Demo",
      description: null,
      callbackUrl: "https://merchant.example.com/payments/callback",
      theme: "violet",
      apiKey: "pgk_9f8e7d6c5b4a39281706f5e4d3c2b1a0",
      ownerId: "usr_3x4mpl3t3st0rd3r1d2",
      createdAt: "2026-08-13T15:30:00.000Z",
      updatedAt: "2026-08-13T15:30:00.000Z",
    },
  ],
  total: 1,
  limit: 20,
  offset: 0,
} as const;

export const projectRotatedKey = {
  apiKey: "pgk_a1b2c3d4e5f60718293a4b5c6d7e8f90",
} as const;

export const bankAccountCreated = {
  bankAccount: {
    id: "bka_3x4mpl3t3st0rd3r1d2",
    type: "CBE_BIRR",
    accountName: "Demo Merchant",
    accountNumber: "1000987654321",
    phoneNumber: "251912345678",
    createdAt: "2026-08-13T15:31:00.000Z",
  },
} as const;

export const webhookCreated = {
  webhook: {
    id: "whk_3x4mpl3t3st0rd3r1d2",
    url: "https://merchant.example.com/webhooks/pygate",
    label: null,
    events: ["payment.approved", "payment.rejected"],
    active: true,
    secretPrefix: "whsec_4b1c2d3e4f5a",
    lastDeliveredAt: null,
    createdAt: "2026-08-13T15:31:00.000Z",
    signingSecret: "whsec_4b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
  },
} as const;

export const inviteCreated = {
  inviteId: "inv_3x4mpl3t3st0rd3r1d2",
  token: "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718",
  inviteUrl:
    "https://dashboard.example.com/invite/a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718",
  permissions: ["view_dashboard", "manage_bank_accounts"],
  expiresAt: "2026-08-20T15:31:00.000Z",
} as const;

export const teamList = {
  members: [
    {
      userId: "usr_3x4mpl3t3st0rd3r1d2",
      email: "merchant@example.com",
      name: "Demo Merchant",
      permissions: [
        "view_dashboard",
        "manage_settings",
        "manage_bank_accounts",
        "validate_payments",
        "create_invoice",
        "manage_support",
        "view_logs",
        "manage_team",
      ],
      joinedAt: "2026-08-13T15:30:00.000Z",
    },
  ],
  invites: [],
} as const;

export const errorInvalidAdminKey = {
  error: "Invalid API key",
} as const;

export const errorMissingBearer = {
  error: "Missing or malformed bearer token",
} as const;

export const errorBankAlreadyEnabled = {
  error: "This bank is already enabled for this project",
} as const;
