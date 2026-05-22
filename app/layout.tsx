import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
