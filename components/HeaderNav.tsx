"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "States" },
  { href: "/road-signs", label: "Road signs" },
] as const;

/** Paths where main app nav tabs should not show as active */
const NEUTRAL_PATHS = new Set([
  "/terms",
  "/privacy",
  "/cookies",
  "/login",
  "/guides",
  "/auth/reset-password",
]);

function isNavItemActive(pathname: string, href: string): boolean {
  if (NEUTRAL_PATHS.has(pathname)) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href;
}

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="header-nav" aria-label="Main">
      {NAV_ITEMS.map((item) => {
        const isActive = isNavItemActive(pathname, item.href);

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={`header-nav-link ${isActive ? "is-active" : ""}`}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
