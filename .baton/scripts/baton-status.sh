#!/usr/bin/env bash
# baton-status.sh — print current state across all three chats
# Usage: .baton/scripts/baton-status.sh

set -euo pipefail

BATON="${HOME}/.satyajit-baton.md"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
case "$CURRENT_BRANCH" in
  cases2)         ACTOR="master"  ;;
  cases2-mobile)  ACTOR="mobile"  ;;
  cases2-desktop) ACTOR="desktop" ;;
  *)              ACTOR="?"      ;;
esac

echo "═══════════════════════════════════════════"
echo "  Baton Status — $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "═══════════════════════════════════════════"
echo ""
echo "You are: [$ACTOR] on $CURRENT_BRANCH @ $(git rev-parse --short HEAD)"
echo ""

echo "── Branch heads (origin) ──"
git fetch origin --quiet 2>/dev/null || true
for b in cases2 cases2-mobile cases2-desktop main master; do
  REF="$(git rev-parse --short origin/$b 2>/dev/null || echo '???????')"
  MSG="$(git log -1 --format='%s' origin/$b 2>/dev/null || echo '(no remote)')"
  printf "  %-15s %s  %s\n" "$b" "$REF" "$MSG"
done

echo ""
echo "── Last 15 baton events ──"
if [[ -f "$BATON" ]]; then
  tail -15 "$BATON"
else
  echo "  (live baton missing — first claim will create it)"
fi

echo ""
echo "── Per-actor latest event ──"
for who in master mobile desktop; do
  LAST="$(grep "\[$who " "$BATON" 2>/dev/null | tail -1 || true)"
  if [[ -z "$LAST" ]]; then
    printf "  %-7s : (no events)\n" "$who"
  else
    printf "  %-7s : %s\n" "$who" "$LAST"
  fi
done
