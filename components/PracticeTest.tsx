"use client";

import { FormEvent, useMemo, useState } from "react";
import type { DrivingQuestion } from "@/lib/states";

type PracticeTestProps = {
  questions: DrivingQuestion[];
  stateName: string;
};

export function PracticeTest({ questions, stateName }: PracticeTestProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    return questions.reduce((total, question) => {
      return answers[question.id] === question.answerIndex ? total + 1 : total;
    }, 0);
  }, [answers, questions]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function resetTest() {
    setAnswers({});
    setSubmitted(false);
  }

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <form className="practice-test" onSubmit={handleSubmit}>
      <div className="test-toolbar">
        <div>
          <p className="eyebrow">{stateName}</p>
          <h1>Practice test</h1>
        </div>
        <div className="score-chip">
          {submitted ? `${score}/${questions.length}` : `${questions.length} questions`}
        </div>
      </div>

      {!submitted ? (
        <div className="test-progress" aria-label="Test progress">
          <div className="test-progress-label">
            <span>Progress</span>
            <strong>
              {answeredCount}/{questions.length}
            </strong>
          </div>
          <div className="test-progress-track">
            <div
              className="test-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="question-stack">
        {questions.map((question, questionIndex) => (
          <fieldset className="question-card" key={question.id}>
            <legend>
              <span>{questionIndex + 1}</span>
              {question.prompt}
            </legend>

            <div className="choice-list">
              {question.choices.map((choice, choiceIndex) => {
                const isSelected = answers[question.id] === choiceIndex;
                const isCorrect = submitted && question.answerIndex === choiceIndex;
                const isWrong = submitted && isSelected && !isCorrect;

                return (
                  <label
                    className={[
                      "choice",
                      isSelected ? "is-selected" : "",
                      isCorrect ? "is-correct" : "",
                      isWrong ? "is-wrong" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={choice}
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
                    <span>{choice}</span>
                  </label>
                );
              })}
            </div>

            {submitted && question.explanation ? (
              <p className="explanation">{question.explanation}</p>
            ) : null}
          </fieldset>
        ))}
      </div>

      <div className="test-actions">
        {submitted ? (
          <button className="secondary-button" onClick={resetTest} type="button">
            Retake
          </button>
        ) : (
          <button
            className="primary-button"
            disabled={Object.keys(answers).length !== questions.length}
            type="submit"
          >
            Check answers
          </button>
        )}
      </div>
    </form>
  );
}
