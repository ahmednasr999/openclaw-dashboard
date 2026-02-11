const { google } = require('googleapis');
const fs = require('fs');

// Configuration
const SPREADSHEET_ID = '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA';
const SHEET_NAME = 'Sheet1';
const SERVICE_ACCOUNT_PATH = '/home/openclaw/.openclaw/config/google-sheets-sa.json';

async function getAuth() {
    const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
    return new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
}

async function readSheet(sheets, range) {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: range
    });
    return response.data.values || [];
}

async function main() {
    console.log('='.repeat(70));
    console.log('VERIFICATION: Checking all data rows');
    console.log('='.repeat(70));

    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Read all data
    const currentData = await readSheet(sheets, `${SHEET_NAME}!A1:M1000`);
    
    if (!currentData || currentData.length === 0) {
        console.log('ERROR: No data found!');
        return;
    }

    const headers = currentData[0];
    const dataRows = currentData.slice(1);
    
    // Count non-empty rows
    let nonEmptyRows = 0;
    const rowsWithData = [];
    
    for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        // Check if row has any non-empty cell
        const hasData = row && row.some(cell => cell && cell.toString().trim() !== '');
        if (hasData) {
            nonEmptyRows++;
            rowsWithData.push({ rowNum: i + 2, data: row });
        }
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total rows read: ${currentData.length}`);
    console.log(`   Header row: 1`);
    console.log(`   Data rows with content: ${nonEmptyRows}`);
    console.log(`   Empty rows: ${dataRows.length - nonEmptyRows}`);
    
    console.log(`\n📋 HEADERS (${headers.length} columns):`);
    headers.forEach((h, i) => {
        console.log(`   ${String.fromCharCode(65 + i)}. ${h}`);
    });
    
    console.log(`\n🔍 DATA VERIFICATION (showing ${Math.min(10, rowsWithData.length)} of ${rowsWithData.length} rows):`);
    rowsWithData.slice(0, 10).forEach(({ rowNum, data }) => {
        const company = data[0] || '(no company)';
        const role = data[1] || '(no role)';
        const status = data[2] || '(no status)';
        console.log(`   Row ${rowNum}: ${company.substring(0, 25).padEnd(27)} | ${role.substring(0, 30).padEnd(32)} | ${status}`);
    });
    
    // Check for expected vs actual structure
    const expectedHeaders = [
        'Company', 'Role', 'Status', 'Priority', 'CV Ready', 'Applied',
        'Applied Date', 'Follow-up Date', 'Job URL', 'Notes', 
        'Competitive Advantages', 'Deadline/Next Step', 'CV Link'
    ];
    
    console.log(`\n✅ STRUCTURE CHECK:`);
    let allMatch = true;
    expectedHeaders.forEach((expected, i) => {
        const actual = headers[i] || '(missing)';
        const match = expected === actual;
        if (!match) allMatch = false;
        const status = match ? '✓' : '✗';
        console.log(`   ${status} Column ${String.fromCharCode(65 + i)}: Expected "${expected}" | Got "${actual}"`);
    });
    
    if (allMatch) {
        console.log(`\n✅ SUCCESS: Sheet structure already matches the target format!`);
        console.log(`   No restructuring needed.`);
    } else {
        console.log(`\n⚠️ MISMATCH DETECTED: Restructuring required.`);
    }
    
    return { headers, rowsWithData, allMatch };
}

main().catch(console.error);
