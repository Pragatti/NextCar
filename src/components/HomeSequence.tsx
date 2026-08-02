import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CARS } from "@/lib/data";
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Stats follow the car circle in a soft arc:
 * top/bottom sit closer in; middle pushes farther out.
 * `gap` = distance from the car edge (px).
 */
const RANGES = [
  { value: "352", label: "Top Speed", side: "left" as const, top: "8%", gap: 14 },
  { value: "620", label: "Power HP", side: "left" as const, top: "42%", gap: 64 },
  { value: "780", label: "Torque", side: "left" as const, top: "76%", gap: 14 },
  { value: "3.2 Sec", label: "0-100 KM/H", side: "right" as const, top: "8%", gap: 14 },
  { value: "2,450 KM", label: "Oil Change", side: "right" as const, top: "42%", gap: 64 },
  { value: "520 KM", label: "Range", side: "right" as const, top: "76%", gap: 14 },
];

type Phase = "bg" | "stats" | "rings";

type HomeSequenceProps = {
  sequenceKey: number;
  onRingsReady?: () => void;
};

export function HomeSequence({ sequenceKey, onRingsReady }: HomeSequenceProps) {
  const [phase, setPhase] = useState<Phase>("bg");

  useEffect(() => {
    setPhase("bg");
    const t1 = window.setTimeout(() => setPhase("stats"), 700);
    const t2 = window.setTimeout(() => {
      setPhase("rings");
      onRingsReady?.();
    }, 700 + 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [sequenceKey, onRingsReady]);

  const showStats = phase === "stats" || phase === "rings";

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center px-4 pb-36 pt-10 sm:px-8 sm:pb-40 sm:pt-15">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative z-20 px-2 text-center"
      >
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
      </motion.div>

      {/* Spacer keeps page flow; car is viewport-centered with innermost ring */}
      <div className="relative mt-4 min-h-[min(72vw,300px)] w-full flex-1 sm:mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="fixed left-1/2 top-[48%] z-10 size-[min(72vw,300px)] -translate-x-1/2 -translate-y-1/2 sm:top-1/2"
        >
          <div className="car-circle-wrap h-full w-full">
            <div className="relative h-full w-full overflow-hidden rounded-full border border-white/25">
              <motion.img
                key={`home-car-${sequenceKey}`}
                src={CARS.dashboard}
                alt="NEXTCAR performance vehicle"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover object-[50%_45%]"
                draggable={false}
              />
            </div>
          </div>

          {/* 2) Range indicators after car appears */}
          <AnimatePresence>
            {showStats &&
              RANGES.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{
                    opacity: 0,
                    x: stat.side === "left" ? -28 : 28,
                    y: 8,
                  }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.45,
                    ease: EASE,
                  }}
                  className="absolute z-20 hidden flex-col items-center sm:flex"
                  style={{
                    top: stat.top,
                    ...(stat.side === "left"
                      ? { right: `calc(100% + ${stat.gap}px)` }
                      : { left: `calc(100% + ${stat.gap}px)` }),
                  }}
                >
                  {/* Figma number box: 56×36 (grows for longer values) */}
                  <p
                    className="flex min-w-[56px] items-center justify-center whitespace-nowrap font-[family-name:var(--font-sf)] font-semibold leading-none tracking-wide text-white"
                    style={{
                  
                      fontSize: 26,
                      opacity: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                  {/* Figma label box: 81×19 */}
                  <p
                    className="mt-[3px] flex min-w-[81px] items-center justify-center whitespace-nowrap text-center font-[family-name:var(--font-sf)] font-medium leading-none text-[#A8A8A8]"
                    style={{
                    
                      fontSize: 13,
                      opacity: 1,
                    }}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Compact stats for narrow viewports (side arcs hide below sm) */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative z-20 mt-auto grid w-full max-w-md grid-cols-3 gap-x-3 gap-y-3 px-1 pb-2 sm:hidden"
          >
            {RANGES.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[family-name:var(--font-sf)] text-[15px] font-semibold leading-none tracking-wide text-white">
                  {stat.value}
                </p>
                <p className="mt-1 font-[family-name:var(--font-sf)] text-[10px] font-medium leading-none text-[#A8A8A8]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
