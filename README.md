# Louis Lu — Portfolio

> Interactive personal portfolio with an AI chatbot (text + voice), agentic RAG, automated evals, an LLMOps dashboard, and prompt-injection defense.

[![Live Demo](https://img.shields.io/badge/demo-cv--santiago.vercel.app-blue?style=flat-square)](https://cv-santiago.vercel.app)
[![Built with Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-blueviolet?style=flat-square)](https://claude.ai/code)

---

## What this is

A production-grade personal portfolio that goes beyond a static CV: a dual-mode AI chatbot (text + voice) that answers questions about your background using retrieval-augmented generation, full LLMOps observability with a custom dashboard, automated evals as a CI gate, prompt versioning, and a closed loop that turns production failures into new test cases.

**Key features:**
- **AI Chatbot** — Text (Claude Sonnet) + Voice (OpenAI Realtime API). Responds in first person. Agentic RAG with hybrid search (pgvector + BM25) and Haiku reranking
- **6-Layer Defense** — Keyword detection, canary tokens, fingerprinting, anti-extraction, online safety scoring, adversarial red team. Real-time jailbreak email alerts
- **Automated Evals** — Categories: factual accuracy, persona, boundaries, quality, safety, language, RAG quality, multi-turn, source badges, voice quality. CI-gate ready
- **LLMOps Dashboard** — Private `/ops` with tabs for Overview, Conversations, Costs, RAG, Security, Evals, Voice, System — real data from Langfuse + Supabase
- **Closed Loop** — Trace → online scoring → low quality → auto-generate test → CI gate blocks deploy
- **Voice Mode** — OpenAI Realtime API, audio-to-audio, shared RAG pipeline
- **GEO-ready** — `llms.txt`, structured data (JSON-LD), AI-crawler-friendly `robots.txt`

**This is a template you own now.** The experience, education, and bio content is currently placeholder text (`[Your Name]`, `[Your Company]`, etc.) — see [docs/portfolio-migration-plan.md](docs/portfolio-migration-plan.md) for what was removed from the original site and what to fill in next.

---

## Tech Stack

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Claude](https://img.shields.io/badge/Claude_Sonnet-191919?style=flat&logo=anthropic&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI_Realtime-412991?style=flat&logo=openai&logoColor=white)
![Langfuse](https://img.shields.io/badge/Langfuse-000000?style=flat&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel_Edge-000000?style=flat&logo=vercel&logoColor=white)

---

## Chatbot Architecture

```
User message → FloatingChat.tsx → api/chat.js (Vercel Edge)
                                    ├── System prompt (Langfuse registry + fallback)
                                    ├── Claude Sonnet (tool_use decision)
                                    ├── Agentic RAG (if needed):
                                    │     ├── OpenAI embeddings (text-embedding-3-small)
                                    │     ├── Supabase pgvector (semantic) + full-text (BM25)
                                    │     └── Claude Haiku (reranking + diversification)
                                    ├── Claude Sonnet (streaming generation)
                                    ├── Langfuse tracing (every span with cost)
                                    └── waitUntil → Haiku scoring (0ms added latency)

Voice mode → useVoiceMode.ts → api/voice-token.js → OpenAI Realtime WebSocket
                                  └── api/rag-search.js (function calling for RAG)
```

### Key Files

| File | Path | Description |
|------|------|-------------|
| Chat edge function | `api/chat.js` | Main chatbot — RAG, tracing, scoring, streaming, defense |
| RAG pipeline | `api/_shared/rag.js` | Hybrid search, reranking, cost tracking, intent classification |
| Prompt management | `api/_shared/prompt.js` | Langfuse prompt registry with file fallback |
| Voice token | `api/voice-token.js` | OpenAI Realtime ephemeral token + rate limiting |
| Voice RAG | `api/rag-search.js` | RAG search for voice mode function calling |
| Voice trace | `api/voice-trace.js` | Voice session tracing with cost estimation |
| Chat widget | `src/FloatingChat.tsx` | React widget — streaming SSE, quick prompts, contact CTA |
| Voice hook | `src/useVoiceMode.ts` | WebSocket management, audio capture, transcript persistence |
| System prompt | `chatbot-prompt.txt` | Fallback prompt (production uses Langfuse if configured) |

---

## LLMOps Dashboard (`/ops`)

Private, password-protected dashboard showing real production data:

| Tab | What it shows | Data source |
|-----|---------------|-------------|
| Overview | KPIs, timelines, donuts, intent distribution | Langfuse traces |
| Conversations | Filter + list + detail with spans, cost, latency, scores | Langfuse traces + observations |
| Costs | Breakdown per component (toolDecision/embedding/reranking/generation/voice) | `trace.metadata.cost` |
| RAG | Activation rate, chunks per article | Langfuse tags + Supabase |
| Security | Defense funnel, safety distribution, jailbreak list | Langfuse tags + scores |
| Evals | Pass rates by category | `evals/results/` via build |
| Voice | Sessions, text/voice split, latency P50/P95, cost per minute | Langfuse tags |
| System | Prompt versions, RAG document stats, model pricing | Langfuse prompts API + Supabase |

---

## Evals & Testing

The eval suite currently ships with a small set of placeholder-safe tests — they check durable guardrails (no outdated model claims, always responds in English, doesn't leak internal instructions) rather than specific facts, since the CV content is still `[bracketed placeholders]`. Once you fill in your real experience, add fact-checking tests back in (see the `_todo` notes in `evals/datasets/factual.json` and `scripts/validate-llms-txt.ts`).

| Category | Type |
|----------|------|
| factual_accuracy | Deterministic |
| persona_adherence | Deterministic |
| boundary_testing | Deterministic |
| response_quality | Mixed |
| safety_jailbreak | Deterministic |
| language_handling | Deterministic |
| rag_quality | Mixed |
| multi_turn | Mixed (currently empty — add scenarios once you have real content) |
| source_badges | Deterministic |
| voice_quality | Mixed |

Run with `npm run evals` (requires `ANTHROPIC_API_KEY`).

---

## Scripts & CLI Tools

All scripts live in `scripts/` and run via `npm run`.

### Chatbot Operations
| Command | Script | Description |
|---------|--------|-------------|
| `npm run evals` | `evals/runner.ts` | Run the automated eval suite |
| `npm run adversarial` | `scripts/adversarial-test.ts` | Red team: auto-generated attacks |
| `npm run chats` | `scripts/chats.ts` | View recent conversations from Langfuse |
| `npm run evaluate-traces` | `scripts/evaluate-traces.ts` | Batch eval with Haiku (quality, safety, intent) |
| `npm run diagnose:rag` | `scripts/diagnose-rag.ts` | RAG quality diagnostic — detects retrieval misses |

### Prompt & RAG Management
| Command | Script | Description |
|---------|--------|-------------|
| `npm run prompt:sync` | `scripts/sync-prompt-to-langfuse.ts` | Sync prompt to Langfuse (hash-based, skip if unchanged) |
| `npm run prompt:regression` | `scripts/prompt-regression.ts` | Compare two prompt versions side by side |
| `npm run rag:sync` | `scripts/export-chunks.ts` + `scripts/ingest-rag.ts` | Re-export site content + ingest to Supabase |

### Contract & Integration Tests
| Command | Script | Description |
|---------|--------|-------------|
| `npm run test:contract` | `tests/ops-contract.test.ts` | Validate trace metadata matches the dashboard contract |
| `npm run test:ops` | `tests/ops-dashboard.test.ts` | Test all dashboard API endpoints |

### Build Pipeline
| Command | Script | Description |
|---------|--------|-------------|
| `npm run build` | (chained) | rag:sync → prompt:sync → embed-evals → og-image → tsc → vite → sitemap → validate → prerender |
| — | `scripts/generate-sitemap.ts` | Generate sitemap.xml |
| — | `scripts/validate-articles.ts` | SEO validation for any articles you add |
| — | `scripts/validate-llms-txt.ts` | Validate llms.txt consistency |
| — | `scripts/prerender.tsx` | SSR prerender all pages with critical CSS |

---

## Quick Start

```bash
git clone <your-repo-url>
cd <your-repo>
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173)

### Environment Variables

```bash
# Core
ANTHROPIC_API_KEY=           # Claude API (chatbot)
OPENAI_API_KEY=              # Embeddings + Voice

# RAG
SUPABASE_URL=                # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=   # Supabase service key

# Observability
LANGFUSE_PUBLIC_KEY=         # Langfuse tracing
LANGFUSE_SECRET_KEY=         # Langfuse tracing

# Alerts & Dashboard
RESEND_API_KEY=              # Jailbreak email alerts
OPS_DASHBOARD_SECRET=        # Dashboard password (/ops)
```

---

## Project Structure

```
src/
├── App.tsx                  # Home page — hero, experience, education, contact
├── AboutPage.tsx            # /about — bio, timeline, certifications, FAQ
├── FloatingChat.tsx         # Chat widget (text mode)
├── useVoiceMode.ts          # Voice mode hook (OpenAI Realtime)
├── VoiceOrb.tsx             # Voice UI (orb + transcript)
├── GlobalNav.tsx            # Navigation with breadcrumbs
├── main.tsx                 # React Router + lazy loading
├── i18n.ts                  # Site content (English)
├── about-i18n.ts            # About page content
├── articles/
│   ├── registry.ts          # Centralized article config (empty — add your own case studies here)
│   ├── components.tsx       # Shared article layout/header/footer components
│   └── json-ld.ts           # JSON-LD builder
├── ops/                     # LLMOps Dashboard
│   ├── OpsDashboard.tsx     # Shell + Overview tab
│   ├── OpsAuth.tsx          # Login screen
│   ├── hooks/                # useOpsApi, useTraces
│   ├── components/           # KpiCard, MetricChart, FilterBar, etc.
│   └── tabs/                 # Conversations, Costs, Security, Evals, etc.

api/
├── chat.js                  # Main chatbot edge function
├── voice-token.js           # Voice ephemeral token + rate limit
├── voice-trace.js           # Voice session tracing
├── rag-search.js            # RAG for voice function calling
├── _shared/
│   ├── rag.js               # RAG pipeline (search, rerank, cost)
│   ├── prompt.js            # Prompt versioning (Langfuse)
│   └── ops-auth.js          # Dashboard auth helper
└── ops/                     # Dashboard API proxy layer

evals/
├── datasets/                 # JSON eval datasets
├── assertions.ts             # Deterministic assertions
├── llm-judge.ts              # LLM-as-Judge (Haiku)
└── runner.ts                 # Eval runner

scripts/                      # See "Scripts & CLI Tools" section above
tests/
├── ops-contract.test.ts      # Contract tests
└── ops-dashboard.test.ts     # Dashboard API tests

chatbot-prompt.txt             # System prompt (fallback, prod uses Langfuse if configured)
```

---

## Adding a Case Study

The article-registry pattern used by the original 7 case studies still works — it's just empty now. To add your own:

1. Write a component in `src/YourArticle.tsx` using the shared components in `src/articles/components.tsx`
2. Write its content in `src/your-article-i18n.ts`
3. Register it in `src/articles/registry.ts` with a `slug`, `title`, `seo`, and `seoMeta`
4. Add a rewrite for its slug in `vercel.json`

See `docs/portfolio-migration-plan.md` for the shape the original articles used.

---

## Cost

- **~$0.005 per text conversation** (multiple models in the pipeline)
- **~$0.25 per voice session** (OpenAI Realtime)
- **$0 infrastructure** (free tiers: Vercel, Supabase, Langfuse)

---

## License

MIT
