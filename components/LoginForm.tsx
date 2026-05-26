"use client";

import Link from "next/link";
import { login, resetPassword, signUp } from "@/app/auth/actions";
import { PasswordField } from "@/components/PasswordField";
import { IconEmail } from "@/components/AuthIcons";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  return (
    <form className="auth-form" suppressHydrationWarning>
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
            suppressHydrationWarning
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
          suppressHydrationWarning
          type="submit"
        >
          Forgot password?
        </button>
      </div>

      <div className="auth-actions">
        <button
          className="primary-button auth-submit"
          formAction={login}
          suppressHydrationWarning
          type="submit"
        >
          Log in
        </button>
        <button
          className="secondary-button"
          formAction={signUp}
          suppressHydrationWarning
          type="submit"
        >
          Create account
        </button>
      </div>

      <p className="auth-legal-note">
        By signing in, you agree to our{" "}
        <Link href="/terms">Terms</Link>, <Link href="/privacy">Privacy Policy</Link>, and{" "}
        <Link href="/cookies">Cookie Policy</Link>.
      </p>
    </form>
  );
}
