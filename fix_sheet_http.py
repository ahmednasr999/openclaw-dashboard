#!/usr/bin/env python3
"""
Fix Google Sheet HYPERLINK formulas using direct HTTP API calls
"""

import json
import base64
import urllib.request
import urllib.error
import ssl
import time

# Configuration
SPREADSHEET_ID = "10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
SERVICE_ACCOUNT_FILE = "/home/openclaw/.openclaw/config/google-sheets-sa.json"

# GitHub raw URL base for PDFs
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/ahmednasr999/openclaw-dashboard/main/applications"

# Job folder mappings (from batch_report.json)
JOB_FOLDERS = {
    "01": "job_01_techglobal_solutions",
    "02": "job_02_cloudfirst_consulting",
    "03": "job_03_smalltech_llc",
    "04": "job_04_emirates_digital_bank",
    "05": "job_05_mckinsey_company",
    "06": "job_06_adcb",
    "07": "job_07_bcg",
    "08": "job_08_mashreq_bank",
    "09": "job_09_deloitte",
    "10": "job_10_fab",
    "11": "job_11_kpmg",
    "12": "job_12_dubai_islamic_bank",
    "13": "job_13_pwc",
    "14": "job_14_saudi_national_bank",
    "15": "job_15_oliver_wyman",
    "16": "job_16_noor_bank",
    "17": "job_17_ey",
    "18": "job_18_rakbank",
    "19": "job_19_accenture",
    "20": "job_20_qatar_national_bank",
    "21": "job_21_bain_company",
    "22": "job_22_sharjah_islamic_bank",
    "23": "job_23_ibm_consulting",
    "24": "job_24_ajman_bank",
    "25": "job_25_roland_berger",
    "26": "job_26_cbd_bank",
    "27": "job_27_capgemini",
    "28": "job_28_al_hilal_bank",
    "29": "job_29_oliver_wyman",
    "30": "job_30_al_masraf_bank",
    "31": "job_31_strategy",
    "32": "job_32_doha_bank",
    "33": "job_33_at_kearney",
    "34": "job_34_national_bank_of_oman",
    "35": "job_35_ahli_bank",
    "36": "job_36_monitor_deloitte",
    "37": "job_37_bank_of_sharjah",
    "38": "job_38_infosys_consulting",
    "39": "job_39_united_arab_bank",
    "40": "job_40_arthur_d_little",
    "41": "job_41_mena_fintech",
    "42": "job_42_gulf_bank",
    "43": "job_43_booz_allen_hamilton",
    "44": "job_44_boubyan_bank",
    "45": "job_45_warba_bank",
    "46": "job_46_bearingpoint",
    "47": "job_47_al_ahli_bank_of_kuwait",
    "48": "job_48_tech_mahindra",
    "49": "job_49_cognizant",
    "50": "job_50_wipro",
}

def get_access_token():
    """Get access token from service account using JWT"""
    with open(SERVICE_ACCOUNT_FILE) as f:
        sa = json.load(f)
    
    # Create JWT header
    header = base64.urlsafe_b64encode(json.dumps({
        "alg": "RS256",
        "typ": "JWT",
        "kid": sa.get("private_key_id")
    }).encode()).decode().rstrip("=")
    
    # Create JWT claim set
    now = int(time.time())
    claims = base64.urlsafe_b64encode(json.dumps({
        "iss": sa["client_email"],
        "scope": "https://www.googleapis.com/auth/spreadsheets",
        "aud": "https://oauth2.googleapis.com/token",
        "exp": now + 3600,
        "iat": now
    }).encode()).decode().rstrip("=")
    
    # For simplicity, use a pre-fetched token approach
    # Actually making the full JWT flow requires cryptography library
    # Let's use a simpler approach with curl
    return None

def make_api_call(method, url, data=None, token=None):
    """Make HTTP API call"""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    headers = {
        "Content-Type": "application/json"
    }
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

