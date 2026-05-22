"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/auth/actions";
import logo from "@/app/assets/drivesights_logo.png";
import { HeaderNav } from "@/components/HeaderNav";

type AppHeaderClientProps = {
  user: User | null;
};

const AUTH_PATHS = ["/login", "/auth/reset-password"];

export function AppHeaderClient({ user }: AppHeaderClientProps) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((path) => pathname === path);

  return (
    <header className={`app-header ${isAuthPage ? "is-auth" : ""}`}>
      <Link className="brand" href="/">
        <Image alt="DriveSight" className="brand-logo" priority src={logo} />
        <span>DriveSight</span>
      </Link>

      {!isAuthPage ? <HeaderNav /> : <div className="header-spacer" aria-hidden="true" />}

      <nav className="header-actions" aria-label="Account">
        {isAuthPage ? null : user ? (
          <>
            <span className="user-email">{user.email}</span>
            <form action={logout}>
              <button className="text-button" type="submit">
                Log out
              </button>
            </form>
          </>
        ) : (
          <Link className="text-button" href="/login">
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}
