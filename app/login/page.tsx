import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { login, resetPassword, signUp } from "@/app/auth/actions";
import { PasswordField } from "@/components/PasswordField";
import {
  IconEmail,
  IconMap,
  IconQuiz,
  IconSign,
  IconSpark,
} from "@/components/AuthIcons";
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

const FEATURES = [
  {
    icon: IconMap,
    title: "50-state practice",
    description: "DMV-style questions for every state on an interactive map.",
    color: "#2563eb",
  },
  {
    icon: IconSign,
    title: "Road sign library",
    description: "Browse official US road symbol sign sheets while you study.",
    color: "#7c3aed",
  },
  {
    icon: IconQuiz,
    title: "Track your progress",
    description: "Answer practice tests and review explanations instantly.",
    color: "#ea580c",
  },
] as const;

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
    <main className="auth-page">
      <section className="auth-showcase" aria-hidden="false">
        <div className="auth-showcase-glow auth-showcase-glow-a" />
        <div className="auth-showcase-glow auth-showcase-glow-b" />

        <div className="auth-showcase-content">
          <div className="auth-showcase-badge">
            <IconSpark className="auth-inline-icon" />
            <span>Your driving study hub</span>
          </div>

          <h1 className="auth-showcase-title">
            Pass your test with <span>confidence</span>
          </h1>
          <p className="auth-showcase-lead">
            Log in to save progress, pick your home state, and unlock practice tests
            plus the full US road signs reference.
          </p>

          <ul className="auth-feature-list">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li className="auth-feature-item" key={feature.title}>
                  <span
                    className="auth-feature-icon"
                    style={{ background: `${feature.color}18`, color: feature.color }}
                  >
                    <Icon className="auth-inline-icon" />
                  </span>
                  <span>
                    <strong>{feature.title}</strong>
                    <small>{feature.description}</small>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="auth-panel-wrap" aria-labelledby="login-heading">
        <div className="auth-panel">
          <div className="auth-brand">
            <Image alt="DriveSight" className="auth-logo" priority src={logo} />
            <p className="eyebrow auth-eyebrow">DriveSight account</p>
            <h2 id="login-heading">Welcome back</h2>
            <p className="auth-subtitle">
              An account is required to access practice tests and road signs
            </p>
          </div>

          {message ? <p className="auth-message">{message}</p> : null}

          <form className="auth-form">
            <input name="next" type="hidden" value={nextPath} />

            <label className="auth-field">
              <span>Email</span>
              <span className="auth-input-wrap">
                <IconEmail className="auth-field-icon" />
                <input
                  autoComplete="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </span>
            </label>

            <PasswordField required />

            <div className="forgot-password-row">
              <button
                className="link-button"
                formAction={resetPassword}
                formNoValidate
                type="submit"
              >
                Forgot password?
              </button>
            </div>

            <div className="auth-actions">
              <button className="primary-button auth-submit" formAction={login} type="submit">
                Log in
              </button>
              <button className="secondary-button" formAction={signUp} type="submit">
                Create account
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
