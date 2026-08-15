import { orderApiBase } from "./curl";

export const pythonCreateOrder = `from pygate import Pygate

client = Pygate(api_key=os.environ["PYGATE_API_KEY"])

order = client.orders.create(
    amount=250,
    description="Test order",
    currency="ETB",
)

print(order.payment_url)
# => https://checkout.example.com/pay/ord_…`;

export const pythonGetOrder = `order = client.orders.get("ord_3x4mpl3t3st0rd3r1d2")
print(order.status)  # "PENDING" | "PAID" | "EXPIRED" | "REJECTED"`;

export const pythonVerify = `result = client.verify(
    reference="TXN9X9K7M",
    suffix="250",
)

if result.ok:
    print(result.data.amount)`;

export const pythonRequestsImpl = `import os, requests

res = requests.post(
    "${orderApiBase}/orders",
    headers={"x-api-key": os.environ["PYGATE_API_KEY"]},
    json={"amount": 250, "description": "Test order", "currency": "ETB"},
    timeout=10,
)
res.raise_for_status()
order = res.json()`;
