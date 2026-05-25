"use server";

import { cookies } from "next/headers";
import {
  computePracticeStreak,
  mergeWeakCategories,
  type UserProgress,
} from "@/lib/progress";
import { createClient } from "@/utils/supabase/server";

type AttemptInput = {
  questionId: string;
  selectedAnswerIndex: number;
  isCorrect: boolean;
  category?: string;
};

export async function recordPracticeSession(
  stateCode: string,
  attempts: AttemptInput[],
) {
  if (attempts.length === 0) {
    return { ok: true as const };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "Not signed in" };
  }

  const code = stateCode.toUpperCase();

  const { error: attemptsError } = await supabase
    .from("user_question_attempts")
    .insert(
      attempts.map((attempt) => ({
        user_id: user.id,
        question_id: attempt.questionId,
        selected_answer_index: attempt.selectedAnswerIndex,
        is_correct: attempt.isCorrect,
      })),
    );

  if (attemptsError) {
    return { ok: false as const, error: attemptsError.message };
  }

  const sessionCorrect = attempts.filter((attempt) => attempt.isCorrect).length;
  const missedCategories = attempts
    .filter((attempt) => !attempt.isCorrect)
    .map((attempt) => attempt.category);

  const { data: existingRow } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("state_code", code)
    .maybeSingle();

  const existing = existingRow as Record<string, unknown> | null;
  const nowIso = new Date().toISOString();

  const previousProgress: UserProgress = {
    stateCode: code,
    totalAttempted: Number(existing?.total_attempted ?? 0),
    totalCorrect: Number(existing?.total_correct ?? 0),
    weakCategories: Array.isArray(existing?.weak_categories)
      ? existing.weak_categories.map(String)
      : [],
    practiceStreak: Number(existing?.practice_streak ?? 0),
    lastPracticeAt: existing?.last_practice_at
      ? String(existing.last_practice_at)
      : null,
  };

  const payload = {
    user_id: user.id,
    state_code: code,
    total_attempted: previousProgress.totalAttempted + attempts.length,
    total_correct: previousProgress.totalCorrect + sessionCorrect,
    weak_categories: mergeWeakCategories(
      previousProgress.weakCategories,
      missedCategories,
    ),
    practice_streak: computePracticeStreak(
      previousProgress.practiceStreak,
      previousProgress.lastPracticeAt,
    ),
    last_practice_at: nowIso,
    updated_at: nowIso,
  };

  const { error: progressError } = await supabase
    .from("user_progress")
    .upsert(payload, { onConflict: "user_id,state_code" });

  if (progressError) {
    return { ok: false as const, error: progressError.message };
  }

  return { ok: true as const };
}
