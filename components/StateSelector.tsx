"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { StateSummary } from "@/lib/states";

type StateSelectorProps = {
  states: StateSummary[];
};

export function StateSelector({ states }: StateSelectorProps) {
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
    <section className="state-workspace" aria-label="State driving tests">
      <div className="map-panel">
        <div className="map-header">
          <div>
            <p className="eyebrow">Driving tests</p>
            <h1>Choose a state</h1>
          </div>
          <div className="question-total">
            <strong>{totalQuestions.toLocaleString()}</strong>
            <span>questions</span>
          </div>
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
      </div>

      <aside className="state-list-panel">
        <label className="home-state-field">
          <span>Home state</span>
          <select
            onChange={(event) => handleHomeStateChange(event.target.value)}
            value={homeStateCode}
          >
            <option value="">Not selected</option>
            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </label>

        <label className="search-field">
          <span>State</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search state or code"
            type="search"
            value={query}
          />
        </label>

        <div className="state-list">
          {filteredStates.map((state) => (
            <Link
              className="state-row"
              href={`/states/${state.code.toLowerCase()}`}
              key={state.code}
            >
              <span className="state-code">{state.code}</span>
              <span className="state-name">{state.name}</span>
              <span className="state-count">
                {state.questionCount.toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
      </aside>
    </section>
  );
}
