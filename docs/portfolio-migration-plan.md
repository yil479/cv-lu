# Turn cv-santiago into your personal portfolio

> **Status: Complete.** All 6 phases below were implemented and verified —
> kept here as a historical record of the migration. Real content (experience,
> education, bio, projects) has since replaced the `[bracketed placeholders]`
> this plan created in Phase 4. See **"Post-migration updates"** at the end of
> this document for what's changed since the migration itself landed.

## Context

This repo is a React 19 + TypeScript + Vite SPA that also runs an AI chatbot,
voice agent, RAG pipeline, and eval suite, personalized to the current owner
("Santiago"). You want to turn it into your own portfolio while **keeping the
LLM/chatbot/eval machinery running** — both to show it off and to keep studying
it — but with English-only content and your own experience/projects instead of
his.

Decisions locked in with you:

1. **Keep** the chatbot / voice agent / RAG pipeline / eval suite / `/ops`
   dashboard — re-personalize instead of removing.
2. **English only** — remove Spanish everywhere (content + routing).
3. **Delete** the 7 case-study articles completely (Jacobo agent, Business OS,
   programmatic SEO, self-healing chatbot, career-ops, n8n-for-PMs, Santifer
   iRepair) — routes, components, data files, assets, all gone.
4. **Remove** his experience/education content but **keep the section structure
   as placeholders** (`[YOUR COMPANY]`, `[YOUR ROLE]`, `[YOUR BULLET]`, etc.) for
   you to fill in later.
5. **Delete** the home-page projects grid entirely — no placeholder card, no
   live-GitHub-stats wiring kept.
6. **Delete** all personal-identity material (his photos, employer/client logos,
   named testimonial headshots, social links, JSON-LD identity, contact emails,
   slide decks) — none of this is placeholder-able, it's other real people.

Because you're keeping the AI layer, the chatbot's system prompt, the RAG index,
and the eval test fixtures all currently assert Santiago-specific facts — those
have to be updated too, or the chatbot will contradict the placeholder resume
it's supposedly answering questions about (Phase 5 below).

## Phase 1 — Delete the 7 case-study articles

Delete components (`src/JacoboAgent.tsx`, `BusinessOS.tsx`, `ProgrammaticSeo.tsx`,
`SelfHealingChatbot.tsx`, `CareerOps.tsx`, `N8nForPMs.tsx`, `SantiferIRepair.tsx`),
their `*-i18n.ts` data files, `src/ArchitectureDiagram.tsx` (verify sole importer
first), and their `public/{jacobo,business-os,pseo,chatbot,career-ops,irepair,workflows,vendor}/`
asset folders.

Edit `src/articles/registry.ts` — empty `articleRegistry` to `[]`. Edit
`src/i18n.ts`/`src/App.tsx` to strip every dead `caseStudyUrl`/`caseStudyLabel`
field and the `<Link>`s that consume them (~25 locations: deep-dive CTAs, hero
star-count pill, project-card links). Edit `vercel.json` to drop the 7 slug-pair
`rewrites`/`redirects`. Edit `scripts/prerender.tsx` to drop the 6 `*-i18n.ts`
imports/`i18nMap` entries.

**RAG/eval touch-points** (since infra is kept): `scripts/export-chunks.ts` likely
has a parser branch per article type — confirm it still runs cleanly against an
empty registry (home/about/llms.txt only) rather than hard-failing on missing
files. `evals/datasets/*.json` almost certainly contains test cases asking the
chatbot about Jacobo/Business OS/career-ops/etc. — remove those cases now (full
persona-fact rewrite happens in Phase 5, but dead-article test cases should go
here so nothing in Phase 2-4 checkpoints fails against content that no longer
exists).

