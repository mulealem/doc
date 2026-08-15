import { orderApiBase } from "./curl";

export const nodeCreateOrder = `import { createOrder } from "@pygate/node";

const order = await createOrder({
  apiKey: process.env.PYGATE_API_KEY,
  amount: 250,
  description: "Test order",
  currency: "ETB",
});

console.log(order.paymentUrl);
// => https://checkout.example.com/pay/ord_…`;

export const nodeGetOrder = `import { getOrder } from "@pygate/node";

const order = await getOrder({
  apiKey: process.env.PYGATE_API_KEY,
  orderId: "ord_3x4mpl3t3st0rd3r1d2",
});

console.log(order.status); // "PENDING" | "PAID" | "EXPIRED" | "REJECTED"`;

export const nodeVerify = `import { verify } from "@pygate/node";

const result = await verify({
  apiKey: process.env.PYGATE_API_KEY,
  reference: "TXN9X9K7M",
  suffix: "250",
});

if (result.ok) {
  console.log(result.data.amount); // 250
}`;

export const nodeFetchImpl = `// Or, without the SDK:
const res = await fetch("${orderApiBase}/orders", {
  method: "POST",
  headers: {
    "x-api-key": process.env.PYGATE_API_KEY,
    "content-type": "application/json",
  },
  body: JSON.stringify({
    amount: 250,
    description: "Test order",
    currency: "ETB",
  }),
});

const order = await res.json();`;
