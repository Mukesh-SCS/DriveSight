import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { HomeStateButton } from "@/components/HomeStateButton";
import { PracticeTest } from "@/components/PracticeTest";
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

  return {
    title: state ? `${state.name} Practice Test | DriveSight` : "Practice Test",
  };
}

export default async function StatePage({ params }: StatePageProps) {
  const { code } = await params;
  const state = getStateByCode(code);

  if (!state) {
    notFound();
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: questionRows } = await supabase
    .from("driving_test_questions")
    .select(
      "id,state_code,prompt,question,choices,options,answer_index,correct_answer_index,explanation,category,difficulty,source,is_active",
    )
    .eq("state_code", state.code)
    .eq("is_active", true)
    .limit(100);

  const questions = normalizeQuestions(questionRows, state.code);

  return (
    <main className="app-shell">
      <div className="page-nav">
        <Link href="/">All states</Link>
        <HomeStateButton stateCode={state.code} stateName={state.name} />
      </div>
      <PracticeTest questions={questions} stateName={state.name} />
    </main>
  );
}
