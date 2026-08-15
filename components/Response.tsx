export interface ResponseProps {
  status: number | string;
  body?: object | string;
  description?: string;
}

const STATUS_COLORS: Record<string, { bg: string; fg: string; label: string }> = {
  "200": { bg: "rgba(16, 185, 129, 0.15)", fg: "#34d399", label: "200 OK" },
  "201": { bg: "rgba(16, 185, 129, 0.15)", fg: "#34d399", label: "201 Created" },
  "204": { bg: "rgba(16, 185, 129, 0.15)", fg: "#34d399", label: "204 No Content" },
  "400": { bg: "rgba(234, 179, 8, 0.15)", fg: "#fbbf24", label: "400 Bad Request" },
  "401": { bg: "rgba(239, 68, 68, 0.15)", fg: "#f87171", label: "401 Unauthorized" },
  "404": { bg: "rgba(239, 68, 68, 0.15)", fg: "#f87171", label: "404 Not Found" },
  "429": { bg: "rgba(234, 179, 8, 0.15)", fg: "#fbbf24", label: "429 Too Many Requests" },
  "502": { bg: "rgba(239, 68, 68, 0.15)", fg: "#f87171", label: "502 Bad Gateway" },
};

export function Response({ status, body, description }: ResponseProps) {
  const key = String(status);
  const c = STATUS_COLORS[key] ?? {
    bg: "rgba(107, 114, 128, 0.15)",
    fg: "#9ca3af",
    label: key,
  };
  const bodyStr =
    typeof body === "string"
      ? body
      : body !== undefined
        ? JSON.stringify(body, null, 2)
        : undefined;

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
          padding: "8px 12px",
          background: c.bg,
          borderBottom: "1px solid var(--color-fd-border, #2a2a2a)",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.85rem",
          fontWeight: 600,
          color: c.fg,
        }}
      >
        {c.label}
      </div>
      {description ? (
        <div
          style={{
            padding: "8px 12px",
            background: "var(--color-fd-muted, #1a1a1a)",
            color: "var(--color-fd-muted-foreground, #888)",
            fontSize: "0.85rem",
            borderBottom: "1px solid var(--color-fd-border, #2a2a2a)",
          }}
        >
          {description}
        </div>
      ) : null}
      {bodyStr !== undefined ? (
        <pre
          style={{
            margin: 0,
            padding: "12px 16px",
            background: "var(--color-fd-muted, #1a1a1a)",
            overflowX: "auto",
            fontSize: "0.85rem",
            lineHeight: 1.5,
          }}
        >
          <code>{bodyStr}</code>
        </pre>
      ) : null}
    </div>
  );
}
