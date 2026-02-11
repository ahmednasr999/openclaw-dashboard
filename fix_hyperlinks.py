#!/usr/bin/env python3
"""
Fix Google Sheet HYPERLINK formulas using HTTP API
"""

import json
import subprocess
import urllib.request
import urllib.error
import ssl

# Configuration
SPREADSHEET_ID = "10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
SERVICE_ACCOUNT_FILE = "/home/openclaw/.openclaw/config/google-sheets-sa.json"
GITHUB_BASE = "https://raw.githubusercontent.com/ahmednasr999/openclaw-dashboard/main/applications"

# Job folder mappings
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

# Company to job number mapping
COMPANY_TO_JOB = {
    "TechGlobal Solutions": "01",
    "CloudFirst Consulting": "02",
    "SmallTech LLC": "03",
    "Emirates Digital Bank": "04",
    "McKinsey & Company": "05",
    "ADCB": "06",
    "BCG": "07",
    "Mashreq Bank": "08",
    "Deloitte": "09",
    "FAB": "10",
    "KPMG": "11",
    "Dubai Islamic Bank": "12",
    "PwC": "13",
    "Saudi National Bank": "14",
    "Noor Bank": "16",
    "EY": "17",
    "RAKBANK": "18",
    "Accenture": "19",
    "Qatar National Bank": "20",
    "Bain & Company": "21",
    "Sharjah Islamic Bank": "22",
    "IBM Consulting": "23",
    "Ajman Bank": "24",
    "Roland Berger": "25",
    "CBD Bank": "26",
    "Capgemini": "27",
    "Al Hilal Bank": "28",
    "Al Masraf Bank": "30",
    "Strategy&": "31",
    "Doha Bank": "32",
    "AT Kearney": "33",
    "National Bank of Oman": "34",
    "Ahli Bank": "35",
    "Monitor Deloitte": "36",
    "Bank of Sharjah": "37",
    "Infosys Consulting": "38",
    "United Arab Bank": "39",
    "Arthur D. Little": "40",
    "MENA Fintech": "41",
    "Gulf Bank": "42",
    "Booz Allen Hamilton": "43",
    "Boubyan Bank": "44",
    "Warba Bank": "45",
    "BearingPoint": "46",
    "Al Ahli Bank of Kuwait": "47",
    "Tech Mahindra": "48",
    "Cognizant": "49",
    "Wipro": "50",
}

# Oliver Wyman appears twice - at job 15 and 29
# We'll handle it specially based on row position

def get_token():
    """Get access token using shell script"""
    result = subprocess.run(
        ["/root/.openclaw/agents/main/workspace/get_token.sh"],
        capture_output=True, text=True
    )
    return result.stdout.strip()

def api_call(method, url, data=None, token=None):
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
        error_body = e.read().decode()
        print(f"HTTP Error {e.code}: {error_body}")
        raise

def main():
    print("Getting access token...")
    token = get_token()
    print("✅ Got token")
    
    # Read current sheet data (rows 10-60 to cover all 50 jobs)
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/Sheet1!A10:M70"
    sheet_data = api_call("GET", url, token=token)
    
    values = sheet_data.get("values", [])
    print(f"\nRead {len(values)} rows from sheet")
    
    # Build update requests
    updates = []
    oliver_wyman_count = 0
    
    for row_offset, row in enumerate(values):
        sheet_row = 10 + row_offset  # Actual sheet row number (1-based)
        
        if len(row) < 1:
            continue
        
        company = row[0].strip()
        if not company:
            continue
        
        # Get job number
        job_num = None
        if company == "Oliver Wyman":
            oliver_wyman_count += 1
            job_num = "15" if oliver_wyman_count == 1 else "29"
        else:
            job_num = COMPANY_TO_JOB.get(company)
        
        if not job_num:
            print(f"  Skipping row {sheet_row}: Unknown company '{company}'")
            continue
        
        folder = JOB_FOLDERS.get(job_num)
        if not folder:
            print(f"  Skipping row {sheet_row}: No folder for job {job_num}")
            continue
        
        # Generate URLs
        job_url = f"https://www.linkedin.com/jobs/search/?keywords={company.replace(' ', '+')}"
        cv_url = f"{GITHUB_BASE}/{folder}/CV.pdf"
        
        # Create HYPERLINK formulas
        job_formula = f'=HYPERLINK("{job_url}", "🔗 View Job")'
        cv_formula = f'=HYPERLINK("{cv_url}", "📄 View CV (PDF)")'
        
        # Add updates
        updates.append({
            "range": f"Sheet1!I{sheet_row}",
            "values": [[job_formula]]
        })
        updates.append({
            "range": f"Sheet1!M{sheet_row}",
            "values": [[cv_formula]]
        })
        
        print(f"Row {sheet_row}: {company} (Job {job_num}) -> {folder}")
    
    print(f"\nPrepared {len(updates)} cell updates")
    
    # Apply batch update in chunks (max 1000 cells per request, we have ~100)
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
        print(f"✅ Updated {result.get('totalUpdatedColumns', 0)} columns")
    
    print("\n✅ Done!")

if __name__ == "__main__":
    main()
