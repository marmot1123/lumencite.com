import { createFileRoute } from '@tanstack/react-router'

import { LandingPage, SITE_URL } from '../components/landing'

const TITLE = 'LumenCite — 研究者のための AI ネイティブ文献管理'
const DESCRIPTION =
  'LumenCite は研究者のためのオープンソース文献管理アプリ。PDF を定理・数式・図表のレベルまで構造化し、ライブラリ全体を横断して AI と対話できます。BibTeX 自動同期で LaTeX 執筆までそのままつながります。macOS / Windows / Linux 対応、MIT ライセンス。'

export const Route = createFileRoute('/ja')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${SITE_URL}/ja` },
      { property: 'og:site_name', content: 'LumenCite' },
      { property: 'og:image', content: `${SITE_URL}/og-ja.png` },
      { property: 'og:locale', content: 'ja_JP' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'canonical', href: `${SITE_URL}/ja` },
      { rel: 'alternate', hrefLang: 'ja', href: `${SITE_URL}/ja` },
      { rel: 'alternate', hrefLang: 'en', href: `${SITE_URL}/en` },
      { rel: 'alternate', hrefLang: 'x-default', href: `${SITE_URL}/` },
    ],
  }),
  component: JaPage,
})

function JaPage() {
  return <LandingPage locale="ja" />
}
