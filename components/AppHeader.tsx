import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { logout } from "@/app/auth/actions";
import logo from "@/app/assets/drivesights_logo.png";
import { createClient } from "@/utils/supabase/server";

export async function AppHeader() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="app-header">
      <Link className="brand" href="/">
        <Image
          alt="DriveSight"
          className="brand-logo"
          priority
          src={logo}
        />
        <span>DriveSight</span>
      </Link>

      <nav className="header-actions" aria-label="Account">
        {user ? (
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
