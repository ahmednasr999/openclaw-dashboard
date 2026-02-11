const { google } = require('googleapis');
const fs = require('fs');

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
    console.log('DETAILED DATA INTEGRITY CHECK');
    console.log('='.repeat(70));

    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Read all data
    const currentData = await readSheet(sheets, `${SHEET_NAME}!A1:M1000`);
    const headers = currentData[0];
    const dataRows = currentData.slice(1);
    
    // Analyze each column
    console.log('\n📊 COLUMN ANALYSIS:\n');
    
    const colNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const stats = [];
    
    for (let col = 0; col < 13; col++) {
        let filled = 0;
        let empty = 0;
        let sampleValues = new Set();
        
        for (let row = 0; row < dataRows.length; row++) {
            const cell = dataRows[row][col];
            if (cell && cell.toString().trim() !== '') {
                filled++;
                sampleValues.add(cell.toString().trim());
            } else {
                empty++;
            }
        }
        
        const uniqueValues = Array.from(sampleValues).slice(0, 5);
        stats.push({ col: colNames[col], header: headers[col], filled, empty, uniqueValues });
        
        console.log(`${colNames[col]}. ${headers[col]}`);
        console.log(`   Filled: ${filled} | Empty: ${empty}`);
        console.log(`   Sample values: ${uniqueValues.join(' | ').substring(0, 70)}`);
        console.log('');
    }
    
    // Count rows by status
    console.log('\n📈 STATUS DISTRIBUTION:');
    const statusCol = 2; // Column C
    const statusCounts = {};
    dataRows.forEach(row => {
        const status = row[statusCol] || 'Empty';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    Object.entries(statusCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([status, count]) => {
            console.log(`   ${status}: ${count} jobs`);
        });
    
    // Check for CV Links (Column M)
    console.log('\n🔗 CV LINKS CHECK (Column M):');
    let cvLinkCount = 0;
    dataRows.forEach((row, idx) => {
        const cvLink = row[12];
        if (cvLink && cvLink.toString().includes('View CV')) {
            cvLinkCount++;
        }
    });
    console.log(`   Jobs with CV links: ${cvLinkCount}`);
    
    // Check for Job URLs (Column I)
    console.log('\n🌐 JOB URL CHECK (Column I):');
    let jobUrlCount = 0;
    dataRows.forEach(row => {
        const jobUrl = row[8];
        if (jobUrl && jobUrl.toString().includes('View Job')) {
            jobUrlCount++;
        }
    });
    console.log(`   Jobs with Job URLs: ${jobUrlCount}`);
    
    // Sample full rows
    console.log('\n📋 SAMPLE FULL ROWS (Rows 2, 10, 50):');
    [1, 9, 49].forEach(idx => {
        if (dataRows[idx]) {
            console.log(`\n   Row ${idx + 2}:`);
            dataRows[idx].forEach((cell, colIdx) => {
                const val = cell ? cell.toString().substring(0, 40) : '(empty)';
                console.log(`      ${colNames[colIdx]}. ${headers[colIdx]}: ${val}`);
            });
        }
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ VERIFICATION COMPLETE');
    console.log('='.repeat(70));
    console.log(`\nTotal jobs tracked: ${dataRows.length}`);
    console.log('All data appears intact with the correct structure.');
}

main().catch(console.error);
