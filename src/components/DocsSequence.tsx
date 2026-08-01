import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CARS, DOCS_JOURNEY, DOCS_SLOTS } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;
const STEP_MS = 1200;
const REVEAL_MS = 1400;
const LOAD_MS = 1100;
const AWAY_MS = 900;
const HOLD_MS = 2200;
const TRACK_INSET = 0.06;

function stepDuration(stage: (typeof DOCS_JOURNEY)[number]["stage"]) {
  if (stage === "reveal") return REVEAL_MS;
  if (stage === "loadBehind") return LOAD_MS;
  if (stage === "truckAway") return AWAY_MS;
  if (stage === "delivery") return 1400;
  if (stage === "hold") return HOLD_MS;
  if (stage === "thanks") return 0;
  return STEP_MS;
}

type DocsSequenceProps = {
  onHome?: () => void;
};

export function DocsSequence({ onHome }: DocsSequenceProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const timers: number[] = [];
    let elapsed = 0;
    for (let i = 1; i < DOCS_JOURNEY.length; i++) {
      elapsed += stepDuration(DOCS_JOURNEY[i - 1].stage);
      timers.push(window.setTimeout(() => setStep(i), elapsed));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const current = DOCS_JOURNEY[step];
  const isSpotlight = current.stage === "spotlight";
  const isTrack = current.stage === "track";
  const isReveal = current.stage === "reveal";
  const isDeliveryScene =
    current.stage === "delivery" ||
    current.stage === "loadBehind" ||
    current.stage === "truckAway";
  const isLoadBehind = current.stage === "loadBehind";
  const isTruckAway = current.stage === "truckAway";
  const isThanks = current.stage === "thanks";

  const trackLeftPct =
    (TRACK_INSET + (DOCS_SLOTS[current.slot] / 100) * (1 - TRACK_INSET * 2)) *
    100;

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center px-4 pb-40 pt-12 sm:px-8">
      {/* Always stays */}
      <div className="relative z-20 shrink-0 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,60px)] font-normal italic uppercase leading-[39px] tracking-[0.01em]">
          <span className="text-[var(--fg)]">Engineered for </span>
          <span className="text-[var(--accent)] drop-shadow-[0_0_22px_var(--accent-glow)]">
            passion
          </span>
        </h1>
        <p className="mt-3 font-[family-name:var(--font-sans)] text-[15px] font-medium tracking-normal text-[#D1D1D1]">
          Precision. Power. Performance
        </p>
        <span className="mx-auto mt-2.5 block h-[3px] w-5 rounded-full bg-[#C85A5A]" />
      </div>

      <div className="relative mt-4 flex w-full flex-1 items-center justify-center">
        {/* Track line + dots during journey */}
        <AnimatePresence>
          {isTrack && (
            <motion.div
              key="track-line"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="pointer-events-none absolute inset-x-[6%] top-1/2 z-[1] -translate-y-1/2"
              aria-hidden
            >
              <div className="relative h-px w-full border-t-[1.5px] border-dashed border-[#e10600]">
                {DOCS_SLOTS.map((pct, i) => {
                  if (i >= current.slot) return null;
                  return (
                    <span
                      key={pct}
                      className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF0000] shadow-[0_0_12px_rgba(255,0,0,0.85)]"
                      style={{ left: `${pct}%` }}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left → Right dotted line reveal (after dots complete) */}
        <AnimatePresence>
          {isReveal && (
            <motion.div
              key="line-reveal"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute inset-x-[4%] top-1/2 z-[2] -translate-y-1/2"
              aria-hidden
            >
              <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.15, ease: EASE }}
                className="relative h-8 w-full"
              >
                <div className="absolute inset-x-0 top-[8px] border-t-[2px] border-dashed border-[#e10600]" />
                <div className="absolute inset-x-0 top-[20px] border-t-[2px] border-dashed border-[#e10600]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Journey car (spotlight → track) */}
        <AnimatePresence>
          {(isSpotlight || isTrack) && (
            <motion.div
              key="docs-car"
              initial={false}
              animate={{
                left: isSpotlight ? "50%" : `${trackLeftPct}%`,
                top: "50%",
                x: "-50%",
                y: "-50%",
                width: isSpotlight ? 343 : 84,
                height: isSpotlight ? 341 : 84,
                opacity: 1,
              }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.95, ease: EASE }}
              className="absolute z-20"
            >
              {isSpotlight && (
                <div
                  className="pointer-events-none absolute left-1/2 top-[-160%] z-0 h-[200%] w-[min(220px,34vw)] -translate-x-1/2"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 45%, transparent 75%)",
                    filter: "blur(10px)",
                  }}
                  aria-hidden
                />
              )}

              <div
                className="relative z-[1] h-full w-full overflow-hidden rounded-full border border-white/25"
                style={{ borderWidth: 1.32 }}
              >
                <img
                  src={CARS.docsEntry}
                  alt="NEXTCAR vehicle"
                  className="h-full w-full object-cover object-[50%_45%]"
                  draggable={false}
                />
              </div>

              <AnimatePresence mode="wait">
                {isTrack && current.tooltip && (
                  <motion.div
                    key={current.tooltip.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="absolute bottom-[calc(100%+14px)] left-1/2 z-30 -translate-x-1/2"
                  >
                    <SkewCard
                      title={current.tooltip.title}
                      sub={current.tooltip.sub}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/*
          Delivery artboard — Figma 1892×968, local origin (349, 315):
          Car 273×273 @ (349, 328) → local (0, 13)
          Truck 1002×392 @ (535, 315) -180° → local (186, 0)
        */}
        <AnimatePresence>
          {isDeliveryScene && (
            <motion.div
              key="delivery-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="relative z-10 w-full max-w-[1188px] overflow-hidden"
              style={{ aspectRatio: "1188 / 392" }}
            >
              {/* Car — 273×273, slides behind truck */}
              <motion.div
                initial={{ opacity: 0, left: `${(0 / 1188) * 100}%` }}
                animate={
                  isTruckAway
                    ? { opacity: 0, left: `${(220 / 1188) * 100}%` }
                    : isLoadBehind
                      ? { opacity: 0.4, left: `${(220 / 1188) * 100}%` }
                      : { opacity: 1, left: `${(0 / 1188) * 100}%` }
                }
                transition={{
                  duration: isLoadBehind ? 0.95 : 0.55,
                  ease: EASE,
                }}
                className="absolute z-[5]"
                style={{
                  top: `${(13 / 392) * 100}%`,
                  width: `${(273 / 1188) * 100}%`,
                  aspectRatio: "1",
                }}
              >
                <div
                  className="relative h-full w-full overflow-hidden rounded-full border border-white/25"
                  style={{ borderWidth: 1.32 }}
                >
                  <img
                    src={CARS.docsEntry}
                    alt="Delivered vehicle"
                    className="h-full w-full object-cover object-[50%_45%]"
                    draggable={false}
                  />
                </div>
              </motion.div>

              {/* Truck — 1002×392 @ -180° */}
              <motion.div
                className="absolute z-10"
                style={{
                  left: `${(186 / 1188) * 100}%`,
                  top: 0,
                  width: `${(1002 / 1188) * 100}%`,
                  height: "100%",
                }}
                initial={{ opacity: 0, x: 40 }}
                animate={
                  isTruckAway
                    ? { opacity: 1, x: "120%" }
                    : { opacity: 1, x: 0 }
                }
                transition={
                  isTruckAway
                    ? { duration: 0.75, ease: [0.33, 0.1, 0.67, 0.2] }
                    : { duration: 0.7, delay: 0.1, ease: EASE }
                }
              >
                <img
                  src={CARS.delivery}
                  alt="Vehicle delivery"
                  className="h-full w-full object-contain object-center"
                  style={{ transform: "rotate(-180deg)" }}
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* After truck: brief hold → THANK YOU + Home (no circle) */}
        <AnimatePresence>
          {isThanks && (
            <motion.div
              key="thanks-content"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: EASE }}
              className="relative z-10 flex flex-col items-center px-6 text-center"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.5rem)] font-normal italic uppercase leading-none tracking-[0.02em] text-[var(--fg)]"
              >
                Thank You
              </motion.h2>

              <motion.button
                type="button"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22, ease: EASE }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={onHome}
                className="nav-btn mt-7 rounded-full px-9 py-2.5 text-[15px] font-medium tracking-wide text-[var(--fg)]"
              >
                Home
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SkewCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div
      className="whitespace-nowrap px-5 py-3 text-center"
      style={{
        background: "rgba(42, 42, 44, 0.78)",
        border: "1px solid rgba(255,255,255,0.12)",
        transform: "skewX(-14deg)",
        backdropFilter: "blur(10px)",
        boxShadow: "inset -16px 0 24px rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ transform: "skewX(14deg)" }}>
        <p className="text-[14px] font-semibold tracking-wide text-white sm:text-[15px]">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] text-[#C5C5C5]">{sub}</p>
      </div>
    </div>
  );
}
