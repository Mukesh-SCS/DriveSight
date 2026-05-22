import { cookies } from "next/headers";
import { AppHeaderClient } from "@/components/AppHeaderClient";
import { createClient } from "@/utils/supabase/server";

export async function AppHeader() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AppHeaderClient user={user} />;
}
