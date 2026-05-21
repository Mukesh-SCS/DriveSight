"use client";

import { useEffect, useState } from "react";

type HomeStateButtonProps = {
  stateCode: string;
  stateName: string;
};

export function HomeStateButton({
  stateCode,
  stateName,
}: HomeStateButtonProps) {
  const [homeStateCode, setHomeStateCode] = useState("");
  const isHomeState = homeStateCode === stateCode;

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

  function setHomeState() {
    localStorage.setItem("drivesight.homeState", stateCode);
    setHomeStateCode(stateCode);
    window.dispatchEvent(new Event("drivesight-home-state-change"));
  }

  return (
    <button
      className={`home-state-button ${isHomeState ? "is-selected" : ""}`}
      disabled={isHomeState}
      onClick={setHomeState}
      type="button"
    >
      {isHomeState ? `${stateName} is your home state` : "Set as home state"}
    </button>
  );
}
