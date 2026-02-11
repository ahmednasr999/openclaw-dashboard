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
    
    // First get spreadsheet info to find correct sheet name
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });
    
    console.log('Available sheets:');
    for (const sheet of spreadsheet.data.sheets) {
      console.log(`  - "${sheet.properties.title}"`);
    }
    
    const targetSheet = spreadsheet.data.sheets.find(
      s => s.properties.title === 'Sheet1'
    );
    
    if (!targetSheet) {
      console.log('\nSheet "Job Applications" not found!');
      return;
    }
    
    const sheetName = targetSheet.properties.title;
    console.log(`\nUsing sheet: "${sheetName}"`);
    
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:I`
    });
    
    const values = result.data.values || [];
    
    if (!values.length) {
      console.log('No data found in sheet');
      return;
    }
    
    console.log(`\nTotal rows in sheet: ${values.length}`);
    
    const matches = [];
    for (let rowNum = 0; rowNum < values.length; rowNum++) {
      const row = values[rowNum];
      if (row.length < 2) continue;
      
      const company = row[1] || '';
      const jobUrl = row[8] || '';
      
      if (TARGET_COMPANIES.includes(company)) {
        matches.push({
          row: rowNum + 1,
          company: company,
          jobUrl: jobUrl || '(empty)'
        });
      }
    }
    
    console.log('\n' + '='.repeat(110));
    console.log(`${'Row'.padEnd(6)} | ${'Company'.padEnd(35)} | Job URL`);
    console.log('='.repeat(110));
    
    for (const match of matches) {
      console.log(`${String(match.row).padEnd(6)} | ${match.company.padEnd(35)} | ${match.jobUrl}`);
    }
    
    console.log('='.repeat(110));
    console.log(`\nFound ${matches.length} matching companies out of ${TARGET_COMPANIES.length} requested.`);
    
    const foundCompanies = new Set(matches.map(m => m.company));
    const notFound = TARGET_COMPANIES.filter(c => !foundCompanies.has(c));
    
    if (notFound.length) {
      console.log('\nCompanies NOT found in sheet:');
      for (const c of notFound) {
        console.log(`  - ${c}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
