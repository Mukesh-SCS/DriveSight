import { cookies } from "next/headers";
import { Dashboard } from "@/components/Dashboard";
import { UserProgressPanel } from "@/components/UserProgressPanel";
import { normalizeUserProgress } from "@/lib/progress";
import { buildQuestionCountMap, mergeStateSummaries } from "@/lib/states";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: stateRows }, { data: questionRows }] = await Promise.all([
    supabase.from("state_driving_tests").select("state_code,state_name,question_count"),
    supabase
      .from("driving_test_questions")
      .select("state_code")
      .eq("is_active", true),
  ]);

  const liveCounts = buildQuestionCountMap(questionRows);
  const states = mergeStateSummaries(stateRows, liveCounts);

  const { data: progressRows } = user
    ? await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
    : { data: [] };

  const progress = (progressRows ?? [])
    .map((row) => normalizeUserProgress(row, ""))
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  return (
    <main className="app-shell">
      <Dashboard states={states} />
      <UserProgressPanel progressRows={progress} />
    </main>
  );
}
