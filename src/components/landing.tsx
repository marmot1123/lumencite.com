import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import {
  IconArrowRight,
  IconCommand,
  IconDoc,
  IconDownload,
  IconExternal,
  IconFilter,
  IconPlug,
  IconScan,
  IconSearch,
  IconShield,
  IconSigma,
} from './icons'

export const SITE_URL = 'https://lumencite.com'
export const GITHUB = 'https://github.com/marmot1123/LumenCite'
export const RELEASES = `${GITHUB}/releases/latest`
const SPONSOR = 'https://github.com/sponsors/marmot1123'

export type Locale = 'ja' | 'en'

/**
 * OS-aware download target. SSR renders the macOS default; after hydration
 * the label switches to the visitor's OS and, when the GitHub API answers,
 * the href upgrades from the releases page to the direct installer asset.
 */
type DownloadOS = 'mac' | 'windows' | 'linux' | 'other'

const LATEST_RELEASE_API =
  'https://api.github.com/repos/marmot1123/LumenCite/releases/latest'

function detectOS(): DownloadOS {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  const platform = (nav.userAgentData?.platform ?? nav.platform).toLowerCase()
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    return 'other'
  }
  if (platform.includes('mac') || ua.includes('mac os')) {
    // iPadOS in desktop mode masquerades as a Mac but has a touch screen
    return navigator.maxTouchPoints > 1 ? 'other' : 'mac'
  }
  if (platform.includes('win') || ua.includes('windows')) return 'windows'
  if (platform.includes('linux') || ua.includes('linux')) return 'linux'
  return 'other'
}

type DownloadTarget = { os: DownloadOS; href: string }

function useDownloadTarget(): DownloadTarget | null {
  const [target, setTarget] = useState<DownloadTarget | null>(null)
  useEffect(() => {
    const os = detectOS()
    setTarget({ os, href: RELEASES })
    let cancelled = false
    fetch(LATEST_RELEASE_API)
      .then((res) => (res.ok ? res.json() : null))
      .then((release: unknown) => {
        if (cancelled || !release) return
        const assets = (
          release as {
            assets?: Array<{ name: string; browser_download_url: string }>
          }
        ).assets
        if (!assets) return
        const find = (suffix: string) =>
          assets.find((a) => a.name.toLowerCase().endsWith(suffix))
            ?.browser_download_url
        const href =
          os === 'mac'
            ? find('.dmg')
            : os === 'windows'
              ? (find('-setup.exe') ?? find('.msi'))
              : os === 'linux'
                ? find('.appimage')
                : undefined
        if (href) setTarget({ os, href })
      })
      .catch(() => {
        // keep the releases-page fallback
      })
    return () => {
      cancelled = true
    }
  }, [])
  return target
}

type GridItem = {
  icon: typeof IconSearch
  title: string
  body: string
}

type Copy = {
  nav: {
    features: string
    download: string
  }
  hero: {
    chipA: string
    chipB: string
    h1Pre: ReactNode
    h1Accent: string
    h1Post: string
    sub: string
    ctaGithub: string
    note: string
  }
  shot: {
    src: string
    srcSet: string
    width: number
    height: number
    alt: string
  }
  lcir: {
    title: string
    body: ReactNode
    doc: string
    sec: string
    def: string
    thm: string
    proof: string
    eq: string
    fig: string
    figChip: string
    caption: string
  }
  chat: {
    title: string
    body: string
    question: string
    answerPre: string
    answerMid: string
    answerPost: string
    footnote: string
  }
  latex: {
    title: string
    body: ReactNode
    texLine1: string
    texLine2: string
    texLine3Post: string
    bibNote: string
  }
  grid: { heading: string; items: Array<GridItem>; tail: string }
  download: { heading: string; body: string; ctaAll: string }
  dl: { hero: Record<DownloadOS, string>; card: Record<DownloadOS, string> }
  footer: { readmeLabel: string; readmeHref: string }
}

