import Link from "next/link";
import {
  adaptiveTierLabel,
  getAccuracyPercent,
  getAdaptiveTier,
  type UserProgress,
} from "@/lib/progress";
import { getStateByCode } from "@/lib/states";

type UserProgressPanelProps = {
  progressRows: UserProgress[];
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not yet";
  }

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UserProgressPanel({ progressRows }: UserProgressPanelProps) {
  if (progressRows.length === 0) {
    return (
      <section className="progress-panel progress-panel-empty progress-panel--colorful">
        <span className="progress-empty-icon" aria-hidden="true">
          📊
        </span>
        <h2>Your study progress</h2>
        <p>Complete a practice test to unlock accuracy stats, streaks, and weak-area tracking.</p>
      </section>
    );
  }

  const sorted = [...progressRows].sort(
    (a, b) => b.totalAttempted - a.totalAttempted,
  );

  const totalAttempted = sorted.reduce((sum, row) => sum + row.totalAttempted, 0);
  const totalCorrect = sorted.reduce((sum, row) => sum + row.totalCorrect, 0);
  const overallAccuracy =
    totalAttempted === 0 ? 0 : Math.round((totalCorrect / totalAttempted) * 100);

  return (
    <section className="progress-panel progress-panel--colorful" aria-label="Your study progress">
      <div className="progress-panel-head">
        <h2>Your study progress</h2>
        <div className="progress-overview">
          <article className="progress-overview-stat progress-stat--tried">
            <strong>{totalAttempted}</strong>
            <span>Questions tried</span>
          </article>
          <article className="progress-overview-stat progress-stat--accuracy">
            <strong>{overallAccuracy}%</strong>
            <span>Overall accuracy</span>
          </article>
          <article className="progress-overview-stat progress-stat--streak">
            <strong>{Math.max(...sorted.map((row) => row.practiceStreak), 0)}</strong>
            <span>Best streak (days)</span>
          </article>
        </div>
      </div>

      <ul className="progress-state-list">
        {sorted.map((progress) => {
          const state = getStateByCode(progress.stateCode);
          const accuracy = getAccuracyPercent(progress);
          const tier = getAdaptiveTier(progress);

          return (
            <li className="progress-state-card" key={progress.stateCode}>
              <div className="progress-state-top">
                <div>
                  <strong>{state?.name ?? progress.stateCode}</strong>
                  <span>{adaptiveTierLabel(tier)} · Last practice {formatDate(progress.lastPracticeAt)}</span>
                </div>
                <Link
                  className="progress-practice-btn"
                  href={`/states/${progress.stateCode.toLowerCase()}`}
                >
                  Practice
                </Link>
              </div>

              <div className="progress-state-metrics">
                <span>
                  <strong>{accuracy}%</strong> accuracy
                </span>
                <span>
                  <strong>{progress.totalCorrect}</strong> / {progress.totalAttempted} correct
                </span>
                <span>
                  <strong>{progress.practiceStreak}</strong> day streak
                </span>
              </div>

              {progress.weakCategories.length > 0 ? (
                <div className="progress-weak-tags">
                  <span>Weak areas:</span>
                  {progress.weakCategories.map((category) => (
                    <span className="progress-weak-tag" key={category}>
                      {category}
                    </span>
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
