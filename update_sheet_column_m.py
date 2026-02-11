#!/usr/bin/env python3
"""
Update Google Sheet Column M with CV HTML HYPERLINK formulas
Matches company names from sheet with CV content
"""

import json
import base64
import urllib.request
import urllib.error
import ssl
import subprocess
import tempfile
import os
import re
import glob
from pathlib import Path

# Configuration
SPREADSHEET_ID = "10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
SERVICE_ACCOUNT_FILE = "/home/openclaw/.openclaw/config/google-sheets-sa.json"
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/ahmednasr999/openclaw-dashboard/master/applications"

def build_company_folder_mapping():
    """Build mapping from company name to folder by reading CV.md files"""
    company_folder_map = {}
    cv_files = sorted(glob.glob('/root/.openclaw/agents/main/workspace/applications/job_*/CV.md'))
    
    for cv_file in cv_files:
        folder = Path(cv_file).parent.name
        with open(cv_file, 'r') as f:
            content = f.read()
        
        # Extract company from TARGET POSITION line
        match = re.search(r'TARGET POSITION:.+?at\s+(.+)', content)
        if match:
            company = match.group(1).strip()
            company_folder_map[company] = folder
    
    return company_folder_map

def normalize_company(name):
    """Normalize company name for matching"""
    return name.lower().replace('&', 'and').replace('.', '').replace(',', '').strip()

def find_best_match(sheet_company, company_map):
    """Find best matching folder for a company name from the sheet"""
    sheet_norm = normalize_company(sheet_company)
    
    # Direct match first
    for company, folder in company_map.items():
        if normalize_company(company) == sheet_norm:
            return folder
    
    # Partial match
    for company, folder in company_map.items():
        company_norm = normalize_company(company)
        # Check if key parts match
        if sheet_norm in company_norm or company_norm in sheet_norm:
            return folder
        # Split and check words
        sheet_words = set(sheet_norm.split())
        company_words = set(company_norm.split())
        if len(sheet_words & company_words) >= min(2, len(sheet_words)):
            return folder
    
    return None

def get_token_with_curl():
    """Get access token using curl and openssl"""
    with open(SERVICE_ACCOUNT_FILE) as f:
        sa = json.load(f)
    
    header = base64.urlsafe_b64encode(json.dumps({"alg": "RS256", "typ": "JWT"}).encode()).decode().rstrip("=")
    now = int(os.popen('date +%s').read().strip())
    claims = base64.urlsafe_b64encode(json.dumps({
        "iss": sa["client_email"],
        "scope": "https://www.googleapis.com/auth/spreadsheets",
        "aud": "https://oauth2.googleapis.com/token",
        "exp": now + 3600,
        "iat": now
    }).encode()).decode().rstrip("=")
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.pem', delete=False) as f:
        f.write(sa["private_key"])
        key_file = f.name
    
    try:
        sign_input = f"{header}.{claims}"
        cmd = f"echo -n '{sign_input}' | openssl dgst -sha256 -sign {key_file} | base64 -w 0"
        signature = os.popen(cmd).read().replace("\n", "").replace("+", "-").replace("/", "_").rstrip("=")
        
        jwt = f"{sign_input}.{signature}"
        
        result = subprocess.run([
            "curl", "-s", "-X", "POST",
            "https://oauth2.googleapis.com/token",
            "-H", "Content-Type: application/x-www-form-urlencoded",
            "-d", f"grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion={jwt}"
        ], capture_output=True, text=True)
        resp = json.loads(result.stdout)
        return resp.get("access_token")
    finally:
        os.unlink(key_file)

def make_api_call(method, url, data=None, token=None):
    """Make HTTP API call"""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode() if data else None,
        headers=headers,
        method=method
    )
    
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode()}")
        raise

def main():
    print("="*60)
    print("Update Google Sheet - CV HTML Links (Column M)")
    print("="*60)
    
    # Build company mapping
    print("\nBuilding company-to-folder mapping...")
    company_map = build_company_folder_mapping()
    print(f"✅ Mapped {len(company_map)} companies")
    
    print("\nGetting access token...")
    token = get_token_with_curl()
    if not token:
        print("❌ Failed to get access token")
        return
    print("✅ Got access token")
    
    # Read the spreadsheet
    sheet_name = "Sheet1"
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{sheet_name}!A1:N60"
    values_data = make_api_call("GET", url, token=token)
    
    values = values_data.get("values", [])
    print(f"\nTotal rows: {len(values)}")
    
    # Header is row 0
    headers = values[0]
    print(f"Headers: {headers}")
    
    # Prepare updates for Column M
    updates = []
    unmatched = []
    
    for row_idx in range(1, len(values)):
        row = values[row_idx]
        sheet_row = row_idx + 1  # 1-based
        
        # Get company name from column A
        company = str(row[0]).strip() if len(row) > 0 else ""
        
        if not company or company == "Company":
            continue
        
        # Find matching folder
        folder = find_best_match(company, company_map)
        
        if folder:
            cv_html_url = f"{GITHUB_RAW_BASE}/{folder}/CV.html"
            # Create HYPERLINK formula for HTML - replacing PDF with HTML
            cv_html_formula = f'=HYPERLINK("{cv_html_url}", "🌐 View CV (HTML/PDF)")'
            
            updates.append({
                "range": f"{sheet_name}!M{sheet_row}",
                "values": [[cv_html_formula]]
            })
            print(f"✓ Row {sheet_row}: '{company}' -> {folder}")
        else:
            unmatched.append((sheet_row, company))
            print(f"✗ Row {sheet_row}: '{company}' -> NO MATCH")
    
    print(f"\n{'='*60}")
    print(f"Matched: {len(updates)}")
    print(f"Unmatched: {len(unmatched)}")
    print(f"{'='*60}")
    
    if unmatched:
        print("\nUnmatched companies:")
        for row, company in unmatched:
            print(f"  Row {row}: {company}")
    
    # Apply batch update
    if updates:
        url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values:batchUpdate"
        body = {
            "valueInputOption": "USER_ENTERED",
            "data": updates
        }
        result = make_api_call("POST", url, body, token)
        print(f"\n✅ Updated {result.get('totalUpdatedCells', 0)} cells")
        print(f"✅ Updated {result.get('totalUpdatedRows', 0)} rows")
    
    print("\n" + "="*60)
    print("✅ All CV HTML HYPERLINK formulas applied to Column M!")
    print("="*60)

if __name__ == "__main__":
    main()
