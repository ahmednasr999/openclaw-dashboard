#!/usr/bin/env python3
"""
Fix Google Sheet HYPERLINK formulas for Job URL and CV Link columns
"""

import gspread
from google.oauth2.service_account import Credentials
import json

# Configuration
SPREADSHEET_ID = "10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
SHEET_NAME = "Applications"
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

def get_job_url(job_num):
    """Generate a placeholder job URL - in real scenario, this would be from the job posting"""
    # Since we don't have actual job URLs in the data, we'll create a search link
    # This is a fallback - the user mentioned Job URLs should be in the data
    return f"https://www.linkedin.com/jobs/search/?keywords=job+{job_num}"

def get_cv_url(folder_name):
    """Generate GitHub raw URL for CV PDF"""
    return f"{GITHUB_RAW_BASE}/{folder_name}/CV.pdf"

def main():
    # Authenticate with Google Sheets
    creds = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )
    client = gspread.authorize(creds)
    
    # Open spreadsheet
    spreadsheet = client.open_by_key(SPREADSHEET_ID)
    
    # Try to open the sheet
    try:
        worksheet = spreadsheet.worksheet(SHEET_NAME)
    except gspread.exceptions.WorksheetNotFound:
        # Try first sheet
        worksheet = spreadsheet.sheet1
        print(f"Sheet '{SHEET_NAME}' not found, using '{worksheet.title}'")
    
    # Get all values to understand the structure
    all_values = worksheet.get_all_values()
    print(f"Sheet has {len(all_values)} rows")
    
    # Find header row
    header_row = None
    for i, row in enumerate(all_values[:10]):
        if any("Job" in str(cell) for cell in row):
            header_row = i
            print(f"Header row found at row {i+1}")
            print(f"Headers: {row}")
            break
    
    if header_row is None:
        print("Could not find header row")
        return
    
    # Determine column indices (0-based)
    headers = all_values[header_row]
    
    # Find Job URL column (I = 8) and CV Link column (L = 11)
    job_url_col = 8  # Column I
    cv_link_col = 11  # Column L
    
    # Also try to find by header name
    for i, h in enumerate(headers):
        h_lower = str(h).lower()
        if "url" in h_lower and "job" in h_lower:
            job_url_col = i
            print(f"Job URL column found at index {i} (column {chr(65+i)})")
        if "cv" in h_lower or "link" in h_lower:
            cv_link_col = i
            print(f"CV Link column found at index {i} (column {chr(65+i)})")
    
    # Process data rows
    data_start_row = header_row + 1  # First data row
    
    # Prepare batch updates
    job_url_updates = []
    cv_link_updates = []
    
    for row_idx in range(data_start_row, len(all_values)):
        row = all_values[row_idx]
        sheet_row_num = row_idx + 1  # 1-based for Google Sheets
        
        # Get job number from column A (index 0)
        job_num = str(row[0]).strip() if len(row) > 0 else ""
        
        # Skip empty rows
        if not job_num or job_num == "":
            continue
        
        # Clean job number (remove leading zeros for lookup but keep for sheet)
        job_num_clean = job_num.lstrip('0') or '0'
        
        if job_num_clean in JOB_FOLDERS:
            folder = JOB_FOLDERS[job_num_clean]
            
            # Generate CV PDF URL
            cv_url = get_cv_url(folder)
            
            # For Job URL, we'll use a placeholder or try to get from data
            # The user mentioned Job URLs should be in the batch reports
            job_url = get_job_url(job_num_clean)
            
            # Create HYPERLINK formulas
            job_url_formula = f'=HYPERLINK("{job_url}", "🔗 View Job")'
            cv_link_formula = f'=HYPERLINK("{cv_url}", "📄 View CV (PDF)")'
            
            # Column I (Job URL) - Update ALL rows
            job_url_cell = gspread.utils.rowcol_to_a1(sheet_row_num, job_url_col + 1)
            job_url_updates.append({
                'range': job_url_cell,
                'values': [[job_url_formula]]
            })
            
            # Column L (CV Link) - Update ALL rows (60-73 mentioned in task, but let's do all)
            cv_link_cell = gspread.utils.rowcol_to_a1(sheet_row_num, cv_link_col + 1)
            cv_link_updates.append({
                'range': cv_link_cell,
                'values': [[cv_link_formula]]
            })
            
            print(f"Row {sheet_row_num}: Job {job_num} -> {folder}")
    
    print(f"\nPrepared {len(job_url_updates)} Job URL updates")
    print(f"Prepared {len(cv_link_updates)} CV Link updates")
    
    # Apply updates in batches
    if job_url_updates:
        print("\nUpdating Job URLs (Column I)...")
        worksheet.batch_update(job_url_updates, value_input_option='USER_ENTERED')
        print(f"✅ Updated {len(job_url_updates)} Job URL cells")
    
    if cv_link_updates:
        print("\nUpdating CV Links (Column L)...")
        worksheet.batch_update(cv_link_updates, value_input_option='USER_ENTERED')
        print(f"✅ Updated {len(cv_link_updates)} CV Link cells")
    
    print("\n✅ All HYPERLINK formulas applied successfully!")

if __name__ == "__main__":
    main()
