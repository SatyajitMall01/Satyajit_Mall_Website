#!/usr/bin/env bash
# baton-verify-merge.sh — gated merge: build + conflict-check, then merge cases2 → main → master
# Run from inside a worktree (cases2-mobile or cases2-desktop).
# Exits non-zero if any gate fails. Logs to live baton.

set -euo pipefail

BATON="${HOME}/.satyajit-baton.md"
TS() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
ACTOR=""
case "$CURRENT_BRANCH" in
  cases2-mobile)  ACTOR="mobile"  ;;
  cases2-desktop) ACTOR="desktop" ;;
  *)
    echo "✗ Must run from cases2-mobile or cases2-desktop branch (currently: $CURRENT_BRANCH)"
    exit 2
    ;;
esac

log() {
  printf "%s  [%-7s]  %-7s %s\n" "$(TS)" "$ACTOR" "$1" "$2" >> "$BATON"
  echo "$2"
}

log "GATE" "Starting merge verification on $CURRENT_BRANCH"

# 1. Working tree must be clean
if [[ -n "$(git status --porcelain)" ]]; then
  log "FAIL"  "Dirty working tree. Commit or stash first."
  exit 1
fi

# 2. Vite build gate
echo ""
echo "── Gate 1: vite build ──"
cd frontend
if ! npx vite build 2>&1 | tail -20; then
  cd ..
  log "FAIL"  "vite build failed on $CURRENT_BRANCH"
  exit 1
fi
cd ..
log "PASS"  "vite build clean"

# 3. Conflict check (test merge into cases2)
echo ""
echo "── Gate 2: conflict check (test merge into cases2) ──"
git fetch origin cases2 2>&1 | tail -3
TEST_BRANCH="_baton_test_$(date +%s)"
git checkout -b "$TEST_BRANCH" origin/cases2 2>&1 | tail -3

if ! git merge --no-commit --no-ff "$CURRENT_BRANCH" >/dev/null 2>&1; then
  git merge --abort 2>/dev/null || true
  git checkout "$CURRENT_BRANCH"
  git branch -D "$TEST_BRANCH"
  log "FAIL"  "merge conflict against cases2"
  exit 1
fi
git merge --abort 2>/dev/null || true
git checkout "$CURRENT_BRANCH"
git branch -D "$TEST_BRANCH"
log "PASS"  "no conflicts vs cases2"

# 4. Real merge sequence: cases2 → main → master
echo ""
echo "── Real merge: $CURRENT_BRANCH → cases2 → main → master ──"

git checkout cases2
git pull origin cases2
git merge --no-ff "$CURRENT_BRANCH" -m "merge: $CURRENT_BRANCH → cases2 (baton-verified by $ACTOR)"
git push origin cases2

git checkout main
git pull origin main
git merge --no-ff cases2 -m "merge: cases2 → main"
git push origin main

git checkout master
git pull origin master
git merge --no-ff cases2 -m "merge: cases2 → master"
git push origin master

git checkout "$CURRENT_BRANCH"

MERGED_SHA="$(git rev-parse --short cases2)"
log "MERGED" "$CURRENT_BRANCH → cases2/main/master at $MERGED_SHA"

echo ""
echo "✓ Merged + pushed. cases2 now at $MERGED_SHA"
echo "  Both peers should: git fetch && git rebase origin/cases2 (or merge)"
