const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Configuration
const SPREADSHEET_ID = '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA';
const SHEET_NAME = 'Sheet1';
const SERVICE_ACCOUNT_PATH = '/home/openclaw/.openclaw/config/google-sheets-sa.json';

// New column structure
const NEW_HEADERS = [
    'Company',           // A
    'Role',              // B
    'Status',            // C
    'Priority',          // D
    'CV Ready',          // E
    'Applied',           // F
    'Applied Date',      // G
    'Follow-up Date',    // H
    'Job URL',           // I
    'Notes',             // J
    'Competitive Advantages',  // K
    'Deadline/Next Step',      // L
    'CV Link'            // M
];

async function getAuth() {
    const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    return auth;
}

async function readSheet(sheets, range) {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: range
    });
    return response.data.values || [];
}

async function writeSheet(sheets, range, values) {
    const response = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values }
    });
    return response;
}

async function clearSheet(sheets, range) {
    await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: range
    });
}

async function main() {
    console.log('='.repeat(60));
    console.log('Google Sheet Restructuring Tool');
    console.log('='.repeat(60));

    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Step 1: Read current sheet
    console.log('\n[1/5] Reading current sheet data...');
    const currentData = await readSheet(sheets, `${SHEET_NAME}!A1:Z1000`);

    if (!currentData || currentData.length === 0) {
        console.log('ERROR: No data found in sheet!');
        return;
    }

    console.log(`   Found ${currentData.length} rows`);
    
    const oldHeaders = currentData[0] || [];
    const oldData = currentData.slice(1);

    console.log(`   Current headers (${oldHeaders.length}): ${oldHeaders.join(', ')}`);
    
    // Display first few rows for analysis
    console.log('\n   First 3 data rows (first 6 cols):');
    for (let i = 0; i < Math.min(3, oldData.length); i++) {
        console.log(`   Row ${i + 2}: ${oldData[i]?.slice(0, 6).join(' | ')}...`);
    }

    // Show all columns for each row
    console.log('\n   Full column analysis:');
    for (let i = 0; i < Math.min(3, oldData.length); i++) {
        const row = oldData[i] || [];
        console.log(`\n   Row ${i + 2} (${row.length} cols):`);
        row.forEach((cell, idx) => {
            const header = oldHeaders[idx] || `Col${idx + 1}`;
            const value = cell?.toString().substring(0, 40) || '(empty)';
            console.log(`      ${header}: ${value}`);
        });
    }

    return { oldHeaders, oldData };
}

main().catch(console.error);
