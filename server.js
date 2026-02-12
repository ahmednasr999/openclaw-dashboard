const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const https = require('https');

// Import helper functions
const {
    extractJobKeywords,
    extractJobTitle,
    generateTailoredSummary,
    generateTailoredCompetencies,
    generateTailoredExperience,
    generateProfessionalHTMLCV,
    generateEliteExecutivePackage,
    waitForDeployment
} = require('./server_helpers');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static('.'));

// Load CV reference
const cvReference = fs.readFileSync('Ahmed_Nasr_CV_Reference.md', 'utf8');

// Helper functions for company/role extraction
function extractCompany(jd) {
    const match = jd.match(/(?:at|with)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+|\n|$)/) ||
                  jd.match(/^([A-Z][A-Za-z0-9\s&]+?)\s*[-–]/);
    return match ? match[1].trim().replace(/\s+/g, '_') : 'Company';
}

function extractRole(jd) {
    const match = jd.match(/(?:hiring|seeking|for)\s+([A-Z][a-zA-Z\s]+?(?:Manager|Director|VP|Head|Lead|Engineer|Consultant|Analyst))/i) ||
                  jd.match(/^([A-Z][a-zA-Z\s]+?)\s*[-–]/);
    return match ? match[1].trim().replace(/\s+/g, '_').slice(0, 30) : 'Position';
}

// Extract ATS score from keyword match section
function extractATSScore(section3Content) {
    const scoreMatch = section3Content.match(/ATS Match Score[:\s]+(\d+)/i);
    if (scoreMatch) {
        return parseInt(scoreMatch[1]);
    }
    // Try to extract from range format (e.g., "85-90%")
    const rangeMatch = section3Content.match(/(\d+)[-\s]*(\d+)?\s*%/);
    if (rangeMatch) {
        const low = parseInt(rangeMatch[1]);
        const high = rangeMatch[2] ? parseInt(rangeMatch[2]) : low;
        return Math.round((low + high) / 2); // Return average
    }
    return 75; // Default if not found
}

// Extract fit rating from fit assessment section
function extractFitRating(section8Content) {
    const ratingMatch = section8Content.match(/Rating[:\s]+(STRONG|MODERATE|WEAK)/i);
    if (ratingMatch) {
        return ratingMatch[1].toUpperCase();
    }
    // Check for emoji indicators
    if (section8Content.includes('🔴') || section8Content.includes('⚠️')) {
        return 'WEAK';
    }
    if (section8Content.includes('🟡')) {
        return 'MODERATE';
    }
    if (section8Content.includes('✅') || section8Content.includes('✓')) {
        return 'STRONG';
    }
    return 'MODERATE'; // Default
}

// Extract honest assessment summary
function extractAssessment(section3Content, section8Content) {
    // Look for explicit assessment
    const assessmentMatch = section8Content.match(/(?:Recommendation|Assessment|Verdict)[:\s]+([^\n]+)/i);
    if (assessmentMatch) {
        return assessmentMatch[1].trim();
    }
    
    // Look for critical gaps
    const criticalGapMatch = section3Content.match(/critical gaps?[:\s]+([^\n]+)/i);
    if (criticalGapMatch) {
        return `Critical gaps identified: ${criticalGapMatch[1].trim()}`;
    }
    
    // Check for hiring likelihood
    const hiringMatch = section8Content.match(/hiring likelihood[:\s]+(\d+[-\s]*\d*%)/i);
    if (hiringMatch) {
        return `Hiring likelihood: ${hiringMatch[1]}. Consider if effort matches probability.`;
    }
    
    return 'Review the full analysis package for detailed gap assessment.';
}

function commitToGitHub(outputDir, folderName) {
    try {
        execSync('git add -A', { cwd: '.' });
        execSync(`git commit -m "feat: Add elite executive package for ${folderName}"`, { cwd: '.' });
        execSync('git push origin main', { cwd: '.' });
        console.log('✅ Committed to GitHub');
    } catch (error) {
        console.error('Git commit error:', error.message);
    }
}

async function addToGoogleSheet({ company, role, jobUrl, cvUrl, folder }) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: '/home/openclaw/.openclaw/config/google-sheets-sa.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });
        
        const spreadsheetId = '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA';
        
        const rowData = [
            company,
            role,
            'CV Ready',
            'High',
            'Yes',
            'No',
            '',
            '',
            jobUrl,
            'Elite Executive Package Generated',
            '20+ years, Digital transformation, PMP, CSM, CBAP, MBA',
            '',
            cvUrl
        ];
        
        await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: 'Sheet1!A:M',
            valueInputOption: 'RAW',
            requestBody: { values: [rowData] }
        });
        
        console.log('✅ Added to Google Sheet');
    } catch (error) {
        console.error('❌ Google Sheet error:', error.message);
    }
}

