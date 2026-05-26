import { cookies } from "next/headers";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { createClient } from "@/utils/supabase/server";

const FOOTER_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookies" },
] as const;

export async function SiteFooter() {
  const year = new Date().getFullYear();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-copy">
          © {year} DriveSight. Educational practice only — not affiliated with any DMV
          or state licensing agency.
        </p>
        <nav aria-label="Legal and account" className="site-footer-nav">
          {FOOTER_LINKS.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <form action={logout} className="site-footer-logout-form">
              <button className="site-footer-link-btn" type="submit">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/login">Sign in</Link>
          )}
        </nav>
      </div>
    </footer>
  );
}
