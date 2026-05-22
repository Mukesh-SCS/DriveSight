"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "States" },
  { href: "/road-signs", label: "Road signs" },
] as const;

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="header-nav" aria-label="Main">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

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
