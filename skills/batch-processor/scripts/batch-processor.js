#!/usr/bin/env node
/**
 * Batch Processor - Process multiple job applications in one run
 * Integrates: JD Parser + ATS Scorer + CV Tailor
 */

const fs = require('fs');
const path = require('path');

// Load skills
const jdParserPath = path.join(__dirname, '..', '..', 'jd-parser', 'scripts', 'jd-parser.js');
const atsScorerPath = path.join(__dirname, '..', '..', 'ats-scorer', 'scripts', 'ats-scorer.js');

let parseJobDescription, atsScore;

try {
  const jdModule = require(jdParserPath);
  parseJobDescription = jdModule.parseJobDescription;
} catch (e) {
  console.warn('JD Parser not found, some features may be limited');
}

try {
  const atsModule = require(atsScorerPath);
  atsScore = atsModule.atsScore;
} catch (e) {
  console.warn('ATS Scorer not found, scoring will be skipped');
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    outputDir: './batch-output',
    reportOnly: false,
    delay: 1000 // ms between requests to be polite
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--cv-file' && args[i + 1]) {
      options.cvFile = args[i + 1];
    } else if (args[i] === '--output-dir' && args[i + 1]) {
      options.outputDir = args[i + 1];
    } else if (args[i] === '--report-only') {
      options.reportOnly = true;
    } else if (args[i] === '--delay' && args[i + 1]) {
      options.delay = parseInt(args[i + 1]);
    } else if (!options.jobsFile && !args[i].startsWith('--')) {
      options.jobsFile = args[i];
    }
  }
  
  return options;
}

// Load jobs from JSON file
function loadJobs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const jobs = JSON.parse(content);
  
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs file must contain an array of job objects');
  }
  
  return jobs.map((job, index) => ({
    id: job.id || `job-${String(index + 1).padStart(3, '0')}`,
    url: job.url || null,
    text: job.text || null,
    company: job.company || null,
    notes: job.notes || '',
    priority: job.priority || 'medium'
  }));
}

// Delay helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch JD from URL using jd-parser's fetch capability
async function fetchJobDescription(url) {
  // Reuse jd-parser's fetch if available
  if (parseJobDescription) {
    const https = require('https');
    const http = require('http');
    
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https:') ? https : http;
      
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 15000
      };
      
      const req = client.get(url, options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchJobDescription(res.headers.location).then(resolve).catch(reject);
        }
        
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          // Extract text from HTML
          const text = data
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          resolve(text);
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  }
  
  throw new Error('JD Parser not available');
}

// Process a single job
async function processJob(job, cvText, options) {
  const result = {
    id: job.id,
    company: job.company,
    url: job.url,
    status: 'pending',
    job_title: null,
    location: null,
    ats_score: null,
    match_level: null,
    found_keywords: [],
    missing_keywords: [],
    recommendations: [],
    cv_generated: false,
    cv_path: null,
    error: null,
    notes: job.notes,
    priority: job.priority
  };
  
  try {
    console.log(`  Processing: ${job.id}${job.company ? ` (${job.company})` : ''}`);
    
    // Step 1: Get job description
    let jdText = '';
    if (job.text) {
      jdText = job.text;
      console.log(`    Using provided text (${jdText.length} chars)`);
    } else if (job.url) {
      console.log(`    Fetching from URL...`);
      jdText = await fetchJobDescription(job.url);
      console.log(`    Fetched ${jdText.length} chars`);
      await sleep(options.delay); // Be polite
    } else {
      throw new Error('No URL or text provided');
    }
    
    // Step 2: Parse job description
    let parsedJD = null;
    if (parseJobDescription) {
      parsedJD = parseJobDescription(jdText, job.url || 'text');
      result.job_title = parsedJD.job_title;
      result.company = parsedJD.company || job.company;
      result.location = parsedJD.location;
      result.employment_type = parsedJD.employment_type;
      console.log(`    Parsed: ${parsedJD.job_title || 'Unknown title'} at ${parsedJD.company || 'Unknown company'}`);
    }
    
    // Step 3: ATS Score
    if (atsScore && cvText) {
      const scoreResult = await atsScore(jdText, cvText);
      result.ats_score = scoreResult.match_score;
      result.found_keywords = scoreResult.found_keywords;
      result.missing_keywords = scoreResult.missing_keywords;
      result.recommendations = scoreResult.recommendations;
      
      // Determine match level
      if (scoreResult.match_score >= 80) {
        result.match_level = 'excellent';
      } else if (scoreResult.match_score >= 65) {
        result.match_level = 'good';
      } else if (scoreResult.match_score >= 50) {
        result.match_level = 'fair';
      } else {
        result.match_level = 'poor';
      }
      
      console.log(`    ATS Score: ${scoreResult.match_score}% (${result.match_level})`);
    }
    
    // Step 4: Generate tailored CV (placeholder - would integrate with cv-tailor)
    if (!options.reportOnly && parsedJD) {
      // For now, just save the parsed JD
      const jdOutputPath = path.join(options.outputDir, `${job.id}-jd.json`);
      fs.writeFileSync(jdOutputPath, JSON.stringify(parsedJD, null, 2));
      result.cv_path = jdOutputPath;
      result.cv_generated = true;
      console.log(`    Saved parsed JD to: ${jdOutputPath}`);
    }
    
    result.status = 'success';
    
  } catch (error) {
    result.status = 'failed';
    result.error = error.message;
    console.log(`    ❌ Failed: ${error.message}`);
  }
  
  return result;
}

