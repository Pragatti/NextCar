import { Check, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import logoImage from "@/assets/logo.png";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-30 flex h-[78px] w-full shrink-0 items-center justify-between px-[27px]"
    >
      <a href="/" className="flex h-full shrink-0 items-center" aria-label="NEXTCAR home">
        <img
          src={logoImage}
          alt="NEXTCAR — Drive Next"
          className="h-[59px] w-[130px] object-contain object-left"
          draggable={false}
        />
      </a>

      <div className="relative flex items-center">
        <ThemeToggle />
        <div className="absolute right-0 top-[calc(70%+60px)] flex items-center gap-2.5">
          <ActionButton label="Download">
            <Download className="size-4" strokeWidth={1.75} />
          </ActionButton>
          <ActionButton label="Share">
            <Share2 className="size-4" strokeWidth={1.75} />
          </ActionButton>
          <ActionButton label="Confirm" accent>
            <Check className="size-4" strokeWidth={2.25} />
          </ActionButton>
        </div>
      </div>
    </motion.header>
  );
}

function ActionButton({
  children,
  label,
  accent = false,
}: {
  children: React.ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className={`flex size-10 items-center justify-center rounded-full border transition-colors ${
        accent
          ? "border-[var(--accent)] bg-[var(--accent)] text-white accent-glow"
          : "nav-btn text-[var(--fg-muted)] hover:text-[var(--fg)]"
      }`}
    >
      {children}
    </motion.button>
  );
}