const COPY: Record<Locale, Copy> = {
  ja: {
    nav: {
      features: '機能',
      download: 'ダウンロード',
    },
    hero: {
      chipA: 'オープンソースの文献管理アプリ',
      chipB: 'macOS / Windows / Linux',
      h1Pre: '文献ライブラリを、',
      h1Accent: '対話できる',
      h1Post: '研究基盤に。',
      sub: 'LumenCite は研究者のためのオープンソース文献管理アプリ。PDF を定理・数式・図表のレベルまで構造化し、ライブラリ全体を横断して AI と対話できます。BibTeX 自動同期で、LaTeX 執筆までそのままつながります。',
      ctaGithub: 'GitHub で見る',
      note: '無料 · MIT ライセンス · Universal Binary（Apple Silicon / Intel） · Windows / Linux 版は Releases から',
    },
    shot: {
      src: '/screenshots/library-view-ja-1600.webp',
      srcSet:
        '/screenshots/library-view-ja-1600.webp 1600w, /screenshots/library-view-ja-2400.webp 2400w',
      width: 1600,
      height: 1004,
      alt: 'LumenCite のライブラリ画面。左にコレクションとタグ、中央に文献一覧、右に選択中の論文の詳細パネル',
    },
    lcir: {
      title: '論文を、機械が読める構造へ。',
      body: (
        <>
          PDF と arXiv の TeX
          ソースを解析し、セクション・段落・定理・証明・数式・図表をページ座標つきのツリー（LCIR）に変換。論文は追加した瞬間に自動で解析されます。全文検索の索引と図表の切り出しはこの構造から作られ、AI
          チャットは「Theorem
          2.3」のような文中参照を実体のノードとして読み取ります。
        </>
      ),
      doc: 'arXiv:quant-ph/0303081 · LCIR',
      sec: '§2 コイン付き量子ウォーク',
      def: '定義 2.1 — Coined walk',
      thm: '定理 2.3 — 混合時間の上界',
      proof: '証明',
      eq: '式 (14)',
      fig: '図 3 — 分布の比較',
      figChip: '切り出し済み',
      caption:
        'この構造が、全文検索の索引・図表の切り出し・AI チャットの引用の土台になっています',
    },
    chat: {
      title: 'ライブラリ全体と、対話する。',
      body: 'AI が全文検索と LCIR の読み取りツールを繰り返し呼び出しながら、複数の文献を横断して回答を組み立てます。回答は論文自身の記述と LumenCite の推論を区別して提示。引用ブロックをクリックすれば、PDF のその場所へ飛べます。スコープはライブラリ全体でも、選んだ数本だけでも。',
      question:
        'コイン付き量子ウォークの標準的な定式化は、この中だとどの論文に従うのがいい？',
      answerPre:
        '導入としては Kempe のレビューが最も整理されています。定義はヒルベルト空間',
      answerMid: '上で与えられており、後続の Ambainis の定式化とも整合します。',
      answerPost: 'ここは論文自身の記述です。',
      footnote:
        '引用ブロックをクリックすると、PDF の該当箇所がハイライトされます',
    },
    latex: {
      title: 'LaTeX 執筆に、そのままつながる。',
      body: (
        <>
          ライブラリを編集すると、指定したパスの .bib
          ファイルへ自動で同期（VSCode LaTeX Workshop を想定した設計）。cite key
          はピン留めでき、重複は自動で回避されます。ターミナルからは CLI の{' '}
          <code className="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">
            lumencite bib
          </code>
          、Claude Code や Claude Desktop からは内蔵の MCP
          サーバー経由で操作できます。
        </>
      ),
      texLine1: '{量子ウォークの基礎}',
      texLine2: 'コイン付き量子ウォークの定義は',
      texLine3Post: ' に従う。',
      bibNote: '変更から 800ms で自動同期',
    },
    grid: {
      heading: '研究の道具として、必要なものを全部。',
      items: [
        {
          icon: IconSearch,
          title: 'メタデータ自動取得',
          body: 'DOI / arXiv ID / ISBN を入れるだけ。CrossRef · arXiv · Open Library から取得',
        },
        {
          icon: IconDoc,
          title: 'PDF ビューア',
          body: '3 色ハイライトとノート。1 エントリに本文＋補足資料など複数 PDF を添付可能',
        },
        {
          icon: IconFilter,
          title: '全文検索と複合フィルタ',
          body: 'FTS5 による PDF 全文検索。種別・年・スター・タグを AND / OR で積み重ね',
        },
        {
          icon: IconScan,
          title: 'Vision OCR',
          body: 'テキストレイヤーのないスキャン PDF を LLM ビジョンで転写し、検索可能に',
        },
        {
          icon: IconPlug,
          title: 'MCP · CLI · Web Clipper',
          body: 'Claude Code などからライブラリを読み書き。Chrome 拡張でワンクリック取り込み',
        },
        {
          icon: IconSigma,
          title: 'KaTeX 数式表示',
          body: '抄録やノートの数式をそのままレンダリング。ノートは Markdown で記述',
        },
        {
          icon: IconCommand,
          title: '⌘K コマンドパレット',
          body: 'エントリ横断検索とグローバルアクションを、どこからでも呼び出し',
        },
        {
          icon: IconShield,
          title: '自動バックアップ',
          body: 'DB と添付ファイルを 1 つの zip に。14 世代保持し、検証つきで復元',
        },
      ],
      tail: 'ほかにも：LLM 要約（OpenAI / Anthropic、API キーは OS キーチェーンに保管） · 日本語 / English UI · ライト / ダーク / 自動テーマ · 4 色のアクセントカラー · 署名済み自動アップデート（macOS）',
    },
    download: {
      heading: '今日から、ライブラリと話しはじめる。',
      body: 'macOS 版は署名・公証済みで、アプリ内から自動アップデート。Windows（.msi / .exe）と Linux（.AppImage / .deb / .rpm）は GitHub Releases からどうぞ。',
      ctaAll: 'すべてのリリースを見る',
    },
    dl: {
      hero: {
        mac: 'macOS 版をダウンロード',
        windows: 'Windows 版をダウンロード',
        linux: 'Linux 版をダウンロード',
        other: 'ダウンロード',
      },
      card: {
        mac: 'ダウンロード（.dmg）',
        windows: 'ダウンロード（.exe）',
        linux: 'ダウンロード（.AppImage）',
        other: 'ダウンロード',
      },
    },
    footer: {
      readmeLabel: 'README（日本語）',
      readmeHref: `${GITHUB}/blob/main/README_ja.md`,
    },
  },
  en: {
    nav: {
      features: 'Features',
      download: 'Download',
    },
    hero: {
      chipA: 'Open-source reference manager',
      chipB: 'macOS / Windows / Linux',
      h1Pre: 'A reference library',
      h1Accent: 'you can talk to',
      h1Post: '.',
      sub: 'LumenCite is an open-source reference manager for researchers. It parses PDFs down to theorems, equations, and figures, and lets you chat with an AI across your entire library. Automatic BibTeX sync connects it straight to your LaTeX writing.',
      ctaGithub: 'View on GitHub',
      note: 'Free · MIT License · Universal Binary (Apple Silicon / Intel) · Windows / Linux builds on Releases',
    },
    shot: {
      src: '/screenshots/library-view-en-1600.webp',
      srcSet:
        '/screenshots/library-view-en-1600.webp 1600w, /screenshots/library-view-en-2400.webp 2400w',
      width: 1600,
      height: 1005,
      alt: 'The LumenCite library view: collections and tags on the left, the reference list in the center, and the detail panel for the selected paper on the right',
    },
    lcir: {
      title: 'Papers, parsed into machine-readable structure.',
      body: (
        <>
          LumenCite parses PDFs and arXiv TeX sources into a tree of sections,
          paragraphs, theorems, proofs, equations, figures, and tables (LCIR),
          each node carrying page coordinates. Papers are analyzed automatically
          the moment you add them. The full-text index and figure extraction are
          built from this structure, and the AI chat reads in-text references
          like &ldquo;Theorem 2.3&rdquo; as the actual nodes.
        </>
      ),
      doc: 'arXiv:quant-ph/0303081 · LCIR',
      sec: '§2 Coined quantum walks',
      def: 'Definition 2.1 — Coined walk',
      thm: 'Theorem 2.3 — Mixing-time upper bound',
      proof: 'Proof',
      eq: 'Eq. (14)',
      fig: 'Fig. 3 — Distribution comparison',
      figChip: 'cropped',
      caption:
        'This structure underpins the full-text index, figure extraction, and chat citations',
    },
    chat: {
      title: 'Talk to your entire library.',
      body: "The AI iterates over full-text search and LCIR read tools to build answers across multiple papers. Responses distinguish the paper's own words from LumenCite's inference, and clicking a citation jumps to that exact spot in the PDF. Scope a chat to your whole library, or just the papers you pick.",
      question:
        'Which of these papers should I follow for the standard formulation of coined quantum walks?',
      answerPre:
        "Kempe's review is the most organized introduction. The definition is given on the Hilbert space",
      answerMid: "and is consistent with Ambainis's later formulation.",
      answerPost: "This part is the paper's own wording.",
      footnote:
        'Clicking a citation highlights the corresponding passage in the PDF',
    },
    latex: {
      title: 'Flows straight into LaTeX writing.',
      body: (
        <>
          Edits to your library sync automatically to a .bib file at a path you
          choose, designed with VSCode LaTeX Workshop in mind. Citation keys can
          be pinned, and duplicates are resolved automatically. Use the built-in
          CLI{' '}
          <code className="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]">
            lumencite bib
          </code>{' '}
          from the terminal, or drive the library from Claude Code and Claude
          Desktop via the built-in MCP server.
        </>
      ),
      texLine1: '{Basics of quantum walks}',
      texLine2: 'We follow the coined quantum walk',
      texLine3Post: '.',
      bibNote: 'auto-syncs 800 ms after each change',
    },
    grid: {
      heading: 'Everything a research tool needs.',
      items: [
        {
          icon: IconSearch,
          title: 'Automatic metadata',
          body: 'Just paste a DOI / arXiv ID / ISBN — fetched via CrossRef, arXiv, and Open Library',
        },
        {
          icon: IconDoc,
          title: 'PDF viewer',
          body: '3-color highlights and notes. Attach multiple PDFs per entry — the paper plus supplements',
        },
        {
          icon: IconFilter,
          title: 'Full-text search & filters',
          body: 'FTS5 full-text search over PDFs. Stack type, year, star, and tag filters with AND / OR',
        },
        {
          icon: IconScan,
          title: 'Vision OCR',
          body: 'Transcribes scanned PDFs with no text layer via LLM vision, making them searchable',
        },
        {
          icon: IconPlug,
          title: 'MCP · CLI · Web Clipper',
          body: 'Read and write your library from Claude Code and more. One-click capture via the Chrome extension',
        },
        {
          icon: IconSigma,
          title: 'KaTeX math',
          body: 'Renders math in abstracts and notes as you wrote it. Notes are Markdown',
        },
        {
          icon: IconCommand,
          title: '⌘K command palette',
          body: 'Search across entries and trigger global actions from anywhere',
        },
        {
          icon: IconShield,
          title: 'Automatic backups',
          body: 'Database and attachments bundled into one zip. 14 generations kept, validated restore',
        },
      ],
      tail: 'Also: LLM summaries (OpenAI / Anthropic, API keys in the OS keychain) · Japanese / English UI · light / dark / auto themes · 4 accent colors · signed auto-updates (macOS)',
    },
    download: {
      heading: 'Start talking to your library today.',
      body: 'The macOS build is signed and notarized, with in-app auto-updates. Windows (.msi / .exe) and Linux (.AppImage / .deb / .rpm) builds are on GitHub Releases.',
      ctaAll: 'All releases',
    },
    dl: {
      hero: {
        mac: 'Download for macOS',
        windows: 'Download for Windows',
        linux: 'Download for Linux',
        other: 'Download',
      },
      card: {
        mac: 'Download (.dmg)',
        windows: 'Download (.exe)',
        linux: 'Download (.AppImage)',
        other: 'Download',
      },
    },
    footer: {
      readmeLabel: 'README',
      readmeHref: `${GITHUB}/blob/main/README.md`,
    },
  },
}

