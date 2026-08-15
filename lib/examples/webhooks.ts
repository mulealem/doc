export const webhookSecretCreate = "whsec_test_d3m0nly";

export const payloadPaymentApproved = {
  id: "evt_3x4mpl3v3n71d3",
  type: "payment.approved",
  createdAt: "2026-08-13T15:26:48.000Z",
  data: {
    paymentId: "pay_3x4mpl3p4ym3nt1d",
    orderId: "ord_3x4mpl3t3st0rd3r1d2",
    amount: 250,
    amountMinor: 25000,
    currency: "ETB",
    status: "APPROVED",
    approvedAt: "2026-08-13T15:26:48.000Z",
    payerName: "Abel Tadesse",
    payerAccount: "1000123456789",
    receiverName: "Demo Merchant",
    reference: "TXN9X9K7M",
  },
} as const;

export const payloadPaymentRejected = {
  id: "evt_3x4mpl3v3n71d4",
  type: "payment.rejected",
  createdAt: "2026-08-13T15:27:01.000Z",
  data: {
    paymentId: "pay_3x4mpl3p4ym3nt1d",
    orderId: "ord_3x4mpl3t3st0rd3r1d2",
    amount: 250,
    amountMinor: 25000,
    currency: "ETB",
    status: "REJECTED",
    reason: "AMOUNT_MISMATCH",
    message: "Receipt amount 240 does not match order amount 250.",
  },
} as const;
