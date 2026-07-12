#!/usr/bin/env bash
# Pre-commit guard: blocks commits that stage an .env file or content that
# looks like an API key/secret. Not a substitute for a real secret scanner
# (gitleaks/trufflehog) — it's a lightweight, dependency-free tripwire tuned
# to this repo's providers (Anthropic, OpenAI, Supabase, GitHub, AWS, JWTs).
#
# Bypass (should be rare, and reviewed): git commit --no-verify
set -euo pipefail

files="$(git diff --cached --name-only --diff-filter=ACM)"
[ -z "$files" ] && exit 0

found=0

while IFS= read -r file; do
  [ -z "$file" ] && continue

  # .env files must never be committed, regardless of content.
  if echo "$file" | grep -qE '(^|/)\.env(\..*)?$'; then
    echo "✖ $file: .env files must never be committed"
    found=1
    continue
  fi

  case "$file" in
    package-lock.json|*.lock|*.svg|*.png|*.jpg|*.jpeg|*.webp|*.ico|*.woff2|*.mp4|*.mp3) continue ;;
  esac

  added="$(git diff --cached -U0 -- "$file" | grep -E '^\+' | grep -Ev '^\+\+\+' || true)"
  [ -z "$added" ] && continue

  while IFS= read -r pat; do
    [ -z "$pat" ] && continue
    hit="$(echo "$added" | grep -inE "$pat" || true)"
    if [ -n "$hit" ]; then
      echo "✖ $file: matches secret pattern ($pat)"
      echo "$hit" | sed -E 's/^(.{0,28}).*$/    \1.../'
      found=1
    fi
  done <<'PATTERNS'
sk-ant-[A-Za-z0-9_-]{20,}
sk-(proj-)?[A-Za-z0-9]{20,}
ghp_[A-Za-z0-9]{36}
github_pat_[A-Za-z0-9_]{20,}
AKIA[0-9A-Z]{16}
eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}
(SECRET|API_KEY|ACCESS_KEY|PRIVATE_KEY)[[:space:]]*[:=][[:space:]]*['\''"]?[A-Za-z0-9/+_.-]{16,}
PATTERNS
done <<< "$files"

if [ "$found" -eq 1 ]; then
  echo ""
  echo "Commit blocked: staged changes look like they contain an API key/secret."
  echo "Remove it, or if this is a false positive: git commit --no-verify"
  exit 1
fi

exit 0