export function LandingPage({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const dl = useDownloadTarget()
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <Nav t={t} locale={locale} />
      <main>
        <Hero t={t} dl={dl} />
        <FeatureLcir t={t} />
        <FeatureChat t={t} />
        <FeatureLatex t={t} />
        <FeatureGrid t={t} />
        <DownloadSection t={t} dl={dl} />
      </main>
      <Footer t={t} />
    </div>
  )
}

/* ============ Nav ============ */

function Nav({ t, locale }: { t: Copy; locale: Locale }) {
  return (
    <header className="border-b border-line-subtle">
      <div className="mx-auto flex h-[68px] max-w-[1328px] items-center justify-between px-5 md:px-8">
        <Link to={`/${locale}`} className="flex items-center gap-2.5">
          <img src="/lumencite.svg" alt="" className="h-[30px] w-[30px]" />
          <span className="text-[17px] font-semibold tracking-tight text-ink">
            LumenCite
          </span>
        </Link>
        <nav className="flex items-center gap-5 md:gap-8">
          <a
            href="#features"
            className="hidden text-[13.5px] font-medium text-ink-mute hover:text-ink md:block"
          >
            {t.nav.features}
          </a>
          <a
            href="#download"
            className="hidden text-[13.5px] font-medium text-ink-mute hover:text-ink md:block"
          >
            {t.nav.download}
          </a>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="hidden text-[13.5px] font-medium text-ink-mute hover:text-ink sm:block"
          >
            GitHub
          </a>
          <a
            href={RELEASES}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-accent-hover"
          >
            <IconDownload size={15} />
            {t.nav.download}
          </a>
          <LangSwitcher locale={locale} />
        </nav>
      </div>
    </header>
  )
}

