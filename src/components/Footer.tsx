import { LapsTimeline } from "./LapsTimeline";

type FooterProps = {
  activeLap: number;
  onSelectLap: (id: number) => void;
};

export function Footer({ activeLap, onSelectLap }: FooterProps) {
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-50 w-full">
      <div className="pointer-events-auto">
        <LapsTimeline activeLap={activeLap} onSelectLap={onSelectLap} />
      </div>
    </footer>
  );
}
