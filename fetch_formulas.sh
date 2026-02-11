#!/bin/bash
TOKEN=$(python3 /root/.openclaw/agents/main/workspace/get_token.py)
SPREADSHEET_ID="10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"

curl -s -H "Authorization: Bearer $TOKEN" \
  "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/A:M?valueRenderOption=FORMULA"
