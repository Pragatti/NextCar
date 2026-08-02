import { AnimatePresence, motion } from "framer-motion";
import type { NavId } from "@/lib/data";
import { CARS, VIEW_CARS } from "@/lib/data";
import { DocsSequence } from "./DocsSequence";

const FEATURES = [
  { label: "CUSTOMIZE", side: "left", top: "18%" },
  { label: "PAINT JOB", side: "left", top: "68%" },
  { label: "BODYWORK", side: "right", top: "18%" },
  { label: "ACCESSORIES", side: "right", top: "68%" },
] as const;

type HeroView = NavId | "default";

type HeroProps = {
  view: HeroView;
  docsKey?: number;
  onDocsHome?: () => void;
  onDocsRingsReady?: () => void;
};

export function Hero({
  view,
  docsKey = 0,
  onDocsHome,
  onDocsRingsReady,
}: HeroProps) {
  if (view === "docs") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`docs-sequence-${docsKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <DocsSequence onHome={onDocsHome} onRingsReady={onDocsRingsReady} />
        </motion.div>
      </AnimatePresence>
    );
  }

  const isDashboard = view === "gauge";
  const isDefault = view === "default" || view === "home";
  const carSrc = isDefault
    ? CARS.home
    : (VIEW_CARS[view as NavId] ?? CARS.home);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center px-4 pb-36 pt-10 sm:px-8 sm:pb-40 sm:pt-15">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.12 }}
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
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="mx-auto mt-2.5 block h-[3px] w-5 origin-center rounded-full bg-[#C85A5A]"
        />
      </motion.div>
      <div className="relative mt-4 min-h-[min(72vw,300px)] w-full flex-1 sm:mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.72 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 16,
            delay: 0.2,
          }}
          className="fixed left-1/2 top-[48%] z-10 size-[min(72vw,300px)] -translate-x-1/2 -translate-y-1/2 sm:top-1/2"
        >
          <div className="car-circle-wrap h-full w-full">
            <div
              className="relative h-full w-full overflow-hidden rounded-full border border-white/25"
              style={{ borderWidth: 1.32 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={carSrc}
                  src={carSrc}
                  alt="NEXTCAR performance vehicle"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
                  draggable={false}
                />
              </AnimatePresence>
            </div>
          </div>
          <AnimatePresence>
            {isDashboard &&
              FEATURES.map((feature, i) => (
                <motion.button
                  key={feature.label}
                  type="button"
                  initial={{
                    opacity: 0,
                    x: feature.side === "left" ? -28 : 28,
                    scale: 0.9,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: feature.side === "left" ? -20 : 20,
                    scale: 0.92,
                  }}
                  transition={{
                    delay: 0.08 + i * 0.06,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="nav-btn absolute z-20 hidden whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--fg)] sm:block"
                  style={{
                    top: feature.top,
                    ...(feature.side === "left"
                      ? { right: "calc(100% + 18px)" }
                      : { left: "calc(100% + 18px)" }),
                  }}
                >
                  {feature.label}
                </motion.button>
              ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