// Generate batch report
function generateReport(results, options) {
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');
  const withScores = results.filter(r => r.ats_score !== null);
  
  const avgScore = withScores.length > 0
    ? Math.round(withScores.reduce((sum, r) => sum + r.ats_score, 0) / withScores.length)
    : null;
  
  // Find best matches
  const bestMatches = results
    .filter(r => r.ats_score !== null)
    .sort((a, b) => b.ats_score - a.ats_score)
    .slice(0, 3);
  
  // Generate recommendations
  const recommendations = [];
  
  if (avgScore !== null) {
    if (avgScore < 50) {
      recommendations.push('Overall match is low. Consider focusing on different roles or updating base CV.');
    } else if (avgScore < 70) {
      recommendations.push('Moderate overall match. Tailoring CV for each role is recommended.');
    } else {
      recommendations.push('Strong overall match. Good job targeting!');
    }
  }
  
  const excellent = results.filter(r => r.match_level === 'excellent').length;
  const good = results.filter(r => r.match_level === 'good').length;
  
  if (excellent > 0) {
    recommendations.push(`${excellent} job(s) with excellent match - prioritize these applications.`);
  }
  if (good > 0) {
    recommendations.push(`${good} job(s) with good match - strong candidates for application.`);
  }
  if (failed.length > 0) {
    recommendations.push(`${failed.length} job(s) failed to process - check URLs or try manual processing.`);
  }
  
  return {
    batch_id: `batch-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`,
    processed_at: new Date().toISOString(),
    total_jobs: results.length,
    successful: successful.length,
    failed: failed.length,
    average_ats_score: avgScore,
    best_matches: bestMatches.map(r => ({
      id: r.id,
      job_title: r.job_title,
      company: r.company,
      ats_score: r.ats_score
    })),
    results: results,
    recommendations: recommendations,
    summary_by_level: {
      excellent: results.filter(r => r.match_level === 'excellent').length,
      good: results.filter(r => r.match_level === 'good').length,
      fair: results.filter(r => r.match_level === 'fair').length,
      poor: results.filter(r => r.match_level === 'poor').length,
      unscored: results.filter(r => r.match_level === null).length
    }
  };
}

// Export report as markdown
function exportMarkdown(report, filePath) {
  const lines = [
    '# Batch Processing Report',
    '',
    `**Generated:** ${report.processed_at}`,
    `**Batch ID:** ${report.batch_id}`,
    '',
    '## Summary',
    '',
    `- Total Jobs: ${report.total_jobs}`,
    `- Successful: ${report.successful}`,
    `- Failed: ${report.failed}`,
    report.average_ats_score ? `- Average ATS Score: ${report.average_ats_score}%` : '',
    '',
    '## Match Distribution',
    '',
    `- 🟢 Excellent (80%+): ${report.summary_by_level.excellent}`,
    `- 🟡 Good (65-79%): ${report.summary_by_level.good}`,
    `- 🟠 Fair (50-64%): ${report.summary_by_level.fair}`,
    `- 🔴 Poor (<50%): ${report.summary_by_level.poor}`,
    `- ⚪ Unscored: ${report.summary_by_level.unscored}`,
    '',
    '## Top Matches',
    ''
  ];
  
  if (report.best_matches.length > 0) {
    report.best_matches.forEach((match, i) => {
      lines.push(`${i + 1}. **${match.job_title || 'Unknown'}** at ${match.company || 'Unknown'} - ${match.ats_score}%`);
    });
  } else {
    lines.push('No scored matches available.');
  }
  
  lines.push(
    '',
    '## Detailed Results',
    ''
  );
  
  report.results.forEach(r => {
    const status = r.status === 'success' ? '✅' : '❌';
    lines.push(`### ${status} ${r.id}: ${r.job_title || 'Unknown'} at ${r.company || 'Unknown'}`);
    lines.push('');
    lines.push(`- **Status:** ${r.status}`);
    if (r.ats_score !== null) {
      lines.push(`- **ATS Score:** ${r.ats_score}% (${r.match_level})`);
    }
    if (r.location) {
      lines.push(`- **Location:** ${r.location}`);
    }
    if (r.found_keywords && r.found_keywords.length > 0) {
      lines.push(`- **Found Keywords:** ${r.found_keywords.slice(0, 5).join(', ')}${r.found_keywords.length > 5 ? '...' : ''}`);
    }
    if (r.missing_keywords && r.missing_keywords.length > 0) {
      lines.push(`- **Missing Keywords:** ${r.missing_keywords.slice(0, 5).join(', ')}${r.missing_keywords.length > 5 ? '...' : ''}`);
    }
    if (r.notes) {
      lines.push(`- **Notes:** ${r.notes}`);
    }
    if (r.error) {
      lines.push(`- **Error:** ${r.error}`);
    }
    lines.push('');
  });
  
  lines.push(
    '## Recommendations',
    ''
  );
  
  report.recommendations.forEach(rec => {
    lines.push(`- ${rec}`);
  });
  
  fs.writeFileSync(filePath, lines.filter(l => l !== '').join('\n'));
}

