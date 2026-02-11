#!/bin/bash
# Add 3 enhancement columns to Google Sheet using curl and JWT auth

set -e

SPREADSHEET_ID="10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
SA_FILE="/home/openclaw/.openclaw/config/google-sheets-sa.json"

echo "============================================================"
echo "Adding Enhancement Columns T, U, V to Job Tracker Sheet"
echo "============================================================"

# Get access token using the service account
echo -e "\n[1/5] Getting access token from service account..."

# Extract service account details
CLIENT_EMAIL=$(jq -r '.client_email' "$SA_FILE")
PRIVATE_KEY=$(jq -r '.private_key' "$SA_FILE")
TOKEN_URI=$(jq -r '.token_uri' "$SA_FILE")

# Create JWT claim
HEADER='{"alg":"RS256","typ":"JWT"}'
NOW=$(date +%s)
EXP=$((NOW + 3600))
CLAIM=$(cat <<EOF
{
  "iss": "$CLIENT_EMAIL",
  "sub": "$CLIENT_EMAIL",
  "scope": "https://www.googleapis.com/auth/spreadsheets",
  "aud": "$TOKEN_URI",
  "exp": $EXP,
  "iat": $NOW
}
EOF
)

# Base64URL encode header and claim
b64enc() { openssl base64 -e | tr '+/' '-_' | tr -d '=\n'; }

JWT_HEADER=$(echo -n "$HEADER" | b64enc)
JWT_CLAIM=$(echo -n "$CLAIM" | b64enc)
JWT_PAYLOAD="$JWT_HEADER.$JWT_CLAIM"

# Sign with private key
SIGNATURE=$(echo -n "$JWT_PAYLOAD" | openssl dgst -sha256 -sign <(echo "$PRIVATE_KEY") | b64enc)
JWT="$JWT_PAYLOAD.$SIGNATURE"

# Get access token
TOKEN_RESPONSE=$(curl -s -X POST "$TOKEN_URI" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" \
  -d "assertion=$JWT")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
    echo "ERROR: Failed to get access token"
    echo "$TOKEN_RESPONSE"
    exit 1
fi

echo "✓ Access token obtained"

# Function to update sheet values
update_values() {
    local range=$1
    local values_json=$2
    
    curl -s -X PUT "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values/$range" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"range\": \"$range\",
            \"values\": $values_json,
            \"majorDimension\": \"ROWS\"
        }?valueInputOption=USER_ENTERED" 2>/dev/null
}

# Step 2: Add headers
echo -e "\n[2/5] Adding column headers..."

# Column T: Interview Stage
curl -s -X PUT "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values/Sheet1!T1?valueInputOption=USER_ENTERED" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"range":"Sheet1!T1","values":[["Interview Stage"]]}' > /dev/null

# Column U: Source/Referral
curl -s -X PUT "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values/Sheet1!U1?valueInputOption=USER_ENTERED" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"range":"Sheet1!U1","values":[["Source/Referral"]]}' > /dev/null

# Column V: Outcome/Response
curl -s -X PUT "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values/Sheet1!V1?valueInputOption=USER_ENTERED" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"range":"Sheet1!V1","values":[["Outcome/Response"]]}' > /dev/null

echo "✓ Headers added: T, U, V"

# Step 3: Count existing jobs
echo -e "\n[3/5] Counting existing jobs..."

COMPANY_DATA=$(curl -s "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values/Sheet1!A2:A100?majorDimension=COLUMNS" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

NUM_JOBS=$(echo "$COMPANY_DATA" | jq -r '.values[0] | map(select(length > 0 and . != "")) | length')
echo "✓ Found $NUM_JOBS existing jobs to backfill"

# Step 4: Backfill default values
echo -e "\n[4/5] Backfilling default values..."

# Prepare batch update data for columns T, U, V
# Using batchUpdate for efficiency

T_VALUES=$(jq -n --arg n "$NUM_JOBS" '[range(($n|tonumber)) | ["Pending"]]')
U_VALUES=$(jq -n --arg n "$NUM_JOBS" '[range(($n|tonumber)) | [""]]')
V_VALUES=$(jq -n --arg n "$NUM_JOBS" '[range(($n|tonumber)) | ["Pending"]]')

# Update column T (Interview Stage) - rows 2 to NUM_JOBS+1
T_END=$((NUM_JOBS + 1))
curl -s -X PUT "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values/Sheet1!T2:T$T_END?valueInputOption=USER_ENTERED" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"range\":\"Sheet1!T2:T$T_END\",\"values\":$T_VALUES}" > /dev/null

# Update column U (Source/Referral)
curl -s -X PUT "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values/Sheet1!U2:U$T_END?valueInputOption=USER_ENTERED" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"range\":\"Sheet1!U2:U$T_END\",\"values\":$U_VALUES}" > /dev/null

# Update column V (Outcome/Response)
curl -s -X PUT "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values/Sheet1!V2:V$T_END?valueInputOption=USER_ENTERED" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"range\":\"Sheet1!V2:V$T_END\",\"values\":$V_VALUES}" > /dev/null

echo "✓ Backfilled $NUM_JOBS rows with default values"

# Step 5: Verify
echo -e "\n[5/5] Verifying final structure..."

HEADERS=$(curl -s "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values/Sheet1!A1:V1" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

HEADER_COUNT=$(echo "$HEADERS" | jq -r '.values[0] | length')
T_HEADER=$(echo "$HEADERS" | jq -r '.values[0][19] // "NOT SET"')
U_HEADER=$(echo "$HEADERS" | jq -r '.values[0][20] // "NOT SET"')
V_HEADER=$(echo "$HEADERS" | jq -r '.values[0][21] // "NOT SET"')

echo ""
echo "============================================================"
echo "VERIFICATION"
echo "============================================================"
echo "Total columns: $HEADER_COUNT (expected: 22)"
echo "Column T (index 20): $T_HEADER"
echo "Column U (index 21): $U_HEADER"
echo "Column V (index 22): $V_HEADER"

# Check sample data
SAMPLE=$(curl -s "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values/Sheet1!A2:V4" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

echo ""
echo "Sample data (first 3 jobs):"
echo "$SAMPLE" | jq -r '.values[] | "  Row: T=\"\(.[19] // "N/A")\", U=\"\(.[20] // "N/A")\", V=\"\(.[21] // "N/A")\""' 2>/dev/null || echo "  (Could not parse sample)"

echo ""
echo "============================================================"
echo "✅ TASK COMPLETE"
echo "============================================================"
echo ""
echo "Added 3 enhancement columns:"
echo "  • T: Interview Stage (default: Pending)"
echo "  • U: Source/Referral (default: blank)"
echo "  • V: Outcome/Response (default: Pending)"
echo ""
echo "Backfilled $NUM_JOBS existing jobs"
echo "Final structure: $HEADER_COUNT columns total (A-V)"
echo ""
