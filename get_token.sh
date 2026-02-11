#!/bin/bash
# Get Google Sheets API access token from service account

SA_FILE="/home/openclaw/.openclaw/config/google-sheets-sa.json"

# Read service account details
CLIENT_EMAIL=$(jq -r '.client_email' "$SA_FILE")
PRIVATE_KEY=$(jq -r '.private_key' "$SA_FILE")

# Create JWT header
HEADER=$(echo -n '{"alg":"RS256","typ":"JWT"}' | openssl base64 -e -A | tr '+/' '-_' | tr -d '=')

# Create JWT claims
NOW=$(date +%s)
EXP=$((NOW + 3600))
CLAIMS=$(echo -n "{\"iss\":\"$CLIENT_EMAIL\",\"scope\":\"https://www.googleapis.com/auth/spreadsheets\",\"aud\":\"https://oauth2.googleapis.com/token\",\"exp\":$EXP,\"iat\":$NOW}" | openssl base64 -e -A | tr '+/' '-_' | tr -d '=')

# Create signature
SIGN_INPUT="$HEADER.$CLAIMS"

# Write private key to temp file
KEY_FILE=$(mktemp)
echo "$PRIVATE_KEY" > "$KEY_FILE"

# Sign
SIGNATURE=$(echo -n "$SIGN_INPUT" | openssl dgst -sha256 -sign "$KEY_FILE" -binary | openssl base64 -e -A | tr '+/' '-_' | tr -d '=')

# Cleanup
rm "$KEY_FILE"

# Create JWT
JWT="$SIGN_INPUT.$SIGNATURE"

# Get access token
TOKEN_RESPONSE=$(curl -s -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=$JWT")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
    echo "Failed to get access token: $TOKEN_RESPONSE"
    exit 1
fi

echo "$ACCESS_TOKEN"
