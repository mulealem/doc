import type { ReactNode } from "react";

export interface ParamProps {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  min?: string | number;
  max?: string | number;
  enum?: string[];
  children: ReactNode;
}

export function Param({
  name,
  type,
  required,
  default: defaultValue,
  min,
  max,
  enum: enumValues,
  children,
}: ParamProps) {
  return (
    <div
      data-param-name={name}
      data-param-type={type}
      data-param-required={required ? "true" : undefined}
      style={{
        borderLeft: "2px solid var(--color-fd-border, #2a2a2a)",
        paddingLeft: 16,
        margin: "16px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <code
          style={{
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "var(--color-fd-primary, #5b8def)",
          }}
        >
          {name}
        </code>
        <span style={{ fontSize: "0.8rem", color: "var(--color-fd-muted-foreground, #888)" }}>
          {type}
        </span>
        {required ? (
          <span
            style={{
              fontSize: "0.7rem",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#f87171",
              padding: "1px 6px",
              borderRadius: 3,
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            REQUIRED
          </span>
        ) : null}
        {defaultValue !== undefined ? (
          <span
            style={{
              fontSize: "0.7rem",
              background: "rgba(107, 114, 128, 0.15)",
              color: "#9ca3af",
              padding: "1px 6px",
              borderRadius: 3,
            }}
          >
            default: <code>{defaultValue}</code>
          </span>
        ) : null}
        {min !== undefined || max !== undefined ? (
          <span
            style={{
              fontSize: "0.7rem",
              background: "rgba(107, 114, 128, 0.15)",
              color: "#9ca3af",
              padding: "1px 6px",
              borderRadius: 3,
            }}
          >
            {min !== undefined ? `min: ${min}` : ""}
            {min !== undefined && max !== undefined ? " · " : ""}
            {max !== undefined ? `max: ${max}` : ""}
          </span>
        ) : null}
        {enumValues && enumValues.length > 0 ? (
          <span
            style={{
              fontSize: "0.7rem",
              background: "rgba(107, 114, 128, 0.15)",
              color: "#9ca3af",
              padding: "1px 6px",
              borderRadius: 3,
            }}
          >
            enum: {enumValues.join(" · ")}
          </span>
        ) : null}
      </div>
      <div style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

export interface ParamsProps {
  children: ReactNode;
}

export function Params({ children }: ParamsProps) {
  return (
    <div
      style={{
        margin: "16px 0",
        padding: "4px 0",
      }}
    >
      {children}
    </div>
  );
}
