"use client";

import { useEffect, useRef, RefObject } from "react";

// ─── Timing Constants ────────────────────────────────────────────────────────
const TYPE_SPEED = 75; // ms per character typed
const DELETE_SPEED = 45; // ms per character deleted
const HOLD_DURATION = 1500; // ms to hold word before deleting
const BETWEEN_WORD_PAUSE = 320; // ms pause between words

const WORDS = ["UI/UX", "4 years", "Design solutions", "No headache! 🚀"];

interface HeroCursorProps {
  containerRef: RefObject<HTMLElement | null>;
}

export default function HeroCursor({ containerRef }: HeroCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const tooltipTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const tooltipText = tooltipTextRef.current;
    const container = containerRef.current;
    if (!cursor || !tooltipText || !container) return;

    // ── Position tracking via RAF (no React state) ──────────────────────────
    let mouseX = -300;
    let mouseY = -300;
    let rafScheduled = false;

    const flushPosition = () => {
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      rafScheduled = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(flushPosition);
      }
    };

    // ── Boundary detection ───────────────────────────────────────────────────
    const onMouseEnter = () => {
      container.style.cursor = "none";
      cursor.style.opacity = "1";
    };

    const onMouseLeave = () => {
      container.style.cursor = "";
      cursor.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    // ── Typewriter logic ─────────────────────────────────────────────────────
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const currentWord = WORDS[wordIndex];

      if (!isDeleting) {
        charIndex++;
        tooltipText.textContent = currentWord.slice(0, charIndex);

        if (charIndex === currentWord.length) {
          isDeleting = true;
          timeoutId = setTimeout(tick, HOLD_DURATION);
          return;
        }
        timeoutId = setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        tooltipText.textContent = currentWord.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % WORDS.length;
          timeoutId = setTimeout(tick, BETWEEN_WORD_PAUSE);
          return;
        }
        timeoutId = setTimeout(tick, DELETE_SPEED);
      }
    };

    timeoutId = setTimeout(tick, 600);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [containerRef]);

  return (
    <>
      {/* Scoped keyframes — does not leak outside this component */}
      <style>{`
        @keyframes hero-cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .hero-cursor-caret {
          animation: hero-cursor-blink 1s step-end infinite;
        }
      `}</style>

      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          willChange: "transform",
          zIndex: 9999,
          /* 80 ms lag gives Figma's natural collaborator-cursor feel */
          transition: "transform 80ms linear, opacity 180ms ease",
          opacity: 0,
        }}
      >
        {/* ── Figma collaborator cursor ──────────────────────────────────── */}
        <svg
          width="16"
          height="20"
          viewBox="0 0 16 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: "drop-shadow(0px 2px 5px rgba(0,0,0,0.5))",
            display: "block",
          }}
        >
          {/* Stubby arrow — no tail, clean flat terminating bottom edge */}
          <path
            d="M2 2 L2 16 L7.5 11.5 L14 11.5 Z"
            fill="#9747FF"
            stroke="#1a1a1a"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        {/* Collaborator name tag — pill anchored at the arrow's bottom-right */}
        <div
          style={{
            position: "absolute",
            top: "11px",
            left: "8px",
            backgroundColor: "#7C3AED",
            color: "white",
            borderRadius: "9999px",
            padding: "1px 8px",
            fontSize: "9.5px",
            fontWeight: 700,
            fontFamily: "var(--font-mono, 'Space Mono', monospace)",
            whiteSpace: "nowrap",
            lineHeight: "16px",
            letterSpacing: "-0.01em",
            boxShadow: "0 1px 6px rgba(0,0,0,0.35)",
          }}
        >
          Rima
        </div>

        {/* ── Figma comment bubble ──────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "50px",
          }}
        >
          {/* Wrapper: drop-shadow applies to box + pin as one unified shape */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.28))",
            }}
          >
            {/* Rounded-rect comment box */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "6px",
                padding: "5px 10px 5px 9px",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                whiteSpace: "nowrap",
                color: "#111111",
                letterSpacing: "-0.01em",
                lineHeight: "18px",
                minWidth: "5ch",
                display: "flex",
                alignItems: "center",
                gap: "1px",
              }}
            >
              <span ref={tooltipTextRef} />
              {/* Blinking caret */}
              <span
                className="hero-cursor-caret"
                style={{
                  display: "inline-block",
                  width: "1.5px",
                  height: "10px",
                  backgroundColor: "#111111",
                  borderRadius: "1px",
                  marginLeft: "1px",
                  verticalAlign: "middle",
                }}
              />
            </div>
            {/* Downward anchor pin — bottom-left corner, teardrop shape */}
            <svg
              style={{
                position: "absolute",
                bottom: "-7px",
                left: "0px",
                display: "block",
              }}
              width="8"
              height="8"
              viewBox="0 0 8 8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0 L8 0 L0 8 Z" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
