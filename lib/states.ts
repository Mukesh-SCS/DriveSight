export type StateSummary = {
  code: string;
  name: string;
  questionCount: number;
  x: number;
  y: number;
};

export type DrivingQuestion = {
  id: string;
  stateCode: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
};

export const DEFAULT_STATES: StateSummary[] = [
  { code: "WA", name: "Washington", questionCount: 59, x: 16, y: 9 },
  { code: "OR", name: "Oregon", questionCount: 18, x: 14, y: 22 },
  { code: "CA", name: "California", questionCount: 334, x: 12, y: 46 },
  { code: "NV", name: "Nevada", questionCount: 45, x: 18, y: 38 },
  { code: "ID", name: "Idaho", questionCount: 14, x: 23, y: 23 },
  { code: "MT", name: "Montana", questionCount: 11, x: 32, y: 15 },
  { code: "WY", name: "Wyoming", questionCount: 6, x: 34, y: 31 },
  { code: "UT", name: "Utah", questionCount: 24, x: 26, y: 41 },
  { code: "AZ", name: "Arizona", questionCount: 12, x: 24, y: 61 },
  { code: "CO", name: "Colorado", questionCount: 44, x: 37, y: 45 },
  { code: "NM", name: "New Mexico", questionCount: 11, x: 35, y: 62 },
  { code: "ND", name: "North Dakota", questionCount: 8, x: 46, y: 15 },
  { code: "SD", name: "South Dakota", questionCount: 28, x: 46, y: 28 },
  { code: "NE", name: "Nebraska", questionCount: 9, x: 47, y: 40 },
  { code: "KS", name: "Kansas", questionCount: 32, x: 49, y: 50 },
  { code: "OK", name: "Oklahoma", questionCount: 31, x: 50, y: 60 },
  { code: "TX", name: "Texas", questionCount: 92, x: 46, y: 77 },
  { code: "MN", name: "Minnesota", questionCount: 112, x: 55, y: 22 },
  { code: "IA", name: "Iowa", questionCount: 15, x: 57, y: 38 },
  { code: "MO", name: "Missouri", questionCount: 101, x: 59, y: 50 },
  { code: "AR", name: "Arkansas", questionCount: 54, x: 59, y: 64 },
  { code: "LA", name: "Louisiana", questionCount: 18, x: 60, y: 78 },
  { code: "WI", name: "Wisconsin", questionCount: 38, x: 63, y: 29 },
  { code: "IL", name: "Illinois", questionCount: 131, x: 65, y: 45 },
  { code: "MI", name: "Michigan", questionCount: 90, x: 70, y: 28 },
  { code: "IN", name: "Indiana", questionCount: 79, x: 70, y: 43 },
  { code: "OH", name: "Ohio", questionCount: 157, x: 76, y: 39 },
  { code: "KY", name: "Kentucky", questionCount: 48, x: 72, y: 52 },
  { code: "TN", name: "Tennessee", questionCount: 84, x: 71, y: 62 },
  { code: "MS", name: "Mississippi", questionCount: 83, x: 65, y: 75 },
  { code: "AL", name: "Alabama", questionCount: 42, x: 70, y: 75 },
  { code: "GA", name: "Georgia", questionCount: 39, x: 77, y: 75 },
  { code: "FL", name: "Florida", questionCount: 80, x: 80, y: 88 },
  { code: "SC", name: "South Carolina", questionCount: 34, x: 82, y: 64 },
  { code: "NC", name: "North Carolina", questionCount: 131, x: 84, y: 56 },
  { code: "VA", name: "Virginia", questionCount: 53, x: 84, y: 47 },
  { code: "WV", name: "West Virginia", questionCount: 16, x: 80, y: 45 },
  { code: "PA", name: "Pennsylvania", questionCount: 38, x: 84, y: 36 },
  { code: "NY", name: "New York", questionCount: 104, x: 87, y: 27 },
  { code: "VT", name: "Vermont", questionCount: 16, x: 91, y: 20 },
  { code: "NH", name: "New Hampshire", questionCount: 17, x: 93, y: 21 },
  { code: "ME", name: "Maine", questionCount: 7, x: 95, y: 13 },
  { code: "MA", name: "Massachusetts", questionCount: 107, x: 94, y: 29 },
  { code: "RI", name: "Rhode Island", questionCount: 10, x: 95, y: 34 },
  { code: "CT", name: "Connecticut", questionCount: 32, x: 92, y: 34 },
  { code: "NJ", name: "New Jersey", questionCount: 62, x: 90, y: 40 },
  { code: "DE", name: "Delaware", questionCount: 8, x: 90, y: 48 },
  { code: "MD", name: "Maryland", questionCount: 8, x: 88, y: 47 },
  { code: "DC", name: "District of Columbia", questionCount: 5, x: 87, y: 46 },
  { code: "AK", name: "Alaska", questionCount: 6, x: 33, y: 93 },
  { code: "HI", name: "Hawaii", questionCount: 6, x: 27, y: 95 },
];

