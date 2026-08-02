# NEXTCAR

Frontend assignment — recreating the NEXTCAR Figma UI in React.

Repo: https://github.com/Pragatti/NextCar

## Run it

```bash
yarn
yarn dev
```

Then open `http://localhost:5173`.

```bash
yarn build
yarn preview
```

Needs Node 18+.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion
- Lucide icons
- next-themes for light/dark

## What’s in it

Single-page car experience based on the Figma frames:

- Home with car, stats, and rings
- Side nav (home / timeline hints, active states)
- Explore timeline — car on the track, cards, truck delivery, thank you
- Footer laps track
- Light and dark mode
- Works on desktop and mobile

## Notes

I used Vite instead of Next.js since this is a single-screen UI and didn’t need routing or SSR.

Desktop (~1892×968) is the main layout from Figma. On smaller screens things scale down (car, delivery truck, nav) instead of a separate mobile design.

Timeline auto-plays when you hit Explore timeline. Timings are a bit snappy so the full flow is easy to demo.

No backend — pure frontend.

## Folder layout

```
src/
  components/
  lib/
  assets/
  index.css
```

## Demo

Drop screenshots or a short Loom/video here before submitting.
