import { LapsTimeline } from "./LapsTimeline";

type FooterProps = {
  activeLap: number;
  onSelectLap: (id: number) => void;
};

export function Footer({ activeLap, onSelectLap }: FooterProps) {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-20 w-full">
      <LapsTimeline activeLap={activeLap} onSelectLap={onSelectLap} />
    </footer>
  );
}
