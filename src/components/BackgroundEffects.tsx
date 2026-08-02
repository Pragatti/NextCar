import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const FRAME_W = 1892;
const FRAME_H = 968;

/** Home open stay: delay 0.08 + 2*0.12 + duration 0.85 */
const OPEN_COMPLETE_MS = 1400;
/** Show/hide flash: in + hold + out */
const FLASH_COMPLETE_MS = 1600;

const RINGS = [
  /** Innermost — 300×300, true frame center */
  {
    w: 300,
    h: 300,
    left: (FRAME_W - 300) / 2,
    top: (FRAME_H - 300) / 2,
    r: 150,
    opacity: 1,
  },
  /** Existing rings unchanged */
  { w: 781, h: 777, left: 556, top: 97, r: 688.05, opacity: 1 },
  { w: 1292, h: 1090, left: 300, top: -52, r: 758, opacity: 1 },
  { w: 1803, h: 1403, left: 46, top: -201, r: 828.05, opacity: 1 },
] as const;

const PARTICLES = [
  { left: "47%", top: "8%", size: 2 },
  { left: "52%", top: "11%", size: 1.5 },
  { left: "49%", top: "15%", size: 2.5 },
  { left: "45%", top: "18%", size: 1.5 },
  { left: "54%", top: "20%", size: 2 },
  { left: "50%", top: "24%", size: 1 },
  { left: "46.5%", top: "28%", size: 2 },
  { left: "53%", top: "30%", size: 1.5 },
  { left: "48%", top: "34%", size: 1 },
  { left: "51.5%", top: "16%", size: 1.5 },
  { left: "44%", top: "22%", size: 1 },
  { left: "55%", top: "14%", size: 2 },
];

const EASE = [0.22, 1, 0.36, 1] as const;

type BackgroundEffectsProps = {
  /** Staggered open animation for concentric rings */
  open?: boolean;
  /** Render concentric rings at all */
  rings?: boolean;
  /** Show → hold → hide (docs transition). Rings do not stay. */
  flash?: boolean;
  /** Fires once after open/flash finishes */
  onOpenComplete?: () => void;
};

export function BackgroundEffects({
  open = false,
  rings = true,
  flash = false,
  onOpenComplete,
}: BackgroundEffectsProps) {
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
  }, [open, flash]);

  useEffect(() => {
    if (!rings || !onOpenComplete || doneRef.current) return;
    if (!open && !flash) return;
    const ms = flash ? FLASH_COMPLETE_MS : OPEN_COMPLETE_MS;
    const t = window.setTimeout(() => {
      doneRef.current = true;
      onOpenComplete();
    }, ms);
    return () => window.clearTimeout(t);
  }, [open, flash, rings, onOpenComplete]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,color-mix(in_srgb,var(--fg)_4%,transparent)_0%,transparent_55%)]" />

      {/* Trapezoid beam — shape clipped inside, blur on outer so edges stay soft */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.45 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 1.15, ease: "easeOut" }}
        className="spotlight-beam absolute left-1/2 top-0 h-[70%] w-[min(560px,58vw)] origin-top -translate-x-1/2"
      >
        <span className="spotlight-beam__blur">
          <span className="spotlight-beam__shape" />
        </span>
      </motion.div>

      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/80"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 5px rgba(255,255,255,0.45)",
          }}
          animate={{ opacity: [0.2, 0.75, 0.25] }}
          transition={{
            duration: 2.6 + (i % 3) * 0.5,
            delay: i * 0.12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {rings && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `min(100%, ${FRAME_W}px)`,
            aspectRatio: `${FRAME_W} / ${FRAME_H}`,
          }}
        >
          {RINGS.map((ring, i) => {
            const glow = ring.w / 781;
            return (
              <motion.div
                key={ring.w}
                className="absolute origin-center"
                style={{
                  width: `${(ring.w / FRAME_W) * 100}%`,
                  height: `${(ring.h / FRAME_H) * 100}%`,
                  left: `${(ring.left / FRAME_W) * 100}%`,
                  top: `${(ring.top / FRAME_H) * 100}%`,
                  borderRadius: ring.r,
                  boxShadow: `0px ${26.46 * glow}px ${47.63 * glow}px 0px #FFFFFF0F inset`,
                }}
                initial={
                  open || flash
                    ? { opacity: 0, scale: 0.4 }
                    : { opacity: ring.opacity, scale: 1 }
                }
                animate={
                  flash
                    ? {
                        opacity: [0, ring.opacity, ring.opacity, 0],
                        scale: [0.4, 1, 1, 1.02],
                      }
                    : open
                      ? { opacity: ring.opacity, scale: 1 }
                      : { opacity: ring.opacity, scale: 1 }
                }
                transition={
                  flash
                    ? {
                        duration: 1.45,
                        delay: 0.05 + i * 0.1,
                        ease: EASE,
                        times: [0, 0.3, 0.7, 1],
                      }
                    : open
                      ? {
                          duration: 0.85,
                          delay: 0.08 + i * 0.12,
                          ease: EASE,
                        }
                      : { duration: 0.4 }
                }
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    borderRadius: "inherit",
                    padding: 1.32,
                    background:
                      "linear-gradient(179.72deg, rgba(187, 181, 181, 0.3) 0.24%, rgba(0, 0, 0, 0) 13.11%)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
