"use client";

import { useId, useState } from "react";
import { IconEye, IconEyeOff, IconLock } from "@/components/AuthIcons";

type PasswordFieldProps = {
  autoComplete?: string;
  label?: string;
  minLength?: number;
  name?: string;
  placeholder?: string;
  required?: boolean;
};

export function PasswordField({
  autoComplete = "current-password",
  label = "Password",
  minLength = 6,
  name = "password",
  placeholder = "Your password",
  required = false,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();

  return (
    <label className="auth-field" htmlFor={inputId}>
      <span>{label}</span>
      <span className="auth-input-wrap auth-input-wrap-password">
        <IconLock className="auth-field-icon" />
        <input
          autoComplete={autoComplete}
          id={inputId}
          minLength={minLength}
          name={name}
          placeholder={placeholder}
          required={required}
          suppressHydrationWarning
          type={visible ? "text" : "password"}
        />
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          className="password-toggle"
          onClick={() => setVisible((current) => !current)}
          suppressHydrationWarning
          type="button"
        >
          {visible ? (
            <IconEyeOff className="auth-inline-icon" />
          ) : (
            <IconEye className="auth-inline-icon" />
          )}
        </button>
      </span>
    </label>
  );
}
