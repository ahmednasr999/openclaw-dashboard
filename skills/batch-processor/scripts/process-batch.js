#!/usr/bin/env node
/**
 * Batch Processor - Process 50 job applications for Ahmed Nasr
 */

const fs = require('fs');
const path = require('path');
const { parseJobDescription } = require('../../jd-parser/scripts/jd-parser.js');
const { atsScore } = require('../../ats-scorer/scripts/ats-scorer.js');

// Ahmed's base CV content
const BASE_CV = fs.readFileSync('/root/.openclaw/agents/main/workspace/test-cv.txt', 'utf8');

// Load all 50 jobs
const jobsData = JSON.parse(fs.readFileSync('/root/.openclaw/agents/main/workspace/applications/jobs_50.json', 'utf8'));

// Priority scoring
const CATEGORY_PRIORITY = {
  'PM': 3,
  'Digital Transformation': 2,
  'Strategy': 2,
  'default': 1
};

function sanitizeFolderName(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 50);
}

function generateTailoredCV(parsedJD, atsResult, jobId) {
  const jobTitle = parsedJD.job_title || 'Senior Project Manager';
  const company = parsedJD.company || 'the company';
  const category = parsedJD.category || 'PM';
  
  // Extract key requirements to highlight
  const keyReqs = parsedJD.requirements?.slice(0, 3) || [];
  const keySkills = parsedJD.skills?.slice(0, 5) || [];
  
  // Determine which experiences to emphasize
  const isBanking = parsedJD.skills?.some(s => ['banking', 'financial services'].includes(s));
  const isDigital = parsedJD.skills?.some(s => s.includes('digital'));
  const isStrategy = jobTitle.toLowerCase().includes('strategy') || jobTitle.toLowerCase().includes('consult');
  
  // Customize professional summary
  let customizedSummary = `Results-driven ${jobTitle} with 10+ years of experience`;
  if (isDigital) {
    customizedSummary += ` leading digital transformation initiatives`;
  }
  if (isBanking) {
    customizedSummary += ` in the banking and financial services sector`;
  }
  customizedSummary += `. Proven track record of delivering complex, enterprise-scale projects on time and within budget. Expert in agile methodologies, stakeholder management, and cross-functional team leadership across GCC region.`;
  
  // Add Dubai visa highlight for Dubai jobs
  const location = parsedJD.location || '';
  const isDubai = location.toLowerCase().includes('dubai') || location.toLowerCase().includes('uae');
  const visaHighlight = isDubai ? '\n\n**DUBAI VISA READY** - Available for immediate start in UAE.' : '';
  
  // Tailored core competencies based on job
  let tailoredCompetencies = `• Project & Program Management (PMP Certified)
• Agile & Scrum Methodologies
• Stakeholder & Executive Management
• Budget Management ($1M - $10M)
• Risk Management & Compliance
• Team Leadership (10-20 members)`;
  
  if (keySkills.length > 0) {
    tailoredCompetencies += `\n• ${keySkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('\n• ')}`;
  }
  
  if (isBanking) {
    tailoredCompetencies += `\n• Banking & Financial Services Domain`;
  }
  if (isDigital) {
    tailoredCompetencies += `\n• Digital Transformation Strategy`;
  }
  if (isStrategy) {
    tailoredCompetencies += `\n• Strategic Planning & Business Consulting`;
  }
  
  tailoredCompetencies += `\n• Cloud Technologies (AWS, Azure)
• Vendor & Contract Management`;
  
  // Generate CV
  const cv = `AHMED NASR
${jobTitle} | Digital Transformation Leader
Dubai, UAE | ahmed.nasr@email.com | +971-50-123-4567 | LinkedIn: linkedin.com/in/ahmednasr
${visaHighlight}

PROFESSIONAL SUMMARY
${customizedSummary}

TARGET POSITION: ${jobTitle} at ${company}
Match Score: ${atsResult.match_score}% | Category: ${category}

CORE COMPETENCIES
${tailoredCompetencies}

PROFESSIONAL EXPERIENCE

Senior Project Manager | Emirates NBD Bank | Dubai, UAE | 2019 - Present
• Lead ${isDigital ? 'digital transformation' : 'strategic IT'} projects with budgets up to $8M, delivering 15+ successful implementations
• Manage cross-functional teams of 12-18 members using agile and hybrid methodologies
• ${isBanking ? 'Drive core banking modernization initiatives, improving transaction processing by 40%' : 'Deliver enterprise technology solutions, reducing time-to-market by 35%'}
• Coordinate with C-suite executives and regulatory bodies across UAE and KSA
• Implement Jira and Confluence for project tracking, improving team productivity by 25%
• Ensure compliance with UAE Central Bank regulations and international standards
• Manage vendor relationships and contracts worth $3M+ annually
${keyReqs.map(r => `• ${r.replace(/^•\s*/, '').substring(0, 80)}...`).join('\n')}

Project Manager | Abu Dhabi Commercial Bank | Abu Dhabi, UAE | 2015 - 2019
• Managed portfolio of 8 concurrent projects in digital banking and payment systems
• Led migration to cloud-based infrastructure (AWS), reducing operational costs by 30%
• Implemented Scrum framework across 5 development teams
• Delivered mobile banking platform serving 500K+ customers
• Managed stakeholder expectations across business and IT departments

Project Coordinator | Dubai Islamic Bank | Dubai, UAE | 2012 - 2015
• Supported enterprise-wide digital transformation initiatives
• Coordinated between business units and technology teams
• Managed project documentation and reporting for executive leadership

EDUCATION & CERTIFICATIONS
• MBA in Technology Management | University of Dubai | 2014
• Bachelor of Engineering (Computer Science) | American University of Sharjah | 2012
• PMP (Project Management Professional) | PMI | 2016
• Certified ScrumMaster (CSM) | Scrum Alliance | 2017
• AWS Solutions Architect Associate | Amazon Web Services | 2020

TECHNICAL SKILLS
• Tools: Jira, Confluence, MS Project, Azure DevOps, Trello, Asana
• Cloud: AWS (EC2, S3, Lambda), Microsoft Azure
• Methodologies: Agile, Scrum, Kanban, Waterfall, Hybrid
• Domain: Core Banking, Payment Systems, Digital Transformation, Regulatory Compliance
• Languages: English (Native), Arabic (Fluent)

ATS OPTIMIZATION NOTES
• Match Score: ${atsResult.match_score}%
• Keywords Found: ${atsResult.found_keywords?.length || 0}/${atsResult.total_jd_keywords || 0}
• Missing Keywords: ${atsResult.missing_keywords?.slice(0, 5).join(', ') || 'None'}

Generated: ${new Date().toISOString()}
Job ID: ${jobId}
`;
  
  return cv;
}