**Test cases:**
- [ ] `grep -rln "JacoboAgent\|BusinessOS\|ProgrammaticSeo\|SelfHealingChatbot\|CareerOps\|N8nForPMs\|SantiferIRepair" src/` → 0 files (outside deleted ones, i.e. command returns nothing)
- [ ] `grep -rn "caseStudyUrl\|caseStudyLabel" src/i18n.ts src/App.tsx` → 0 matches
- [ ] `ls public/jacobo public/business-os public/pseo public/chatbot public/career-ops public/irepair public/workflows 2>&1` → all "No such file or directory"
- [ ] `npm run dev`, visit `/ai-agent-jacobo`, `/business-os-for-airtable`, `/programmatic-seo`, `/self-healing-chatbot`, `/career-ops-system`, `/n8n-for-pms`, `/santifer-irepair-founder` → each renders the `NotFound` page, not a crash
- [ ] Home page hero and experience section render with no dead links (click every link in experience/hero sections, none 404)
- [ ] `grep -rn "jacobo\|business-os\|career-ops\|self-healing\|n8n-for-pms\|santifer-irepair" evals/datasets/*.json` → 0 matches after cleanup
- [ ] `npx tsx scripts/export-chunks.ts` (or the RAG-export step) exits 0 with no references to deleted files
- [ ] `npm run build` exits 0

## Phase 2 — Delete the projects grid

