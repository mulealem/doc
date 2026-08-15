import { computeSignature } from "@/lib/signing";

export interface WebhookEventProps {
  name: string;
  payload: object;
  secret?: string;
  deliveryId?: string;
}

// Fixed example timestamp. A "live" `Date.now()` would differ between the
// pre-rendered HTML and the hydrated client, so the static export keeps the
// timestamp (and the signature derived from it) deterministic per build.
const EXAMPLE_TIMESTAMP = 1752499200; // 2025-07-14T12:00:00Z

export function WebhookEvent({
  name,
  payload,
  secret = "whsec_test_d3m0nly",
  deliveryId = "dly_3x4mpl3_d3l1v3ry",
}: WebhookEventProps) {
  const payloadStr = JSON.stringify(payload, null, 2);
  const sig = computeSignature(payload, secret, EXAMPLE_TIMESTAMP);

  return (
    <div
      style={{
        margin: "16px 0",
        border: "1px solid var(--color-fd-border, #2a2a2a)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          background: "rgba(91, 141, 239, 0.1)",
          borderBottom: "1px solid var(--color-fd-border, #2a2a2a)",
          fontFamily: "var(--font-mono, monospace)",
        }}
      >
        <span
          style={{
            background: "rgba(91, 141, 239, 0.2)",
            color: "#5b8def",
            padding: "2px 8px",
            borderRadius: 3,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          EVENT
        </span>
        <code style={{ fontWeight: 600 }}>{name}</code>
      </div>
      <div
        style={{
          padding: "10px 14px",
          background: "var(--color-fd-muted, #1a1a1a)",
          fontSize: "0.85rem",
          borderBottom: "1px solid var(--color-fd-border, #2a2a2a)",
        }}
      >
        <div style={{ marginBottom: 4 }}>
          <span style={{ color: "var(--color-fd-muted-foreground, #888)" }}>
            <code>x-pygate-timestamp</code>:
          </span>{" "}
          <code>{EXAMPLE_TIMESTAMP}</code>
        </div>
        <div style={{ marginBottom: 4 }}>
          <span style={{ color: "var(--color-fd-muted-foreground, #888)" }}>
            <code>x-pygate-signature</code>:
          </span>{" "}
          <code style={{ wordBreak: "break-all" }}>sha256={sig.slice(0, 16)}…</code>
        </div>
        <div>
          <span style={{ color: "var(--color-fd-muted-foreground, #888)" }}>
            <code>x-pygate-delivery-id</code>:
          </span>{" "}
          <code>{deliveryId}</code>
        </div>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "12px 16px",
          background: "var(--color-fd-muted, #1a1a1a)",
          overflowX: "auto",
          fontSize: "0.85rem",
          lineHeight: 1.5,
          borderTop: "1px solid var(--color-fd-border, #2a2a2a)",
        }}
      >
        <code>{payloadStr}</code>
      </pre>
    </div>
  );
}