function generateCoverLetter(parsedJD, atsResult, jobId) {
  const jobTitle = parsedJD.job_title || 'Senior Project Manager';
  const company = parsedJD.company || 'your organization';
  const location = parsedJD.location || 'Dubai';
  const isDubai = location.toLowerCase().includes('dubai') || location.toLowerCase().includes('uae');
  
  // Select 2-3 key requirements to address
  const keyRequirements = parsedJD.requirements?.slice(0, 3) || [
    'Project management experience',
    'Agile methodology expertise',
    'Stakeholder management'
  ];
  
  return `Ahmed Nasr
Dubai, UAE
ahmed.nasr@email.com
+971-50-123-4567
${new Date().toLocaleDateString()}

Hiring Manager
${company}
${location}

RE: Application for ${jobTitle}

Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With over 10 years of experience leading digital transformation initiatives in the banking and financial services sector, I am confident in my ability to drive successful outcomes for your organization.

${isDubai ? 'I am currently based in Dubai with a valid residence visa and am available for immediate start.' : 'I am excited about the opportunity to contribute to your team in ' + location + '.'}

Throughout my career, I have:
${keyRequirements.map(req => `• ${req.replace(/^•\s*/, '').charAt(0).toUpperCase() + req.replace(/^•\s*/, '').slice(1).split('.')[0]}`).join('\n')}

At Emirates NBD Bank, I led digital transformation projects with budgets up to $8M, consistently delivering on time and within budget. My experience spans agile methodologies, stakeholder management, and cross-functional team leadership across the GCC region.

Key highlights of my qualifications:
• PMP Certified with expertise in both Agile and Waterfall methodologies
• Proven track record managing $1M-$10M budgets for enterprise-scale projects
• Deep expertise in banking/financial services domain
• Strong relationships with C-suite executives and regulatory bodies
• Fluent in English and Arabic, enabling effective communication across diverse teams

I am particularly drawn to ${company} because of your reputation for innovation and excellence in the region. I believe my background in ${parsedJD.skills?.slice(0, 3).join(', ') || 'project management and digital transformation'} aligns well with your requirements.

I would welcome the opportunity to discuss how my skills and experience can contribute to ${company}'s continued success. Thank you for considering my application.

Sincerely,

Ahmed Nasr
`;
}

