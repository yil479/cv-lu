# Evals Suite

Automated evaluation suite for the portfolio's AI chatbot.

## What Evals Are

**Evals** are systematic tests that measure the quality of an AI system:

- **Accuracy** - Does it answer with correct information?
- **Persona adherence** - Does it stay in character?
- **Safety** - Does it refuse what it should refuse?
- **Quality** - Are responses useful and concise?

## Test Categories

See `evals/datasets/*.json` for current test counts per category — they're intentionally small right now since the site content is still placeholder text (see `CLAUDE.md`).

| Category | Description |
|----------|-------------|
| `factual_accuracy` | Correctness of facts about the site owner |
| `persona_adherence` | Stays in first-person character |
| `boundary_testing` | Declines/redirects on sensitive topics |
| `language_handling` | Always replies in English |
| `response_quality` | Response length, tone, format |
| `safety_jailbreak` | Resists prompt injection / jailbreak attempts |
| `rag_quality` | Retrieval and citation quality |
| `multi_turn` | Multi-turn conversation handling |
| `source_badges` | Source-badge generation accuracy |
| `voice_quality` | Voice mode response quality |

## How to Run

**Option 1: Local with Vercel Dev** (recommended for development)
```bash
# Terminal 1: Start server with edge functions
vercel dev

# Terminal 2: Run evals
npm run evals
```

**Option 2: Against production** (to validate a deploy)
```bash
CHAT_API_URL=https://cv-santiago.vercel.app/api/chat npm run evals
```

> **Note:** `npm run dev` (Vite) does not serve the `/api/chat` edge functions. Use `vercel dev` for local development.

## Structure

```
evals/
├── README.md           # This documentation
├── datasets/           # Tests in JSON format
│   ├── factual.json    # Factual accuracy
│   ├── persona.json    # Persona consistency
│   ├── boundaries.json # Boundary tests
│   ├── languages.json  # Language handling
│   ├── quality.json    # Response quality
│   ├── safety.json     # Safety and jailbreaks
│   ├── rag.json         # RAG quality
│   ├── multi-turn.json  # Multi-turn conversations
│   ├── source-badges.json # Source badge accuracy
│   └── voice.json       # Voice mode quality
├── assertions.ts       # Assertion functions
├── llm-judge.ts        # Haiku-based evaluator
├── runner.ts           # Main script
└── results/            # Generated reports
```

## Assertion Types

### Deterministic (most tests)

| Type | Description |
|------|-------------|
| `contains` | Contains exact text |
| `contains_any` | Contains at least one of the values |
| `not_contains` | Does NOT contain the text |
| `max_words` | Maximum N words |
| `min_words` | Minimum N words |
| `regex` | Regex pattern match |
| `language` | Detects language |

### With LLM Judge

| Type | Description |
|------|-------------|
| `llm_judge` | Haiku evaluates against a subjective criterion |

## Dataset Format

```json
{
  "name": "category_name",
  "description": "What this category evaluates",
  "tests": [
    {
      "id": "test-id",
      "description": "What this test checks",
      "input": "Question to the chatbot",
      "lang": "en",
      "assertions": [
        { "type": "contains", "value": "expected text" },
        { "type": "llm_judge", "criteria": "subjective criterion" }
      ]
    }
  ]
}
```

## Results Report

After each run, a report is generated at `results/report-YYYY-MM-DD.md` with:

- Overall summary
- Pass rate per category
- Detail for each test: input, response, and assertions

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CHAT_API_URL` | `http://localhost:3000/api/chat` | Chat API URL |
| `ANTHROPIC_API_KEY` | (required for LLM judge) | Anthropic API key |

### Configuring the API Key (for LLM Judge)

```bash
# Copy the example and add your key
cp evals/.env.example evals/.env.local

# Edit the file with your real key
# .env.local is in .gitignore (not pushed to GitHub)
```

**Note:** Without `ANTHROPIC_API_KEY`, LLM-judge tests will fail. Deterministic tests work without it.
