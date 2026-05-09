#!/usr/bin/env bash
# baton-sync.sh — pull latest cases2 into current worktree branch (rebase)
# Run after peer has merged. Resolves your branch ahead of cases2.

set -euo pipefail

BATON="${HOME}/.satyajit-baton.md"
TS() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
ACTOR=""
case "$CURRENT_BRANCH" in
  cases2-mobile)  ACTOR="mobile"  ;;
  cases2-desktop) ACTOR="desktop" ;;
  *)
    echo "✗ Run from cases2-mobile or cases2-desktop"
    exit 2
    ;;
esac

if [[ -n "$(git status --porcelain)" ]]; then
  echo "✗ Dirty working tree — commit or stash first"
  exit 1
fi

echo "── Fetching origin ──"
git fetch origin cases2

BEFORE="$(git rev-parse --short HEAD)"
echo "── Rebasing $CURRENT_BRANCH onto origin/cases2 ──"
if ! git rebase origin/cases2; then
  echo ""
  echo "✗ Rebase conflict. Resolve manually then run: git rebase --continue"
  printf "%s  [%-7s]  SYNC    REBASE_CONFLICT vs origin/cases2\n" "$(TS)" "$ACTOR" >> "$BATON"
  exit 1
fi

AFTER="$(git rev-parse --short HEAD)"
if [[ "$BEFORE" == "$AFTER" ]]; then
  echo "✓ Already up-to-date with cases2 ($AFTER)"
else
  echo "✓ Rebased $BEFORE → $AFTER on top of cases2"
fi

printf "%s  [%-7s]  SYNC    rebased onto cases2 (%s → %s)\n" "$(TS)" "$ACTOR" "$BEFORE" "$AFTER" >> "$BATON"
