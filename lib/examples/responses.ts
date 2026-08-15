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
