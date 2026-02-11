#!/usr/bin/env python3
"""
Fix remaining rows in Google Sheet
"""

import json
import subprocess
import urllib.request
import urllib.error
import ssl

SPREADSHEET_ID = "10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
GITHUB_BASE = "https://raw.githubusercontent.com/ahmednasr999/openclaw-dashboard/main/applications"

def get_token():
    result = subprocess.run(
        ["/root/.openclaw/agents/main/workspace/get_token.sh"],
        capture_output=True, text=True
    )
    return result.stdout.strip()

def api_call(method, url, data=None, token=None):
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
        error_body = e.read().decode()
        print(f"HTTP Error {e.code}: {error_body}")
        raise

def get_job_folder(company, row_num):
    """Get job folder based on company and row number"""
    # Special cases for duplicate companies
    if company == "Oliver Wyman":
        return "job_15_oliver_wyman" if row_num <= 30 else "job_29_oliver_wyman"
    if company == "Emirates Digital Bank":
        return "job_04_emirates_digital_bank"
    if company == "ADCB":
        return "job_06_adcb"
    if company == "FAB":
        return "job_10_fab"
    if company == "Saudi National Bank":
        return "job_14_saudi_national_bank"
    if company == "TechGlobal Solutions":
        return "job_01_techglobal_solutions"
    if company == "McKinsey & Company":
        return "job_05_mckinsey_company"
    if company == "BCG":
        return "job_07_bcg"
    if company == "PwC Strategy&" or company == "PwC":
        return "job_13_pwc"
    if company == "Mashreq Bank":
        return "job_08_mashreq_bank"
    if company == "Dubai Islamic Bank":
        return "job_12_dubai_islamic_bank"
    if company == "Deloitte":
        return "job_09_deloitte"
    if company == "KPMG":
        return "job_11_kpmg"
    if company == "CloudFirst Consulting":
        return "job_02_cloudfirst_consulting"
    if company == "SmallTech LLC":
        return "job_03_smalltech_llc"
    
    return None

def main():
    print("Getting access token...")
    token = get_token()
    print("✅ Got token")
    
    # Read rows 67-74 (the ones that weren't updated)
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/Sheet1!A67:N74"
    sheet_data = api_call("GET", url, token=token)
    
    values = sheet_data.get("values", [])
    print(f"\nRead {len(values)} rows")
    
    updates = []
    
    for row_offset, row in enumerate(values):
        sheet_row = 67 + row_offset
        
        if len(row) < 1:
            continue
        
        company = row[0].strip()
        if not company:
            continue
        
        # Check if already has HYPERLINK
        job_url_val = row[8] if len(row) > 8 else ""
        if "🔗" in job_url_val:
            print(f"  Row {sheet_row}: {company} - already updated, skipping")
            continue
        
        folder = get_job_folder(company, sheet_row)
        if not folder:
            print(f"  Row {sheet_row}: Unknown company '{company}'")
            continue
        
        # Generate URLs
        job_url = f"https://www.linkedin.com/jobs/search/?keywords={company.replace(' ', '+')}"
        cv_url = f"{GITHUB_BASE}/{folder}/CV.pdf"
        
        job_formula = f'=HYPERLINK("{job_url}", "🔗 View Job")'
        cv_formula = f'=HYPERLINK("{cv_url}", "📄 View CV (PDF)")'
        
        updates.append({
            "range": f"Sheet1!I{sheet_row}",
            "values": [[job_formula]]
        })
        updates.append({
            "range": f"Sheet1!M{sheet_row}",
            "values": [[cv_formula]]
        })
        
        print(f"Row {sheet_row}: {company} -> {folder}")
    
    print(f"\nPrepared {len(updates)} cell updates")
    
    if updates:
        url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values:batchUpdate"
        body = {
            "valueInputOption": "USER_ENTERED",
            "data": updates
        }
        
        print("\nSending batch update...")
        result = api_call("POST", url, body, token)
        
        print(f"✅ Updated {result.get('totalUpdatedCells', 0)} cells")
        print(f"✅ Updated {result.get('totalUpdatedRows', 0)} rows")
    
    print("\n✅ Done!")

if __name__ == "__main__":
    main()
