import { cookies } from "next/headers";
import { Dashboard } from "@/components/Dashboard";
import { mergeStateSummaries } from "@/lib/states";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: stateRows } = await supabase
    .from("state_driving_tests")
    .select("state_code,state_name,question_count");

  const states = mergeStateSummaries(stateRows);

  return (
    <main className="app-shell">
      <Dashboard states={states} />
    </main>
  );
}
