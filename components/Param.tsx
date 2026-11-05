import type { ReactNode } from "react";

export interface ParamProps {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  min?: string | number;
  max?: string | number;
  /** Array or comma-separated string — both shapes exist in the content. */
  enum?: string[] | string;
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
  // Normalise `enum="A, B, C"` and `enum={["A","B"]}` to an array. A raw
  // string used to reach `.join()` and crash the static export.
  const enumList = Array.isArray(enumValues)
    ? enumValues
    : typeof enumValues === "string"
      ? enumValues
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [];

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
        {enumList.length > 0 ? (
          <span
            style={{
              fontSize: "0.7rem",
              background: "rgba(107, 114, 128, 0.15)",
              color: "#9ca3af",
              padding: "1px 6px",
              borderRadius: 3,
            }}
          >
            enum: {enumList.join(" · ")}
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
