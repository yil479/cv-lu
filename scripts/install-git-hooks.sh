#!/usr/bin/env bash
# Points git at the repo's tracked hooks dir (scripts/git-hooks) instead of
# the untracked, per-clone .git/hooks — so the secret-scan pre-commit hook
# survives fresh clones. Run automatically by `npm install` via "prepare".
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
chmod +x scripts/git-hooks/pre-commit scripts/check-secrets.sh
git config core.hooksPath scripts/git-hooks
echo "[install-git-hooks] core.hooksPath -> scripts/git-hooks (pre-commit secret scan active)"
