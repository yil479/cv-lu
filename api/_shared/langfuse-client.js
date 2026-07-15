import { Langfuse } from 'langfuse'

// ---------------------------------------------------------------------------
// Masking — redact credential-shaped strings before they leave the process.
// The Langfuse SDK only runs `mask` over `input`/`output` fields (not
// metadata), so this is defense-in-depth against a stray secret ending up in
// a generation's input/output — not a scrub of the conversation itself,
// which is left untouched since reviewing real chat quality is the point.
// ---------------------------------------------------------------------------

const SECRET_PATTERNS = [
  /\bsk-[A-Za-z0-9_-]{10,}\b/g,        // OpenAI/Anthropic/Langfuse secret keys
  /\bpk-lf-[A-Za-z0-9_-]{10,}\b/g,     // Langfuse public keys
  /\bBearer\s+[A-Za-z0-9._-]{10,}\b/g, // Authorization headers
]

function maskString(value) {
  let masked = value
  for (const pattern of SECRET_PATTERNS) {
    masked = masked.replace(pattern, '[REDACTED]')
  }
  return masked
}

function mask({ data }) {
  if (typeof data === 'string') return maskString(data)
  if (Array.isArray(data)) return data.map(item => mask({ data: item }))
  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, mask({ data: v })]),
    )
  }
  return data
}

// ---------------------------------------------------------------------------
// Singleton client (module-scoped — each Vercel Edge/Node function bundle
// gets its own instance, which is the desired one-client-per-isolate shape)
// ---------------------------------------------------------------------------

let langfuseClient = null

export function getLangfuse() {
  if (!langfuseClient && process.env.LANGFUSE_SECRET_KEY) {
    langfuseClient = new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      baseUrl: process.env.LANGFUSE_BASE_URL,
      mask,
    })
  }
  return langfuseClient
}