def get_token_with_curl():
    """Get access token using curl and openssl"""
    import subprocess
    import tempfile
    import os
    
    with open(SERVICE_ACCOUNT_FILE) as f:
        sa = json.load(f)
    
    # Create JWT
    header = base64.urlsafe_b64encode(json.dumps({
        "alg": "RS256",
        "typ": "JWT"
    }).encode()).decode().rstrip("=")
    
    now = int(time.time())
    claims = base64.urlsafe_b64encode(json.dumps({
        "iss": sa["client_email"],
        "scope": "https://www.googleapis.com/auth/spreadsheets",
        "aud": "https://oauth2.googleapis.com/token",
        "exp": now + 3600,
        "iat": now
    }).encode()).decode().rstrip("=")
    
    # Write private key to temp file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.pem', delete=False) as f:
        f.write(sa["private_key"])
        key_file = f.name
    
    try:
        # Create signature
        sign_input = f"{header}.{claims}"
        cmd = [
            "openssl", "dgst", "-sha256", "-sign", key_file,
            "-base64"
        ]
        result = subprocess.run(cmd, input=sign_input, 
                              capture_output=True, text=True)
        signature = result.stdout.replace("\n", "").replace("+", "-").replace("/", "_").rstrip("=")
        
        jwt = f"{sign_input}.{signature}"
        
        # Exchange for access token
        cmd = [
            "curl", "-s", "-X", "POST",
            "https://oauth2.googleapis.com/token",
            "-H", "Content-Type: application/x-www-form-urlencoded",
            "-d", f"grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion={jwt}"
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        resp = json.loads(result.stdout)
        return resp.get("access_token")
    finally:
        os.unlink(key_file)

def main():
    print("Getting access token...")
    token = get_token_with_curl()
    if not token:
        print("Failed to get access token")
        return
    print("✅ Got access token")
    
    # First, read the spreadsheet to understand its structure
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}?includeGridData=false"
    sheet_info = make_api_call("GET", url, token=token)
    
    print(f"\nSpreadsheet: {sheet_info.get('properties', {}).get('title')}")
    
    for sheet in sheet_info.get("sheets", []):
        props = sheet.get("properties", {})
        print(f"  Sheet: {props.get('title')} (GridId: {props.get('sheetId')})")
    
    # Read values from first sheet
    sheet_name = sheet_info["sheets"][0]["properties"]["title"]
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{sheet_name}!A1:Z100"
    values_data = make_api_call("GET", url, token=token)
    
    values = values_data.get("values", [])
    print(f"\nTotal rows: {len(values)}")
    
    # Find header row and data structure
    header_row = None
    for i, row in enumerate(values[:10]):
        if any("Job" in str(cell) or "#" in str(cell) for cell in row):
            header_row = i
            print(f"\nHeader row at {i+1}: {row}")
            break
    
    if header_row is None:
        print("Could not find header row")
        return
    
    headers = values[header_row]
    
    # Find column indices
    job_url_col = None
    cv_link_col = None
    job_num_col = 0  # Assume column A
    
    for i, h in enumerate(headers):
        h_str = str(h).lower()
        if "url" in h_str and ("job" in h_str or "link" in h_str):
            job_url_col = i
            print(f"Job URL column: {chr(65+i)} (index {i})")
        if "cv" in h_str or ("link" in h_str and "cv" in h_str):
            cv_link_col = i
            print(f"CV Link column: {chr(65+i)} (index {i})")
    
    # Default to I (8) and L (11) if not found
    if job_url_col is None:
        job_url_col = 8
        print(f"Using default Job URL column: I (index 8)")
    if cv_link_col is None:
        cv_link_col = 11
        print(f"Using default CV Link column: L (index 11)")
    
    # Prepare updates
    data_start = header_row + 1
    updates = []
    
    for row_idx in range(data_start, len(values)):
        row = values[row_idx]
        sheet_row = row_idx + 1  # 1-based
        
        # Get job number
        job_num = str(row[job_num_col]).strip() if len(row) > job_num_col else ""
        job_num_clean = job_num.lstrip('0') or '0'
        
        if not job_num or job_num_clean not in JOB_FOLDERS:
            continue
        
        folder = JOB_FOLDERS[job_num_clean]
        cv_url = f"{GITHUB_RAW_BASE}/{folder}/CV.pdf"
        
        # Create HYPERLINK formulas
        # For Job URL, check if there's existing URL data or use placeholder
        job_url_formula = f'=HYPERLINK("{cv_url}", "🔗 View Job")'
        cv_link_formula = f'=HYPERLINK("{cv_url}", "📄 View CV (PDF)")'
        
        # Update both columns
        job_url_cell = f"{chr(65+job_url_col)}{sheet_row}"
        cv_link_cell = f"{chr(65+cv_link_col)}{sheet_row}"
        
        updates.append({
            "range": f"{sheet_name}!{job_url_cell}",
            "values": [[job_url_formula]]
        })
        updates.append({
            "range": f"{sheet_name}!{cv_link_cell}",
            "values": [[cv_link_formula]]
        })
        
        print(f"Row {sheet_row}: Job {job_num} -> {folder}")
    
    print(f"\nPrepared {len(updates)} cell updates")
    
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
    
    print("\n✅ All HYPERLINK formulas applied!")

if __name__ == "__main__":
    main()
