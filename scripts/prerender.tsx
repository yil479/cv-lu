/**
 * Post-build script: SSR prerender using React's renderToString.
 *
 * Renders the actual App component to HTML so the pre-rendered content
 * matches exactly what React produces. This enables hydrateRoot() on the
 * client to adopt the existing DOM without replacing it (zero CLS).
 *
 * Articles are loaded from the article registry. Only articles whose
 * component files exist will be prerendered (new case studies added to the
 * registry but not yet created will be skipped gracefully).
 *
 * Usage: npx tsx scripts/prerender.tsx  (runs automatically via "npm run build")
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import React, { Suspense, type ComponentType } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router-dom';
import Critters from 'critters';
import App from '../src/App.tsx';
import GlobalNav from '../src/GlobalNav.tsx';
import { articleRegistry, type ArticleConfig } from '../src/articles/registry.ts';
import { buildArticleJsonLd, buildFaqPage } from '../src/articles/json-ld.ts';
import AboutPage from '../src/AboutPage.tsx';
import { aboutContent } from '../src/about-i18n.ts';
import PrivacyPolicy from '../src/PrivacyPolicy.tsx';
import { seo } from '../src/i18n.ts';

// Map article id → i18n content for JSON-LD generation (empty until new articles are added)
const i18nMap: Record<string, { header: { h1: string }; nav: { breadcrumbHome: string; breadcrumbCurrent: string }; faq: { items: readonly { q: string; a: string }[] } }> = {};

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

/** Strip React 19 SSR-injected <link> tags from inside #root to prevent hydration mismatch */
function stripReactSSRTags(html: string): string {
  return html.replace(/<link[^>]*>/g, '');
}

// ---------------------------------------------------------------------------
// SSR render (home page)
// ---------------------------------------------------------------------------
function renderApp(): string {
  return stripReactSSRTags(renderToString(
    <StaticRouter location="/">
      <div>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </Suspense>
      </div>
    </StaticRouter>
  ));
}

function renderArticlePage(slug: string, ArticleComponent: ComponentType): string {
  return stripReactSSRTags(renderToString(
    <StaticRouter location={`/${slug}`}>
      <GlobalNav />
      <div>
        <Suspense fallback={null}>
          <Routes>
            <Route path={`/${slug}`} element={<ArticleComponent />} />
          </Routes>
        </Suspense>
      </div>
    </StaticRouter>
  ));
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Inject into built HTML
// ---------------------------------------------------------------------------
const distDir = resolve(root, 'dist');
const indexPath = resolve(distDir, 'index.html');

let indexHtml: string;
try {
  indexHtml = readFileSync(indexPath, 'utf-8');
} catch {
  console.error('Error: dist/index.html not found. Run "vite build" first.');
  process.exit(1);
}

// --- Home page (inject into existing index.html) ---
let appHtml: string;
try {
  appHtml = renderApp();
} catch (err) {
  console.error('[prerender] SSR failed for home, falling back to empty root:', err);
  appHtml = '';
}

const injectedHome = indexHtml
  .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(seo.title)}</title>`)
  .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(seo.title)}" />`)
  .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(seo.description)}" />`)
  .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(seo.title)}" />`)
  .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(seo.description)}" />`)
  .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(seo.title)}" />`)
  .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(seo.description)}" />`);

// ---------------------------------------------------------------------------
// About / Entity Home — /about
// ---------------------------------------------------------------------------

const aboutPersonProfile = {
  '@type': 'ProfilePage',
  dateModified: '2026-07-09',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://cv-santiago.vercel.app/#person',
    name: 'Louis Lu',
    url: 'https://cv-santiago.vercel.app',
    email: 'yl4372@columbia.edu',
    jobTitle: ['Senior Software Engineer'],
    knowsAbout: ['[Skill 1]', '[Skill 2]', '[Skill 3]'],
    sameAs: [
      'https://www.linkedin.com/in/louis-lu-5b220713b/',
      'https://github.com/yil479',
    ],
    address: { '@type': 'PostalAddress', addressLocality: 'New York', addressCountry: 'USA' },
  },
};

/**
 * Build the @graph for /about.
 * Includes ProfilePage + FAQPage so AI crawlers see FAQ schema in SSR'd HTML
 * (no longer requires JS execution / useEffect).
 */