export function getStateByCode(code: string) {
  return DEFAULT_STATES.find((state) => state.code === code.toUpperCase());
}

export function mergeStateSummaries(rows: unknown[] | null | undefined) {
  if (!Array.isArray(rows)) {
    return DEFAULT_STATES;
  }

  const byCode = new Map(
    rows
      .map((row) => normalizeStateRow(row))
      .filter((state): state is Pick<StateSummary, "code" | "name" | "questionCount"> =>
        Boolean(state),
      )
      .map((state) => [state.code, state]),
  );

  return DEFAULT_STATES.map((state) => {
    const remote = byCode.get(state.code);
    return remote
      ? {
          ...state,
          name: remote.name || state.name,
          questionCount: remote.questionCount || state.questionCount,
        }
      : state;
  });
}

export function normalizeQuestions(
  rows: unknown[] | null | undefined,
  stateCode: string,
): DrivingQuestion[] {
  if (!Array.isArray(rows) || rows.length === 0) {
    return defaultQuestionsFor(stateCode);
  }

  const questions = rows
    .map((row) => normalizeQuestionRow(row, stateCode))
    .filter((question): question is DrivingQuestion => Boolean(question));

  return questions.length > 0 ? questions : defaultQuestionsFor(stateCode);
}

function normalizeStateRow(row: unknown) {
  if (!row || typeof row !== "object") {
    return null;
  }

  const value = row as Record<string, unknown>;
  const code = String(value.state_code ?? value.code ?? "").toUpperCase();
  const name = String(value.state_name ?? value.name ?? "");
  const questionCount = Number(
    value.question_count ?? value.questions_count ?? value.count ?? 0,
  );

  if (!code) {
    return null;
  }

  return {
    code,
    name,
    questionCount: Number.isFinite(questionCount) ? questionCount : 0,
  };
}

function normalizeQuestionRow(row: unknown, fallbackStateCode: string) {
  if (!row || typeof row !== "object") {
    return null;
  }

  const value = row as Record<string, unknown>;
  const prompt = String(value.prompt ?? value.question ?? "");
  const choices = normalizeChoices(value.choices ?? value.options);
  const answerIndex = Number(
    value.answer_index ?? value.correct_answer_index ?? value.correctIndex ?? 0,
  );

  if (!prompt || choices.length < 2 || !Number.isFinite(answerIndex)) {
    return null;
  }

  return {
    id: String(value.id ?? `${fallbackStateCode}-${prompt}`),
    stateCode: String(value.state_code ?? fallbackStateCode).toUpperCase(),
    prompt,
    choices,
    answerIndex,
    explanation: String(value.explanation ?? ""),
  };
}

function normalizeChoices(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return value
        .split("|")
        .map((choice) => choice.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function defaultQuestionsFor(stateCode: string): DrivingQuestion[] {
  const state = getStateByCode(stateCode);
  const stateName = state?.name ?? stateCode.toUpperCase();

  return [
    {
      id: `${stateCode}-speed-school-zone`,
      stateCode,
      prompt: `In ${stateName}, what should you do when entering a posted school zone?`,
      choices: [
        "Maintain highway speed until children are visible",
        "Reduce speed and obey the posted school-zone limit",
        "Use hazard lights and continue at the same speed",
        "Stop at every crosswalk, even when it is clear",
      ],
      answerIndex: 1,
      explanation:
        "School-zone signs require drivers to slow down and follow the posted limit when the zone is active.",
    },
    {
      id: `${stateCode}-right-on-red`,
      stateCode,
      prompt: "When may a driver turn right at a red light?",
      choices: [
        "After stopping, yielding, and confirming no sign prohibits it",
        "Any time the cross street is not crowded",
        "Only after another vehicle turns first",
        "Without stopping if the lane is clear",
      ],
      answerIndex: 0,
      explanation:
        "A right turn on red generally requires a full stop and yielding to pedestrians and traffic unless a posted sign forbids it.",
    },
    {
      id: `${stateCode}-railroad-crossing`,
      stateCode,
      prompt: "What does a flashing red railroad signal mean?",
      choices: [
        "Slow down and cross if no train is visible",
        "Stop and proceed only when the signal stops and it is safe",
        "Cross quickly before gates lower",
        "Treat it as a yield sign",
      ],
      answerIndex: 1,
      explanation:
        "Flashing red railroad signals require stopping. Continue only after the warning ends and the tracks are clear.",
    },
    {
      id: `${stateCode}-work-zone`,
      stateCode,
      prompt: "What is the safest response to orange work-zone signs?",
      choices: [
        "Change lanes immediately",
        "Increase following distance and watch for workers or lane shifts",
        "Ignore them outside rush hour",
        "Drive on the shoulder to avoid congestion",
      ],
      answerIndex: 1,
      explanation:
        "Orange signs warn of temporary road work. Drivers should slow down, leave space, and expect changing traffic patterns.",
    },
  ];
}
