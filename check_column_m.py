#!/usr/bin/env python3
"""Check Google Sheet Column M for HTML links in rows 10-15."""

import json
import os
import sys
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Service account credentials
SERVICE_ACCOUNT_FILE = '/home/openclaw/.openclaw/config/google-sheets-sa.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# Spreadsheet ID
SPREADSHEET_ID = '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA'

def get_service():
    """Authenticate and return Sheets API service."""
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds)

def main():
    service = get_service()
    
    # Read rows 10-15, column M (column index 12)
    # Using A10:M15 to get all data up to column M
    range_name = 'Sheet1!A10:M15'
    
    try:
        result = service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=range_name
        ).execute()
        
        values = result.get('values', [])
        
        if not values:
            print("No data found in rows 10-15")
            return
        
        print("=" * 60)
        print("Checking Column M (column 13) values in rows 10-15")
        print("=" * 60)
        
        issues_found = []
        
        for i, row in enumerate(values, start=10):
            # Column M is index 12 (0-indexed)
            col_m_value = row[12] if len(row) > 12 else "(empty)"
            
            print(f"\nRow {i}:")
            print(f"  Column M: {col_m_value}")
            
            # Check if it contains .pdf instead of .html
            if col_m_value == "(empty)":
                issues_found.append(f"Row {i}: Column M is empty")
            elif '.pdf' in str(col_m_value).lower():
                issues_found.append(f"Row {i}: Contains .pdf link: {col_m_value}")
            elif '.html' in str(col_m_value).lower():
                print(f"  ✓ Contains .html (correct)")
            else:
                print(f"  ? No .html or .pdf found (value: {col_m_value})")
        
        print("\n" + "=" * 60)
        print("SUMMARY")
        print("=" * 60)
        
        if issues_found:
            print("❌ ISSUES FOUND:")
            for issue in issues_found:
                print(f"  - {issue}")
            sys.exit(1)
        else:
            print("✅ All Column M values contain .html links (correct)")
            
    except Exception as e:
        print(f"Error accessing sheet: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
