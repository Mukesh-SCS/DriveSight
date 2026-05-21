import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "DriveSight",
  description: "State-based driving practice tests powered by Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
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
