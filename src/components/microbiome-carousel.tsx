"use client";

import { useCallback, useEffect, useState } from "react";

type System = {
  key: string;
  n: string;
  name: string;
  stat: string;
  label: string;
  copy: string;
  tt: string;
  ts: string;
  mini: string;
  iconPaths: string[];
  c1: string;
  c2: string;
  c3: string;
  ink: string;
};

const SYSTEMS: System[] = [
  {
    key: "immunity",
    n: "01",
    name: "Immunity",
    stat: "70%",
    label: "of your immune system lives in your gut",
    copy: "A thriving microbial layer trains immune cells to tell friend from foe — calming the body when it overreacts and sharpening it when something real shows up.",
    tt: "Immune defence",
    ts: "How your body fights and tolerates",
    mini: "70% of defence",
    iconPaths: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
    c1: "#f2dce2" /* blush rose */,
    c2: "#e0a8b8" /* dusty pink */,
    c3: "#a0c0a0" /* sage green tail */,
    ink: "#5c1e30",
  },
  {
    key: "mood",
    n: "02",
    name: "Mood",
    stat: "95%",
    label: "of your body's serotonin is produced in your gut",
    copy: "The vagus nerve carries signals from your microbes straight to your brain. Mood, focus, and stress resilience all begin in the conversation happening inside you.",
    tt: "Gut–brain axis",
    ts: "How your gut shapes how you feel",
    mini: "95% serotonin",
    iconPaths: [
      "M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3 3 3 0 0 0 3-3V3z",
      "M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3 3 3 0 0 1-3-3",
    ],
    c1: "#e8e0f4" /* lavender mist */,
    c2: "#c4ace0" /* soft lavender */,
    c3: "#8eac8c" /* sage green tail */,
    ink: "#38245c",
  },
  {
    key: "energy",
    n: "03",
    name: "Energy",
    stat: "10%",
    label: "of your daily energy comes from microbial fermentation",
    copy: "Short-chain fatty acids made by your bacteria fuel the cells lining your gut and stabilise blood sugar. When the balance is off, the afternoon crash is the first thing you'll feel.",
    tt: "Energy & metabolism",
    ts: "How steady your fuel feels",
    mini: "10% daily fuel",
    iconPaths: ["M13 2 3 14h7l-1 8 10-12h-7l1-8z"],
    c1: "#f8edcc" /* warm cream */,
    c2: "#ecd47c" /* sunflower gold */,
    c3: "#b0be6c" /* yellow-green tail */,
    ink: "#4c3c08",
  },
  {
    key: "digestion",
    n: "04",
    name: "Digestion",
    stat: "38 trillion",
    label: "microbial cells in your gut",
    copy: "Gut bacteria ferment fibre into vitamins your body can't make alone — including B12 and K2. Their diversity directly determines how much nutrition you extract from every meal.",
    tt: "Digestion & Absorption",
    ts: "How well you extract nutrients",
    mini: "38 trillion cells",
    iconPaths: [
      "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.4 1.4C19.5 6 19 6.5 16.5 13 14.5 19 13 19.5 11 20Z",
      "M2 21c.6-3.6 2.5-7 6-9",
    ],
    c1: "#cce4be" /* light leaf */,
    c2: "#a4ce8e" /* fresh green */,
    c3: "#70b058" /* vivid leaf */,
    ink: "#1e4c14",
  },
  {
    key: "hormones",
    n: "05",
    name: "Hormones",
    stat: "3×",
    label: "more estrogen metabolism happens in your gut than your liver",
    copy: "A specialised group of microbes — the estrobolome — regulates how hormones are recycled and cleared. When it falters, cycles, mood, and recovery all shift.",
    tt: "Hormone balance",
    ts: "How your body recycles signals",
    mini: "3× recycling",
    iconPaths: [
      "M19 14c1.5-2.5 1-6-1-8a6 6 0 0 0-9 0c-2 2-2.5 5.5-1 8 1 1.7 2 3 3 4 1 1 2 1.5 3 1.5s2-.5 3-1.5c1-1 2-2.3 2-4Z",
    ],
    c1: "#f0d4dc" /* peony blush */,
    c2: "#d89cb4" /* deep rose */,
    c3: "#98ae88" /* sage green tail */,
    ink: "#5c1838",
  },
  {
    key: "skin",
    n: "06",
    name: "Skin",
    stat: "1,000+",
    label: "species share signals between your gut and your skin",
    copy: "The gut–skin axis means breakouts, redness, and slow healing often start one storey down. Calming the inside is the part most skincare can't reach.",
    tt: "Skin & glow",
    ts: "How your inside shows on the outside",
    mini: "1,000+ species",
    iconPaths: [
      "M12 2 14.5 8.5 21 9l-5 4.5L17.5 21 12 17.5 6.5 21 8 13.5 3 9l6.5-.5L12 2Z",
    ],
    c1: "#f8dfc8" /* peach blossom */,
    c2: "#ecba98" /* apricot */,
    c3: "#a8c098" /* fern green tail */,
    ink: "#5c3018",
  },
  {
    key: "sleep",
    n: "07",
    name: "Sleep",
    stat: "2.4×",
    label: "deeper sleep linked to a more diverse microbiome",
    copy: "Your gut helps make the melatonin and GABA that quiet you down at night. A restless microbiome makes a restless sleeper — and the loop runs both ways.",
    tt: "Sleep & recovery",
    ts: "How well your body resets",
    mini: "2.4× deeper",
    iconPaths: ["M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"],
    c1: "#dcd8f0" /* wisteria light */,
    c2: "#b4a0d8" /* wisteria */,
    c3: "#88b4a8" /* mint green tail */,
    ink: "#2c1e54",
  },
];

