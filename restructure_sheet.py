#!/usr/bin/env python3
"""
Google Sheet Restructuring Script
Reads current sheet, restructures columns, preserves data
"""
import json
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Configuration
SPREADSHEET_ID = "10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
SHEET_NAME = "Sheet1"
SERVICE_ACCOUNT_FILE = "/home/openclaw/.openclaw/config/google-sheets-sa.json"

# New column structure
NEW_HEADERS = [
    "Company",           # A
    "Role",              # B
    "Status",            # C
    "Priority",          # D
    "CV Ready",          # E
    "Applied",           # F
    "Applied Date",      # G
    "Follow-up Date",    # H
    "Job URL",           # I
    "Notes",             # J
    "Competitive Advantages",  # K
    "Deadline/Next Step",      # L
    "CV Link"            # M
]

def get_service():
    """Initialize Google Sheets API service"""
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=['https://www.googleapis.com/auth/spreadsheets']
    )
    return build('sheets', 'v4', credentials=credentials)

def read_sheet(service, range_name):
    """Read data from sheet"""
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name
    ).execute()
    return result.get('values', [])

def write_sheet(service, range_name, values):
    """Write data to sheet"""
    body = {'values': values}
    result = service.spreadsheets().values().update(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name,
        valueInputOption='USER_ENTERED',
        body=body
    ).execute()
    return result

def clear_sheet(service, range_name):
    """Clear sheet range"""
    service.spreadsheets().values().clear(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name
    ).execute()

def main():
    print("="*60)
    print("Google Sheet Restructuring Tool")
    print("="*60)
    
    service = get_service()
    
    # Step 1: Read current sheet
    print("\n[1/5] Reading current sheet data...")
    current_data = read_sheet(service, f"{SHEET_NAME}!A1:Z1000")
    
    if not current_data:
        print("ERROR: No data found in sheet!")
        return
    
    print(f"   Found {len(current_data)} rows")
    print(f"   Current headers: {current_data[0] if current_data else 'None'}")
    print(f"   Columns: {len(current_data[0]) if current_data else 0}")
    
    # Display first few rows for analysis
    print("\n   First 3 data rows:")
    for i, row in enumerate(current_data[1:4], 1):
        print(f"   Row {i+1}: {row[:5]}...")  # First 5 columns
    
    # Save current state for mapping analysis
    old_headers = current_data[0] if current_data else []
    old_data = current_data[1:] if len(current_data) > 1 else []
    
    print("\n[2/5] Analyzing current structure...")
    print(f"   Old columns ({len(old_headers)}): {old_headers}")
    print(f"   New columns ({len(NEW_HEADERS)}): {NEW_HEADERS}")
    
    # Create mapping from old to new
    # Based on analysis, we'll map intelligently
    header_map = {}
    for i, h in enumerate(old_headers):
        header_map[h.lower().strip()] = i
    
    print(f"   Header map: {header_map}")
    
    return old_headers, old_data

if __name__ == "__main__":
    main()