function LangSwitcher({ locale }: { locale: Locale }) {
  const seg = (target: Locale) =>
    locale === target
      ? 'bg-accent-soft px-2.5 py-1.5 text-[11.5px] font-semibold text-accent-deep'
      : 'px-2.5 py-1.5 text-[11.5px] font-semibold text-ink-mute hover:bg-surface-2 hover:text-ink'
  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-line bg-white">
      <Link to="/ja" aria-label="日本語" className={seg('ja')}>
        JA
      </Link>
      <span className="h-[18px] w-px bg-line" aria-hidden="true" />
      <Link to="/en" aria-label="English" className={seg('en')}>
        EN
      </Link>
    </div>
  )
}

/* ============ Hero ============ */

function Hero({ t, dl }: { t: Copy; dl: DownloadTarget | null }) {
  return (
    <section className="flex flex-col items-center overflow-hidden px-5 pt-14 md:px-8 md:pt-[84px] [background:radial-gradient(ellipse_900px_500px_at_50%_-80px,oklch(0.95_0.045_75)_0%,oklch(0.985_0.003_80_/_0)_70%)]">
      <p className="flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-[11px] font-semibold text-accent-deep md:text-[12.5px]">
        <span>{t.hero.chipA}</span>
        <span className="opacity-55">·</span>
        <span>{t.hero.chipB}</span>
      </p>
      <h1 className="mt-6 text-center text-[30px] leading-[1.35] font-bold tracking-[-0.025em] md:text-[52px] md:leading-[1.28]">
        {t.hero.h1Pre}
        <br />
        <span className="text-accent-text">{t.hero.h1Accent}</span>
        {t.hero.h1Post}
      </h1>
      <p className="mt-5 max-w-[660px] text-center text-[14px] leading-[1.85] text-ink-mute md:text-[16.5px]">
        {t.hero.sub}
      </p>
      <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-3.5">
        <a
          href={dl?.href ?? RELEASES}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-[9px] bg-accent px-6 py-3 text-[15px] font-semibold text-white shadow-[0_2px_8px_oklch(0.62_0.14_65_/_0.3)] hover:bg-accent-hover sm:w-auto"
        >
          <IconDownload size={17} />
          {t.dl.hero[dl?.os ?? 'mac']}
        </a>
        <a
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-[9px] border border-line-strong bg-white px-6 py-3 text-[15px] font-semibold text-ink hover:bg-surface-2 sm:w-auto"
        >
          {t.hero.ctaGithub}
          <IconExternal size={15} />
        </a>
      </div>
      <p className="mt-4 text-center text-[11.5px] text-ink-faint md:text-[12.5px]">
        {t.hero.note}
      </p>
      <div className="mt-10 w-full max-w-[1200px] overflow-hidden rounded-xl border border-line-warm bg-white shadow-[0_30px_60px_oklch(0_0_0_/_0.12),0_8px_20px_oklch(0_0_0_/_0.07)] md:mt-[60px]">
        <img
          src={t.shot.src}
          srcSet={t.shot.srcSet}
          sizes="(min-width: 1240px) 1200px, 100vw"
          alt={t.shot.alt}
          className="block w-full"
          width={t.shot.width}
          height={t.shot.height}
        />
      </div>
    </section>
  )
}

