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
        className="h-[46px] w-[98px] shrink-0 rounded-[70px] bg-[#1a1a1a]"
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
      className="flex h-[35px] w-[80px] shrink-0 items-center justify-center rounded-[70px] bg-[#1a1a1a] pl-[22px] pr-[24px]  opacity-100"
      style={{ gap: 20 }}
    >
      <Sun className="size-4 shrink-0 text-white" strokeWidth={1.5} />
      <Moon className="size-4 shrink-0 text-white" strokeWidth={1.5} />
    </button>
  );
}