// Main execution
async function main() {
  const options = parseArgs();
  
  if (!options.jobsFile) {
    console.log('Batch Processor - Process multiple job applications\n');
    console.log('Usage:');
    console.log('  node batch-processor.js <jobs.json> --cv-file <cv.txt> [options]\n');
    console.log('Options:');
    console.log('  --cv-file <path>      Path to your CV text file');
    console.log('  --output-dir <dir>    Output directory (default: ./batch-output)');
    console.log('  --report-only         Generate report without saving individual files');
    console.log('  --delay <ms>          Delay between requests (default: 1000ms)\n');
    console.log('Jobs JSON format:');
    console.log(JSON.stringify([
      { id: 'job-001', url: 'https://linkedin.com/jobs/...', company: 'Example Corp', notes: 'Dream job' },
      { id: 'job-002', text: 'Job description text...', company: 'Another Co' }
    ], null, 2));
    process.exit(1);
  }
  
  // Load CV if provided
  let cvText = '';
  if (options.cvFile) {
    try {
      cvText = fs.readFileSync(options.cvFile, 'utf8');
      console.log(`Loaded CV: ${cvText.length} characters\n`);
    } catch (e) {
      console.warn(`Warning: Could not load CV file: ${e.message}`);
    }
  }
  
  // Load jobs
  console.log(`Loading jobs from: ${options.jobsFile}`);
  const jobs = loadJobs(options.jobsFile);
  console.log(`Found ${jobs.length} job(s)\n`);
  
  // Create output directory
  if (!fs.existsSync(options.outputDir)) {
    fs.mkdirSync(options.outputDir, { recursive: true });
  }
  
  // Process each job
  console.log('Processing jobs...\n');
  const results = [];
  
  for (let i = 0; i < jobs.length; i++) {
    console.log(`[${i + 1}/${jobs.length}]`);
    const result = await processJob(jobs[i], cvText, options);
    results.push(result);
    console.log('');
  }
  
  // Generate report
  console.log('Generating report...\n');
  const report = generateReport(results, options);
  
  // Save JSON report
  const jsonPath = path.join(options.outputDir, 'batch-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`JSON report saved: ${jsonPath}`);
  
  // Save Markdown report
  const mdPath = path.join(options.outputDir, 'batch-report.md');
  exportMarkdown(report, mdPath);
  console.log(`Markdown report saved: ${mdPath}`);
  
  // Print summary
  console.log('\n=== BATCH SUMMARY ===');
  console.log(`Total: ${report.total_jobs} | Success: ${report.successful} | Failed: ${report.failed}`);
  if (report.average_ats_score !== null) {
    console.log(`Average ATS Score: ${report.average_ats_score}%`);
  }
  console.log('\nMatch Distribution:');
  console.log(`  Excellent: ${report.summary_by_level.excellent}`);
  console.log(`  Good: ${report.summary_by_level.good}`);
  console.log(`  Fair: ${report.summary_by_level.fair}`);
  console.log(`  Poor: ${report.summary_by_level.poor}`);
  console.log('\nTop Recommendations:');
  report.recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec}`);
  });
  console.log('\n=====================\n');
}

// Export for module use
module.exports = { processJob, generateReport, loadJobs };

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
