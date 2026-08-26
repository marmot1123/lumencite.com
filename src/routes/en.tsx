import { createFileRoute } from '@tanstack/react-router'

import { LandingPage, SITE_URL } from '../components/landing'

const TITLE = 'LumenCite — AI-native reference management for researchers'
const DESCRIPTION =
  'LumenCite is an open-source reference manager for researchers. It parses PDFs down to theorems, equations, and figures, lets you chat with an AI across your whole library, and syncs BibTeX straight into your LaTeX workflow. macOS / Windows / Linux, MIT-licensed.'

export const Route = createFileRoute('/en')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${SITE_URL}/en` },
      { property: 'og:site_name', content: 'LumenCite' },
      { property: 'og:image', content: `${SITE_URL}/og-en.png` },
      { property: 'og:locale', content: 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'canonical', href: `${SITE_URL}/en` },
      { rel: 'alternate', hrefLang: 'ja', href: `${SITE_URL}/ja` },
      { rel: 'alternate', hrefLang: 'en', href: `${SITE_URL}/en` },
      { rel: 'alternate', hrefLang: 'x-default', href: `${SITE_URL}/` },
    ],
  }),
  component: EnPage,
})

function EnPage() {
  return <LandingPage locale="en" />
}
