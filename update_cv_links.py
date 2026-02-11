#!/usr/bin/env python3
"""Update CV links in Google Sheet from raw.githubusercontent.com to GitHub Pages"""

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Configuration
SPREADSHEET_ID = "10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
OLD_PREFIX = "https://raw.githubusercontent.com/ahmednasr999/openclaw-dashboard/master/applications/"
NEW_PREFIX = "https://ahmednasr999.github.io/openclaw-dashboard/applications/"

# Authenticate with service account
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
creds = service_account.Credentials.from_service_account_file(
    '/home/openclaw/.openclaw/config/google-sheets-sa.json', scopes=SCOPES)
service = build('sheets', 'v4', credentials=creds)

# Get all data from the sheet to find the CV Links column (M)
result = service.spreadsheets().values().get(
    spreadsheetId=SPREADSHEET_ID,
    range='A:M'  # Get columns A through M
).execute()

values = result.get('values', [])
if not values:
    print("No data found in spreadsheet")
    exit(1)

# Find header row and CV Link column index
header_row = values[0]
print(f"Headers: {header_row}")

cv_link_col_idx = None
for i, header in enumerate(header_row):
    if 'CV' in header or 'Link' in header or header.strip() == 'M':
        print(f"Column {i}: '{header}'")
        if 'CV' in header or 'cv' in header.lower():
            cv_link_col_idx = i
            print(f"Found CV Link column at index {i}: '{header}'")
            break

# If not found by name, assume column M (index 12)
if cv_link_col_idx is None:
    cv_link_col_idx = 12  # Column M is index 12 (0-based)
    print(f"Using column M (index {cv_link_col_idx})")

# Collect updates
updates = []
rows_updated = 0

for row_idx, row in enumerate(values[1:], start=2):  # Skip header, 1-based for sheets
    if len(row) > cv_link_col_idx:
        old_url = row[cv_link_col_idx]
        if old_url and OLD_PREFIX in old_url:
            new_url = old_url.replace(OLD_PREFIX, NEW_PREFIX)
            updates.append({
                'range': f'M{row_idx}',
                'values': [[new_url]]
            })
            print(f"Row {row_idx}: {old_url[:60]}... -> {new_url[:60]}...")
            rows_updated += 1

print(f"\nTotal rows to update: {rows_updated}")

# Apply updates in batch if any
if updates:
    body = {'valueInputOption': 'USER_ENTERED', 'data': updates}
    result = service.spreadsheets().values().batchUpdate(
        spreadsheetId=SPREADSHEET_ID, body=body).execute()
    print(f"\nUpdated {result.get('totalUpdatedCells', 0)} cells")
    print(f"Updated {result.get('totalUpdatedRows', 0)} rows")
else:
    print("\nNo updates needed - checking if already updated...")
    
    # Check for any GitHub Pages URLs
    github_pages_count = 0
    for row in values[1:]:
        if len(row) > cv_link_col_idx:
            url = row[cv_link_col_idx]
            if url and NEW_PREFIX in url:
                github_pages_count += 1
    
    print(f"Found {github_pages_count} rows already using GitHub Pages URLs")
    
    # Show sample URLs
    print("\nSample URLs from column M:")
    for row_idx, row in enumerate(values[1:6], start=2):  # First 5 data rows
        if len(row) > cv_link_col_idx:
            url = row[cv_link_col_idx]
            print(f"  Row {row_idx}: {url[:80]}..." if url else f"  Row {row_idx}: (empty)")
