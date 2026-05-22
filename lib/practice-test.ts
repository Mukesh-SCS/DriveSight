import type { DrivingQuestion, QuestionDifficulty } from "@/lib/states";

export type PreparedChoice = {
  text: string;
  originalIndex: number;
};

export type PreparedQuestion = DrivingQuestion & {
  displayChoices: PreparedChoice[];
  displayAnswerIndex: number;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function prepareQuestions(
  questions: DrivingQuestion[],
  options?: { shuffleQuestions?: boolean; shuffleChoices?: boolean },
): PreparedQuestion[] {
  const shuffleQuestions = options?.shuffleQuestions ?? true;
  const shuffleChoices = options?.shuffleChoices ?? true;

  const ordered = shuffleQuestions ? shuffle(questions) : [...questions];

  return ordered.map((question) => {
    const indexedChoices = question.choices.map((text, originalIndex) => ({
      text,
      originalIndex,
    }));

    const displayChoices = shuffleChoices
      ? shuffle(indexedChoices)
      : indexedChoices;

    const displayAnswerIndex = displayChoices.findIndex(
      (choice) => choice.originalIndex === question.answerIndex,
    );

    return {
      ...question,
      displayChoices,
      displayAnswerIndex: displayAnswerIndex >= 0 ? displayAnswerIndex : 0,
    };
  });
}

export function formatCategory(category: string | undefined) {
  if (!category) {
    return "General";
  }

  return category
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function difficultyLabel(difficulty: QuestionDifficulty | undefined) {
  if (!difficulty) {
    return "Medium";
  }

  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export type ReviewSummary = {
  correct: number;
  wrong: number;
  unanswered: number;
  total: number;
  byCategory: Record<string, { correct: number; total: number }>;
};

export function buildReviewSummary(
  preparedQuestions: PreparedQuestion[],
  answers: Record<string, number | undefined>,
  submitted: boolean,
): ReviewSummary {
  const summary: ReviewSummary = {
    correct: 0,
    wrong: 0,
    unanswered: 0,
    total: preparedQuestions.length,
    byCategory: {},
  };

  for (const question of preparedQuestions) {
    const category = formatCategory(question.category);
    if (!summary.byCategory[category]) {
      summary.byCategory[category] = { correct: 0, total: 0 };
    }

    summary.byCategory[category].total += 1;

    const selected = answers[question.id];
    if (selected === undefined) {
      summary.unanswered += 1;
      continue;
    }

    const isCorrect = submitted && selected === question.displayAnswerIndex;
    if (!submitted) {
      continue;
    }

    if (isCorrect) {
      summary.correct += 1;
      summary.byCategory[category].correct += 1;
    } else {
      summary.wrong += 1;
    }
  }

  return summary;
}
