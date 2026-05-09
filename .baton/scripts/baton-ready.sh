#!/usr/bin/env bash
# baton-ready.sh — worker signals task complete, ready for merge gate
# Usage: .baton/scripts/baton-ready.sh "<task / sha / notes>"

set -euo pipefail

NOTE="${1:?note required (task / sha / what's ready)}"
BATON="${HOME}/.satyajit-baton.md"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
ACTOR=""
case "$CURRENT_BRANCH" in
  cases2-mobile)  ACTOR="mobile"  ;;
  cases2-desktop) ACTOR="desktop" ;;
  *)
    echo "✗ Run from a worker branch (cases2-mobile or cases2-desktop). Currently: $CURRENT_BRANCH"
    exit 2
    ;;
esac

SHA="$(git rev-parse --short HEAD)"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

printf "%s  [%-7s]  READY   @%s — %s\n" "$TS" "$ACTOR" "$SHA" "$NOTE" >> "$BATON"

echo "✓ READY signal sent for $ACTOR @ $SHA"
echo "  Note: $NOTE"
echo ""
echo "Next: run .baton/scripts/baton-verify-merge.sh to gate + merge"
