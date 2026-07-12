import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArticleLayout } from './articles/components'

const content = {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: March 15, 2026',
    intro: 'This policy describes how data is collected and used when you visit cv-santiago.vercel.app.',
    sections: [
      {
        heading: 'What data is collected',
        items: [
          'Chatbot messages: when you interact with the chatbot, messages are processed to generate responses. No personally identifiable information is requested or stored.',
          'Voice mode audio: if you activate voice mode, audio is processed in real time for conversation and is not permanently stored.',
          'Usage analytics: anonymous browsing data (pages visited, duration, device) is collected to improve the site.',
        ],
      },
      {
        heading: 'How data is used',
        items: [
          "Chatbot messages are used exclusively to generate contextual responses about the site owner's professional experience.",
          'Conversation traces are stored in anonymized form to improve response quality and detect misuse attempts.',
          'Analytics data is used to understand usage patterns and improve site performance.',
        ],
      },
      {
        heading: 'Third parties',
        items: [
          'Anthropic (Claude): processes chatbot messages to generate responses.',
          'OpenAI (Realtime API): processes voice mode audio for real-time conversation.',
          'Langfuse: stores anonymized conversation traces for observability and quality improvement.',
          'Vercel: hosts the website and collects anonymous usage analytics.',
        ],
      },
      {
        heading: 'Cookies and local storage',
        body: 'This site does not use tracking cookies or third-party cookies. Only browser localStorage is used for interface preferences (visual theme). No personal information is stored.',
      },
      {
        heading: 'No user accounts',
        body: 'This site does not require registration or login. No names, emails, or passwords are collected through the website.',
      },
      {
        heading: 'Contact',
        body: 'For any privacy-related inquiries, you can write to:',
        email: 'yl4372@columbia.edu',
      },
    ],
    backHome: 'Back to home',
} as const

interface PrivacySection {
  heading: string
  items?: readonly string[]
  body?: string
  email?: string
}

export default function PrivacyPolicy() {
  const t = content

  useEffect(() => {
    document.title = `${t.title} | cv-santiago.vercel.app`

    // noindex
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = 'noindex, nofollow'

    // Fix canonical (SPA fallback serves homepage canonical — override it)
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (canonical) canonical.href = 'https://cv-santiago.vercel.app/privacy'

    // Fix meta description
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement
    if (desc) desc.content = 'Privacy policy for cv-santiago.vercel.app. How chatbot and website data is collected and used.'

    return () => {
      robots.content = 'index, follow'
    }
  }, [t.title])

  return (
    <ArticleLayout>
      <header className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
          {t.title}
        </h1>
        <p className="text-sm text-muted-foreground">{t.lastUpdated}</p>
      </header>

      <article className="prose-custom">
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
          {t.intro}
        </p>

        {(t.sections as readonly PrivacySection[]).map((section, i) => (
          <section key={i} className="mb-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              {section.heading}
            </h2>

            {section.items && (
              <ul className="space-y-2 mb-4">
                {section.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-base text-muted-foreground">
                    <span className="text-primary font-bold shrink-0 mt-0.5">{'●'}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.body && (
              <p className="text-base text-muted-foreground leading-relaxed">
                {section.body}
              </p>
            )}

            {section.email && (
              <p className="mt-2">
                <a
                  href={`mailto:${section.email}`}
                  className="text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  {section.email}
                </a>
              </p>
            )}
          </section>
        ))}

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            {'← '}{t.backHome}
          </Link>
        </div>
      </article>
    </ArticleLayout>
  )
}
