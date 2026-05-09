#!/usr/bin/env bash
# baton-claim.sh — log work intent to shared live baton
# Usage: .baton/scripts/baton-claim.sh "<actor>" "<task>"

set -euo pipefail

ACTOR="${1:?actor required (mobile|desktop)}"
TASK="${2:?task description required}"
BATON="${HOME}/.satyajit-baton.md"

# Initialize live baton if missing
if [[ ! -f "$BATON" ]]; then
  cat > "$BATON" <<EOF
# Satyajit Mall Website — Live Baton

Real-time event log. Both Claude Code chats append here.
Format: ISO8601  [actor]  EVENT  message

---

EOF
fi

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
printf "%s  [%-7s]  CLAIM   %s\n" "$TS" "$ACTOR" "$TASK" >> "$BATON"

echo "✓ Claimed: $TASK"
echo "  Live baton: $BATON"

# Show last 5 events from peer for awareness
PEER="$( [[ "$ACTOR" == "mobile" ]] && echo "desktop" || echo "mobile" )"
echo ""
echo "── Last 5 events from peer ($PEER) ──"
grep "\[$PEER " "$BATON" | tail -5 || echo "  (no peer events yet)"
