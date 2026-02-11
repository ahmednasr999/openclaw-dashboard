#!/usr/bin/env python3
"""
Update Google Sheet Column M with CV HTML GitHub links
Spreadsheet ID: 10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA
"""

import os
import json
import glob
from pathlib import Path

# Configuration
SPREADSHEET_ID = "10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/ahmednasr999/openclaw-dashboard/master/applications"

def get_cv_html_links():
    """Generate list of CV HTML GitHub raw URLs"""
    workspace = Path('/root/.openclaw/agents/main/workspace')
    applications_dir = workspace / 'applications'
    
    # Find all CV.html files
    cv_html_files = sorted(glob.glob(str(applications_dir / 'job_*/CV.html')))
    
    links = []
    for cv_html_path in cv_html_files:
        cv_html_path = Path(cv_html_path)
        job_folder = cv_html_path.parent.name
        
        # Extract job number
        job_num = job_folder.split('_')[1]
        
        # Generate GitHub raw URL
        github_url = f"{GITHUB_RAW_BASE}/{job_folder}/CV.html"
        
        links.append({
            'job_number': job_num,
            'job_folder': job_folder,
            'github_url': github_url
        })
    
    return links

def generate_update_report(links):
    """Generate a report of links for manual update or API usage"""
    report_lines = [
        "# CV HTML Links for Google Sheet Update",
        f"# Spreadsheet ID: {SPREADSHEET_ID}",
        f"# Total CVs: {len(links)}",
        "# Column M should contain these hyperlinks",
        "",
        "| Row | Job # | Job Folder | GitHub HTML URL |",
        "|-----|-------|------------|-----------------|"
    ]
    
    for i, link in enumerate(links, start=2):  # Start at row 2 (assuming header in row 1)
        report_lines.append(f"| {i} | {link['job_number']} | {link['job_folder']} | {link['github_url']} |")
    
    return '\n'.join(report_lines)

def main():
    print("Generating CV HTML links for Google Sheet update...")
    print(f"Spreadsheet ID: {SPREADSHEET_ID}")
    
    links = get_cv_html_links()
    print(f"\nFound {len(links)} CV.html files")
    
    # Generate report
    report = generate_update_report(links)
    
    # Save report
    report_path = Path('/root/.openclaw/agents/main/workspace/CV_HTML_LINKS_UPDATE.md')
    with open(report_path, 'w') as f:
        f.write(report)
    
    print(f"\nReport saved to: {report_path}")
    print("\nSample links:")
    for link in links[:5]:
        print(f"  Job {link['job_number']}: {link['github_url']}")
    
    # Also create a simple CSV format for easy import
    csv_lines = ["Row,Job_Number,Job_Folder,CV_HTML_URL"]
    for i, link in enumerate(links, start=2):
        csv_lines.append(f"{i},{link['job_number']},{link['job_folder']},{link['github_url']}")
    
    csv_path = Path('/root/.openclaw/agents/main/workspace/cv_html_links.csv')
    with open(csv_path, 'w') as f:
        f.write('\n'.join(csv_lines))
    
    print(f"\nCSV saved to: {csv_path}")
    
    # Try to update via Google Sheets API if credentials available
    try:
        update_via_api(links)
    except Exception as e:
        print(f"\nAPI update failed (manual update may be needed): {e}")
    
    return links

def update_via_api(links):
    """Attempt to update Google Sheet via API"""
    # Check for service account
    sa_path = '/home/openclaw/.openclaw/config/google-sheets-sa.json'
    
    if not os.path.exists(sa_path):
        print(f"\nService account not found at {sa_path}")
        print("Please update Google Sheet manually using the CSV file")
        return False
    
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        
        # Load credentials
        credentials = service_account.Credentials.from_service_account_file(
            sa_path,
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        
        service = build('sheets', 'v4', credentials=credentials)
        
        # Prepare data for Column M (13th column)
        # Assuming data starts at row 2
        values = []
        for link in links:
            values.append([link['github_url']])
        
        # Update range M2:M{last_row}
        range_name = f"Sheet1!M2:M{len(links) + 1}"
        
        body = {
            'values': values
        }
        
        result = service.spreadsheets().values().update(
            spreadsheetId=SPREADSHEET_ID,
            range=range_name,
            valueInputOption='RAW',
            body=body
        ).execute()
        
        print(f"\n✓ Google Sheet updated successfully!")
        print(f"  Updated {result.get('updatedCells', 0)} cells in Column M")
        return True
        
    except ImportError:
        print("\nGoogle API libraries not installed. Install with:")
        print("  pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client")
        return False
    except Exception as e:
        print(f"\nError updating Google Sheet: {e}")
        return False

if __name__ == '__main__':
    main()
