import { orderApiBase } from "./curl";

export const goCreateOrder = `package main

import (
    "context"
    "os"

    "github.com/pygate/pygate-go"
)

func main() {
    client := pygate.New(os.Getenv("PYGATE_API_KEY"))

    order, err := client.Orders.Create(context.Background(), pygate.OrderCreateParams{
        Amount:      250,
        Description: "Test order",
        Currency:    "ETB",
    })
    if err != nil {
        panic(err)
    }

    println(order.PaymentURL)
}`;

export const goGetOrder = `order, err := client.Orders.Get(context.Background(), "ord_3x4mpl3t3st0rd3r1d2")
if err != nil {
    panic(err)
}
println(order.Status)`;

export const goVerify = `result, err := client.Verify(context.Background(), pygate.VerifyParams{
    Reference: "TXN9X9K7M",
    Suffix:    "250",
})
if err != nil {
    panic(err)
}
if result.OK {
    println(result.Data.Amount)
}`;

export const goNetHttpImpl = `package main

import (
    "bytes"
    "encoding/json"
    "net/http"
    "os"
)

func main() {
    body, _ := json.Marshal(map[string]any{
        "amount":      250,
        "description": "Test order",
        "currency":    "ETB",
    })

    req, _ := http.NewRequest("POST", "${orderApiBase}/orders", bytes.NewReader(body))
    req.Header.Set("x-api-key", os.Getenv("PYGATE_API_KEY"))
    req.Header.Set("content-type", "application/json")

    res, err := http.DefaultClient.Do(req)
    if err != nil {
        panic(err)
    }
    defer res.Body.Close()
}`;
