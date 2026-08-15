import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        maxWidth: 640,
        margin: "120px auto",
        padding: "0 24px",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", margin: 0 }}>404</h1>
      <p style={{ marginTop: 16, opacity: 0.7 }}>The page you were looking for doesn’t exist.</p>
      <p style={{ marginTop: 24 }}>
        <Link href="/" style={{ color: "#5b8def" }}>
          ← Back to PyGate Docs
        </Link>
      </p>
    </main>
  );
}