Remove the projects section from `src/App.tsx` and `projects.items` from
`src/i18n.ts` (both languages, ahead of Phase 3's flattening). Delete
`scripts/update-github-stats.ts`, `update-discord-stats.ts`,
`update-reddit-stats.ts`, `update-twitter-stats.ts` and their entries in
`package.json`'s `build` chain — nothing left for them to patch once the grid and
case studies are both gone.

**Test cases:**
- [ ] `grep -n "projects\." src/App.tsx` → no rendering of a projects grid section remains (imports/usages gone)
- [ ] `grep -n "projects:" src/i18n.ts` → the `projects` key removed from both the (still bilingual, pre-Phase-3) translation object
- [ ] `ls scripts/update-github-stats.ts scripts/update-discord-stats.ts scripts/update-reddit-stats.ts scripts/update-twitter-stats.ts 2>&1` → all "No such file or directory"
- [ ] `grep -n "update-github-stats\|update-discord-stats\|update-reddit-stats\|update-twitter-stats" package.json` → 0 matches
- [ ] `npm run dev`, visit `/` → no "Projects" section/nav anchor visible, no console errors
- [ ] `npm run build` exits 0

## Phase 3 — Remove Spanish entirely

Flatten `src/i18n.ts` (`translations`, `seo`) and `src/about-i18n.ts` from
`{ es, en }` down to a single English object; drop `type Lang = 'es' | 'en'`.
Edit `src/PrivacyPolicy.tsx`, `src/AboutPage.tsx`, `src/PressFeatures.tsx` (or
delete `PressFeatures.tsx` outright — it's Santiago's press coverage, dead once
Phase 6 strips it) to drop the `lang` prop and ES branches. Edit `src/App.tsx`:
remove the `pathname === '/en' ? 'en' : 'es'` derivation, `translations[lang]`/
`seo[lang]` indexing → direct references, resolve every `lang === 'es' ? ... :
...` ternary to its English literal.

Edit `src/GlobalNav.tsx`: delete `FlagES`/`FlagEN`, the language-pill switcher,
the language-mismatch banner + sessionStorage machinery; simplify `useLang()`.
Edit `src/main.tsx`: drop `/en`, `/sobre-mi`, `/privacidad` routes; simplify
`NotFound` to English-only; drop `getEsSlugs()` usage in the chat-widget's
language detection (chat always operates in English now). Edit
`src/articles/registry.ts`: collapse `ArticleConfig` shape (`slugs.{es,en}` →
`slug`, etc.), delete `xDefaultSlug`, `getAltPaths()`, `getEsSlugs()`.

Edit `index.html`: `lang="es"` → `lang="en"`, drop `hreflang`/`x-default`
alternates, `og:locale` → `en_US` only, JSON-LD `WebSite.inLanguage` → `"en"`,
rewrite the bilingual `FAQPage` block to English-only. Edit
`scripts/generate-sitemap.ts` (drop hreflang-alternate emission),
`scripts/prerender.tsx` (single `renderApp()`), `scripts/validate-articles.ts` /
`validate-llms-txt.ts` / `validate-prerender.ts` (simplify ES/EN-pair
assertions).

**Eval touch-point:** `evals/datasets/languages.json` (or similarly named) tests
bilingual chatbot behavior — rewrite its expectations to English-only (e.g. "if a
visitor writes in Spanish, still reply in English" rather than "reply in
Spanish").

**Test cases:**
- [ ] `grep -rn "es:" src/i18n.ts src/about-i18n.ts` → 0 matches (no `{ es, en }` shape remains)
- [ ] `grep -rn "type Lang\|: Lang\b\|'es' | 'en'" src/` → 0 matches
- [ ] `grep -rn "lang === 'es'\|lang === 'en'" src/` → 0 matches
- [ ] `npm run dev`, visit `/en`, `/sobre-mi`, `/privacidad` → all render `NotFound` (routes gone)
- [ ] Visit `/` → renders the (formerly-English) home content directly, no language toggle/flag pill visible in nav
- [ ] Manually trigger the old language-mismatch banner condition (set browser language to Spanish, reload) → banner does not appear
- [ ] `grep -n "hreflang" index.html` → only `en` (no `es` or `x-default` alternate) or none at all
- [ ] `grep -n "es_ES" index.html` → 0 matches
- [ ] View page source on `/` → `<html lang="en">`
- [ ] `npx tsx scripts/generate-sitemap.ts` then inspect `sitemap.xml` → one `<url>` per route, no hreflang-alternate blocks
- [ ] `npx tsx scripts/prerender.tsx` → produces exactly one prerendered tree, not an `/es` + `/en` pair
- [ ] `grep -rn "\\\\bspanish\\\\b\|reply in Spanish" evals/datasets/*.json` (case-insensitive) → rewritten to English-only expectations
- [ ] `npm run build` exits 0

## Phase 4 — Placeholder experience/education, delete personal identity

**Experience/education (placeholder, keep structure):** in `src/i18n.ts`, replace
`experience` entries (zinkee, careerOps, santifer, lico, everis) with a single
generic placeholder entry shape repeated as needed —
`[YOUR COMPANY]` / `[YOUR ROLE]` / `[YOUR ACHIEVEMENT BULLET]` — preserving the
object shape (bullets array, dates, etc.) so the layout keeps working and you can
swap values in directly. Same for the `education` block. Delete the `agentInfra`
block (his private tooling, not a template you'd reuse). Replace
`src/about-i18n.ts` bio copy with `[YOUR BIO]` placeholder paragraphs, same
headings.

**Personal identity (delete, no placeholder):**
- `public/foto-avatar*`, `logo-santifer.*`, `logo-lico.*`, `logo-everis.*`,
  `zinkee-logo.*`, `career-ops-logo.*`, `garry-tan.jpg`, `javier-martinez.*`,
  `juan-sabate.*`, `manuel-lopez.*`, `firma-zinkee-santi.png`, `press-logos/`,
  `logos/` (client logos), `slides/*.pdf` — delete the files and the `<img>`/
  `<link rel="preload">` tags referencing them in `App.tsx`/`index.html`.
- `index.html` JSON-LD: replace `<title>`/meta/OG/Twitter tags with
  `[YOUR NAME] | [YOUR TITLE]` placeholders; strip the `Person` node's `name`,
  `alternateName`, `email`, `sameAs` (17 social links); delete outright the
  `Organization` (Santifer iRepair), `SoftwareSourceCode` (career-ops), and
  `subjectOf` press-citation nodes; replace or delete the `FAQPage` block.
- `public/humans.txt`, `public/.well-known/security.txt`: placeholder contact
  info.
- `public/llms.txt`: **keep** (it's ingested into the RAG index per Phase 5) but
  replace its bio/CV content with placeholders matching `src/i18n.ts`.
- `package.json` `"name"`: `cv-santiago` → generic placeholder.
- **Keep**: favicons, `bmc-logo.svg` (verify generic), fonts, `public/audio/`,
  `og-image.webp` (flag for regeneration once you have a real name/photo).

**Test cases:**
- [ ] `grep -n "\[YOUR " src/i18n.ts` → shows placeholder entries in `experience`/`education`
- [ ] `npm run dev`, visit `/`, scroll to experience section → shows placeholder company/role/bullet text, layout intact (no broken spacing/missing bullet points)
- [ ] `grep -n "agentInfra" src/i18n.ts` → 0 matches
- [ ] `grep -n "\[YOUR BIO\]" src/about-i18n.ts` and visit `/about` → placeholder bio renders correctly
- [ ] `find public -iname "foto-avatar*" -o -iname "logo-santifer*" -o -iname "logo-lico*" -o -iname "logo-everis*" -o -iname "zinkee-logo*" -o -iname "career-ops-logo*" -o -iname "garry-tan*" -o -iname "javier-martinez*" -o -iname "juan-sabate*" -o -iname "manuel-lopez*" -o -iname "firma-zinkee-santi*"` → 0 results
- [ ] `ls public/press-logos public/logos public/slides 2>&1` → all "No such file or directory" (or empty if any generic file was intentionally kept — verify none)
- [ ] `grep -rn "foto-avatar\|logo-santifer\|logo-lico\|logo-everis\|zinkee-logo\|garry-tan\|javier-martinez\|juan-sabate\|manuel-lopez\|firma-zinkee\|press-logos" src/ index.html` → 0 matches (no dangling `<img>`/`<link>` references)
- [ ] `grep -n "sameAs\|alternateName\|\"name\":" index.html` → Person node stripped/placeholder'd, no 17-entry social link array
- [ ] `grep -n "Organization\|SoftwareSourceCode" index.html` → 0 matches (nodes deleted)
- [ ] View page source on `/` → OG title/description/Twitter tags show placeholder text, not "santifer"
- [ ] `cat public/llms.txt` → bio/CV content shows placeholders, file still exists
- [ ] `cat public/humans.txt public/.well-known/security.txt` → contact info placeholder'd
- [ ] `grep -n "\"name\"" package.json` → no longer `"cv-santiago"`
- [ ] `npm run build` exits 0

## Phase 5 — Re-personalize the AI layer to match your placeholder identity

This is the phase specific to keeping the chatbot/voice/RAG/eval stack. Nothing
here changes *architecture* — only the facts baked into prompts and test data,
so the chatbot's claims stay consistent with the placeholder content from Phase 4
(and easy to bulk-update again once you supply real content).

- `chatbot-prompt.txt`: replace the condensed-CV section (name, dates, companies,
  metrics) with the same placeholder values used in `src/i18n.ts`; update the
  first-person persona framing (currently "santifer"/Santiago-specific).
- `api/voice-token.js`: replace the "sounds like Santiago, originally from
  Seville" instruction with a neutral/placeholder voice persona note.
- `api/cron/evaluate.js`: replace the LLM-judge prompt's "Santiago Fernández, an
  AI Product Manager based in Seville" framing and disclosure rules with
  placeholder equivalents.
- `api/chat.js`: replace hardcoded `hi@santifer.io`/`hola@santifer.io` fallback
  emails with one placeholder email (drop the Spanish variant — English only per
  Phase 3).
- `api/_shared/rag.js`: remove keyword routing tied to deleted case-study slugs
  (`santifer-irepair`, etc. — dead after Phase 1); update the hardcoded jailbreak
  -alert email subject (`"🚨 JAILBREAK ATTEMPT - santifer.io"`) to your
  placeholder domain/identity.
- `evals/datasets/*.json` (`factual.json`, `boundaries.json`, `persona.json`,
  `rag.json`, etc.): rewrite fact-assertion test cases to check against the new
  placeholder values rather than Santiago's real facts, so the eval suite is
  green and meaningful again. Add a short `// TODO` note at the top of each
  dataset reminding you to re-run this rewrite once real content replaces the
  placeholders.
- `.env.local.example`: keep as-is (Supabase/OpenAI keys still needed since RAG
  is retained) — no change needed, just confirm it's still accurate.

**Test cases:**
- [ ] `grep -in "santiago\|santifer\|seville" chatbot-prompt.txt` → 0 matches
- [ ] `npm run dev`, open chat widget, ask "What's your name?" → responds with placeholder identity, not "Santiago"
- [ ] Ask the chatbot "Tell me about Jacobo" / "Tell me about career-ops" → responds that it has no info (RAG has nothing to retrieve), does not hallucinate the deleted case studies
- [ ] Ask the chatbot in Spanish ("¿Cuál es tu experiencia?") → responds in English
- [ ] `grep -in "seville\|santiago" api/voice-token.js` → 0 matches
- [ ] Enable voice mode in dev, ask it to introduce itself → uses placeholder identity, no Seville/Santiago accent instruction
- [ ] `grep -in "santiago\|seville" api/cron/evaluate.js` → 0 matches
- [ ] `grep -n "hi@santifer.io\|hola@santifer.io" api/chat.js` → 0 matches, exactly one placeholder email used
- [ ] `grep -n "santifer-irepair\|santifer.io" api/_shared/rag.js` → 0 matches (routing keywords and jailbreak-alert subject updated)
- [ ] `grep -rln "Santiago\|santifer" evals/datasets/` → 0 files
- [ ] `npm run evals` (or the project's actual eval-runner script name) → exits 0, all test cases pass against placeholder content
- [ ] Trigger a known adversarial/jailbreak eval case manually → still correctly flagged/blocked (guardrails unaffected by the persona rewrite)
- [ ] `npm run build` exits 0

## Phase 6 — Documentation

- Rewrite `README.md`: drop the mirrored Spanish section, update the feature
  description to reflect your ownership (keep the "AI chatbot / RAG / evals"
  description since that stays, just de-personalize attribution).
- Scrub the name from `docs/adr/001-tech-stack.md`.
- **Create `CLAUDE.md` at the project root** (see recommendation below).
- Copy this plan file into the project repo (e.g.
  `docs/portfolio-migration-plan.md`) as you asked, for reference once
  implementation starts.

**Test cases:**
- [ ] `grep -n "es-versión\|Versión en Español" README.md` → 0 matches
- [ ] `grep -in "santiago fernández" docs/adr/001-tech-stack.md` → 0 matches
- [ ] `test -f CLAUDE.md` → exists
- [ ] `CLAUDE.md` documents: build-chain order, article-registry pattern, `[YOUR ...]` placeholder convention, required env vars (read it back and confirm each is present)
- [ ] `test -f docs/portfolio-migration-plan.md` → exists in the project repo, not just `~/.claude/plans/`

### Do you need a CLAUDE.md?

**Yes, worth adding.** This project has enough non-obvious structure that a fresh
Claude Code session (including future-you asking Claude for help) will otherwise
re-derive it every time:

- The monolithic `npm run build` chain (RAG sync → stats → OG image → `tsc` →
  `vite build` → sitemap → validators → prerender → IndexNow) has a specific
  required order — easy to break by editing scripts in isolation.
- The `src/articles/registry.ts` pattern is how you'd add a new case-study
  article in the future (component + data file + registry entry + `vercel.json`
  rewrite) — worth documenting once, so the pattern the current 7 articles used
  isn't lost just because you deleted the examples.
- The `[YOUR ...]` placeholder convention should be documented so Claude (and
  collaborators) know those are intentional stand-ins, not bugs to "fix" by
  inventing content.
- The RAG/eval/voice stack needs specific env vars and a note that eval datasets
  must be kept in sync with real content — a good candidate for a "when you
  update your experience, also update these eval files" note.

I'll draft it as part of this phase once the migration lands, covering: stack
overview, build-chain order and why, the article-registry pattern, the
placeholder convention, and required env vars.

## Final end-to-end verification

Each phase above has its own test cases to run as you complete it. This is the
last full sweep after all 6 phases are done:

- [ ] `npm run dev`: click through `/`, `/about`, `/privacy`, a 404 path, theme
      toggle, chat widget, voice mode — all working, all placeholder content, no
      Santiago references
- [ ] `npm run build` exits 0 clean; inspect `dist/` — contains exactly `/`,
      `/about`, `/privacy` (no `/en`, `/sobre-mi`, `/privacidad`, old article
      slugs)
- [ ] `npm run lint` → 0 errors
- [ ] `npx tsc -b --noEmit` → 0 errors
- [ ] `npm run evals` → all green
- [ ] Repo-wide grep sweep (excluding `node_modules`/`.git`/`dist`), each
      expected to return **zero** hits:
      `grep -rn "santifer\|Santiago\|hi@santifer.io\|hola@santifer.io\|es_ES\|lang === 'es'" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.html" --include="*.md" --include="*.json" --include="*.txt" .`
- [ ] `git diff --stat` sanity check — expect a large diff (`App.tsx` is 3086
      lines, `i18n.ts` is 1763 lines, both touched extensively)

## Critical files

- `package.json`, `src/main.tsx`, `src/App.tsx`, `src/i18n.ts`,
  `src/articles/registry.ts`, `src/GlobalNav.tsx`, `scripts/prerender.tsx`,
  `vercel.json`, `index.html`, `chatbot-prompt.txt`, `api/voice-token.js`,
  `api/cron/evaluate.js`, `api/_shared/rag.js`, `evals/datasets/*.json`

## Post-migration updates

Work done after the migration above landed, once real content replaced the
Phase 4 placeholders. Kept as a running log rather than rewritten into the
phases above, since those describe the migration itself, not what came after.

- **Real content.** `src/i18n.ts` experience/education/bio and
  `chatbot-prompt.txt` were filled in with Louis Lu's actual career history
  (JPMorgan, Fulgent Genetics, Columbia, UC San Diego) — no more
  `[bracketed placeholders]`. `evals/datasets/factual.json` now asserts real
  facts instead of placeholder-safe generic checks.
- **Legacy projects restored.** Five projects from an earlier personal
  portfolio (`/luislu`, a Start Bootstrap "Vitality" template site) were added
  to the Projects section in `src/i18n.ts`: Musaic (music-sharing app), San
  Diego air pollution analysis, San Diego traffic collision analysis,
  TeamUp2018, and KitchIn. Project cards gained an optional `link` field
  (`src/App.tsx`) to support this.
- **Interactive Art section.** The legacy portfolio's `myart/` — a
  vanilla-JS, drag-to-look-around 3D room gallery (`ge1doot.js` +
  `imageTransform3D.js`, no framework) — was copied into `public/myart/` and
  embedded via a same-origin `<iframe>` in a new "Art" section on the home
  page (`src/App.tsx`, between Projects and Education). Chosen over a native
  React rebuild to preserve the original behavior exactly; `vercel.json`'s
  CSP already allowed same-origin iframes and inline scripts, so no config
  changes were needed.
- **Experience section restyled.** Rebuilt as an alternating zig-zag timeline
  (center connecting line, circular icon badges, alternating panels on
  desktop, single left-rail column on mobile) to match the old portfolio's
  look, using Tailwind only — no data changes.
- **Real avatar photo.** The hero avatar and chat-widget avatar — called out
  in Phase 4 above as "generic icon placeholders" pending a real photo — now
  use `public/foto-avatar.webp` (480×480) and `public/foto-avatar-sm.webp`
  (160×160), wired into the LCP preload tags in `index.html` that
  `scripts/prerender.tsx` was already built to consume.
- **Pre-commit secret scan.** `scripts/check-secrets.sh`, tracked git hooks in
  `scripts/git-hooks/`, and a `prepare` script in `package.json` now block
  commits containing `.env` files or API-key-shaped content. See the
  "Pre-commit Secret Scan" section in `README.md`.
