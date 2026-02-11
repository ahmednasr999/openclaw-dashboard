#!/usr/bin/env python3
"""Add 3 enhancement columns (T, U, V) to Job Tracker Google Sheet"""

from google.oauth2 import service_account
from googleapiclient.discovery import build

# Configuration
SPREADSHEET_ID = "10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
SHEET_NAME = "Sheet1"

# New column headers
NEW_COLUMNS = {
    'T': 'Interview Stage',
    'U': 'Source/Referral', 
    'V': 'Outcome/Response'
}

# Default values for existing rows
DEFAULT_VALUES = {
    'T': 'Pending',
    'U': '',
    'V': 'Pending'
}

# Authenticate with service account
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
creds = service_account.Credentials.from_service_account_file(
    '/home/openclaw/.openclaw/config/google-sheets-sa.json', scopes=SCOPES)
service = build('sheets', 'v4', credentials=creds)

# Step 1: Get current sheet structure to verify
print("=" * 60)
print("STEP 1: Reading current sheet structure...")
print("=" * 60)

result = service.spreadsheets().values().get(
    spreadsheetId=SPREADSHEET_ID,
    range=f'{SHEET_NAME}!A1:V1'  # Get header row through column V
).execute()

headers = result.get('values', [[]])[0] if result.get('values') else []
print(f"Current headers ({len(headers)} columns):")
for i, header in enumerate(headers, start=1):
    col_letter = chr(64 + i) if i <= 26 else f"?"
    print(f"  {col_letter}: {header}")

# Step 2: Check if columns T, U, V already exist
print("\n" + "=" * 60)
print("STEP 2: Checking for existing columns T, U, V...")
print("=" * 60)

existing_cols = {}
if len(headers) >= 20:
    existing_cols['T'] = headers[19] if len(headers) > 19 else None
if len(headers) >= 21:
    existing_cols['U'] = headers[20] if len(headers) > 20 else None
if len(headers) >= 22:
    existing_cols['V'] = headers[21] if len(headers) > 21 else None

print(f"Existing column T (index 20): {existing_cols.get('T', 'NOT SET')}")
print(f"Existing column U (index 21): {existing_cols.get('U', 'NOT SET')}")
print(f"Existing column V (index 22): {existing_cols.get('V', 'NOT SET')}")

# Step 3: Add headers for columns T, U, V
print("\n" + "=" * 60)
print("STEP 3: Adding headers for columns T, U, V...")
print("=" * 60)

header_updates = []
header_updates.append({
    'range': f'{SHEET_NAME}!T1',
    'values': [[NEW_COLUMNS['T']]]
})
header_updates.append({
    'range': f'{SHEET_NAME}!U1', 
    'values': [[NEW_COLUMNS['U']]]
})
header_updates.append({
    'range': f'{SHEET_NAME}!V1',
    'values': [[NEW_COLUMNS['V']]]
})

body = {'valueInputOption': 'USER_ENTERED', 'data': header_updates}
result = service.spreadsheets().values().batchUpdate(
    spreadsheetId=SPREADSHEET_ID, body=body).execute()
print(f"✓ Added headers to columns T, U, V")
print(f"  Updated {result.get('totalUpdatedCells', 0)} cells")

# Step 4: Get all data rows to backfill
print("\n" + "=" * 60)
print("STEP 4: Counting data rows to backfill...")
print("=" * 60)

result = service.spreadsheets().values().get(
    spreadsheetId=SPREADSHEET_ID,
    range=f'{SHEET_NAME}!A2:A1000'  # Get all rows in column A (Company)
).execute()

data_rows = result.get('values', [])
num_jobs = len([r for r in data_rows if r and r[0].strip()])  # Count non-empty rows
print(f"Found {num_jobs} existing jobs to backfill")

# Step 5: Backfill default values for existing jobs
print("\n" + "=" * 60)
print("STEP 5: Backfilling default values for existing jobs...")
print("=" * 60)

# Backfill in batches for efficiency
BATCH_SIZE = 50
updates = []
total_updates = 0

for batch_start in range(2, 2 + num_jobs, BATCH_SIZE):
    batch_end = min(batch_start + BATCH_SIZE, 2 + num_jobs)
    
    for row in range(batch_start, batch_end):
        # Column T: Interview Stage - default "Pending"
        updates.append({
            'range': f'{SHEET_NAME}!T{row}',
            'values': [[DEFAULT_VALUES['T']]]
        })
        # Column U: Source/Referral - default empty
        updates.append({
            'range': f'{SHEET_NAME}!U{row}',
            'values': [[DEFAULT_VALUES['U']]]
        })
        # Column V: Outcome/Response - default "Pending"
        updates.append({
            'range': f'{SHEET_NAME}!V{row}',
            'values': [[DEFAULT_VALUES['V']]]
        })
        total_updates += 3
    
    # Apply batch
    if updates:
        body = {'valueInputOption': 'USER_ENTERED', 'data': updates}
        result = service.spreadsheets().values().batchUpdate(
            spreadsheetId=SPREADSHEET_ID, body=body).execute()
        print(f"  Backfilled rows {batch_start} to {batch_end-1}")
        updates = []

print(f"\n✓ Backfilled {total_updates} cells across {num_jobs} jobs")

# Step 6: Verify the final structure
print("\n" + "=" * 60)
print("STEP 6: Verifying final sheet structure...")
print("=" * 60)

result = service.spreadsheets().values().get(
    spreadsheetId=SPREADSHEET_ID,
    range=f'{SHEET_NAME}!A1:V1'
).execute()

final_headers = result.get('values', [[]])[0] if result.get('values') else []
print(f"Final headers ({len(final_headers)} columns total):")
for i, header in enumerate(final_headers, start=1):
    col_letter = chr(64 + i) if i <= 26 else f"?"
    mark = " ✓" if col_letter in ['T', 'U', 'V'] else ""
    print(f"  {col_letter}: {header}{mark}")

# Verify sample data
print("\n" + "=" * 60)
print("STEP 7: Verifying sample backfill data...")
print("=" * 60)

result = service.spreadsheets().values().get(
    spreadsheetId=SPREADSHEET_ID,
    range=f'{SHEET_NAME}!A2:V5'  # First 4 data rows
).execute()

sample_data = result.get('values', [])
print("Sample rows (first 4 jobs):")
for i, row in enumerate(sample_data, start=2):
    company = row[0] if len(row) > 0 else 'N/A'
    t_val = row[19] if len(row) > 19 else 'NOT SET'
    u_val = row[20] if len(row) > 20 else 'NOT SET'
    v_val = row[21] if len(row) > 21 else 'NOT SET'
    print(f"  Row {i} ({company}): T='{t_val}', U='{u_val}', V='{v_val}'")

print("\n" + "=" * 60)
print("✅ SUCCESS: All 3 enhancement columns added!")
print("=" * 60)
print(f"""
SUMMARY:
• Added columns T, U, V with correct headers
• Backfilled {num_jobs} existing jobs with default values
• Final sheet structure: {len(final_headers)} columns (A-V)

COLUMN REFERENCE:
T: Interview Stage     → Default: "Pending"
U: Source/Referral     → Default: "" (blank)  
V: Outcome/Response    → Default: "Pending"

The sheet is ready for new job entries with enhanced tracking!
""")
