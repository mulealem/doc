import { orderApiBase } from "./curl";

export const phpCreateOrder = `<?php
use Pygate\\Pygate;

$client = new Pygate(getenv("PYGATE_API_KEY"));

$order = $client->orders->create([
    "amount" => 250,
    "description" => "Test order",
    "currency" => "ETB",
]);

echo $order->paymentUrl;`;

export const phpGetOrder = `<?php
$order = $client->orders->get("ord_3x4mpl3t3st0rd3r1d2");
echo $order->status;`;

export const phpVerify = `<?php
$result = $client->verify([
    "reference" => "TXN9X9K7M",
    "suffix" => "250",
]);

if ($result->ok) {
    echo $result->data->amount;
}`;

export const phpCurlImpl = `<?php
$ch = curl_init("${orderApiBase}/orders");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "x-api-key: " . getenv("PYGATE_API_KEY"),
        "content-type: application/json",
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "amount" => 250,
        "description" => "Test order",
        "currency" => "ETB",
    ]),
]);

$response = curl_exec($ch);
$order = json_decode($response, true);`;
