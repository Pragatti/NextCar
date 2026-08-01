import { motion } from "framer-motion";
import { LAPS } from "@/lib/data";
import { cn } from "@/lib/cn";

type LapsTimelineProps = {
  activeLap: number;
  onSelectLap: (id: number) => void;
};

/**
 * Design wave (viewBox 1000×100, y↓):
 * peaks at LAP 02 & 04, trough at LAP 03
 * Dot X at 10% / 30% / 50% / 70% / 90% → 100, 300, 500, 700, 900
 */
const DOTS = [
  { x: 100, y: 40 }, // LAP 01
  { x: 300, y: 18 }, // LAP 02 — peak
  { x: 500, y: 72 }, // LAP 03 — trough (active)
  { x: 700, y: 20 }, // LAP 04 — peak
  { x: 900, y: 38 }, // LAP 05
] as const;

/** Path passes through each DOT exactly */
const WAVE_PATH = [
  "M 0 44",
  `C 40 42, 70 41, ${DOTS[0].x} ${DOTS[0].y}`,
  `C 160 38, 220 12, ${DOTS[1].x} ${DOTS[1].y}`,
  `C 380 26, 440 78, ${DOTS[2].x} ${DOTS[2].y}`,
  `C 560 66, 620 14, ${DOTS[3].x} ${DOTS[3].y}`,
  `C 780 28, 840 42, ${DOTS[4].x} ${DOTS[4].y}`,
  "C 940 36, 980 40, 1000 42",
].join(" ");

export function LapsTimeline({ activeLap, onSelectLap }: LapsTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="relative w-full pb-5"
    >
      {/* Full-bleed track */}
      <div className="relative h-[120px] w-full">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <defs>
            {/* Minor red fill under the dashed arc */}
            <linearGradient id="footerWaveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e10600" stopOpacity="0.28" />
              <stop offset="35%" stopColor="#e10600" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#e10600" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={`${WAVE_PATH} L 1000 100 L 0 100 Z`}
            fill="url(#footerWaveFill)"
          />

          {/* Thin dashed red arc — primary stroke */}
          <path
            d={WAVE_PATH}
            stroke="#e10600"
            strokeWidth="2.25"
            strokeDasharray="9 10"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Stems start at each arc dot and drop to labels */}
        {LAPS.map((lap, index) => {
          const active = lap.id === activeLap;
          const dot = DOTS[index];
          const topPct = (dot.y / 100) * 100;

          return (
            <span
              key={`stem-${lap.id}`}
              aria-hidden
              className={cn(
                "pointer-events-none absolute z-[5] w-px -translate-x-1/2 border-l border-dashed",
                active ? "border-white/35" : "border-white/20"
              )}
              style={{
                left: `${(dot.x / 1000) * 100}%`,
                top: `${topPct}%`,
                height: `calc(${100 - topPct}% + 32px)`,
              }}
            />
          );
        })}

        {/* Dots exactly on path */}
        {LAPS.map((lap, index) => {
          const active = lap.id === activeLap;
          const dot = DOTS[index];

          return (
            <button
              key={lap.id}
              type="button"
              aria-label={lap.label}
              aria-pressed={active}
              onClick={() => onSelectLap(lap.id)}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(dot.x / 1000) * 100}%`,
                top: `${(dot.y / 100) * 100}%`,
              }}
            >
              {active ? (
                <motion.span
                  layoutId="lap-pointer"
                  className="relative flex size-6 items-center justify-center"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                >
                  <span className="absolute size-7 rounded-full bg-[#FF0000]/30" />
                  <span className="absolute size-7 rounded-full bg-[#FF0000]/20 blur-[3px]" />
                  <span className="relative size-[10px] rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.85)]" />
                </motion.span>
              ) : (
                <span className="relative flex size-7 items-center justify-center">
                  <span className="absolute size-7 rounded-full bg-[#666666]/35" />
                  <span className="relative size-3 rounded-full bg-[#666666]" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Labels only — stems already touch dots above */}
      <div className="relative mt-8 grid w-full grid-cols-5">
        {LAPS.map((lap) => {
          const active = lap.id === activeLap;

          return (
            <button
              key={lap.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelectLap(lap.id)}
              className="flex flex-col items-center"
            >
              <span
                className={cn(
                  "text-center transition-colors duration-300",
                  active ? "text-white" : "text-[#888888]"
                )}
              >
                <span
                  className={cn(
                    "block text-[11px] font-semibold tracking-[0.14em]",
                    active && "font-bold text-white"
                  )}
                >
                  {lap.label}
                </span>
                <span className="mt-0.5 block text-[10px] tracking-wide sm:text-[11px]">
                  {lap.zone}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
