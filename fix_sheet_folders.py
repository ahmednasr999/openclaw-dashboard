#!/usr/bin/env python3
"""
Update Google Sheet Column M with correct folder paths matching GitHub repo structure.
"""

import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Configuration
SPREADSHEET_ID = '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA'
SHEET_NAME = 'Job Applications'
CREDENTIALS_PATH = '/home/openclaw/.openclaw/config/google-sheets-sa.json'

# Company name to folder mapping
COMPANY_FOLDERS = {
    'TechGlobal Solutions': 'job_01_techglobal_solutions',
    'CloudFirst Consulting': 'job_02_cloudfirst_consulting',
    'SmallTech LLC': 'job_03_smalltech_llc',
    'Emirates Digital Bank': 'job_04_emirates_digital_bank',
    'McKinsey & Company': 'job_05_mckinsey_company',
    'ADCB': 'job_06_adcb',
    'BCG': 'job_07_bcg',
    'Mashreq Bank': 'job_08_mashreq_bank',
    'Deloitte': 'job_09_deloitte',
    'FAB': 'job_10_fab',
    'KPMG': 'job_11_kpmg',
    'Dubai Islamic Bank': 'job_12_dubai_islamic_bank',
    'PwC': 'job_13_pwc',
    'Saudi National Bank': 'job_14_saudi_national_bank',
    'Oliver Wyman': 'job_15_oliver_wyman',
    'Noor Bank': 'job_16_noor_bank',
    'EY': 'job_17_ey',
    'RAKBANK': 'job_18_rakbank',
    'Accenture': 'job_19_accenture',
    'Qatar National Bank': 'job_20_qatar_national_bank',
    'Bain & Company': 'job_21_bain_company',
    'Sharjah Islamic Bank': 'job_22_sharjah_islamic_bank',
    'IBM Consulting': 'job_23_ibm_consulting',
    'Ajman Bank': 'job_24_ajman_bank',
    'Roland Berger': 'job_25_roland_berger',
    'CBD Bank': 'job_26_cbd_bank',
    'Capgemini': 'job_27_capgemini',
    'Al Hilal Bank': 'job_28_al_hilal_bank',
    'Strategy&': 'job_31_strategy',
    'Doha Bank': 'job_32_doha_bank',
    'AT Kearney': 'job_33_at_kearney',
    'National Bank of Oman': 'job_34_national_bank_of_oman',
    'Ahli Bank': 'job_35_ahli_bank',
    'Monitor Deloitte': 'job_36_monitor_deloitte',
    'Bank of Sharjah': 'job_37_bank_of_sharjah',
    'Infosys Consulting': 'job_38_infosys_consulting',
    'United Arab Bank': 'job_39_united_arab_bank',
    'Arthur D. Little': 'job_40_arthur_d_little',
    'MENA FinTech': 'job_41_mena_fintech',
    'Gulf Bank': 'job_42_gulf_bank',
    "Booz Allen Hamilton": 'job_43_booz_allen_hamilton',
    'Boubyan Bank': 'job_44_boubyan_bank',
    'Warba Bank': 'job_45_warba_bank',
    'BearingPoint': 'job_46_bearingpoint',
    'Al Ahli Bank of Kuwait': 'job_47_al_ahli_bank_of_kuwait',
    'Tech Mahindra': 'job_48_tech_mahindra',
    'Cognizant': 'job_49_cognizant',
    'Wipro': 'job_50_wipro',
}

def get_sheets_service():
    """Get Google Sheets service."""
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_PATH,
        scopes=['https://www.googleapis.com/auth/spreadsheets']
    )
    return build('sheets', 'v4', credentials=credentials)

def main():
    service = get_sheets_service()
    
    # Read Column B (Company names) and Column M (CV Links) for rows 10-73
    range_read = f"{SHEET_NAME}!B10:M73"
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=range_read,
        valueRenderOption='UNFORMATTED_VALUE'
    ).execute()
    
    rows = result.get('values', [])
    
    # Prepare updates
    updates = []
    for i, row in enumerate(rows):
        sheet_row = i + 10  # Actual sheet row number
        
        if len(row) < 1:
            continue
            
        company = row[0].strip() if row[0] else None
        if not company:
            continue
            
        folder = COMPANY_FOLDERS.get(company)
        if folder:
            # Update Column M with correct URL
            url = f"https://ahmednasr999.github.io/openclaw-dashboard/applications/{folder}/CV.html"
            formula = f'=HYPERLINK("{url}", "📄 View CV")'
            
            updates.append({
                'range': f"{SHEET_NAME}!M{sheet_row}",
                'values': [[formula]]
            })
            print(f"Row {sheet_row}: {company} → {folder}")
        else:
            print(f"Row {sheet_row}: {company} → NOT FOUND")
    
    if updates:
        # Batch update
        body = {'valueInputOption': 'USER_ENTERED', 'data': updates}
        result = service.spreadsheets().values().batchUpdate(
            spreadsheetId=SPREADSHEET_ID,
            body=body
        ).execute()
        print(f"\n✅ Updated {result.get('totalUpdatedCells', 0)} cells")
    else:
        print("\nNo updates needed")

if __name__ == '__main__':
    main()
