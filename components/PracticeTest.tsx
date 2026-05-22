"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { DrivingQuestion } from "@/lib/states";
import {
  buildReviewSummary,
  difficultyLabel,
  formatCategory,
  prepareQuestions,
  type PreparedQuestion,
} from "@/lib/practice-test";

type PracticeTestProps = {
  questions: DrivingQuestion[];
  stateName: string;
};

type TestMode = "full" | "wrong-only";

function getQuestionStatus(
  question: PreparedQuestion,
  selected: number | undefined,
  submitted: boolean,
) {
  if (!submitted) {
    return selected === undefined ? "unanswered" : "answered";
  }

  if (selected === undefined) {
    return "unanswered";
  }

  return selected === question.displayAnswerIndex ? "correct" : "wrong";
}

export function PracticeTest({ questions, stateName }: PracticeTestProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [testMode, setTestMode] = useState<TestMode>("full");
  const [sessionKey, setSessionKey] = useState(0);
  const [wrongOnlyIds, setWrongOnlyIds] = useState<string[]>([]);

  const sourceQuestions = useMemo(() => {
    if (testMode === "wrong-only" && wrongOnlyIds.length > 0) {
      const idSet = new Set(wrongOnlyIds);
      return questions.filter((question) => idSet.has(question.id));
    }
    return questions;
  }, [questions, testMode, wrongOnlyIds]);

  const preparedQuestions = useMemo(
    () => prepareQuestions(sourceQuestions),
    [sourceQuestions, sessionKey],
  );

  const score = useMemo(() => {
    return preparedQuestions.reduce((total, question) => {
      return answers[question.id] === question.displayAnswerIndex ? total + 1 : total;
    }, 0);
  }, [answers, preparedQuestions]);

  const review = useMemo(
    () => buildReviewSummary(preparedQuestions, answers, submitted),
    [answers, preparedQuestions, submitted],
  );

  const answeredCount = preparedQuestions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;

  const progressPercent =
    preparedQuestions.length === 0
      ? 0
      : Math.round((answeredCount / preparedQuestions.length) * 100);

  const recordAttempts = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const rows = preparedQuestions
        .map((question) => {
          const selected = answers[question.id];
          if (selected === undefined) {
            return null;
          }

          return {
            user_id: user.id,
            question_id: question.id,
            selected_answer_index: selected,
            is_correct: selected === question.displayAnswerIndex,
          };
        })
        .filter((row): row is NonNullable<typeof row> => Boolean(row));

      if (rows.length > 0) {
        await supabase.from("user_question_attempts").insert(rows);
      }
    } catch {
      // Attempt logging should not block the practice flow.
    }
  }, [answers, preparedQuestions]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const missed = preparedQuestions
      .filter((question) => answers[question.id] !== question.displayAnswerIndex)
      .map((question) => question.id);

    setWrongOnlyIds(missed);
    await recordAttempts();
  }

  function startNewSession(mode: TestMode = "full") {
    setAnswers({});
    setSubmitted(false);
    setTestMode(mode);
    setSessionKey((current) => current + 1);
  }

  function practiceWrongOnly() {
    if (wrongOnlyIds.length === 0) {
      return;
    }
    startNewSession("wrong-only");
  }

  if (preparedQuestions.length === 0) {
    return (
      <section className="practice-test">
        <div className="test-toolbar">
          <div>
            <p className="eyebrow">{stateName}</p>
            <h1>Practice test</h1>
          </div>
        </div>
        <p className="test-empty">No questions available for this state yet.</p>
      </section>
    );
  }

  return (
    <form className="practice-test" onSubmit={handleSubmit}>
      <div className="test-toolbar">
        <div>
          <p className="eyebrow">{stateName}</p>
          <h1>
            {testMode === "wrong-only" ? "Review missed questions" : "Practice test"}
          </h1>
          {testMode === "wrong-only" ? (
            <p className="test-mode-note">Practicing {preparedQuestions.length} questions you missed</p>
          ) : null}
        </div>
        <div className="score-chip">
          {submitted
            ? `${score}/${preparedQuestions.length}`
            : `${preparedQuestions.length} questions`}
        </div>
      </div>

      {!submitted ? (
        <div className="test-progress" aria-label="Test progress">
          <div className="test-progress-label">
            <span>Progress</span>
            <strong>
              {answeredCount}/{preparedQuestions.length}
            </strong>
          </div>
          <div className="test-progress-track">
            <div
              className="test-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      ) : (
        <section className="review-summary" aria-label="Test results">
          <h2 className="review-summary-title">Results summary</h2>
          <div className="review-summary-grid">
            <article className="review-stat is-correct">
              <strong>{review.correct}</strong>
              <span>Correct</span>
            </article>
            <article className="review-stat is-wrong">
              <strong>{review.wrong}</strong>
              <span>Wrong</span>
            </article>
            <article className="review-stat is-unanswered">
              <strong>{review.unanswered}</strong>
              <span>Unanswered</span>
            </article>
          </div>
          <ul className="review-category-list">
            {Object.entries(review.byCategory).map(([category, stats]) => (
              <li key={category}>
                <span>{category}</span>
                <strong>
                  {stats.correct}/{stats.total}
                </strong>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="question-stack">
        {preparedQuestions.map((question, questionIndex) => {
          const selected = answers[question.id];
          const status = getQuestionStatus(question, selected, submitted);

          return (
            <fieldset
              className={`question-card is-${status}`}
              key={question.id}
            >
              <legend>
                <span className="question-number">{questionIndex + 1}</span>
                <span className="question-prompt">{question.prompt}</span>
              </legend>

              <div className="question-meta">
                <span className="question-tag">{formatCategory(question.category)}</span>
                <span
                  className={`question-tag difficulty-${question.difficulty ?? "medium"}`}
                >
                  {difficultyLabel(question.difficulty)}
                </span>
              </div>

              <div className="choice-list">
                {question.displayChoices.map((choice, choiceIndex) => {
                  const isSelected = selected === choiceIndex;
                  const isCorrect =
                    submitted && question.displayAnswerIndex === choiceIndex;
                  const isWrong = submitted && isSelected && !isCorrect;

                  return (
                    <label
                      className={[
                        "choice",
                        isSelected ? "is-selected" : "",
                        isCorrect ? "is-correct" : "",
                        isWrong ? "is-wrong" : "",
                        submitted && !isSelected && !isCorrect
                          ? "is-muted"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={`${question.id}-${choice.originalIndex}`}
                    >
                      <input
                        checked={isSelected}
                        disabled={submitted}
                        name={question.id}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: choiceIndex,
                          }))
                        }
                        type="radio"
                      />
                      <span>{choice.text}</span>
                    </label>
                  );
                })}
              </div>

              {submitted && question.explanation ? (
                <p className="explanation">{question.explanation}</p>
              ) : null}
            </fieldset>
          );
        })}
      </div>

      <div className="test-actions">
        {submitted ? (
          <>
            {wrongOnlyIds.length > 0 ? (
              <button
                className="primary-button"
                onClick={practiceWrongOnly}
                type="button"
              >
                Practice wrong answers only ({wrongOnlyIds.length})
              </button>
            ) : null}
            <button
              className="secondary-button"
              onClick={() => startNewSession("full")}
              type="button"
            >
              Retake full test
            </button>
          </>
        ) : (
          <button
            className="primary-button"
            disabled={answeredCount !== preparedQuestions.length}
            type="submit"
          >
            Check answers
          </button>
        )}
      </div>
    </form>
  );
}
