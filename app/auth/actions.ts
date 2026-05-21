"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getSafeNextPath(formData);

  if (!email || !password) {
    redirectWithMessage(next, "Email and password are required");
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithMessage(next, error.message);
  }

  redirect(next);
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getSafeNextPath(formData);

  if (!email || !password) {
    redirectWithMessage(next, "Email and password are required");
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirectWithMessage(next, error.message);
  }

  redirectWithMessage(next, "Check your email to confirm your account");
}

export async function resetPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const next = getSafeNextPath(formData);

  if (!email) {
    redirectWithMessage(next, "Enter your email to reset your password");
  }

  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "http://localhost:3000";
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/login`,
  });

  if (error) {
    redirectWithMessage(next, error.message);
  }

  redirectWithMessage(next, "Password reset link sent");
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

function redirectWithMessage(next: string, message: string): never {
  const loginUrl = new URL("/login", "http://localhost");
  loginUrl.searchParams.set("message", message);

  if (next !== "/") {
    loginUrl.searchParams.set("next", next);
  }

  redirect(`${loginUrl.pathname}${loginUrl.search}`);
}
