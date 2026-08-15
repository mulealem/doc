/**
 * PyGate wordmark used in the navbar and favicon.
 * "Py" carries the brand accent; the rest adapts to the theme.
 */
export function PyGateLogo() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        fontWeight: 700,
        fontSize: "1.05rem",
      }}
    >
      <span style={{ color: "#5b8def" }}>Py</span>
      <span>Gate</span>
      <span
        style={{
          color: "var(--color-fd-muted-foreground, #888)",
          fontWeight: 400,
        }}
      >
        Docs
      </span>
    </span>
  );
}