const SPREAD = 120; // total arc degrees
const N = SYSTEMS.length;
const STEP = SPREAD / (N - 1); // degrees between adjacent spokes

export function MicrobiomeCarousel() {
  const [active, setActive] = useState(3); // digestion by default
  const [tick, setTick] = useState(0); // increment to re-trigger fade animations

  const goTo = useCallback((i: number) => {
    setActive(((i % N) + N) % N);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(active - 1);
      if (e.key === "ArrowRight") goTo(active + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  const s = SYSTEMS[active];

  return (
    <>
      <style>{`
        @keyframes mc-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes mc-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mc-pulse {
          0%   { box-shadow: 0 0 0 0 currentColor; }
          70%  { box-shadow: 0 0 0 8px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        .mc-float    { animation: mc-float 6s ease-in-out infinite; }
        .mc-fade     { animation: mc-fade-up 480ms cubic-bezier(.2,.7,.2,1) both; }
        .mc-pulse-dot { animation: mc-pulse 2s infinite; }

        .mc-scene { position: relative; min-height: 720px; }
        .mc-arc   { position: absolute; left: 0; right: 0; top: 0; height: 380px; overflow: visible; z-index: 2; pointer-events: none; }
        .mc-spoke { position: absolute; left: 50%; top: 480px; width: 0; height: 0; pointer-events: none; }
        .mc-tile  {
          position: absolute; left: 0; top: -400px;
          width: 134px; height: 168px;
          transform-origin: center;
          pointer-events: auto; cursor: pointer;
          border-radius: 18px; overflow: hidden;
          border: none; padding: 0;
          transition: transform 900ms cubic-bezier(.5,0,.15,1),
                      box-shadow 500ms ease, filter 500ms ease;
          will-change: transform;
        }
        .mc-center { position: relative; z-index: 1; text-align: center; padding-top: 280px; padding-bottom: 24px; max-width: 720px; margin: 0 auto; }
        .mc-nav    { position: absolute; top: 280px; width: 100%; pointer-events: none; z-index: 4; }
        .mc-nav-btn {
          pointer-events: auto; width: 44px; height: 44px;
          border-radius: 50%; border: 1px solid #c2caac;
          background: #f6f8ec; color: #2e3a2b; cursor: pointer;
          display: grid; place-items: center;
          box-shadow: 0 8px 18px -10px rgba(40,30,10,.25);
          transition: all 200ms ease; position: absolute;
        }
        .mc-nav-btn:hover { background: #1a221b !important; color: #f6f8ec !important; border-color: #1a221b !important; transform: scale(1.04); }
        .mc-prev { left: 16px; }
        .mc-next { right: 16px; }

        @media (max-width: 1100px) {
          .mc-spoke { top: 440px; }
          .mc-tile  { top: -360px; width: 120px; height: 152px; }
        }
        @media (max-width: 760px) {
          .mc-scene  { min-height: 660px; }
          .mc-spoke  { top: 380px; }
          .mc-tile   { top: -300px; width: 96px; height: 122px; }
          .mc-center { padding-top: 240px; }
        }
        @media (max-width: 480px) {
          .mc-prev { left: 4px; }
          .mc-next { right: 4px; }
        }
      `}</style>

      <div
        style={{
          background: "#ecf0e2",
          borderRadius: 24,
          padding: "48px 28px 64px",
          maxWidth: 1320,
          margin: "0 auto",
          fontFamily:
            "var(--font-dm-sans, var(--font-nunito), system-ui, sans-serif)",
          WebkitFontSmoothing: "antialiased",
          overflowX: "hidden",
        }}
      >
        {/* Top bar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 22,
            borderBottom: "1px solid #d8dec6",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontSize: 11.5,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#5b6852",
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 22,
                height: 1,
                background: "#8a957f",
                flexShrink: 0,
                display: "block",
              }}
            />
            Why your microbiome matters
          </span>
          <span
            style={{
              fontFamily: "var(--font-instrument-serif, serif)",
              fontStyle: "italic",
              fontSize: 16,
              color: "#2e3a2b",
            }}
          >
            <b style={{ fontWeight: 400, color: "#1a221b" }}>{s.n}</b>
            <span style={{ color: "#8a957f", margin: "0 2px" }}>/</span>
            07
          </span>
        </header>

        {/* Scene */}
        <section className="mc-scene" style={{ marginTop: 24 }}>
          {/* Arc — spokes pivot from below, tiles fan above */}
          <div className="mc-arc">
            {SYSTEMS.map((sys, i) => {
              const angle = (i - active) * STEP;
              const dist = Math.abs(i - active);
              const isActive = dist === 0;
              return (
                <div
                  key={sys.key}
                  className="mc-spoke"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transition: "transform 900ms cubic-bezier(.5,0,.15,1)",
                    zIndex: 10 - dist,
                  }}
                >
                  <button
                    type="button"
                    aria-label={sys.tt}
                    onClick={() => goTo(i)}
                    className="mc-tile"
                    style={{
                      transform: `translate(-50%,-50%) scale(${isActive ? 1.18 : 1})`,
                      color: sys.ink,
                      background: `
                        radial-gradient(85% 70% at 0% 0%, color-mix(in oklab,${sys.c1},white 14%), transparent 60%),
                        linear-gradient(155deg,${sys.c1} 0%,${sys.c2} 60%,${sys.c3} 100%)
                      `,
                      boxShadow: isActive
                        ? "0 28px 56px -28px rgba(40,30,10,.45),0 6px 14px -4px rgba(40,30,10,.22),inset 0 0 0 1px rgba(255,255,255,.6)"
                        : "0 18px 36px -22px rgba(30,45,25,.38),0 2px 6px -3px rgba(30,45,25,.2),inset 0 0 0 1px rgba(255,255,255,.45)",
                      filter: isActive
                        ? "saturate(1.7) contrast(1.1)"
                        : `saturate(${(1.7 * 0.85).toFixed(2)}) contrast(1.1) brightness(1.01)`,
                    }}
                  >
                    <div
                      className="mc-float"
                      style={{
                        position: "absolute",
                        inset: 0,
                        padding: "14px 14px 12px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        animationDelay: `${(i * 0.4) % 2}s`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,.55)",
                            display: "grid",
                            placeItems: "center",
                            color: sys.ink,
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: 13, height: 13 }}
                            aria-hidden="true"
                          >
                            {sys.iconPaths.map((d, j) => (
                              // biome-ignore lint/suspicious/noArrayIndexKey: static icon paths
                              <path key={j} d={d} />
                            ))}
                          </svg>
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-dm-mono, monospace)",
                            fontSize: 10,
                            letterSpacing: "0.18em",
                            color: sys.ink,
                            opacity: 0.65,
                          }}
                        >
                          {sys.n}
                        </span>
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-instrument-serif, serif)",
                            fontSize: 20,
                            lineHeight: 1.02,
                            color: sys.ink,
                          }}
                        >
                          {sys.name}
                        </div>
                        <div
                          style={{
                            fontSize: 10.5,
                            color: sys.ink,
                            opacity: 0.7,
                            marginTop: 2,
                            letterSpacing: "0.01em",
                          }}
                        >
                          {sys.mini}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Prev / Next */}
          <div className="mc-nav">
            <button
              type="button"
              className="mc-nav-btn mc-prev"
              aria-label="Previous"
              onClick={() => goTo(active - 1)}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 16, height: 16 }}
                aria-hidden="true"
              >
                <path d="M10 3 5 8l5 5" />
              </svg>
            </button>
            <button
              type="button"
              className="mc-nav-btn mc-next"
              aria-label="Next"
              onClick={() => goTo(active + 1)}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 16, height: 16 }}
                aria-hidden="true"
              >
                <path d="M6 3l5 5-5 5" />
              </svg>
            </button>
          </div>

          {/* Center copy */}
          <div className="mc-center">
            {/* System badge */}
            <span
              key={`badge-${tick}`}
              className="mc-fade"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "7px 14px 7px 12px",
                borderRadius: 999,
                background: "#f6f8ec",
                border: "1px solid #c2caac",
                color: "#2e3a2b",
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: 11.5,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <span
                className="mc-pulse-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: s.ink,
                  color: s.ink,
                  flexShrink: 0,
                  filter: "saturate(1.7)",
                  display: "block",
                }}
              />
              System {s.n} · {s.name}
            </span>

            {/* Headline */}
            <h2
              style={{
                fontFamily: "var(--font-instrument-serif, serif)",
                fontWeight: 400,
                fontSize: "clamp(42px, 5.4vw, 72px)",
                lineHeight: 1.02,
                letterSpacing: "-0.014em",
                color: "#1a221b",
                margin: "18px 0 6px",
              }}
            >
              Seven systems,{" "}
              <em
                key={`em-${tick}`}
                className="mc-fade"
                style={{
                  fontStyle: "italic",
                  color: s.ink,
                  transition: "color 600ms ease",
                  filter: "saturate(1.7)",
                }}
              >
                {s.name}.
              </em>
            </h2>

            {/* Stat */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 14,
                margin: "14px 0",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <span
                key={`stat-${tick}`}
                className="mc-fade"
                style={{
                  fontFamily: "var(--font-instrument-serif, serif)",
                  fontStyle: "italic",
                  fontSize: "clamp(44px, 4.6vw, 60px)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: s.ink,
                  filter: "saturate(1.7)",
                }}
              >
                {s.stat}
              </span>
              <span
                key={`label-${tick}`}
                className="mc-fade"
                style={{
                  fontSize: 14.5,
                  color: "#5b6852",
                  maxWidth: 260,
                  lineHeight: 1.4,
                  textAlign: "left",
                }}
              >
                {s.label}
              </span>
            </div>

            {/* Copy */}
            <p
              key={`copy-${tick}`}
              className="mc-fade"
              style={{
                fontSize: 17,
                lineHeight: 1.55,
                color: "#2e3a2b",
                maxWidth: 560,
                margin: "0 auto 28px",
              }}
            >
              {s.copy}
            </p>

            {/* Footer chip */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 18px 10px 12px",
                borderRadius: 999,
                background: "#f6f8ec",
                border: "1px solid #d8dec6",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: s.c1,
                  color: s.ink,
                  display: "grid",
                  placeItems: "center",
                  transition: "background 600ms ease, color 600ms ease",
                  filter: "saturate(1.7)",
                  flexShrink: 0,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 18, height: 18 }}
                  aria-hidden="true"
                >
                  {s.iconPaths.map((d, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static icon paths
                    <path key={j} d={d} />
                  ))}
                </svg>
              </span>
              <span>
                <div
                  key={`tt-${tick}`}
                  className="mc-fade"
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    letterSpacing: "-0.005em",
                    color: "#1a221b",
                    textAlign: "left",
                  }}
                >
                  {s.tt}
                </div>
                <div
                  key={`ts-${tick}`}
                  className="mc-fade"
                  style={{
                    fontSize: 12,
                    color: "#5b6852",
                    marginTop: 1,
                  }}
                >
                  {s.ts}
                </div>
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
