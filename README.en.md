# tarot-draw

Web app for drawing and laying out a full 78-card tarot deck. The interface and card blurbs are in **Traditional Chinese** (繁體中文).

[繁體中文說明](./README.md)

## Features

- **排陣抽牌 (spread mode)** — Choose a spread, tap empty slots or the deck to draw. Built-in spreads: single card, past/present/future, a four-card relationship layout, and Celtic Cross (凱爾特十字).
- **自由牌 (free board)** — Cards go on a draggable canvas; optional fullscreen for layout. Discard pile supported.
- **手動洗牌 (manual shuffle)** — Scroll the stacked deck, tap backs to draw, cut the pile, or use quick actions (top card, random card). Drawn cards appear in a strip below.
- **扇形選牌 (fan picker)** — Tap the deck to fan visible cards and pick one by hand instead of automatic dealing.
- **正逆位** — Reversals are derived from a deterministic hash of shuffle seed and draw context so runs stay reproducible for a given seed state.
- **牌義** — Tap a drawn card to open a modal with upright / reversed meaning text (see `src/lib/interpretation.ts`).

Shuffle resets the deck and clears drawn cards for the current mode so you can start a new session cleanly.

## Stack

- [React](https://react.dev/) 19 · [Vite](https://vitejs.dev/) 8 · [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4 · [Framer Motion](https://www.framer.com/motion/) for transitions

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended; 20+ is a safe default)

## Setup and scripts

```bash
npm install
npm run dev
```

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm run dev`  | Start Vite dev server with HMR       |
| `npm run build`| Typecheck (`tsc -b`) then production build |
| `npm run preview` | Serve the `dist` output locally   |
| `npm run lint` | Run ESLint on the project            |

After `npm run dev`, open the URL Vite prints (usually `http://localhost:5173`).

## Project layout (high level)

- `src/App.tsx` — Modes, shuffle/draw state, spread definitions
- `src/lib/tarot.ts` — Deck construction, card metadata, image paths
- `src/lib/interpretation.ts` — Upright / reversed copy per card
- `src/ui/` — Deck pile, fan picker, boards, modals, etc.
- `CARD_IMAGE_STATUS.md` — Notes on card face assets (78 + back)
- `scripts/normalize-cards.ps1` — Helper for card image filenames

## Windows note

This repo’s `package.json` includes `@rolldown/binding-win32-x64-msvc` for the Windows toolchain used here. If you develop on **macOS or Linux**, you may need to replace or remove that binding so `npm install` resolves the correct platform package for your OS.

## License

Private project (`"private": true` in `package.json`). Add a license file here if you intend to publish the repo.
