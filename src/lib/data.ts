import blueCar from "@/assets/blue.jpg";
import redCar from "@/assets/red-car.jpg";
import speedometerCar from "@/assets/seepdometer.jpg";
import blackCar from "@/assets/black-car.png";
import deliveryTruck from "@/assets/vehicle.png";

export type NavId = "gauge" | "home" | "finance" | "chat" | "docs" | "lock";

export type Lap = {
  id: number;
  label: string;
  zone: string;
};

export const LAPS: Lap[] = [
  { id: 1, label: "LAP 01", zone: "Speed Zone" },
  { id: 2, label: "LAP 02", zone: "Acceleration Zone" },
  { id: 3, label: "LAP 03", zone: "Technical Section" },
  { id: 4, label: "LAP 04", zone: "High Speed Zone" },
  { id: 5, label: "LAP 05", zone: "Final Corner" },
];

export const CARS = {
  home: blueCar,
  dashboard: blackCar,
  docsEntry: redCar,
  docsStats: speedometerCar,
  delivery: deliveryTruck,
} as const;

export const VIEW_CARS: Partial<Record<NavId, string>> = {
  home: CARS.home,
  gauge: CARS.dashboard,
  docs: CARS.docsEntry,
};

export const DOCS_SLOTS = [0, 33.333, 66.666, 100] as const;

export type DocsStage =
  | "spotlight"
  | "track"
  | "reveal"
  | "delivery"
  | "loadBehind"
  | "truckAway"
  | "hold"
  | "thanks";

export const DOCS_JOURNEY = [
  {
    id: "spotlight",
    stage: "spotlight" as const,
    slot: 0,
    tooltip: null,
    showCar: true,
    showTruck: false,
  },
  {
    id: "trackEnter",
    stage: "track" as const,
    slot: 0,
    tooltip: null,
    showCar: true,
    showTruck: false,
  },
  {
    id: "registration",
    stage: "track" as const,
    slot: 0,
    tooltip: { title: "Registration", sub: "Fill form for submission" },
    showCar: true,
    showTruck: false,
  },
  {
    id: "consultation",
    stage: "track" as const,
    slot: 1,
    tooltip: { title: "Consultation", sub: "Planning and pricing" },
    showCar: true,
    showTruck: false,
  },
  {
    id: "artist",
    stage: "track" as const,
    slot: 2,
    tooltip: { title: "Artist assign", sub: "according to task" },
    showCar: true,
    showTruck: false,
  },
  {
    id: "pickup",
    stage: "track" as const,
    slot: 3,
    tooltip: { title: "Vehicle Pickup", sub: "Payment & dropoff" },
    showCar: true,
    showTruck: false,
  },
  {
    id: "reveal",
    stage: "reveal" as const,
    slot: 3,
    tooltip: null,
    showCar: false,
    showTruck: false,
  },
  {
    id: "delivery",
    stage: "delivery" as const,
    slot: 0,
    tooltip: null,
    showCar: true,
    showTruck: true,
  },
  {
    id: "loadBehind",
    stage: "loadBehind" as const,
    slot: 0,
    tooltip: null,
    showCar: true,
    showTruck: true,
  },
  {
    id: "truckAway",
    stage: "truckAway" as const,
    slot: 0,
    tooltip: null,
    showCar: false,
    showTruck: true,
  },
  {
    id: "hold",
    stage: "hold" as const,
    slot: 0,
    tooltip: null,
    showCar: false,
    showTruck: false,
  },
  {
    id: "thanks",
    stage: "thanks" as const,
    slot: 0,
    tooltip: null,
    showCar: false,
    showTruck: false,
  },
] as const;
