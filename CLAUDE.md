# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## このリポジトリについて

AI ネイティブな文献管理ソフトウェア **LumenCite** の公式サイト。`https://lumencite.com` で公開（ホスティングは Cloudflare Workers の静的アセット配信）。

## 技術スタック

- **TanStack Start**（React 19 + TanStack Router + Vite 8）、TypeScript、Tailwind CSS 4
- **静的プリレンダリング有効**（`vite.config.ts` の `tanstackStart({ prerender })`）。ビルドすると全ルートが `dist/client/` に静的 HTML として書き出される（`crawlLinks: true` でリンク先も自動クロール）。サーバー不要の完全静的サイトとして運用する方針。
- Lint/Format は ESLint（`@tanstack/eslint-config`）+ Prettier（`design/` は Prettier 対象外）。

## コマンド

- `pnpm dev` — 開発サーバー（port 3000）
- `pnpm build` — 本番ビルド（プリレンダリング込み。出力は `dist/`。`/`・`/ja`・`/en` の 3 ページが出る）
- `pnpm lint` / `pnpm check` — ESLint / Prettier チェック
- `pnpm format` — Prettier + eslint --fix 一括整形
- `pnpm generate-routes` — ルートツリー再生成（通常は dev/build が自動で行う）
- `pnpm run deploy` — ビルド + `wrangler deploy` で Cloudflare へデプロイ（要 `wrangler login` 済み）。**`run` を省略すると pnpm 組み込みの workspace deploy コマンドに解釈されて失敗する**

## デプロイ（Cloudflare Workers）

- `wrangler.jsonc` は **assets-only Worker**（`main` なし）。`dist/client` を静的配信し、カスタムドメイン `lumencite.com` を `routes` の `custom_domain` で紐付け。
- サーバー機能（お問い合わせ、`/` の Accept-Language エッジリダイレクト等）が必要になったら `main` に Worker スクリプトを足す。TanStack Start の Cloudflare アダプタへの移行も可。
- 404 は現在 `not_found_handling: "none"`（素の 404）。専用 404 ページを作ったら `404-page` に変更する。

## サイト構成（日英 2 言語）

- `/ja`・`/en` — 各言語のランディングページ。`src/components/landing.tsx` の `LandingPage` を共用し、同ファイル内の `COPY` 辞書（`ja` / `en`）で全コピーを管理する。文言変更は `COPY` を編集する。
- `/` — 言語ゲート（`src/routes/index.tsx`）。`navigator.language` で `/ja` か `/en` へクライアントリダイレクトし、フォールバックとして両言語へのリンクを表示。
- SEO メタ（title / description / OG / hreflang）は各ルートの `head()` に、共通の favicon・フォント読み込みは `src/routes/__root.tsx` に置く。`<html lang>` は `__root.tsx` がパスから判定。
- パスエイリアス `#/*` → `./src/*`（package.json の `imports`）。`src/routeTree.gen.ts` は自動生成物（手で編集しない）。

## デザイン

- デザイントークンは `src/styles.css` の `@theme` に定義（アプリ本体 `../LumenCite/design/design_handoff_library_view/README.md` の OKLCH トークン準拠。ライトベース + アンバーのアクセントカラー、IBM Plex Sans/Serif/Mono + Noto Sans JP）。
- 確定デザイン（案A）のデザインキャンバス作業ファイルは `design/landing/`（`*.dc.html` + `canvas.json`）。公開済みキャンバスの再シードに使うので削除しない。キャンバスは Claude Code の `/design` プレビューで公開済み。

## アセット

- `public/screenshots/library-view-{ja,en}-{1600,2400}.webp` — ヒーロー用アプリスクリーンショット。**元画像は `../LumenCite/docs/screenshots/library_view*.png`**。日本語版の元 PNG は上端 12px に黒帯があるため、再生成時は上端をトリミングしてから `sips -Z` + `cwebp` で変換する。
- `public/og-{ja,en}.png` — OG 画像（1200×630、スクショの中央クロップ）。
- `public/lumencite.svg` ほかロゴ類 — 正本は `../LumenCite/design/logo-exports/`。

## 周辺リポジトリとの関係

- 親ディレクトリ `../` は LumenCite 関連の情報をまとめる親ディレクトリ(独自の `CLAUDE.md` あり)。git リポジトリではない。
- アプリ本体は `../LumenCite/`（Tauri 2 + React + TypeScript のデスクトップアプリ）。製品の仕様・機能はそちらの `CLAUDE.md` と `docs/` が正であり、**サイトに載せる機能説明はそちらの README / SPEC に基づいて書く（創作の実績・価格・機能を入れない）**。LCIR は現状「全文検索の索引・図表切り出し・AI チャットの土台」であり、アウトライン表示 UI はまだ無い（実装されたら文言を更新する）。

## 作業上の注意

- このディレクトリは Dropbox 同期下にあり、`/Users/motoki/Library/CloudStorage/Dropbox/projects/LumenCite/lumencite.com` と `/Users/motoki/Dropbox/projects/LumenCite/lumencite.com` は同じ場所を指す。
- `node_modules/` と `.tanstack/` には `com.dropbox.ignored` xattr を設定済みで Dropbox 同期から除外されている。これらを作り直した場合は `xattr -w com.dropbox.ignored 1 <dir>` を再設定すること。
