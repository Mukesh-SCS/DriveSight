import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import logo from "@/app/assets/drivesights_logo.png";
import { createClient } from "@/utils/supabase/server";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export const metadata = {
  title: "Reset Password | DriveSight",
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Sign in or use the link from your reset email");
  }

  const { message } = await searchParams;

  return (
    <main className="auth-shell auth-shell-centered">
      <section className="auth-panel" aria-labelledby="reset-password-heading">
        <div className="auth-brand">
          <Image alt="DriveSight" className="auth-logo" priority src={logo} />
          <p className="eyebrow auth-eyebrow">DriveSight account</p>
          <h1 id="reset-password-heading">Set a new password</h1>
          <p className="auth-subtitle">Choose a new password for {user.email}</p>
        </div>

        {message ? <p className="auth-message">{message}</p> : null}

        <ResetPasswordForm />

        <p className="auth-guest">
          <Link href="/">Back to dashboard</Link>
        </p>
      </section>
    </main>
  );
}
