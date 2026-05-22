"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getSafeNextPath(formData);

  if (!email || !password) {
    redirectWithMessage("/login", "Email and password are required", next);
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithMessage("/login", error.message, next);
  }

  redirect(next);
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getSafeNextPath(formData);

  if (!email || !password) {
    redirectWithMessage("/login", "Email and password are required", next);
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${await getSiteOrigin()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    redirectWithMessage("/login", error.message, next);
  }

  redirectWithMessage("/login", "Check your email to confirm your account", next);
}

export async function resetPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const next = getSafeNextPath(formData);

  if (!email) {
    redirectWithMessage("/login", "Enter your email to reset your password", next);
  }

  const cookieStore = await cookies();
  const origin = await getSiteOrigin();
  const supabase = createClient(cookieStore);
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent("/auth/reset-password")}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    redirectWithMessage("/login", error.message, next);
  }

  redirectWithMessage(
    "/login",
    "Password reset email sent. Check your inbox for the link.",
    next,
  );
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!password || password.length < 6) {
    redirectWithMessage(
      "/auth/reset-password",
      "Password must be at least 6 characters",
    );
  }

  if (password !== confirmPassword) {
    redirectWithMessage("/auth/reset-password", "Passwords do not match");
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirectWithMessage("/auth/reset-password", error.message);
  }

  redirect("/?message=Password updated successfully");
}

export async function logout() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  redirect("/login");
}

function getSafeNextPath(formData: FormData) {
  const next = String(formData.get("next") ?? "/");

  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

async function getSiteOrigin() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");

  if (origin) {
    return origin;
  }

  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function redirectWithMessage(
  path: string,
  message: string,
  next?: string,
): never {
  const url = new URL(path, "http://localhost");
  url.searchParams.set("message", message);

  if (next && next !== "/" && path === "/login") {
    url.searchParams.set("next", next);
  }

  redirect(`${url.pathname}${url.search}`);
}
