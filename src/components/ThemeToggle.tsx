import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Figma frame is 46×98 @ 90° → renders as 98×46 horizontal pill
  if (!mounted) {
    return (
      <div
        className="h-8 w-[68px] shrink-0 rounded-[70px] bg-[#1a1a1a] sm:h-[46px] sm:w-[98px]"
        aria-hidden
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-[30px] w-[68px] shrink-0 items-center justify-center gap-3 rounded-[70px] bg-[#1a1a1a] px-3 opacity-100 sm:h-[35px] sm:w-[80px] sm:gap-5 sm:px-0 sm:pl-[22px] sm:pr-[24px]"
    >
      <Sun className="size-3.5 shrink-0 text-white sm:size-4" strokeWidth={1.5} />
      <Moon className="size-3.5 shrink-0 text-white sm:size-4" strokeWidth={1.5} />
    </button>
  );
}