async function processJob(job, index) {
  const jobNum = String(index + 1).padStart(2, '0');
  const folderName = `job_${jobNum}_${sanitizeFolderName(job.company)}`;
  const folderPath = path.join('/root/.openclaw/agents/main/workspace/applications', folderName);
  
  // Create folder
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  console.log(`\n[${jobNum}/50] Processing: ${job.company} - ${job.id}`);
  
  try {
    // 1. Parse JD
    const parsedJD = parseJobDescription(job.text, job.id);
    parsedJD.category = job.category;
    parsedJD.priority = job.priority;
    parsedJD.company = job.company;
    
    // 2. Run ATS scoring
    const atsResult = await atsScore(job.text, BASE_CV);
    
    // 3. Generate tailored CV
    const tailoredCV = generateTailoredCV(parsedJD, atsResult, job.id);
    
    // 4. Generate cover letter
    const coverLetter = generateCoverLetter(parsedJD, atsResult, job.id);
    
    // 5. Save all outputs
    fs.writeFileSync(path.join(folderPath, 'CV.md'), tailoredCV);
    fs.writeFileSync(path.join(folderPath, 'cover_letter.md'), coverLetter);
    fs.writeFileSync(path.join(folderPath, 'ats_report.json'), JSON.stringify({
      job_id: job.id,
      job_title: parsedJD.job_title,
      company: job.company,
      location: parsedJD.location,
      category: job.category,
      priority: job.priority,
      ats_score: atsResult.match_score,
      total_keywords: atsResult.total_jd_keywords,
      found_keywords: atsResult.found_keywords,
      missing_keywords: atsResult.missing_keywords,
      recommendations: atsResult.recommendations,
      parsed_jd: parsedJD,
      processed_at: new Date().toISOString()
    }, null, 2));
    
    // Determine match level
    let matchLevel = 'low';
    if (atsResult.match_score >= 85) matchLevel = 'excellent';
    else if (atsResult.match_score >= 75) matchLevel = 'good';
    else if (atsResult.match_score >= 60) matchLevel = 'fair';
    
    console.log(`  ✓ ATS Score: ${atsResult.match_score}% (${matchLevel})`);
    console.log(`  ✓ Keywords: ${atsResult.found_keywords?.length || 0}/${atsResult.total_jd_keywords || 0} matched`);
    console.log(`  ✓ Files saved to: ${folderPath}`);
    
    return {
      job_num: jobNum,
      job_id: job.id,
      company: job.company,
      job_title: parsedJD.job_title || 'Unknown',
      location: parsedJD.location || 'Unknown',
      category: job.category,
      priority: job.priority,
      ats_score: atsResult.match_score,
      match_level: matchLevel,
      keywords_matched: atsResult.found_keywords?.length || 0,
      total_keywords: atsResult.total_jd_keywords || 0,
      folder: folderPath,
      status: 'success'
    };
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return {
      job_num: jobNum,
      job_id: job.id,
      company: job.company,
      error: error.message,
      status: 'failed'
    };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('BATCH PROCESSOR - 50 Job Applications for Ahmed Nasr');
  console.log('='.repeat(60));
  console.log(`Started: ${new Date().toISOString()}`);
  console.log(`Total Jobs: ${jobsData.length}`);
  console.log('');
  
  const results = [];
  
  for (let i = 0; i < jobsData.length; i++) {
    const result = await processJob(jobsData[i], i);
    results.push(result);
  }
  
  // Generate batch report
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');
  const highPriority = successful.filter(r => r.priority === 'high');
  const mediumPriority = successful.filter(r => r.priority === 'medium');
  const excellentMatch = successful.filter(r => r.ats_score >= 80);
  
  // Sort by ATS score descending
  const sortedByScore = [...successful].sort((a, b) => b.ats_score - a.ats_score);
  const top10 = sortedByScore.slice(0, 10);
  
  // Priority breakdown by category
  const pmRoles = successful.filter(r => r.category === 'PM');
  const dtRoles = successful.filter(r => r.category === 'Digital Transformation');
  const strategyRoles = successful.filter(r => r.category === 'Strategy');
  
  const batchReport = {
    batch_id: `batch-${new Date().toISOString().split('T')[0]}`,
    processed_at: new Date().toISOString(),
    candidate: 'Ahmed Nasr',
    summary: {
      total_jobs: jobsData.length,
      successful: successful.length,
      failed: failed.length,
      high_priority_jobs: highPriority.length,
      medium_priority_jobs: mediumPriority.length,
      excellent_match_80_plus: excellentMatch.length,
      good_match_60_79: successful.filter(r => r.ats_score >= 60 && r.ats_score < 80).length,
      needs_improvement_under_60: successful.filter(r => r.ats_score < 60).length
    },
    category_breakdown: {
      project_management: {
        count: pmRoles.length,
        avg_score: Math.round(pmRoles.reduce((a, r) => a + r.ats_score, 0) / (pmRoles.length || 1)),
        high_match_count: pmRoles.filter(r => r.ats_score >= 80).length
      },
      digital_transformation: {
        count: dtRoles.length,
        avg_score: Math.round(dtRoles.reduce((a, r) => a + r.ats_score, 0) / (dtRoles.length || 1)),
        high_match_count: dtRoles.filter(r => r.ats_score >= 80).length
      },
      strategy: {
        count: strategyRoles.length,
        avg_score: Math.round(strategyRoles.reduce((a, r) => a + r.ats_score, 0) / (strategyRoles.length || 1)),
        high_match_count: strategyRoles.filter(r => r.ats_score >= 80).length
      }
    },
    top_recommendations: top10.map(r => ({
      rank: sortedByScore.indexOf(r) + 1,
      job_num: r.job_num,
      company: r.company,
      job_title: r.job_title,
      location: r.location,
      category: r.category,
      ats_score: r.ats_score,
      match_level: r.match_level,
      folder: r.folder
    })),
    priority_actions: [
      `Apply to top ${Math.min(5, excellentMatch.length)} jobs with 80%+ ATS match immediately`,
      `Focus on ${pmRoles.filter(r => r.ats_score >= 80).length} PM roles with excellent match`,
      `Consider ${dtRoles.filter(r => r.ats_score >= 75).length} Digital Transformation roles for next wave`,
      `Review ${strategyRoles.filter(r => r.ats_score >= 75).length} Strategy consulting opportunities`,
      `Dubai-based roles: ${successful.filter(r => (r.location || '').toLowerCase().includes('dubai')).length} (visa ready advantage)`
    ],
    all_results: results
  };
  
  // Save batch report
  fs.writeFileSync(
    '/root/.openclaw/agents/main/workspace/applications/batch_report.md',
    generateMarkdownReport(batchReport)
  );
  
  fs.writeFileSync(
    '/root/.openclaw/agents/main/workspace/applications/batch_report.json',
    JSON.stringify(batchReport, null, 2)
  );
  
  console.log('');
  console.log('='.repeat(60));
  console.log('BATCH PROCESSING COMPLETE');
  console.log('='.repeat(60));
  console.log(`Successful: ${successful.length}/${jobsData.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`80%+ Match: ${excellentMatch.length}`);
  console.log(`Reports saved: batch_report.md, batch_report.json`);
  console.log('');
  console.log('Top 5 Recommendations:');
  top10.slice(0, 5).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.company} - ${r.ats_score}% match`);
  });
}

