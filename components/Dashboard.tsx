"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ROAD_SIGN_COUNT } from "@/lib/road-signs";
import type { StateSummary } from "@/lib/states";

type DashboardProps = {
  states: StateSummary[];
};

export function Dashboard({ states }: DashboardProps) {
  const [query, setQuery] = useState("");
  const [homeStateCode, setHomeStateCode] = useState("");

  const filteredStates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return states;
    }

    return states.filter(
      (state) =>
        state.name.toLowerCase().includes(normalizedQuery) ||
        state.code.toLowerCase().includes(normalizedQuery),
    );
  }, [query, states]);

  const totalQuestions = states.reduce(
    (total, state) => total + state.questionCount,
    0,
  );

  const homeState = states.find((state) => state.code === homeStateCode);

  useEffect(() => {
    const readHomeState = () => {
      setHomeStateCode(localStorage.getItem("drivesight.homeState") ?? "");
    };

    readHomeState();
    window.addEventListener("storage", readHomeState);
    window.addEventListener("drivesight-home-state-change", readHomeState);

    return () => {
      window.removeEventListener("storage", readHomeState);
      window.removeEventListener("drivesight-home-state-change", readHomeState);
    };
  }, []);

  function handleHomeStateChange(code: string) {
    if (code) {
      localStorage.setItem("drivesight.homeState", code);
    } else {
      localStorage.removeItem("drivesight.homeState");
    }

    setHomeStateCode(code);
    window.dispatchEvent(new Event("drivesight-home-state-change"));
  }

  return (
    <section className="dashboard" aria-label="DriveSight dashboard">
      <header className="dashboard-top">
        <div className="dashboard-intro">
          <h1>State practice tests</h1>
          <p>
            Select your home state, explore the map, and jump into real DMV-style
            questions. Browse{" "}
            <Link href="/guides">free study guides</Link> for all 50 states.
          </p>
        </div>

        <div className="dashboard-actions">
          {homeState ? (
            <Link
              className="primary-button dashboard-primary-cta"
              href={`/states/${homeState.code.toLowerCase()}`}
            >
              Practice {homeState.name}
            </Link>
          ) : null}
          <Link className="feature-card" href="/road-signs">
            <span className="feature-card-icon" aria-hidden="true">
              ⬡
            </span>
            <span className="feature-card-copy">
              <strong>Road symbol signs</strong>
              <small>{ROAD_SIGN_COUNT} reference sheets</small>
            </span>
            <span className="feature-card-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </header>

      <div className="dashboard-metrics" aria-label="Overview">
        <div className="metric-pill">
          <strong>{states.length}</strong>
          <span>states</span>
        </div>
        <div className="metric-pill">
          <strong>{totalQuestions.toLocaleString()}</strong>
          <span>questions</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="map-panel">
          <div className="panel-head">
            <h2>United States</h2>
            <span className="panel-badge">{totalQuestions.toLocaleString()} Qs</span>
          </div>

          <div className="state-map" aria-label="United States state test map">
            <img
              alt=""
              aria-hidden="true"
              className="usa-map-image"
              src="/usa-map.svg"
            />
            {states.map((state) => (
              <Link
                aria-label={`${state.name} practice test, ${state.questionCount} questions`}
                className={`state-pin ${state.code === homeStateCode ? "is-home" : ""}`}
                href={`/states/${state.code.toLowerCase()}`}
                key={state.code}
                style={{ left: `${state.x}%`, top: `${state.y}%` }}
              >
                <span className="state-tooltip">
                  <strong>{state.name}</strong>
                  <small>{state.questionCount.toLocaleString()} questions</small>
                  {state.code === homeStateCode ? <small>Home state</small> : null}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="state-sidebar">
          <div className="sidebar-block">
            <label className="field">
              <span>Home state</span>
              <select
                onChange={(event) => handleHomeStateChange(event.target.value)}
                value={homeStateCode}
              >
                <option value="">Choose your state</option>
                {states.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Search</span>
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name or code (e.g. CA)"
                type="search"
                value={query}
              />
            </label>
          </div>

          <div className="state-list">
            {filteredStates.length === 0 ? (
              <p className="state-list-empty">No states match your search.</p>
            ) : (
              filteredStates.map((state) => (
                <Link
                  className={`state-row ${state.code === homeStateCode ? "is-home-row" : ""}`}
                  href={`/states/${state.code.toLowerCase()}`}
                  key={state.code}
                >
                  <span className="state-code">{state.code}</span>
                  <span className="state-name">{state.name}</span>
                  <span className="state-count">
                    {state.questionCount.toLocaleString()}
                  </span>
                </Link>
              ))
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
