import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";
import { source } from "@/lib/source";
import { PyGateLogo } from "@/components/logo";
import "./globals.css";

const dashboardUrl =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://dashboard.example.com";

export const metadata: Metadata = {
  title: { default: "PyGate Docs", template: "%s — PyGate Docs" },
  description: "PyGate developer documentation",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://docs.example.com",
  ),
  icons: { icon: "/favicon.svg" },
};

function Footer() {
  return (
    <footer
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0 1.25rem",
        marginTop: "4rem",
        paddingTop: "1rem",
        borderTop: "1px solid var(--color-fd-border, #2a2a2a)",
        fontSize: "0.85rem",
        color: "var(--color-fd-muted-foreground, #888)",
      }}
    >
      <span>© {new Date().getFullYear()} PyGate. Receipt-based payments.</span>
      <span style={{ display: "flex", gap: "1.25rem", marginLeft: "auto" }}>
        <Link href="/security">Security</Link>
        <Link href="/changelog">Changelog</Link>
        <a href={dashboardUrl} target="_blank" rel="noreferrer">
          Dashboard
        </a>
      </span>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <RootProvider
          search={{
            // Static export: the search index is prerendered to a static
            // JSON file during `next build` (see app/api/search/route.ts).
            options: { type: "static", api: "/api/search" },
          }}
        >
          <DocsLayout
            tree={source.pageTree}
            nav={{ title: <PyGateLogo />, url: "/" }}
            sidebar={{ defaultOpenLevel: 1 }}
            themeSwitch={{ mode: "light-dark-system" }}
            githubUrl="https://github.com/pygate/pygate"
            links={[
              {
                type: "button",
                text: "Dashboard",
                url: dashboardUrl,
                external: true,
              },
            ]}
          >
            {children}
            <Footer />
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
