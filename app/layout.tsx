import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { SITE_CONFIG } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  title: {
    default: `${SITE_CONFIG.name} — DMV Practice Tests for 50 States`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.defaultDescription,
  alternates: { canonical: SITE_CONFIG.baseUrl },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.baseUrl,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — DMV Practice Tests for 50 States`,
    description: SITE_CONFIG.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — DMV Practice Tests for 50 States`,
    description: SITE_CONFIG.defaultDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={jakarta.variable} lang="en" suppressHydrationWarning>
      <body className={jakarta.className} suppressHydrationWarning>
        <Script id="remove-pronounce-extension-root" strategy="beforeInteractive">
          {`
            (() => {
              const removeInjectedNodes = () => {
                document.getElementById("pronounceRootElement")?.remove();
                document
                  .querySelectorAll(".pronounceRootElementItem")
                  .forEach((node) => node.remove());
              };

              removeInjectedNodes();

              const observer = new MutationObserver(removeInjectedNodes);
              observer.observe(document.documentElement, {
                childList: true,
                subtree: true
              });

              window.addEventListener("load", () => observer.disconnect(), {
                once: true
              });
            })();
          `}
        </Script>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
