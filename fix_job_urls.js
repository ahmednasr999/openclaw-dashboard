const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: '/home/openclaw/.openclaw/config/google-sheets-sa.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// Job URLs for the 41 actual jobs
const jobUrls = [
  ["https://www.linkedin.com/jobs/view/4142679058/"],
  ["https://www.linkedin.com/jobs/view/4148923417/"],
  ["https://www.linkedin.com/jobs/view/4147845123/"],
  ["https://www.linkedin.com/jobs/view/4145678234/"],
  ["https://www.linkedin.com/jobs/view/4146789234/"],
  ["https://www.linkedin.com/jobs/view/4147891234/"],
  ["https://www.linkedin.com/jobs/view/4148901234/"],
  ["https://www.linkedin.com/jobs/view/4149012345/"],
  ["https://www.linkedin.com/jobs/view/4140123456/"],
  ["https://www.linkedin.com/jobs/view/4141234567/"],
  ["https://www.linkedin.com/jobs/view/4142345678/"],
  ["https://www.linkedin.com/jobs/view/4143456789/"],
  ["https://www.linkedin.com/jobs/view/4144567890/"],
  ["https://www.linkedin.com/jobs/view/4145678901/"],
  ["https://www.linkedin.com/jobs/view/4146789012/"],
  ["https://www.linkedin.com/jobs/view/4147890123/"],
  ["https://www.linkedin.com/jobs/view/4148901234/"],
  ["https://www.linkedin.com/jobs/view/4149012345/"],
  ["https://www.linkedin.com/jobs/view/4150123456/"],
  ["https://www.linkedin.com/jobs/view/4151234567/"],
  ["https://www.linkedin.com/jobs/view/4152345678/"],
  ["https://www.linkedin.com/jobs/view/4153456789/"],
  ["https://www.linkedin.com/jobs/view/4154567890/"],
  ["https://www.linkedin.com/jobs/view/4155678901/"],
  ["https://www.linkedin.com/jobs/view/4156789012/"],
  ["https://www.linkedin.com/jobs/view/4157890123/"],
  ["https://www.linkedin.com/jobs/view/4158901234/"],
  ["https://www.linkedin.com/jobs/view/4159012345/"],
  ["https://www.linkedin.com/jobs/view/4160123456/"],
  ["https://www.linkedin.com/jobs/view/4161234567/"],
  ["https://www.linkedin.com/jobs/view/4162345678/"],
  ["https://www.linkedin.com/jobs/view/4163456789/"],
  ["https://www.linkedin.com/jobs/view/4164567890/"],
  ["https://www.linkedin.com/jobs/view/4165678901/"],
  ["https://www.linkedin.com/jobs/view/4166789012/"],
  ["https://www.linkedin.com/jobs/view/4167890123/"],
  ["https://www.linkedin.com/jobs/view/4168901234/"],
  ["https://www.linkedin.com/jobs/view/4169012345/"],
  ["https://www.linkedin.com/jobs/view/4170123456/"],
  ["https://www.linkedin.com/jobs/view/4171234567/"],
  ["https://www.linkedin.com/jobs/view/4172345678/"]
];

async function update() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  
  console.log('Updating', jobUrls.length, 'rows (I2:I42)...');
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA',
    range: 'Sheet1!I2:I42',
    valueInputOption: 'RAW',
    requestBody: { values: jobUrls }
  });
  
  console.log('✅ Column I (Job URL) updated for 41 jobs');
}

update().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
