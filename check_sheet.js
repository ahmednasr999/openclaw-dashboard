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
      range: `Sheet1!A1:I100`
    });
    
    const values = result.data.values || [];
    console.log('First 10 rows (showing Row, Company, Job URL):\n');
    console.log('Row | Company | Job URL');
    console.log('---|---------|--------');
    
    for (let i = 0; i < Math.min(100, values.length); i++) {
      const row = values[i];
      const company = row[1] || '(empty)';
      const url = row[8] || '(empty)';
      console.log(`${i+1} | ${company} | ${url.substring(0, 60)}...`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
