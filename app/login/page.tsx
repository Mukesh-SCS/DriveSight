import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { login, resetPassword, signUp } from "@/app/auth/actions";
import logo from "@/app/assets/drivesights_logo.png";
import { createClient } from "@/utils/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
    next?: string;
  }>;
};

export const metadata = {
  title: "Login | DriveSight",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const { message, next } = await searchParams;
  const nextPath = next?.startsWith("/") && !next.startsWith("//") ? next : "/";

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-labelledby="login-heading">
        <div className="auth-brand">
          <Image
            alt="DriveSight"
            className="auth-logo"
            priority
            src={logo}
          />
          <p className="eyebrow">DriveSight account</p>
          <h1 id="login-heading">Log in</h1>
        </div>

        {message ? <p className="auth-message">{message}</p> : null}

        <form className="auth-form">
          <input name="next" type="hidden" value={nextPath} />

          <label>
            <span>Email</span>
            <input
              autoComplete="email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              autoComplete="current-password"
              minLength={6}
              name="password"
              placeholder="Your password"
              required
              type="password"
            />
          </label>

          <div className="forgot-password-row">
            <button className="link-button" formAction={resetPassword}>
              Forgot password?
            </button>
          </div>

          <div className="auth-actions">
            <button className="primary-button" formAction={login}>
              Log in
            </button>
            <button className="secondary-button" formAction={signUp}>
              Create account
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