// Process job endpoint
app.post('/api/process-job', async (req, res) => {
    const { jobUrl, jobDescription, timestamp } = req.body;
    
    console.log('\n🚀 New job processing request');
    console.log('URL:', jobUrl);
    console.log('Timestamp:', timestamp);
    
    try {
        // Generate unique folder name
        const jobId = Date.now();
        const cleanCompany = extractCompany(jobDescription) || 'unknown';
        const cleanRole = extractRole(jobDescription) || 'position';
        const folderName = `job_${String(jobId).slice(-6)}_${cleanCompany}_${cleanRole}`.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 50);
        const outputDir = path.join('applications', folderName);
        
        console.log('Output directory:', outputDir);
        
        // Create directory
        fs.mkdirSync(outputDir, { recursive: true });
        
        // Generate Elite Executive Package
        console.log('📝 Generating Elite Executive Package...');
        const elitePackage = generateEliteExecutivePackage(jobDescription, jobUrl);
        
        // Save all sections
        fs.writeFileSync(path.join(outputDir, '01_EXECUTIVE_CV.md'), elitePackage.section1);
        fs.writeFileSync(path.join(outputDir, '02_COVER_LETTER.md'), elitePackage.section2);
        fs.writeFileSync(path.join(outputDir, '03_KEYWORD_MATCH.md'), elitePackage.section3);
        fs.writeFileSync(path.join(outputDir, '04_MISSING_KEYWORDS.md'), elitePackage.section4);
        fs.writeFileSync(path.join(outputDir, '05_GAP_CLOSURE.md'), elitePackage.section5);
        fs.writeFileSync(path.join(outputDir, '06_RECRUITER_OUTREACH.md'), elitePackage.section6);
        fs.writeFileSync(path.join(outputDir, '07_APPLICATION_STRATEGY.md'), elitePackage.section7);
        fs.writeFileSync(path.join(outputDir, '08_FIT_ASSESSMENT.md'), elitePackage.section8);
        fs.writeFileSync(path.join(outputDir, '09_FINAL_CV.md'), elitePackage.finalAssembly);
        fs.writeFileSync(path.join(outputDir, 'FULL_PACKAGE.md'), elitePackage.fullPackage);
        
        // Save professional HTML CV
        console.log('🎨 Generating Professional HTML CV...');
        const extractedJobTitle = extractJobTitle(jobDescription);
        const htmlCV = generateProfessionalHTMLCV(jobDescription, cleanCompany, cleanRole, extractedJobTitle);
        fs.writeFileSync(path.join(outputDir, 'CV.html'), htmlCV);
        console.log(`✓ CV.html tailored: "${extractedJobTitle} - Ahmed Nasr Resume"`);
        
        // Save job description
        fs.writeFileSync(path.join(outputDir, 'job_description.txt'), `Job URL: ${jobUrl}\n\n${jobDescription}`);
        
        // Commit to GitHub
        console.log('📤 Committing to GitHub...');
        commitToGitHub(outputDir, folderName);
        
        // Generate CV URLs
        const cvUrl = `https://ahmednasr999.github.io/openclaw-dashboard/${outputDir}/CV.html`;
        const packageUrl = `https://ahmednasr999.github.io/openclaw-dashboard/${outputDir}/FULL_PACKAGE.md`;
        
        // Wait for GitHub Pages deployment
        console.log('⏳ Waiting for GitHub Pages deployment...');
        await waitForDeployment(cvUrl);
        
        // Add to Google Sheet
        console.log('📊 Adding to Google Sheet...');
        await addToGoogleSheet({
            company: cleanCompany.replace(/_/g, ' '),
            role: cleanRole.replace(/_/g, ' '),
            jobUrl: jobUrl,
            cvUrl: cvUrl,
            folder: folderName
        });
        
        console.log('✅ Complete! Package generated:', folderName);
        
        // Extract ATS score from the generated content
        const atsScore = extractATSScore(elitePackage.section3);
        const fitRating = extractFitRating(elitePackage.section8);
        const atsAssessment = extractAssessment(elitePackage.section3, elitePackage.section8);
        
        res.json({
            success: true,
            cvUrl: cvUrl,
            folder: folderName,
            packageUrl: packageUrl,
            atsScore: atsScore,
            fitRating: fitRating,
            atsAssessment: atsAssessment,
            message: 'Elite Executive Package generated successfully'
        });
        
    } catch (error) {
        console.error('❌ Error processing job:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Elite Executive Package Generator
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🦞 CV Tailor Server running on http://localhost:${PORT}`);
    console.log(`📄 Job Processor: http://localhost:${PORT}/job-processor.html`);
    console.log('✅ Elite Executive Package generation enabled');
    console.log('\nPress Ctrl+C to stop\n');
});
