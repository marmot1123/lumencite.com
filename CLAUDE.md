# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## このリポジトリについて

AI ネイティブな文献管理ソフトウェア **LumenCite** の公式サイト。`https://lumencite.com` にデプロイ予定。ホスティング先は未決定（静的出力なので Cloudflare / Netlify 等どこでも可）。

## 技術スタック

- **TanStack Start**（React 19 + TanStack Router + Vite 8）、TypeScript、Tailwind CSS 4
- **静的プリレンダリング有効**（`vite.config.ts` の `tanstackStart({ prerender })`）。ビルドすると全ルートが `dist/client/` に静的 HTML として書き出される（`crawlLinks: true` でリンク先も自動クロール）。サーバー不要の完全静的サイトとして運用する方針。
- Lint/Format は ESLint（`@tanstack/eslint-config`）+ Prettier。

## コマンド

- `pnpm dev` — 開発サーバー（port 3000）
- `pnpm build` — 本番ビルド（プリレンダリング込み。出力は `dist/`）
- `pnpm lint` / `pnpm check` — ESLint / Prettier チェック
- `pnpm format` — Prettier + eslint --fix 一括整形
- `pnpm generate-routes` — ルートツリー再生成（通常は dev/build が自動で行う）

## 構成のポイント

- ファイルベースルーティング: `src/routes/` にルートを追加する。`src/routeTree.gen.ts` は自動生成物（手で編集しない）。
- ルート共通レイアウトは `src/routes/__root.tsx`。
- パスエイリアス `#/*` → `./src/*`（package.json の `imports`）。

## 周辺リポジトリとの関係

- 親ディレクトリ `../` は LumenCite 関連の情報をまとめる親ディレクトリ（独自の `CLAUDE.md` あり）。git リポジトリではない。
- アプリ本体は `../LumenCite/`（Tauri 2 + React + TypeScript のデスクトップアプリ）。製品の仕様・機能はそちらの `CLAUDE.md` と `docs/` が正であり、サイトに製品情報を書くときはそちらを参照する。

## 作業上の注意

- このディレクトリは Dropbox 同期下にあり、`/Users/motoki/Library/CloudStorage/Dropbox/projects/LumenCite/lumencite.com` と `/Users/motoki/Dropbox/projects/LumenCite/lumencite.com` は同じ場所を指す。
- `node_modules/` と `.tanstack/` には `com.dropbox.ignored` xattr を設定済みで Dropbox 同期から除外されている。これらを作り直した場合は `xattr -w com.dropbox.ignored 1 <dir>` を再設定すること。
