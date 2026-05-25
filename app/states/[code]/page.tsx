import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { HomeStateButton } from "@/components/HomeStateButton";
import { PracticeTest } from "@/components/PracticeTest";
import {
  adaptiveTierLabel,
  normalizeUserProgress,
  selectAdaptiveQuestions,
} from "@/lib/progress";
import { buildAppPageMetadata } from "@/lib/seo/metadata";
import { getStateProfileByCode } from "@/lib/seo/taxonomy";
import { testTypePath } from "@/lib/seo/urls";
import { getStateByCode, normalizeQuestions } from "@/lib/states";
import { createClient } from "@/utils/supabase/server";

type StatePageProps = {
  params: Promise<{
    code: string;
  }>;
};

export async function generateMetadata({ params }: StatePageProps) {
  const { code } = await params;
  const state = getStateByCode(code);

  if (!state) {
    return { title: "Practice Test", robots: { index: false } };
  }

  const profile = getStateProfileByCode(state.code);

  return buildAppPageMetadata(
    `${state.name} Practice Test`,
    `Interactive ${state.name} learner permit practice for signed-in users.`,
    `/states/${state.code.toLowerCase()}`,
  );
}

export default async function StatePage({ params }: StatePageProps) {
  const { code } = await params;
  const state = getStateByCode(code);
  const profile = state ? getStateProfileByCode(state.code) : undefined;

  if (!state) {
    notFound();
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: progressRow } = user
    ? await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("state_code", state.code)
        .maybeSingle()
    : { data: null };

  const progress = normalizeUserProgress(progressRow, state.code);

  const { data: questionRows } = await supabase
    .from("driving_test_questions")
    .select(
      "id,state_code,prompt,question,choices,options,answer_index,correct_answer_index,explanation,category,difficulty,source,is_active",
    )
    .eq("state_code", state.code)
    .eq("is_active", true)
    .limit(100);

  const allQuestions = normalizeQuestions(questionRows, state.code);
  const { questions, tier } = selectAdaptiveQuestions(allQuestions, progress, 25);

  return (
    <main className="app-shell">
      <div className="page-nav">
        <Link href="/">All states</Link>
        {profile ? (
          <Link href={testTypePath(profile.slug, "dmv-practice-test")}>
            Public study guide
          </Link>
        ) : null}
        <HomeStateButton stateCode={state.code} stateName={state.name} />
      </div>
      <PracticeTest
        adaptiveTier={tier}
        questions={questions}
        stateCode={state.code}
        stateName={state.name}
        totalInBank={allQuestions.length}
      />
      {progress ? (
        <p className="test-mode-note page-progress-note">
          Your {state.name} accuracy is tracked · current level: {adaptiveTierLabel(tier)}
        </p>
      ) : null}
    </main>
  );
}