function buildAboutJsonLd(pageUrl: string, faq: readonly { q: string; a: string }[]) {
  // Split: ProfilePage references Person by @id (not inline) so KG crawlers
  // dedupe cleanly against the canonical Person emitted on home and articles.
  // The Person itself is emitted top-level in this @graph for ID resolution
  // when /about is the canonical entity home crawled in isolation.
  const personFull = aboutPersonProfile.mainEntity;
  const profile = {
    '@type': 'ProfilePage',
    '@id': `${pageUrl}#profilepage`,
    dateModified: aboutPersonProfile.dateModified,
    inLanguage: 'en',
    mainEntity: { '@id': 'https://cv-santiago.vercel.app/#person' },
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [profile, personFull, buildFaqPage(faq, pageUrl)],
  };
}

interface AboutPageData {
  slug: string;
  html: string;
}

const aboutPages: AboutPageData[] = [];

{
  const t = aboutContent;
  const slug = t.slug;
  const url = `https://cv-santiago.vercel.app/${slug}`;

  let renderedHtml: string;
  try {
    renderedHtml = stripReactSSRTags(renderToString(
      <StaticRouter location={`/${slug}`}>
        <GlobalNav />
        <div>
          <Suspense fallback={null}>
            <Routes>
              <Route path={`/${slug}`} element={<AboutPage />} />
            </Routes>
          </Suspense>
        </div>
      </StaticRouter>
    ));
  } catch (err) {
    console.error(`[prerender] SSR failed for ${slug}, falling back to empty root:`, err);
    renderedHtml = '';
  }

  let result = indexHtml
    .replace('<div id="root"></div>', `<div id="root">${renderedHtml}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(t.seo.title)}</title>`)
    .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(t.seo.title)}" />`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(t.seo.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, '<meta property="og:type" content="profile" />')
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(t.seo.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(t.seo.description)}" />`)
    .replace(/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(t.seo.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(t.seo.description)}" />`);

  // Build @graph (ProfilePage + FAQPage) and inject as SSR JSON-LD
  const aboutJsonLd = buildAboutJsonLd(url, t.faq);
  const aboutJsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(aboutJsonLd, null, 2)}\n</script>`;

  // Replace homepage JSON-LD with ProfilePage + FAQPage @graph
  result = result.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    aboutJsonLdScript,
  );

  aboutPages.push({ slug, html: result });
}

// ---------------------------------------------------------------------------
// Article pages — build from registry
// ---------------------------------------------------------------------------
interface ArticlePage {
  slug: string;
  html: string;
}

function buildArticlePage(
  config: ArticleConfig,
  ArticleComponent: ComponentType,
): string {
  const slug = config.slug;
  const url = `https://cv-santiago.vercel.app/${slug}`;
  const articleSeo = config.seo;

  let renderedHtml: string;
  try {
    renderedHtml = renderArticlePage(slug, ArticleComponent);
  } catch (err) {
    console.error(`[prerender] SSR failed for ${slug}, falling back to empty root:`, err);
    renderedHtml = '';
  }

  let result = indexHtml
    .replace('<div id="root"></div>', `<div id="root">${renderedHtml}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(articleSeo.title)}</title>`)
    .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(articleSeo.title)}" />`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(articleSeo.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, '<meta property="og:type" content="article" />')
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(articleSeo.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(articleSeo.description)}" />`)
    .replace(/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(articleSeo.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(articleSeo.description)}" />`)
    // OG image — replace with article-specific image if configured
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(config.ogImage || 'https://cv-santiago.vercel.app/og-image.webp')}" />`)
    .replace(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${esc(articleSeo.title)}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*" \/>/, config.ogImage ? `<meta name="twitter:image" content="${esc(config.ogImage)}" />` : '');

  // Inject article:published_time + article:modified_time + article:tag
  const seoMeta = config.seoMeta;
  if (seoMeta) {
    const articleMetaTags = [
      `<meta property="article:published_time" content="${seoMeta.datePublished}" />`,
      `<meta property="article:modified_time" content="${seoMeta.dateModified}" />`,
      `<meta property="article:author" content="https://www.linkedin.com/in/louis-lu-5b220713b/" />`,
      `<meta property="article:tag" content="${esc(seoMeta.articleTags)}" />`,
    ].join('\n    ');
    result = result.replace('</head>', `    ${articleMetaTags}\n  </head>`);
  }

  // Inject article JSON-LD (replace homepage Person/WebSite schema)
  const t = i18nMap[config.id];
  if (seoMeta && t) {
    const jsonLd = buildArticleJsonLd({
      url,
      headline: t.header.h1,
      alternativeHeadline: articleSeo.title,
      description: articleSeo.description,
      datePublished: seoMeta.datePublished,
      dateModified: seoMeta.dateModified,
      keywords: seoMeta.keywords,
      images: config.heroImage ? [config.heroImage] : seoMeta.images,
      breadcrumbHome: t.nav.breadcrumbHome,
      breadcrumbCurrent: t.nav.breadcrumbCurrent,
      faq: t.faq.items,
      articleType: seoMeta.articleType,
      about: seoMeta.about,
      extra: seoMeta.extra,
      citation: seoMeta.citation,
      isBasedOn: seoMeta.isBasedOn,
      mentions: seoMeta.mentions,
      discussionUrl: seoMeta.discussionUrl,
      relatedLink: seoMeta.relatedLink,
      video: seoMeta.video,
      subjectOf: seoMeta.subjectOf,
    });
    const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`;
    // Replace the homepage JSON-LD with article-specific one
    result = result.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      jsonLdScript,
    );
  }

  return result;
}

// Load article components and build pages
const articlePages: ArticlePage[] = [];

for (const config of articleRegistry) {
  let ArticleComponent: ComponentType;
  try {
    const mod = await config.component();
    ArticleComponent = mod.default;
  } catch {
    console.log(`[prerender] Skipping ${config.id} — component not found yet`);
    continue;
  }

  const html = buildArticlePage(config, ArticleComponent);
  articlePages.push({ slug: config.slug, html });
}

// ---------------------------------------------------------------------------
// Critical CSS inlining with Critters
// ---------------------------------------------------------------------------
const critters = new Critters({
  path: distDir,
  publicPath: '/',
  inlineFonts: false,
  preload: 'media',
  compress: true,
  reduceInlineStyles: true,
});

function dedupePreloads(html: string): string {
  return html.replace(/<link rel="preload" as="image" href="\/foto-avatar\.webp">/g, '');
}

/**
 * Swap the base <link rel="preload"> for the avatar (home LCP) to the
 * article's hero image (article LCP). Detects `<img ... fetchpriority="high" ...>`
 * in the rendered content and rewrites the preload to match, preserving srcset
 * and sizes where available. If no high-priority image found, leave as-is.
 */
function swapLcpPreload(html: string, isArticle: boolean): string {
  if (!isArticle) return html;
  const imgMatch = html.match(/<img[^>]*fetchpriority="high"[^>]*>/i);
  if (!imgMatch) return html;
  const img = imgMatch[0];
  const src = img.match(/\bsrc="([^"]+)"/)?.[1];
  if (!src) return html;
  const srcset = img.match(/\bsrcset="([^"]+)"/)?.[1];
  const sizes = img.match(/\bsizes="([^"]+)"/)?.[1];
  const attrs = [
    `rel="preload"`,
    `as="image"`,
    `href="${src}"`,
    `type="image/webp"`,
    srcset ? `imagesrcset="${srcset}"` : '',
    sizes ? `imagesizes="${sizes}"` : '',
    `fetchpriority="high"`,
  ].filter(Boolean).join(' ');
  const newPreload = `<link ${attrs} />`;
  return html.replace(
    /<link rel="preload" href="\/foto-avatar-sm\.webp"[^>]*>/,
    newPreload,
  );
}

async function writePage(html: string, outputPath: string, label: string) {
  const dir = dirname(outputPath);
  mkdirSync(dir, { recursive: true });
  // Article pages live in dist/<slug>/index.html, NOT dist/index.html
  const isArticle = /\/dist\/[^/]+\/index\.html$/.test(outputPath)
    && !/\/dist\/privacy\/index\.html$/.test(outputPath);
  const pre = swapLcpPreload(html, isArticle);
  try {
    const processed = dedupePreloads(await critters.process(pre));
    writeFileSync(outputPath, processed, 'utf-8');
    console.log(`[prerender] ${label} (with critical CSS)`);
  } catch {
    writeFileSync(outputPath, pre, 'utf-8');
    console.log(`[prerender] ${label} (no critical CSS)`);
  }
}

// ---------------------------------------------------------------------------
// Privacy page — /privacy
// ---------------------------------------------------------------------------
const privacyPages: { slug: string; html: string }[] = [];

{
  const slug = 'privacy';
  const url = `https://cv-santiago.vercel.app/${slug}`;
  const title = 'Privacy Policy | cv-santiago.vercel.app';
  const description = 'Privacy policy for cv-santiago.vercel.app. How chatbot and website data is collected and used.';

  let renderedHtml: string;
  try {
    renderedHtml = stripReactSSRTags(renderToString(
      <StaticRouter location={`/${slug}`}>
        <GlobalNav />
        <div>
          <Suspense fallback={null}>
            <Routes>
              <Route path={`/${slug}`} element={<PrivacyPolicy />} />
            </Routes>
          </Suspense>
        </div>
      </StaticRouter>
    ));
  } catch (err) {
    console.error(`[prerender] SSR failed for ${slug}:`, err);
    renderedHtml = '';
  }

  let result = indexHtml
    .replace('<div id="root"></div>', `<div id="root">${renderedHtml}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(title)}" />`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow" />')
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(description)}" />`);

  // Remove homepage JSON-LD (privacy page doesn't need structured data)
  result = result.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');

  privacyPages.push({ slug, html: result });
}

async function inlineCriticalCSS() {
  // Home page
  await writePage(injectedHome, indexPath, 'Home: dist/index.html updated');

  // About page
  for (const { slug, html } of aboutPages) {
    await writePage(html, resolve(distDir, slug, 'index.html'), `${slug}: dist/${slug}/index.html created`);
  }

  // Article pages
  for (const { slug, html } of articlePages) {
    await writePage(html, resolve(distDir, slug, 'index.html'), `${slug}: dist/${slug}/index.html created`);
  }

  // Privacy page
  for (const { slug, html } of privacyPages) {
    await writePage(html, resolve(distDir, slug, 'index.html'), `${slug}: dist/${slug}/index.html created`);
  }
}

await inlineCriticalCSS();

// ---------------------------------------------------------------------------
// 404 page — Vercel serves this with HTTP 404 status automatically
// ---------------------------------------------------------------------------
const notFoundHtml = indexHtml
  .replace('<div id="root"></div>', `<div id="root"><div style="min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 1.5rem"><p style="font-size:6rem;font-weight:bold;color:var(--primary);margin-bottom:1rem;font-family:var(--font-display)">404</p><h1 style="font-size:1.5rem;font-weight:600;color:var(--foreground);margin-bottom:0.5rem">Page not found</h1><p style="color:var(--muted-foreground);margin-bottom:2rem;max-width:28rem">The page you're looking for doesn't exist or has been moved.</p><a href="/" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:0.75rem;background:var(--primary);color:var(--primary-foreground);font-weight:500;text-decoration:none">← Back to home</a></div></div>`)
  .replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow" />')
  .replace(/<title>[^<]*<\/title>/, '<title>404 — Page not found | cv-santiago.vercel.app</title>');

// Add noindex if no robots meta exists
if (!notFoundHtml.includes('name="robots"')) {
  const withNoindex = notFoundHtml.replace('</head>', '<meta name="robots" content="noindex, nofollow" /></head>');
  writeFileSync(resolve(distDir, '404.html'), withNoindex, 'utf-8');
} else {
  writeFileSync(resolve(distDir, '404.html'), notFoundHtml, 'utf-8');
}
console.log('[prerender] 404: dist/404.html created');

// ---------------------------------------------------------------------------
// Hydration structure validation
// ---------------------------------------------------------------------------
function validateHydrationStructure(html: string, label: string) {
  const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>\s*<script/);
  if (!rootMatch || !rootMatch[1].trim()) return; // empty root = OK (fallback)
  const content = rootMatch[1];

  // Must NOT contain <link> tags (React 19 SSR artifacts)
  if (/<link\s/.test(content)) {
    console.error(`[hydration-check] FAIL ${label}: <link> tags found inside #root — will cause hydration mismatch`);
    process.exit(1);
  }

  // Must have <div> wrapper (PageTransition)
  if (!content.includes('<div')) {
    console.error(`[hydration-check] FAIL ${label}: missing <div> wrapper (PageTransition) inside #root`);
    process.exit(1);
  }
}

// Validate home page
validateHydrationStructure(injectedHome, 'home');

// Validate about pages
for (const { slug, html } of aboutPages) {
  validateHydrationStructure(html, slug);
}

// Validate article pages
for (const { slug, html } of articlePages) {
  validateHydrationStructure(html, slug);
}

// Validate privacy pages
for (const { slug, html } of privacyPages) {
  validateHydrationStructure(html, slug);
}

console.log('[hydration-check] All pages pass structural validation');
console.log('[prerender] Done.');
