import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CARS, DOCS_JOURNEY, DOCS_SLOTS } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;
const STEP_MS = 1200;
/** Last track stop (Vehicle Pickup) — shorter hold before truck */
const LAST_CAR_MS = 700;
/** Brief beat after 4 steps before car+truck */
const REVEAL_MS = 280;
const LOAD_MS = 550;
const AWAY_MS = 650;
const HOLD_MS = 900;
const DELIVERY_MS = 600;
const DELIVERY_W = 1500;
const DELIVERY_H = 580;

function stepDuration(
  stage: (typeof DOCS_JOURNEY)[number]["stage"],
  id?: (typeof DOCS_JOURNEY)[number]["id"]
) {
  if (id === "pickup") return LAST_CAR_MS;
  if (stage === "reveal") return REVEAL_MS;
  if (stage === "loadBehind") return LOAD_MS;
  if (stage === "truckAway") return AWAY_MS;
  if (stage === "delivery") return DELIVERY_MS;
  if (stage === "hold") return HOLD_MS;
  if (stage === "thanks") return 0;
  return STEP_MS;
}

function useIsNarrow(breakpoint = 640) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);
  return narrow;
}

function useDeliveryScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const pad = window.innerWidth < 640 ? 16 : 48;
      setScale(Math.min(1, (window.innerWidth - pad) / DELIVERY_W));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

type DocsSequenceProps = {
  onHome?: () => void;
  /** After spotlight car appears — open concentric rings and keep them */
  onRingsReady?: () => void;
};

