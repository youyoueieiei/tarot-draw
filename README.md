# tarot-draw

一套 78 張完整塔羅牌的網頁抽牌與排陣工具。介面與牌義說明為**繁體中文**。

[English README](./README.en.md)

## 功能

- **排陣抽牌** — 選擇牌陣後，點擊空位或牌堆即可抽牌。內建牌陣：單張、過去／現在／未來、四張關係牌陣，以及凱爾特十字。
- **自由牌** — 牌面可放在可拖曳的畫布上自由排列；支援全螢幕與棄牌區。
- **手動洗牌** — 捲動疊起的牌堆、點擊牌背抽牌、切牌，或使用快捷操作（頂牌、隨機一張）。已抽出的牌會顯示在下方橫列。
- **扇形選牌** — 點擊牌堆展開扇形，手動挑選一張，而非自動發牌。
- **正逆位** — 依洗牌種子與抽牌情境的確定性雜湊決定正逆位，相同種子下結果可重現。
- **牌義** — 點擊已抽出的牌可開啟視窗，查看正位／逆位說明（見 `src/lib/interpretation.ts`）。

洗牌會重置牌堆並清除目前模式下的已抽牌，方便開始新一輪。

## 技術棧

- [React](https://react.dev/) 19 · [Vite](https://vitejs.dev/) 8 · [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4 · [Framer Motion](https://www.framer.com/motion/)（動畫與過場）

## 環境需求

- [Node.js](https://nodejs.org/)（建議 LTS；20 以上較穩妥）

## 安裝與指令

```bash
npm install
npm run dev
```

| 指令 | 說明 |
| --- | --- |
| `npm run dev` | 啟動 Vite 開發伺服器（含 HMR） |
| `npm run build` | 先型別檢查（`tsc -b`），再建置正式版 |
| `npm run preview` | 在本機預覽 `dist` 建置結果 |
| `npm run lint` | 執行 ESLint |

執行 `npm run dev` 後，在瀏覽器開啟 Vite 顯示的網址（通常為 `http://localhost:5173`）。

## 專案結構（概覽）

- `src/App.tsx` — 模式切換、洗牌／抽牌狀態、牌陣定義
- `src/lib/tarot.ts` — 牌組建構、牌面 metadata、圖片路徑
- `src/lib/interpretation.ts` — 各牌正位／逆位文案
- `src/ui/` — 牌堆、扇形選牌、牌陣版面、彈窗等 UI
- `CARD_IMAGE_STATUS.md` — 牌面圖片資產說明（78 張＋牌背）
- `scripts/normalize-cards.ps1` — 牌面檔名整理輔助腳本

## Windows 說明

本專案 `package.json` 內含 `@rolldown/binding-win32-x64-msvc`，供目前使用的 Windows 工具鏈。若在 **macOS 或 Linux** 開發，可能需要改為或移除該 binding，讓 `npm install` 能解析到對應平台的套件。

## 授權

私人專案（`package.json` 中 `"private": true`）。若打算公開此 repo，請自行加入授權檔。
