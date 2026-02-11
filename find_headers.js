const { google } = require('googleapis');
const fs = require('fs');

const SPREADSHEET_ID = '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA';
const SA_PATH = '/home/openclaw/.openclaw/config/google-sheets-sa.json';

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
      range: `Sheet1!A1:M5`
    });
    
    const values = result.data.values || [];
    console.log('Headers (Row 1):');
    const headers = values[0];
    headers.forEach((h, i) => {
      const col = String.fromCharCode(65 + i);
      console.log(`  ${col}: ${h}`);
    });
    
    console.log('\nSearching for companies...');
    const allData = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `Sheet1!A1:M80`
    });
    
    const rows = allData.data.values || [];
    const headers2 = rows[0];
    const companyCol = headers2.findIndex(h => h && h.toString().toLowerCase().includes('company'));
    
    if (companyCol >= 0) {
      console.log(`\nCompany column found: ${String.fromCharCode(65 + companyCol)} (index ${companyCol})`);
      console.log('\nSample companies:');
      for (let i = 1; i < Math.min(15, rows.length); i++) {
        const company = rows[i][companyCol] || '(empty)';
        const jobUrl = rows[i][8] || '(empty)';
        console.log(`Row ${i+1}: ${company} | URL: ${jobUrl.substring(0, 50)}...`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
