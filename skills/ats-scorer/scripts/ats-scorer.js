#!/usr/bin/env node
/**
 * ATS Scorer - Local keyword matching (no API cost)
 */

const fs = require('fs');

// Common ATS keywords by category
const KEYWORD_CATEGORIES = {
  project_management: [
    'project management', 'program management', 'portfolio management',
    'pmp', 'agile', 'scrum', 'kanban', 'waterfall', 'hybrid',
    'jira', 'ms project', 'asana', 'trello', 'monday.com',
    'stakeholder management', 'risk management', 'change management',
    'budget management', 'vendor management', 'resource allocation'
  ],
  
  technical: [
    'digital transformation', 'ai', 'machine learning', 'ml',
    'automation', 'workflow optimization', 'process improvement',
    'data analysis', 'sql', 'python', 'tableau', 'power bi',
    'cloud', 'aws', 'azure', 'gcp', 'devops', 'ci/cd'
  ],
  
  leadership: [
    'team leadership', 'cross-functional', 'matrix organization',
    'executive reporting', 'c-suite', 'board presentation',
    'strategic planning', 'roadmap', 'vision', 'mission'
  ],
  
  banking_finance: [
    'banking', 'financial services', 'fintech', 'payment systems',
    'core banking', 't24', 'temenos', 'finacle',
    'risk compliance', 'regulatory', 'audit', 'governance',
    'roi', 'cost benefit analysis', 'budget', 'forecasting'
  ],
  
  healthcare: [
    'healthcare', 'clinical', 'patient care', 'hospital',
    'ehr', 'emr', 'hipaa', 'health informatics',
    'medical devices', 'pharma', 'lifesciences'
  ],
  
  gcc_regional: [
    'gcc', 'mena', 'middle east', 'uae', 'dubai', 'saudi', 'riyadh',
    'arabic', 'localization', 'government', 'public sector'
  ],
  
  soft_skills: [
    'communication', 'negotiation', 'influencing', 'conflict resolution',
    'problem solving', 'critical thinking', 'decision making',
    'adaptability', 'resilience', 'emotional intelligence'
  ]
};

// Flatten all keywords
const ALL_KEYWORDS = Object.values(KEYWORD_CATEGORIES).flat();

function extractKeywords(text) {
  /**
   * Extract keywords from job description
   */
  const found = [];
  const lowerText = text.toLowerCase();
  
  ALL_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword.toLowerCase())) {
      found.push(keyword);
    }
  });
  
  // Also extract years of experience requirements
  const yearMatches = text.match(/(\d+)\+?\s*years?/gi) || [];
  const years = yearMatches.map(m => m.toLowerCase());
  
  // Extract degree requirements
  const degreeMatches = text.match(/\b(mba|bachelor|master|phd|pmp|csm|aws|azure)\b/gi) || [];
  const degrees = degreeMatches.map(m => m.toLowerCase());
  
  return [...new Set([...found, ...years, ...degrees])];
}

function scoreCV(cvText, jdKeywords) {
  /**
   * Score CV against JD keywords
   */
  const cvLower = cvText.toLowerCase();
  const found = [];
  const missing = [];
  
  jdKeywords.forEach(keyword => {
    if (cvLower.includes(keyword.toLowerCase())) {
      found.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  const score = jdKeywords.length > 0 
    ? Math.round((found.length / jdKeywords.length) * 100)
    : 0;
  
  return {
    match_score: score,
    found_keywords: found,
    missing_keywords: missing
  };
}

function generateRecommendations(missingKeywords, cvText) {
  /**
   * Generate recommendations for missing keywords
   */
  const recommendations = [];
  
  // Group by category
  const categorized = {};
  missingKeywords.forEach(kw => {
    for (const [category, keywords] of Object.entries(KEYWORD_CATEGORIES)) {
      if (keywords.includes(kw)) {
        if (!categorized[category]) categorized[category] = [];
        categorized[category].push(kw);
        break;
      }
    }
  });
  
  // Generate recommendations
  if (categorized.project_management) {
    recommendations.push(`Add PM keywords: ${categorized.project_management.slice(0, 3).join(', ')}`);
  }
  if (categorized.technical) {
    recommendations.push(`Include technical terms: ${categorized.technical.slice(0, 3).join(', ')}`);
  }
  if (categorized.leadership) {
    recommendations.push(`Highlight leadership: ${categorized.leadership.slice(0, 3).join(', ')}`);
  }
  if (categorized.banking_finance) {
    recommendations.push(`Add banking/finance: ${categorized.banking_finance.slice(0, 3).join(', ')}`);
  }
  
  // General recommendations
  if (missingKeywords.length > 5) {
    recommendations.push(`High keyword gap (${missingKeywords.length} missing). Consider tailoring more specifically.`);
  }
  
  return recommendations.slice(0, 5); // Max 5 recommendations
}

async function atsScore(jdText, cvText) {
  /**
   * Main scoring function
   */
  const jdKeywords = extractKeywords(jdText);
  const score = scoreCV(cvText, jdKeywords);
  const recommendations = generateRecommendations(score.missing_keywords, cvText);
  
  return {
    ...score,
    total_jd_keywords: jdKeywords.length,
    recommendations: recommendations
  };
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node ats-scorer.js <job_description_file> <cv_file>');
    console.log('Example: node ats-scorer.js jd.txt cv.txt');
    process.exit(1);
  }
  
  try {
    const jdText = fs.readFileSync(args[0], 'utf8');
    const cvText = fs.readFileSync(args[1], 'utf8');
    
    atsScore(jdText, cvText).then(result => {
      console.log('\n=== ATS SCORE REPORT ===\n');
      console.log(`Match Score: ${result.match_score}%`);
      console.log(`Total JD Keywords: ${result.total_jd_keywords}`);
      console.log(`Found: ${result.found_keywords.length}`);
      console.log(`Missing: ${result.missing_keywords.length}`);
      console.log('\n✅ Found Keywords:');
      console.log(result.found_keywords.join(', ') || 'None');
      console.log('\n❌ Missing Keywords:');
      console.log(result.missing_keywords.join(', ') || 'None');
      console.log('\n💡 Recommendations:');
      result.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
      console.log('\n========================\n');
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = { atsScore, extractKeywords, scoreCV };