/* ============ Feature sections ============ */

function FeatureEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[12px] font-semibold tracking-[0.1em] text-accent-text">
      {children}
    </p>
  )
}

function FeatureTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[26px] leading-[1.35] font-bold tracking-[-0.02em] md:text-[32px]">
      {children}
    </h2>
  )
}

function FeatureBody({ children }: { children: ReactNode }) {
  return (
    <p className="text-[14px] leading-[1.9] text-ink-mute md:text-[15px]">
      {children}
    </p>
  )
}

const featureCard =
  'w-full max-w-[500px] rounded-xl border border-line bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04),0_10px_30px_rgba(20,15,8,0.07)] md:p-6'

function FeatureLcir({ t }: { t: Copy }) {
  return (
    <section
      id="features"
      className="mx-auto flex max-w-[1200px] scroll-mt-16 flex-col items-center gap-10 px-5 pt-20 md:px-8 md:pt-[120px] lg:flex-row lg:gap-[88px]"
    >
      <div className="flex flex-1 flex-col gap-4">
        <FeatureEyebrow>LCIR — PAPER STRUCTURE</FeatureEyebrow>
        <FeatureTitle>{t.lcir.title}</FeatureTitle>
        <FeatureBody>{t.lcir.body}</FeatureBody>
      </div>
      <div className={featureCard}>
        <div className="mb-2 flex items-center gap-2 border-b border-line-subtle pb-3">
          <IconDoc size={15} className="text-ink-mute" />
          <span className="font-mono text-[11.5px] text-ink-mute">
            {t.lcir.doc}
          </span>
        </div>
        <div className="flex items-center gap-2 py-1.5 text-[13px] font-semibold">
          <span>{t.lcir.sec}</span>
          <span className="ml-auto font-mono text-[10px] text-ink-faint">
            p.3
          </span>
        </div>
        <div className="ml-[7px] flex items-center gap-2 border-l-[1.5px] border-line py-1.5 pl-[22px] text-[12.5px]">
          <span className="text-ink-mute">{t.lcir.def}</span>
          <span className="ml-auto font-mono text-[10px] text-ink-faint">
            p.3
          </span>
        </div>
        <div className="ml-[7px] flex items-center gap-2 rounded-r-lg border-l-[1.5px] border-accent bg-accent-soft py-1.5 pr-2.5 pl-[22px] text-[12.5px]">
          <span className="font-semibold text-accent-deep">{t.lcir.thm}</span>
          <span className="ml-auto font-mono text-[10px] text-accent-deep">
            p.4 · bbox
          </span>
        </div>
        <div className="ml-[7px] flex items-center gap-2 border-l-[1.5px] border-line py-1.5 pl-10 text-[12.5px]">
          <span className="text-ink-mute">{t.lcir.proof}</span>
          <span className="ml-auto font-mono text-[10px] text-ink-faint">
            p.4
          </span>
        </div>
        <div className="ml-[7px] flex items-center gap-2 border-l-[1.5px] border-line py-1.5 pl-[22px] text-[12.5px]">
          <span className="font-mono text-ink-mute">{t.lcir.eq}</span>
          <span className="ml-auto font-mono text-[10px] text-ink-faint">
            p.5
          </span>
        </div>
        <div className="ml-[7px] flex items-center gap-2 border-l-[1.5px] border-line py-1.5 pl-[22px] text-[12.5px]">
          <span className="text-ink-mute">{t.lcir.fig}</span>
          <span className="ml-auto rounded bg-accent-soft px-1.5 py-px text-[9.5px] font-semibold text-accent-deep">
            {t.lcir.figChip}
          </span>
        </div>
        <p className="mt-3 border-t border-line-subtle pt-3 text-[11.5px] leading-[1.6] text-ink-faint">
          {t.lcir.caption}
        </p>
      </div>
    </section>
  )
}

