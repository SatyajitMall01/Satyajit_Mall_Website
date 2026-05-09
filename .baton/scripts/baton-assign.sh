#!/usr/bin/env bash
# baton-assign.sh — master assigns a task to a worker
# Usage: .baton/scripts/baton-assign.sh <mobile|desktop> "<task>"

set -euo pipefail

WORKER="${1:?worker required (mobile|desktop)}"
TASK="${2:?task description required}"
BATON="${HOME}/.satyajit-baton.md"

if [[ "$WORKER" != "mobile" && "$WORKER" != "desktop" ]]; then
  echo "✗ worker must be 'mobile' or 'desktop' (got: $WORKER)"
  exit 2
fi

# Init live baton if missing
if [[ ! -f "$BATON" ]]; then
  cat > "$BATON" <<EOF
# Satyajit Mall Website — Live Baton

Real-time event log. Three chats append: master, mobile, desktop.
Format: ISO8601  [actor]  EVENT  message

---

EOF
fi

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
printf "%s  [%-7s]  ASSIGN  → %-7s : %s\n" "$TS" "master" "$WORKER" "$TASK" >> "$BATON"

echo "✓ Assigned to $WORKER: $TASK"
echo "  Live baton: $BATON"
echo ""
echo "── Last 5 events ──"
tail -5 "$BATON"
