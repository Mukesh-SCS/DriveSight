"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ROAD_SIGN_COUNT, ROAD_SIGN_SHEETS } from "@/lib/road-signs";

export function RoadSignsViewer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef(false);
  const touchStartXRef = useRef(0);

  const activeSheet = ROAD_SIGN_SHEETS[activeIndex];

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(ROAD_SIGN_COUNT - 1, index)));
    canvasRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        goPrev();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  function handleTouchStart(event: React.TouchEvent) {
    touchStartXRef.current = event.touches[0]?.clientX ?? 0;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const delta = touchStartXRef.current - touchEndX;

    if (Math.abs(delta) < 56) {
      return;
    }

    if (delta > 0) {
      goNext();
    } else {
      goPrev();
    }
  }

  return (
    <div className="signs-viewer">
      <header className="signs-toolbar">
        <div className="signs-toolbar-start">
          <Link className="signs-back" href="/">
            ← Dashboard
          </Link>
          <div>
            <p className="eyebrow">Reference library</p>
            <h1>US road symbol signs</h1>
          </div>
        </div>

        <div className="signs-toolbar-actions">
          <span className="signs-position" aria-live="polite">
            Sheet <strong>{activeIndex + 1}</strong> of {ROAD_SIGN_COUNT}
          </span>
          <button
            aria-label="Previous sheet"
            className="icon-button"
            disabled={activeIndex === 0}
            onClick={goPrev}
            type="button"
          >
            ‹
          </button>
          <button
            aria-label="Next sheet"
            className="icon-button"
            disabled={activeIndex === ROAD_SIGN_COUNT - 1}
            onClick={goNext}
            type="button"
          >
            ›
          </button>
        </div>
      </header>

      <div className="signs-body">
        <aside className="signs-rail" aria-label="Sign sheets">
          {ROAD_SIGN_SHEETS.map((sheet, index) => (
            <button
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={`Open sheet ${sheet.index}`}
              className={`signs-thumb ${index === activeIndex ? "is-active" : ""}`}
              key={sheet.id}
              onClick={() => goTo(index)}
              type="button"
            >
              <span className="signs-thumb-index">{sheet.index}</span>
              <span className="signs-thumb-label">{sheet.label}</span>
            </button>
          ))}
        </aside>

        <div
          className="signs-canvas"
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
          ref={canvasRef}
        >
          <div className="signs-canvas-inner" key={activeSheet.id}>
            <Image
              alt={`US road symbol signs reference sheet ${activeSheet.index}`}
              className="signs-canvas-image"
              height={activeSheet.height}
              priority={activeIndex <= 1}
              src={activeSheet.src}
              width={activeSheet.width}
            />
          </div>
        </div>
      </div>

      <footer className="signs-footer">
        <p>Scroll inside the viewer for tall sheets. Swipe left or right to change sheets.</p>
        <div className="signs-footer-nav">
          <button
            className="secondary-button"
            disabled={activeIndex === 0}
            onClick={goPrev}
            type="button"
          >
            Previous sheet
          </button>
          <button
            className="primary-button"
            disabled={activeIndex === ROAD_SIGN_COUNT - 1}
            onClick={goNext}
            type="button"
          >
            Next sheet
          </button>
        </div>
      </footer>
    </div>
  );
}