function FeatureChat({ t }: { t: Copy }) {
  return (
    <section className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 px-5 pt-20 md:px-8 md:pt-[110px] lg:flex-row lg:gap-[88px]">
      <div className="flex flex-1 flex-col gap-4 lg:order-2">
        <FeatureEyebrow>AGENTIC CHAT</FeatureEyebrow>
        <FeatureTitle>{t.chat.title}</FeatureTitle>
        <FeatureBody>{t.chat.body}</FeatureBody>
      </div>
      <div className={`${featureCard} flex flex-col gap-3 lg:order-1`}>
        <div className="max-w-[360px] self-end rounded-[12px_12px_3px_12px] border border-line-subtle bg-surface-2 px-3.5 py-2.5 text-[13px] leading-[1.65]">
          {t.chat.question}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-[7px] border border-line-subtle bg-surface-2 px-2.5 py-1.5">
            <IconSearch size={12} className="shrink-0 text-ink-mute" />
            <span className="truncate font-mono text-[11px] text-ink-mute">
              fulltext_search(&quot;coined quantum walk&quot;)
            </span>
            <span className="ml-auto shrink-0 rounded-full bg-accent-soft px-1.5 py-px font-mono text-[10px] text-accent-deep">
              7 hits
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-[7px] border border-line-subtle bg-surface-2 px-2.5 py-1.5">
            <IconDoc size={12} className="shrink-0 text-ink-mute" />
            <span className="truncate font-mono text-[11px] text-ink-mute">
              get_document_structure(kempe2003)
            </span>
            <span className="ml-auto shrink-0 rounded-full bg-accent-soft px-1.5 py-px font-mono text-[10px] text-accent-deep">
              §2
            </span>
          </div>
          <p className="text-[13px] leading-[1.75]">
            {t.chat.answerPre}{' '}
            <span className="font-serif italic">
              H = H<sub>C</sub> ⊗ H<sub>P</sub>
            </span>{' '}
            {t.chat.answerMid}
            <span className="mx-1 inline-flex translate-y-[-1px] items-center gap-1 rounded-[5px] bg-accent-soft px-1.5 py-0.5 text-[10.5px] font-semibold text-accent-deep">
              Kempe 2003 · §2.1 · p.4
            </span>
            {t.chat.answerPost}
          </p>
        </div>
        <p className="flex items-center gap-1.5 border-t border-line-subtle pt-2.5 text-[11.5px] text-ink-faint">
          <IconArrowRight size={12} className="shrink-0" />
          {t.chat.footnote}
        </p>
      </div>
    </section>
  )
}

