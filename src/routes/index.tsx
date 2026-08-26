import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { SITE_URL } from '../components/landing'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'LumenCite' },
      {
        name: 'description',
        content:
          'LumenCite — AI-native reference management for researchers. 研究者のための AI ネイティブ文献管理。',
      },
    ],
    links: [
      { rel: 'canonical', href: `${SITE_URL}/` },
      { rel: 'alternate', hrefLang: 'ja', href: `${SITE_URL}/ja` },
      { rel: 'alternate', hrefLang: 'en', href: `${SITE_URL}/en` },
      { rel: 'alternate', hrefLang: 'x-default', href: `${SITE_URL}/` },
    ],
  }),
  component: LanguageGate,
})

function LanguageGate() {
  const navigate = useNavigate()

  useEffect(() => {
    const prefersJa = navigator.language.toLowerCase().startsWith('ja')
    void navigate({ to: prefersJa ? '/ja' : '/en', replace: true })
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-cream px-6 [background:radial-gradient(ellipse_700px_420px_at_50%_30%,oklch(0.95_0.045_75)_0%,oklch(0.985_0.003_80_/_0)_70%)]">
      <div className="flex flex-col items-center gap-4">
        <img src="/lumencite.svg" alt="" className="h-16 w-16" />
        <p className="text-[26px] font-bold tracking-tight text-ink">
          LumenCite
        </p>
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row">
        <Link
          to="/ja"
          className="flex min-w-[180px] items-center justify-center rounded-[9px] bg-accent px-6 py-3 text-[15px] font-semibold text-white hover:bg-accent-hover"
        >
          日本語
        </Link>
        <Link
          to="/en"
          className="flex min-w-[180px] items-center justify-center rounded-[9px] border border-line-strong bg-white px-6 py-3 text-[15px] font-semibold text-ink hover:bg-surface-2"
        >
          English
        </Link>
      </div>
    </div>
  )
}