export function DocsSequence({ onHome, onRingsReady }: DocsSequenceProps) {
  const [step, setStep] = useState(0);
  const narrow = useIsNarrow();
  const deliveryScale = useDeliveryScale();
  const spotlightSize = narrow ? 220 : 343;
  const trackSize = narrow ? 64 : 84;
  const cardLift = narrow ? 100 : 136;
  /** Inset track so first/last card + car stay fully visible */
  const trackInset = narrow ? 0.2 : 0.14;

  useEffect(() => {
    setStep(0);
    const timers: number[] = [];
    let elapsed = 0;
    for (let i = 1; i < DOCS_JOURNEY.length; i++) {
      const prev = DOCS_JOURNEY[i - 1];
      elapsed += stepDuration(prev.stage, prev.id);
      timers.push(window.setTimeout(() => setStep(i), elapsed));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const current = DOCS_JOURNEY[step];
  const isSpotlight = current.stage === "spotlight";
  const isTrack = current.stage === "track";
  const isDeliveryScene =
    current.stage === "delivery" ||
    current.stage === "loadBehind" ||
    current.stage === "truckAway";
  const isLoadBehind = current.stage === "loadBehind";
  const isTruckAway = current.stage === "truckAway";
  const isThanks = current.stage === "thanks";

  // First step: car only → then rings open and stay for the rest of the flow
  useEffect(() => {
    if (!onRingsReady || !isSpotlight) return;
    const t = window.setTimeout(() => onRingsReady(), 650);
    return () => window.clearTimeout(t);
  }, [isSpotlight, onRingsReady]);

  const trackLeftPct =
    (trackInset + (DOCS_SLOTS[current.slot] / 100) * (1 - trackInset * 2)) *
    100;
  const trackInsetPct = `${trackInset * 100}%`;

  return (
    <div
      className={`relative mx-auto flex w-full flex-1 flex-col items-center px-4 pb-28 pt-10 sm:px-8 sm:pb-40 sm:pt-12 ${
        isDeliveryScene ? "z-40 max-w-none" : "z-10 max-w-[1200px]"
      }`}
    >
      {/* Always stays */}
      <div className="relative z-20 shrink-0 px-2 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,5vw,60px)] font-normal italic uppercase leading-[1.05] tracking-[0.01em] sm:leading-[39px]">
          <span className="text-[var(--fg)]">Engineered for </span>
          <span className="text-[var(--accent)] drop-shadow-[0_0_22px_var(--accent-glow)]">
            passion
          </span>
        </h1>
        <p className="mt-2 font-[family-name:var(--font-sans)] text-[13px] font-medium tracking-normal text-[#D1D1D1] sm:mt-3 sm:text-[15px]">
          Precision. Power. Performance
        </p>
        <span className="mx-auto mt-2.5 block h-[3px] w-5 rounded-full bg-[#C85A5A]" />
      </div>

      {/* overflow must stay visible — overflow-x-clip also clips Y and cuts cards/car */}
      <div className="relative mt-4 flex min-h-0 w-full max-w-[1200px] flex-1 items-center justify-center overflow-visible">
        {/* Track line + dots during journey */}
        <AnimatePresence>
          {isTrack && (
            <motion.div
              key="track-line"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="pointer-events-none absolute top-1/2 z-[1] -translate-y-1/2"
              style={{ left: trackInsetPct, right: trackInsetPct }}
              aria-hidden
            >
              <div className="relative h-px w-full border-t-[1.5px] border-dotted border-[#e10600]">
                {DOCS_SLOTS.map((pct, i) => {
                  if (i >= current.slot) return null;
                  return (
                    <span
                      key={pct}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${pct}%` }}
                    >
                      {/* Soft red halo */}
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full sm:size-7"
                        style={{ background: "rgba(225, 6, 0, 0.2)" }}
                      />
                      {/* Solid core */}
                      <span className="relative block size-2 rounded-full bg-[#e10600] sm:size-[10px]" />
                    </span>
                  );
                })}
              </div>
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
                width: isSpotlight ? spotlightSize : trackSize,
                height: isSpotlight ? spotlightSize : trackSize,
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

              <div className="car-circle-wrap relative z-[1] h-full w-full">
                <div
                  className="relative h-full w-full overflow-hidden rounded-full border border-white/25"
                  style={{ borderWidth: 1.32 }}
                >
                  <img
                    src={CARS.docsEntry}
                    alt="NEXTCAR vehicle"
                    className="h-full w-full object-cover object-[50%_45%]"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card travels with car — same left + 0.95s timing; flip only on first */}
        {isTrack && current.tooltip && (
          <motion.div
            initial={false}
            animate={{ left: `${trackLeftPct}%` }}
            transition={{ duration: 0.95, ease: EASE }}
            className="pointer-events-none absolute z-30 flex w-0 justify-center"
            style={{
              top: `calc(50% - ${cardLift}px)`,
              perspective: current.id === "registration" ? 1000 : undefined,
            }}
          >
            <div
              key={current.id}
              className={
                current.id === "registration"
                  ? "docs-card-flip shrink-0"
                  : "shrink-0"
              }
            >
              <SkewCard
                title={current.tooltip.title}
                sub={current.tooltip.sub}
                compact={narrow}
              />
            </div>
          </motion.div>
        )}

        {/* Delivery — full-bleed so truck can exit past the viewport edge */}
        <AnimatePresence>
          {isDeliveryScene && (
            <motion.div
              key="delivery-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="relative z-30 flex w-screen max-w-none items-center justify-center overflow-visible"
              style={{
                height: DELIVERY_H * deliveryScale,
                marginLeft: "calc(50% - 50vw)",
                marginRight: "calc(50% - 50vw)",
              }}
            >
              <div
                className="relative shrink-0 overflow-visible"
                style={{
                  width: DELIVERY_W,
                  height: DELIVERY_H,
                  transform: `scale(${deliveryScale})`,
                  transformOrigin: "center center",
                }}
              >
                {/* Car — quick appear, then slides behind truck */}
                <motion.div
                  initial={{ opacity: 0, left: 140 }}
                  animate={
                    isTruckAway
                      ? { opacity: 0, left: 720 }
                      : isLoadBehind
                        ? { opacity: 0.4, left: 720 }
                        : { opacity: 1, left: 140 }
                  }
                  transition={{
                    duration: isLoadBehind ? 0.45 : 0.18,
                    ease: EASE,
                  }}
                  className="absolute top-[calc(50%-43px)] z-[5] size-[148px] -translate-y-1/2"
                >
                  <div className="car-circle-wrap relative size-[148px]">
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
                  </div>
                </motion.div>

                {/* Truck — top-right corner zoom-in, then full exit to the right */}
                <motion.div
                  className="absolute z-40 origin-top-right"
                  style={{
                    top: -52,
                    left: 140,
                    width: 1500,
                    height: 580,
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0.72,
                    x: 260,
                    y: -140,
                  }}
                  animate={
                    isTruckAway
                      ? { opacity: 1, scale: 1, x: "110vw", y: 0 }
                      : { opacity: 1, scale: 1, x: 0, y: 0 }
                  }
                  transition={
                    isTruckAway
                      ? { duration: 0.55, ease: [0.33, 0.1, 0.67, 0.2] }
                      : { duration: 0.38, ease: EASE }
                  }
                >
                  <img
                    src={CARS.delivery}
                    alt="Vehicle delivery"
                    className="h-full w-full object-contain object-[center_35%]"
                    draggable={false}
                  />
                </motion.div>
              </div>
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
              className="relative z-10 flex flex-col items-center px-4 text-center sm:px-6"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="font-[family-name:var(--font-display)] text-[clamp(2rem,8vw,4.5rem)] font-normal italic uppercase leading-none tracking-[0.02em] text-[var(--fg)]"
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
                className="nav-btn mt-6 rounded-full px-8 py-2.5 text-[14px] font-medium tracking-wide text-[var(--fg)] sm:mt-7 sm:px-9 sm:text-[15px]"
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

function SkewCard({
  title,
  sub,
  compact = false,
}: {
  title: string;
  sub: string;
  compact?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-center text-center"
      style={{
        width: compact ? 148 : 200,
        height: compact ? 72 : 88,
        opacity: 1,
        background: "rgba(42, 42, 44, 0.78)",
        border: compact
          ? "2px solid rgba(255,255,255,0.14)"
          : "3px solid rgba(255,255,255,0.14)",
        transform: "skewX(-14deg)",
        backdropFilter: "blur(10px)",
        boxShadow: "inset -16px 0 24px rgba(255,255,255,0.05)",
        backfaceVisibility: "hidden",
      }}
    >
      <div style={{ transform: "skewX(14deg)" }}>
        <p
          className={
            compact
              ? "text-[12px] font-semibold tracking-wide text-white"
              : "text-[15px] font-semibold tracking-wide text-white"
          }
        >
          {title}
        </p>
        <p
          className={
            compact
              ? "mt-0.5 text-[10px] text-[#C5C5C5]"
              : "mt-1 text-[12px] text-[#C5C5C5]"
          }
        >
          {sub}
        </p>
      </div>
    </div>
  );
}
