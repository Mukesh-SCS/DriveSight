"use client";

import { updatePassword } from "@/app/auth/actions";
import { PasswordField } from "@/components/PasswordField";

export function ResetPasswordForm() {
  return (
    <form className="auth-form" suppressHydrationWarning>
      <PasswordField
        autoComplete="new-password"
        label="New password"
        name="password"
        placeholder="At least 6 characters"
        required
      />

      <PasswordField
        autoComplete="new-password"
        label="Confirm password"
        name="confirmPassword"
        placeholder="Re-enter your password"
        required
      />

      <div className="auth-actions">
        <button
          className="primary-button auth-submit"
          formAction={updatePassword}
          suppressHydrationWarning
          type="submit"
        >
          Update password
        </button>
      </div>
    </form>
  );
}
