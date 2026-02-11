#!/usr/bin/env python3
"""Find job URLs for specific companies from Google Sheet"""

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Configuration
SPREADSHEET_ID = '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA'
SHEET_NAME = 'Job Applications'
SA_PATH = '/home/openclaw/.openclaw/config/google-sheets-sa.json'

# Companies to find
TARGET_COMPANIES = [
    'Confidential Company',
    'Bisher & Partners',
    'Confidential - Construction/EPC',
    'New Metrics',
    'American Express Saudi Arabia',
    'RiskPod',
    'Banking Client',
    'Government/Public Sector Client',
    'Al Masraf Bank',
    'PwC Strategy&'
]

def get_sheets_service():
    """Authenticate and return Google Sheets service"""
    creds = service_account.Credentials.from_service_account_file(
        SA_PATH,
        scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
    )
    return build('sheets', 'v4', credentials=creds)

def main():
    service = get_sheets_service()
    
    # Read all data from the sheet (reading enough rows - let's say 500)
    range_name = f"{SHEET_NAME}!A:I"
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name
    ).execute()
    
    values = result.get('values', [])
    
    if not values:
        print("No data found in sheet")
        return
    
    # Find rows matching target companies (Column B = index 1, Column I = index 8)
    matches = []
    for row_num, row in enumerate(values, start=1):
        if len(row) < 2:
            continue
        
        company = row[1] if len(row) > 1 else ''
        job_url = row[8] if len(row) > 8 else ''
        
        if company in TARGET_COMPANIES:
            matches.append({
                'row': row_num,
                'company': company,
                'job_url': job_url if job_url else '(empty)'
            })
    
    # Print results as table
    print("\n" + "="*100)
    print(f"{'Row':<6} | {'Company':<35} | {'Job URL'}")
    print("="*100)
    
    for match in matches:
        print(f"{match['row']:<6} | {match['company']:<35} | {match['job_url']}")
    
    print("="*100)
    print(f"\nFound {len(matches)} matching companies out of {len(TARGET_COMPANIES)} requested.")
    
    # Show which companies were NOT found
    found_companies = {m['company'] for m in matches}
    not_found = [c for c in TARGET_COMPANIES if c not in found_companies]
    
    if not_found:
        print(f"\nCompanies NOT found in sheet:")
        for c in not_found:
            print(f"  - {c}")

if __name__ == '__main__':
    main()
