/**
 * Auto-generates sitemap.xml from the article registry.
 *
 * Runs as part of the build pipeline (after vite build, before prerender).
 * Ensures every registered article has a proper <url> entry.
 *
 * Usage:
 *   npx tsx --tsconfig tsconfig.app.json scripts/generate-sitemap.ts
 */

import { writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { articleRegistry } from '../src/articles/registry.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = resolve(__dirname, '..', 'dist')

const today = new Date().toISOString().slice(0, 10)

/**
 * Most recent git commit date (YYYY-MM-DD) across the given files.
 * Prevents lastmod churn on home + about when unrelated build-pipeline stats
 * update their stars counts without the page actually changing.
 */
function lastmodFromGit(files: string[]): string {
  let latest = ''
  for (const file of files) {
    try {
      const out = execSync(`git log -1 --format=%cs -- ${file}`, { encoding: 'utf-8' }).trim()
      if (out && out > latest) latest = out
    } catch {
      // Git not available or file not in history — fall through to today
    }
  }
  return latest || today
}

const homeLastmod = lastmodFromGit(['src/App.tsx', 'src/i18n.ts'])
const aboutLastmod = lastmodFromGit(['src/AboutPage.tsx', 'src/about-i18n.ts'])

// ---------------------------------------------------------------------------
// URL builder
// ---------------------------------------------------------------------------

interface SitemapUrl {
  loc: string
  lastmod: string
  /** Kept for type-compat with existing call-sites; not emitted (Google ignores since 2017). */
  priority?: string
}

function urlBlock(u: SitemapUrl): string {
  return `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
}

// ---------------------------------------------------------------------------
// Build URLs
// ---------------------------------------------------------------------------

const base = 'https://cv-lu.vercel.app'
const urls: SitemapUrl[] = []

urls.push({
  loc: `${base}/`,
  lastmod: homeLastmod,
  priority: '1.0',
})

urls.push({
  loc: `${base}/about`,
  lastmod: aboutLastmod,
  priority: '0.9',
})

// Articles from registry
for (const article of articleRegistry) {
  urls.push({
    loc: `${base}/${article.slug}`,
    lastmod: article.seoMeta?.dateModified ?? today,
    priority: '0.8',
  })
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(urlBlock).join('\n')}
</urlset>
`

writeFileSync(resolve(dist, 'sitemap.xml'), xml, 'utf-8')
console.log(`[sitemap] Generated ${urls.length} URLs in dist/sitemap.xml`)