function FeatureLatex({ t }: { t: Copy }) {
  return (
    <section className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 px-5 pt-20 md:px-8 md:pt-[110px] lg:flex-row lg:gap-[88px]">
      <div className="flex flex-1 flex-col gap-4">
        <FeatureEyebrow>BIBTEX WORKFLOW</FeatureEyebrow>
        <FeatureTitle>{t.latex.title}</FeatureTitle>
        <FeatureBody>{t.latex.body}</FeatureBody>
      </div>
      <div className="flex w-full max-w-[500px] flex-col gap-3">
        <div className="w-full rounded-xl border border-line bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04),0_10px_30px_rgba(20,15,8,0.07)] md:p-6">
          <div className="mb-3 border-b border-line-subtle pb-2.5">
            <span className="font-mono text-[11px] text-ink-mute">
              main.tex
            </span>
          </div>
          <div className="font-mono text-[12.5px] leading-[1.9] text-ink/80">
            <div>
              <span className="text-[oklch(0.5_0.1_250)]">\section</span>
              {t.latex.texLine1}
            </div>
            <div>{t.latex.texLine2}</div>
            <div>
              <span className="text-[oklch(0.5_0.1_250)]">\cite</span>
              {'{'}
              <span className="rounded-[3px] bg-accent-soft px-0.5 text-accent-deep">
                kempe2003
              </span>
              {'}'}
              {t.latex.texLine3Post}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-[10px] border border-line bg-white px-4 py-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[oklch(0.62_0.15_150)]" />
          <span className="font-mono text-[12px] text-ink/80">
            references.bib
          </span>
          <span className="ml-auto text-right text-[11.5px] text-ink-faint">
            {t.latex.bibNote}
          </span>
        </div>
      </div>
    </section>
  )
}

