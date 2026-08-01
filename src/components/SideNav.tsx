import {
  ArrowLeft,
  FileText,
  Gauge,
  Home,
  IndianRupee,
  Lock,
  MessageCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { NavId } from "@/lib/data";
import { cn } from "@/lib/cn";

type SideNavProps = {
  active: NavId | null;
  onSelect: (id: NavId) => void;
  /** Default screen: “Click for Home” tip until pressed (not active) */
  hintHome?: boolean;
  /** After home rings: “Explore timeline” tip on right (not active) */
  hintDocs?: boolean;
};

export function SideNav({
  active,
  onSelect,
  hintHome = false,
  hintDocs = false,
}: SideNavProps) {
  const leftItems = [
    { id: "gauge" as const, icon: Gauge, label: "Dashboard" },
    { id: "home" as const, icon: Home, label: "Home", hintLabel: "Click for Home" },
    { id: "finance" as const, icon: IndianRupee, label: "Finance" },
  ];

  const rightItems = [
    { id: "chat" as const, icon: MessageCircle, label: "Support" },
    {
      id: "docs" as const,
      icon: FileText,
      label: "Explore timeline",
      hintLabel: "Explore timeline",
    },
    { id: "lock" as const, icon: Lock, label: "Security" },
  ];

  return (
    <>
      <button
        type="button"
        aria-label="Back"
        className="absolute left-[22px] top-[99px] z-20 hidden size-12 items-center justify-center rounded-full border-0 bg-[#232124] text-white md:flex"
      >
        <ArrowLeft className="size-[18px]" strokeWidth={1.5} />
      </button>

      {/* Left — far edge, short outward dashed arc only */}
      <nav className="pointer-events-none absolute left-[24px] top-1/2 z-20 hidden -translate-y-1/2 md:block lg:left-[110px]">
        <Arc side="left" />
        <ul className="relative flex h-[235px] w-[100px] flex-col justify-between py-1">
          {leftItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const showHomeHint = item.id === "home" && hintHome;
            const label =
              showHomeHint && "hintLabel" in item && item.hintLabel
                ? item.hintLabel
                : item.label;
            return (
              <li
                key={item.id}
                className="pointer-events-auto relative"
                style={{
                  marginLeft: index === 1 ? 0 : 32,
                }}
              >
                <NavButton
                  active={isActive}
                  label={label}
                  showLabel={
                    !hintDocs &&
                    (showHomeHint ||
                      (isActive &&
                        (item.id === "home" || item.id === "gauge")))
                  }
                  onClick={() => onSelect(item.id)}
                >
                  <Icon className="relative z-[1] size-[18px]" strokeWidth={1.5} />
                </NavButton>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Right — mirror */}
      <nav className="pointer-events-none absolute right-[24px] top-[50%] z-20 hidden -translate-y-1/2 md:block lg:right-[110px]">
        <Arc side="right" />
        <ul className="relative ml-auto flex h-[235px] w-[100px] flex-col justify-between py-1">
          {rightItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const showDocsHint = item.id === "docs" && hintDocs;
            const label =
              showDocsHint && "hintLabel" in item && item.hintLabel
                ? item.hintLabel
                : item.label;
            return (
              <li
                key={item.id}
                className="pointer-events-auto relative flex justify-end"
                style={{
                  marginRight: index === 1 ? 0 : 32,
                }}
              >
                <NavButton
                  active={isActive}
                  label={label}
                  showLabel={showDocsHint || (isActive && item.id === "docs")}
                  labelSide="left"
                  onClick={() => onSelect(item.id)}
                >
                  <Icon className="relative z-[1] size-[18px]" strokeWidth={1.5} />
                </NavButton>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="fixed bottom-28 left-1/2 z-30 flex -translate-x-1/2 gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--nav-bg)] p-1.5 shadow-[var(--shadow)] md:hidden">
        {leftItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              onClick={() => onSelect(item.id)}
              className={cn("glass-orb", isActive && "glass-orb-active")}
            >
              <Icon className="relative z-[1] size-4" strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
    </>
  );
}

function NavButton({
  children,
  active,
  label,
  showLabel,
  labelSide = "right",
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  label: string;
  showLabel?: boolean;
  labelSide?: "left" | "right";
  onClick?: () => void;
}) {
  return (
    <div className="relative flex items-center">
      {showLabel && labelSide === "left" && <Tooltip label={label} side="left" />}

      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={cn("glass-orb", active && "glass-orb-active")}
      >
        {children}
      </button>

      {showLabel && labelSide === "right" && (
        <Tooltip label={label} side="right" />
      )}
    </div>
  );
}

function Tooltip({ label, side }: { label: string; side: "left" | "right" }) {
  const tipBg = "#242424";

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={label}
        initial={{ opacity: 0, x: side === "right" ? -8 : 8, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: side === "right" ? -6 : 6, scale: 0.96 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "absolute top-1/2 z-10 flex -translate-y-1/2 items-center",
          side === "right" ? "left-[calc(100%+2px)]" : "right-[calc(100%+2px)]"
        )}
      >
        {/* Dark caret — same fill as body (not red) */}
        {side === "right" && (
          <span
            aria-hidden
            className="relative z-[2] -mr-px h-0 w-0 border-y-[6px] border-y-transparent border-r-[8px]"
            style={{ borderRightColor: tipBg }}
          />
        )}

        <span
          className="relative whitespace-nowrap rounded-full px-3.5 py-[7px] font-[family-name:var(--font-sf)] text-[12px] font-medium leading-none tracking-[0.01em] text-white"
          style={{ background: tipBg }}
        >
          {/* Red rim — stronger on the far edge, fades toward the caret */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              padding: 1,
              background:
                side === "right"
                  ? "linear-gradient(90deg, rgba(225, 6, 0, 0.12) 0%, rgba(225, 6, 0, 0.35) 45%, rgba(225, 6, 0, 0.95) 100%)"
                  : "linear-gradient(270deg, rgba(225, 6, 0, 0.12) 0%, rgba(225, 6, 0, 0.35) 45%, rgba(225, 6, 0, 0.95) 100%)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          <span className="relative z-[1]">{label}</span>
        </span>

        {side === "left" && (
          <span
            aria-hidden
            className="relative z-[2] -ml-px h-0 w-0 border-y-[6px] border-y-transparent border-l-[8px]"
            style={{ borderLeftColor: tipBg }}
          />
        )}
      </motion.span>
    </AnimatePresence>
  );
}

function Arc({ side }: { side: "left" | "right" }) {
  // Design: thin dashed arc on the far edge — 3px gap from the menu orbs
  return (
    <svg
      className={cn(
        "pointer-events-none absolute -top-6 z-0 h-[calc(100%+48px)] w-[100px]",
        side === "left" ? "right-[50%]" : "left-[50%]"
      )}
      viewBox="0 0 70 320"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={
          side === "left"
            ? // ( — bulges left; stroke sits on the right edge of this SVG (closest to menu)
              "M 67 8 C 12 70, 12 250, 67 312"
            : // ) — bulges right; stroke on the left edge of this SVG
              "M 3 8 C 58 70, 58 250, 3 312"
        }
        stroke="#EEEEEEAD"
        strokeWidth="1.2"
        strokeDasharray="14 14"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
