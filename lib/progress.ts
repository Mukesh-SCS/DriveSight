import type { DrivingQuestion, QuestionDifficulty } from "@/lib/states";
import { formatCategory } from "@/lib/practice-test";

export type UserProgress = {
  stateCode: string;
  totalAttempted: number;
  totalCorrect: number;
  weakCategories: string[];
  practiceStreak: number;
  lastPracticeAt: string | null;
};

export type AdaptiveTier = "easy" | "medium" | "hard";

export function normalizeUserProgress(
  row: unknown,
  fallbackStateCode: string,
): UserProgress | null {
  if (!row || typeof row !== "object") {
    return null;
  }

  const value = row as Record<string, unknown>;
  const stateCode = String(value.state_code ?? fallbackStateCode).toUpperCase();

  return {
    stateCode,
    totalAttempted: Number(value.total_attempted ?? 0),
    totalCorrect: Number(value.total_correct ?? 0),
    weakCategories: Array.isArray(value.weak_categories)
      ? value.weak_categories.map(String)
      : [],
    practiceStreak: Number(value.practice_streak ?? 0),
    lastPracticeAt: value.last_practice_at
      ? String(value.last_practice_at)
      : null,
  };
}

export function getAccuracyPercent(progress: UserProgress | null | undefined) {
  if (!progress || progress.totalAttempted === 0) {
    return 0;
  }

  return Math.round((progress.totalCorrect / progress.totalAttempted) * 100);
}

export function getAdaptiveTier(progress: UserProgress | null | undefined): AdaptiveTier {
  const accuracy = getAccuracyPercent(progress);

  if (progress && progress.totalAttempted >= 20 && accuracy >= 80) {
    return "hard";
  }

  if (progress && progress.totalAttempted >= 10 && accuracy >= 50) {
    return "medium";
  }

  return "easy";
}

export function adaptiveTierLabel(tier: AdaptiveTier) {
  if (tier === "hard") {
    return "Advanced";
  }
  if (tier === "medium") {
    return "Building skills";
  }
  return "Foundations";
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function pickWeightedQuestions(
  questions: DrivingQuestion[],
  tier: AdaptiveTier,
  limit: number,
) {
  const weights: Record<QuestionDifficulty, number> =
    tier === "hard"
      ? { easy: 1, medium: 2, hard: 4 }
      : tier === "medium"
        ? { easy: 2, medium: 4, hard: 2 }
        : { easy: 4, medium: 3, hard: 1 };

  const weighted = questions.flatMap((question) => {
    const difficulty = question.difficulty ?? "medium";
    const weight = weights[difficulty];
    return Array.from({ length: weight }, () => question);
  });

  const unique: DrivingQuestion[] = [];
  const seen = new Set<string>();

  for (const question of shuffle(weighted)) {
    if (seen.has(question.id)) {
      continue;
    }
    seen.add(question.id);
    unique.push(question);
    if (unique.length >= limit) {
      break;
    }
  }

  if (unique.length < limit) {
    for (const question of shuffle(questions)) {
      if (seen.has(question.id)) {
        continue;
      }
      seen.add(question.id);
      unique.push(question);
      if (unique.length >= limit) {
        break;
      }
    }
  }

  return shuffle(unique);
}

export function selectAdaptiveQuestions(
  questions: DrivingQuestion[],
  progress: UserProgress | null | undefined,
  limit = 25,
) {
  if (questions.length === 0) {
    return { questions: [], tier: "easy" as AdaptiveTier };
  }

  const tier = getAdaptiveTier(progress);
  const pool = pickWeightedQuestions(questions, tier, Math.min(limit, questions.length));

  return { questions: pool, tier };
}

export function mergeWeakCategories(
  existing: string[],
  sessionMissed: Array<string | undefined>,
) {
  const counts = new Map<string, number>();

  for (const category of existing) {
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  for (const category of sessionMissed) {
    if (!category) {
      continue;
    }
    const label = formatCategory(category);
    counts.set(label, (counts.get(label) ?? 0) + 2);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category]) => category);
}

export function computePracticeStreak(
  previousStreak: number,
  lastPracticeAt: string | null | undefined,
  now = new Date(),
) {
  if (!lastPracticeAt) {
    return 1;
  }

  const last = new Date(lastPracticeAt);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfLast = new Date(
    last.getFullYear(),
    last.getMonth(),
    last.getDate(),
  );

  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((startOfToday.getTime() - startOfLast.getTime()) / dayMs);

  if (diffDays === 0) {
    return Math.max(previousStreak, 1);
  }

  if (diffDays === 1) {
    return previousStreak + 1;
  }

  return 1;
}