/* ============ Feature grid ============ */

function FeatureGrid({ t }: { t: Copy }) {
  return (
    <section className="mx-auto flex max-w-[1200px] flex-col items-center px-5 pt-20 md:px-8 md:pt-[120px]">
      <h2 className="text-center text-[24px] font-bold tracking-[-0.02em] md:text-[30px]">
        {t.grid.heading}
      </h2>
      <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.grid.items.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="flex flex-col gap-2.5 rounded-xl border border-line bg-white p-5"
          >
            <Icon size={22} className="text-accent-text" />
            <h3 className="text-[14.5px] font-semibold">{title}</h3>
            <p className="text-[12.5px] leading-[1.7] text-ink-mute">{body}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 max-w-[900px] text-center text-[12.5px] leading-[1.8] text-ink-faint md:text-[13px]">
        {t.grid.tail}
      </p>
    </section>
  )
}

/* ============ Download ============ */

function DownloadSection({ t, dl }: { t: Copy; dl: DownloadTarget | null }) {
  return (
    <section
      id="download"
      className="mx-auto w-full max-w-[1200px] scroll-mt-16 px-5 pt-20 md:px-8 md:pt-[120px]"
    >
      <div className="flex flex-col items-center gap-10 rounded-[18px] border border-accent-soft-border p-8 md:p-14 lg:flex-row lg:gap-16 [background:linear-gradient(160deg,oklch(0.95_0.045_75),oklch(0.965_0.02_75))]">
        <div className="flex flex-1 flex-col gap-3.5">
          <h2 className="text-[22px] font-bold tracking-[-0.02em] md:text-[27px]">
            {t.download.heading}
          </h2>
          <p className="text-[13.5px] leading-[1.8] text-accent-deep md:text-[14.5px]">
            {t.download.body}
          </p>
          <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <a
              href={dl?.href ?? RELEASES}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-[9px] bg-accent px-5 py-3 text-[14.5px] font-semibold text-white hover:bg-accent-hover"
            >
              <IconDownload size={16} />
              {t.dl.card[dl?.os ?? 'mac']}
            </a>
            <a
              href={`${GITHUB}/releases`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-[9px] border border-line-strong bg-white px-5 py-3 text-[14.5px] font-semibold text-ink hover:bg-surface-2"
            >
              {t.download.ctaAll}
            </a>
          </div>
        </div>
        <div className="w-full max-w-[440px] rounded-xl bg-terminal p-5 shadow-[0_12px_30px_rgba(20,15,8,0.18)] md:px-6">
          <p className="pb-2.5 text-[11px] font-semibold tracking-[0.08em] text-[oklch(0.65_0.03_75)]">
            HOMEBREW
          </p>
          <div className="overflow-x-auto font-mono text-[11.5px] leading-[2] text-[oklch(0.9_0.01_80)] md:text-[12.5px]">
            <div>
              <span className="text-[oklch(0.65_0.03_75)]">$</span> brew tap
              marmot1123/lumencite
            </div>
            <div>
              <span className="text-[oklch(0.65_0.03_75)]">$</span> brew trust
              marmot1123/lumencite
            </div>
            <div>
              <span className="text-[oklch(0.65_0.03_75)]">$</span> brew install
              --cask lumencite
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============ Footer ============ */

function Footer({ t }: { t: Copy }) {
  return (
    <footer className="mt-20 border-t border-line-subtle md:mt-[100px]">
      <div className="mx-auto flex max-w-[1328px] flex-col items-center justify-between gap-4 px-5 py-8 md:flex-row md:px-8">
        <div className="flex items-center gap-2.5">
          <img src="/lumencite.svg" alt="" className="h-[22px] w-[22px]" />
          <span className="text-[14px] font-semibold">LumenCite</span>
          <span className="text-[12.5px] text-ink-faint">
            © 2026 · MIT License
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-5 text-[12.5px] font-medium text-ink-mute md:gap-7">
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={`${GITHUB}/releases`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            Releases
          </a>
          <a
            href={t.footer.readmeHref}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            {t.footer.readmeLabel}
          </a>
          <a
            href={SPONSOR}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            Sponsor
          </a>
        </nav>
      </div>
    </footer>
  )
}
