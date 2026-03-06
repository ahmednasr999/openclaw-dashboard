#!/bin/bash
set -euo pipefail

SPREADSHEET_ID="10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"

# Prefer explicit env token, fallback to local helper if available.
TOKEN="${GOOGLE_ACCESS_TOKEN:-}"
if [ -z "$TOKEN" ] && [ -x "./get_token.sh" ]; then
  TOKEN="$(./get_token.sh)"
fi

if [ -z "$TOKEN" ]; then
  echo "Error: missing Google access token. Set GOOGLE_ACCESS_TOKEN or provide executable ./get_token.sh" >&2
  exit 1
fi

curl -s -H "Authorization: Bearer $TOKEN" \
  "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/A:M?valueRenderOption=FORMATTED_VALUE"
