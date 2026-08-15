export const orderApiBase = "https://dashboard.example.com/api/v1";

export const curlCreateOrder = `curl -X POST ${orderApiBase}/orders \\
  -H "x-api-key: pgk_test_4b1c2d3e4f5g6h7i" \\
  -H "content-type: application/json" \\
  -d '{
    "amount": 250,
    "description": "Test order",
    "currency": "ETB"
  }'`;

export const curlGetOrder = `curl ${orderApiBase}/orders/ord_3x4mpl3t3st0rd3r1d2 \\
  -H "x-api-key: pgk_test_4b1c2d3e4f5g6h7i"`;

export const curlVerify = `curl -X POST ${orderApiBase}/verify \\
  -H "x-api-key: pgk_test_4b1c2d3e4f5g6h7i" \\
  -H "content-type: application/json" \\
  -d '{ "reference": "TXN9X9K7M", "suffix": "250" }'`;
