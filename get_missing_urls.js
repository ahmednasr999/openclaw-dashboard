const { google } = require('googleapis');
const fs = require('fs');

const SPREADSHEET_ID = '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA';
const SA_PATH = '/home/openclaw/.openclaw/config/google-sheets-sa.json';

const TARGET_COMPANIES = [
  'Confidential Company',
  'Bisher & Partners',
  'Confidential - Construction/EPC',
  'New Metrics',
  'American Express Saudi Arabia',
  'RiskPod',
  'Banking Client',
  'Government/Public Sector Client',
  'Al Masraf Bank',
  'PwC Strategy&'
];

async function getSheetsService() {
  const credentials = JSON.parse(fs.readFileSync(SA_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
  return google.sheets({ version: 'v4', auth });
}

async function main() {
  try {
    const sheets = await getSheetsService();
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `Sheet1!A2:I80`,
      valueRenderOption: 'FORMULA'
    });
    
    const rows = result.data.values || [];
    
    console.log('🔍 Searching for 10 companies without CV folders...\n');
    console.log('='.repeat(120));
    console.log('Row | Company | Role | Job URL');
    console.log('='.repeat(120));
    
    let found = 0;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const company = row[0] || '';
      const role = row[1] || '';
      const jobUrlCell = row[8] || '';
      
      // Check if this company matches any target (including partial matches)
      const matchedTarget = TARGET_COMPANIES.find(target => 
        company.toLowerCase().includes(target.toLowerCase()) ||
        target.toLowerCase().includes(company.toLowerCase())
      );
      
      if (matchedTarget) {
        found++;
        // Extract URL from HYPERLINK formula if present
        let jobUrl = jobUrlCell;
        const hyperlinkMatch = jobUrlCell.match(/HYPERLINK\("([^"]+)"/);
        if (hyperlinkMatch) {
          jobUrl = hyperlinkMatch[1];
        }
        
        console.log(`${String(i+2).padEnd(4)} | ${company.padEnd(35)} | ${role.substring(0, 30).padEnd(30)} | ${jobUrl.substring(0, 60)}`);
      }
    }
    
    console.log('='.repeat(120));
    console.log(`\n✅ Found ${found} companies`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
