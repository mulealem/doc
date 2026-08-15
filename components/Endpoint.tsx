import type { ReactNode } from "react";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const METHOD_COLORS: Record<Method, { bg: string; fg: string }> = {
  GET: { bg: "rgba(59, 130, 246, 0.15)", fg: "#60a5fa" },
  POST: { bg: "rgba(16, 185, 129, 0.15)", fg: "#34d399" },
  PUT: { bg: "rgba(234, 179, 8, 0.15)", fg: "#fbbf24" },
  PATCH: { bg: "rgba(168, 85, 247, 0.15)", fg: "#c084fc" },
  DELETE: { bg: "rgba(239, 68, 68, 0.15)", fg: "#f87171" },
};

export interface EndpointProps {
  method: Method;
  path: string;
  auth?: string;
  children?: ReactNode;
}

export function Endpoint({ method, path, auth, children }: EndpointProps) {
  const c = METHOD_COLORS[method];
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        background: "var(--color-fd-muted, #1a1a1a)",
        border: "1px solid var(--color-fd-border, #2a2a2a)",
        borderRadius: 8,
        margin: "16px 0",
        fontFamily: "var(--font-mono, ui-monospace, monospace)",
        fontSize: "0.95rem",
      }}
    >
      <span
        style={{
          background: c.bg,
          color: c.fg,
          padding: "4px 10px",
          borderRadius: 4,
          fontWeight: 700,
          fontSize: "0.8rem",
          letterSpacing: "0.05em",
        }}
      >
        {method}
      </span>
      <code style={{ fontWeight: 600 }}>{path}</code>
      {auth ? (
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.75rem",
            color: "var(--color-fd-muted-foreground, #888)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {auth}
        </span>
      ) : null}
      {children}
    </div>
  );
}
