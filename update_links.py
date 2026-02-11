#!/usr/bin/env python3
"""Generate and apply batch update to change raw.githubusercontent URLs to GitHub Pages"""

import json
import re
import urllib.request
import sys

# Get access token
def get_token():
    import subprocess
    result = subprocess.run(['python3', '/root/.openclaw/agents/main/workspace/get_token.py'], 
                          capture_output=True, text=True)
    return result.stdout.strip()

# Configuration
SPREADSHEET_ID = "10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
OLD_PREFIX = "https://raw.githubusercontent.com/ahmednasr999/openclaw-dashboard/"
NEW_PREFIX = "https://ahmednasr999.github.io/openclaw-dashboard/"

def fetch_formulas():
    """Fetch all formulas from the sheet"""
    token = get_token()
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/A:M?valueRenderOption=FORMULA"
    req = urllib.request.Request(url)
    req.add_header('Authorization', f'Bearer {token}')
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def update_cells(updates):
    """Apply batch update to cells"""
    token = get_token()
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values:batchUpdate"
    
    body = json.dumps({
        'valueInputOption': 'USER_ENTERED',
        'data': updates
    }).encode()
    
    req = urllib.request.Request(url, data=body, method='POST')
    req.add_header('Authorization', f'Bearer {token}')
    req.add_header('Content-Type', 'application/json')
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def main():
    print("Fetching current formulas...")
    data = fetch_formulas()
    values = data.get('values', [])
    
    updates = []
    updated_count = 0
    
    print("\nProcessing rows...")
    for row_idx, row in enumerate(values[1:], start=2):  # Skip header, 1-indexed
        if len(row) > 12:  # Column M (index 12)
            cell_formula = row[12]
            if cell_formula and OLD_PREFIX in cell_formula:
                # Replace the URL in the formula
                new_formula = cell_formula.replace(OLD_PREFIX, NEW_PREFIX)
                
                # Extract display text from HYPERLINK formula
                match = re.match(r'=HYPERLINK\("([^"]+)",\s*"([^"]+)"\)', cell_formula)
                if match:
                    old_url, display_text = match.groups()
                    new_url = old_url.replace(OLD_PREFIX, NEW_PREFIX)
                    new_formula = f'=HYPERLINK("{new_url}", "{display_text}")'
                    
                    updates.append({
                        'range': f'M{row_idx}',
                        'values': [[new_formula]]
                    })
                    updated_count += 1
                    
                    if updated_count <= 5 or updated_count % 10 == 0:
                        print(f"Row {row_idx}: Will update")
                        print(f"  Old: {old_url[:70]}...")
                        print(f"  New: {new_url[:70]}...")
    
    print(f"\nTotal cells to update: {updated_count}")
    
    if updates:
        print(f"\nApplying batch update for {len(updates)} cells...")
        result = update_cells(updates)
        print(f"Success! Updated {result.get('totalUpdatedCells', 0)} cells")
        print(f"Updated {result.get('totalUpdatedRows', 0)} rows")
        return True
    else:
        print("\nNo updates needed!")
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