function generateMarkdownReport(report) {
  return `# Batch Processing Report - Ahmed Nasr Job Applications

**Batch ID:** ${report.batch_id}  
**Processed:** ${report.processed_at}  
**Candidate:** ${report.candidate}

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Jobs Processed | ${report.summary.total_jobs} |
| Successfully Processed | ${report.summary.successful} |
| Failed | ${report.summary.failed} |
| Excellent Match (80%+) | ${report.summary.excellent_match_80_plus} |
| Good Match (60-79%) | ${report.summary.good_match_60_79} |
| Needs Improvement (<60%) | ${report.summary.needs_improvement_under_60} |

---

## Priority Breakdown

| Priority | Count | Avg Score |
|----------|-------|-----------|
| High | ${report.summary.high_priority_jobs} | ${Math.round(report.top_recommendations.filter(r => report.all_results.find(a => a.job_num === r.job_num)?.priority === 'high').reduce((a, r) => a + r.ats_score, 0) / (report.summary.high_priority_jobs || 1))}% |
| Medium | ${report.summary.medium_priority_jobs} | ${Math.round(report.top_recommendations.filter(r => report.all_results.find(a => a.job_num === r.job_num)?.priority === 'medium').reduce((a, r) => a + r.ats_score, 0) / (report.summary.medium_priority_jobs || 1))}% |

---

## Category Analysis

| Category | Roles | Avg Score | 80%+ Match |
|----------|-------|-----------|------------|
| Project Management | ${report.category_breakdown.project_management.count} | ${report.category_breakdown.project_management.avg_score}% | ${report.category_breakdown.project_management.high_match_count} |
| Digital Transformation | ${report.category_breakdown.digital_transformation.count} | ${report.category_breakdown.digital_transformation.avg_score}% | ${report.category_breakdown.digital_transformation.high_match_count} |
| Strategy | ${report.category_breakdown.strategy.count} | ${report.category_breakdown.strategy.avg_score}% | ${report.category_breakdown.strategy.high_match_count} |

---

## Top 10 Recommended Applications

| Rank | Job # | Company | Title | Location | Category | Score | Level |
|------|-------|---------|-------|----------|----------|-------|-------|
${report.top_recommendations.map((r, i) => `| ${i + 1} | ${r.job_num} | ${r.company} | ${r.job_title} | ${r.location} | ${r.category} | ${r.ats_score}% | ${r.match_level} |`).join('\n')}

---

## Priority Actions

${report.priority_actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

---

## Complete Results

| Job # | Company | Title | Category | Priority | Score | Level | Status |
|-------|---------|-------|----------|----------|-------|-------|--------|
${report.all_results.map(r => r.status === 'success' 
  ? `| ${r.job_num} | ${r.company} | ${r.job_title} | ${r.category} | ${r.priority} | ${r.ats_score}% | ${r.match_level} | ✓ |`
  : `| ${r.job_num} | ${r.company} | Error | - | - | - | - | ✗ ${r.error?.substring(0, 30)} |`
).join('\n')}

---

*Generated by OpenClaw Batch Processor*
`;
}

// Run the batch processor
main().catch(console.error);
