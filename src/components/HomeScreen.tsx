import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BackgroundEffects } from "./BackgroundEffects";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { HomeSequence } from "./HomeSequence";
import { SideNav } from "./SideNav";
import type { NavId } from "@/lib/data";

export function HomeScreen() {
  const [activeNav, setActiveNav] = useState<NavId | null>(null);
  const [activeLap, setActiveLap] = useState(3);
  const [docsKey, setDocsKey] = useState(0);
  const [homeKey, setHomeKey] = useState(0);
  const [showHomeRings, setShowHomeRings] = useState(false);
  const [hintDocs, setHintDocs] = useState(false);
  /** Explore Timeline: rings flash show→hide, then stay off */
  const [docsFlashRings, setDocsFlashRings] = useState(false);

  const handleNav = (id: NavId) => {
    if (id === "home") {
      setActiveNav("home");
      setShowHomeRings(false);
      setHintDocs(false);
      setDocsFlashRings(false);
      setHomeKey((k) => k + 1);
      return;
    }
    setShowHomeRings(false);
    setHintDocs(false);
    setActiveNav(id);
    if (id === "docs") {
      setDocsKey((k) => k + 1);
      setDocsFlashRings(true);
    } else {
      setDocsFlashRings(false);
    }
  };

  const onHomeRingsReady = useCallback(() => {
    setShowHomeRings(true);
  }, []);

  const onHomeRingsComplete = useCallback(() => {
    setHintDocs(true);
  }, []);

  const onDocsFlashComplete = useCallback(() => {
    setDocsFlashRings(false);
  }, []);

  const isDefault = activeNav === null;
  const isHome = activeNav === "home";
  const isDocs = activeNav === "docs";
  const heroView: NavId | "default" =
    activeNav === "docs"
      ? "docs"
      : activeNav === "gauge"
        ? "gauge"
        : "default";

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--bg)] text-[var(--fg)] transition-colors duration-500">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1892px] flex-col overflow-x-hidden">
        <AnimatePresence>
          {/* Docs: no rings by default; flash show/hide on enter */}
          {isDocs && (
            <motion.div
              key={`bg-docs-${docsKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0"
            >
              <BackgroundEffects
                rings={docsFlashRings}
                flash={docsFlashRings}
                onOpenComplete={onDocsFlashComplete}
              />
            </motion.div>
          )}

          {/* Other nav (not home/docs): static rings */}
          {activeNav !== null &&
            activeNav !== "home" &&
            activeNav !== "docs" && (
              <motion.div
                key="bg-normal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-0"
              >
                <BackgroundEffects />
              </motion.div>
            )}

          {/* Home: rings after stats, stay visible */}
          {isHome && showHomeRings && (
            <motion.div
              key={`bg-home-${homeKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 z-0"
            >
              <BackgroundEffects open onOpenComplete={onHomeRingsComplete} />
            </motion.div>
          )}
        </AnimatePresence>

        <Header />
        <SideNav
          active={activeNav}
          onSelect={handleNav}
          hintHome={isDefault}
          hintDocs={hintDocs}
        />

        {isHome ? (
          <HomeSequence
            sequenceKey={homeKey}
            onRingsReady={onHomeRingsReady}
          />
        ) : (
          <Hero
            view={heroView}
            docsKey={docsKey}
            onDocsHome={() => handleNav("home")}
          />
        )}
      </div>
      <Footer activeLap={activeLap} onSelectLap={setActiveLap} />
    </div>
  );
}
