#!/usr/bin/env node
/**
 * JD Parser - Extract structured data from job descriptions
 * Local parsing only - no API calls
 */

const fs = require('fs');
const https = require('https');
const http = require('http');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      options.url = args[i + 1];
    } else if (args[i] === '--file' && args[i + 1]) {
      options.file = args[i + 1];
    } else if (args[i] === '--text' && args[i + 1]) {
      options.text = args[i + 1];
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[i + 1];
    }
  }
  
  return options;
}

// Fetch HTML from URL
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
      },
      timeout: 10000
    };
    
    const req = client.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirects
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Extract text from HTML (simple regex-based, no cheerio needed for basic extraction)
function extractTextFromHtml(html) {
  // Remove script and style tags
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  
  // Extract text content
  text = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return text;
}

// Extract job title
function extractJobTitle(text) {
  const patterns = [
    /(?:job title|position|role|title)[:\s]+([^\n\.]{3,80})/i,
    /^([^\n]{3,80}?(?:manager|engineer|developer|analyst|consultant|specialist|director|lead|architect|coordinator))/im,
    /(?:we are looking for|hiring|seeking)[:\s]*a[n]?\s+([^\n\.]{3,80}?)(?:\s+(?:to|who|with))/i,
    /([A-Z][^\n]{2,60}?(?:Manager|Engineer|Developer|Analyst|Consultant|Specialist|Director|Lead|Architect|Coordinator))/,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\s+/g, ' ');
    }
  }
  
  return null;
}

// Extract company name
function extractCompany(text) {
  const patterns = [
    /(?:company|organization|employer|at)[:\s]+([A-Z][^\n\.]{2,50})/i,
    /(?:join|about)\s+([A-Z][^\n\.]{2,50})/i,
    /([A-Z][A-Za-z0-9\s&]+(?:Inc|LLC|Ltd|Limited|Corp|Corporation|Company|Group))/,
    /(?:^|\n)\s*([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)?)\s+(?:is\s+(?:seeking|looking|hiring))/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\s+/g, ' ');
    }
  }
  
  return null;
}

// Extract location
function extractLocation(text) {
  const patterns = [
    /(?:location|based in|place)[:\s]+([^\n\.]{2,60})/i,
    /(?:remote|hybrid|onsite|on-site)\s*(?:\([^)]*\))?[:\s]*([^\n\.]{2,60})?/i,
    /\b(in|at)\s+([A-Z][a-z]+(?:,\s*[A-Z]{2})?(?:,\s*[A-Z][a-z]+)?)\b/,
    /\b(Dubai|Abu Dhabi|Riyadh|Jeddah|Doha|Kuwait City|Manama|Muscat|Cairo|London|New York|Singapore|Remote)\b/i,
    /\b([A-Z][a-z]+,\s*(?:UAE|Saudi Arabia|Qatar|Kuwait|Bahrain|Oman|USA|UK|Canada))\b/,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const location = (match[2] || match[1] || match[0]).trim();
      if (location.length > 2 && location.length < 60) {
        return location.replace(/\s+/g, ' ');
      }
    }
  }
  
  return null;
}

// Extract salary
function extractSalary(text) {
  const patterns = [
    /(?:salary|compensation|pay)[:\s]+([^\n\.]{5,40})/i,
    /(\$[\d,]+(?:\s*-\s*\$?[\d,]+)?(?:k|K)?(?:\s*(?:per year|annually|\/year|\/yr))?)/,
    /(\d{2,3}(?:,\d{3})?\s*(?:USD|EUR|GBP|AED|SAR|QAR))(?:\s*-\s*\d{2,3}(?:,\d{3})?)?/i,
    /(?:up to|starting at)\s+(\$?[\d,]+(?:k|K)?)/i,
    /(\d{3},\d{3}\s*-\s*\d{3},\d{3})/,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

// Extract employment type
function extractEmploymentType(text) {
  const types = ['full-time', 'full time', 'part-time', 'part time', 'contract', 
                 'temporary', 'permanent', 'freelance', 'internship', 'casual'];
  
  const lowerText = text.toLowerCase();
  for (const type of types) {
    if (lowerText.includes(type)) {
      return type.charAt(0).toUpperCase() + type.slice(1).replace('-', '-');
    }
  }
  
  return null;
}

// Extract requirements
function extractRequirements(text) {
  const sections = [
    /(?:requirements|required skills|what you need|qualifications? required|must have)[:\s]*([\s\S]*?)(?:\n\s*\n|responsibilities|about you|we offer|benefits|apply|$)/i,
    /(?:minimum qualifications?)[:\s]*([\s\S]*?)(?:\n\s*\n|preferred|requirements|responsibilities|$)/i,
  ];
  
  for (const pattern of sections) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseBulletPoints(match[1]);
    }
  }
  
  // Fallback: look for bullet points with requirement keywords
  const reqPattern = /(?:^|\n)\s*[•\-\*]\s*([^\n]{10,200}(?:required|must|essential|necessary|mandatory)[^\n]*)/gi;
  const matches = [...text.matchAll(reqPattern)];
  if (matches.length > 0) {
    return matches.map(m => m[1].trim()).slice(0, 10);
  }
  
  return [];
}

// Extract responsibilities
function extractResponsibilities(text) {
  const sections = [
    /(?:responsibilities|what you'll do|duties|the role|job description|in this role)[:\s]*([\s\S]*?)(?:\n\s*\n|requirements|qualifications|about you|we offer|benefits|apply|$)/i,
  ];
  
  for (const pattern of sections) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseBulletPoints(match[1]);
    }
  }
  
  // Fallback: look for action-oriented bullet points
  const respPattern = /(?:^|\n)\s*[•\-\*]\s*([^\n]{10,200}(?:manage|lead|develop|create|implement|coordinate|support|ensure|maintain)[^\n]*)/gi;
  const matches = [...text.matchAll(respPattern)];
  if (matches.length > 0) {
    return matches.map(m => m[1].trim()).slice(0, 10);
  }
  
  return [];
}

// Extract qualifications
function extractQualifications(text) {
  const sections = [
    /(?:qualifications?|education|academic|degree)[:\s]*([\s\S]*?)(?:\n\s*\n|experience|skills|requirements|$)/i,
  ];
  
  for (const pattern of sections) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseBulletPoints(match[1]);
    }
  }
  
  // Look for degree mentions
  const degreePattern = /\b(bachelor'?s?|master'?s?|mba|phd|doctorate|degree|certification)\s+(?:in|of)?\s*([^\n\.]{5,50})/gi;
  const matches = [...text.matchAll(degreePattern)];
  if (matches.length > 0) {
    return matches.map(m => `${m[1]} ${m[2]}`.trim());
  }
  
  return [];
}

// Extract skills
function extractSkills(text) {
  const skillKeywords = [
    'project management', 'agile', 'scrum', 'kanban', 'waterfall',
    'leadership', 'communication', 'stakeholder management', 'budget management',
    'risk management', 'change management', 'strategic planning',
    'data analysis', 'sql', 'python', 'excel', 'tableau', 'power bi',
    'jira', 'confluence', 'ms project', 'asana', 'trello',
    'aws', 'azure', 'gcp', 'cloud', 'devops', 'ci/cd',
    'machine learning', 'ai', 'automation', 'digital transformation',
    'negotiation', 'problem solving', 'critical thinking',
    'team management', 'cross-functional', 'vendor management',
    'financial analysis', 'forecasting', 'budgeting', 'reporting',
    'compliance', 'regulatory', 'governance', 'audit',
    'healthcare', 'banking', 'fintech', 'e-commerce',
    'english', 'arabic', 'bilingual',
    'pmp', 'prince2', 'csm', 'safe', 'itil',
    'javascript', 'typescript', 'react', 'node.js', 'java', 'c#', '.net',
  ];
  
  const found = [];
  const lowerText = text.toLowerCase();
  
  skillKeywords.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText) && !found.includes(skill)) {
      found.push(skill);
    }
  });
  
  return found;
}

// Extract years of experience
function extractExperienceYears(text) {
  const patterns = [
    /(\d+)\+?\s*(?:-\s*\d+\+?)?\s*years?(?:\s+of)?\s+(?:experience|exp)/i,
    /(?:minimum|at least|minimum of)\s+(\d+)\+?\s*years?/i,
    /(\d{1,2})\+?\s*years?\s+(?:in|of|working)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1] + '+';
    }
  }
  
  return null;
}

// Parse bullet points from text
function parseBulletPoints(text) {
  // Split by common bullet markers or newlines
  const bullets = text
    .split(/\n\s*[•\-\*•◦▪▫]\s*|\n\s*\d+[.\)]\s*|\n{2,}/)
    .map(line => line.trim())
    .filter(line => line.length > 10 && line.length < 300)
    .map(line => line.replace(/\s+/g, ' '));
  
  // If no bullets found, split by sentences that look like requirements
  if (bullets.length === 0) {
    const sentences = text
      .split(/[.\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 15 && s.length < 200)
      .slice(0, 8);
    return sentences;
  }
  
  return bullets.slice(0, 10);
}

// Main parse function
function parseJobDescription(text, source = 'text') {
  const result = {
    job_title: extractJobTitle(text),
    company: extractCompany(text),
    location: extractLocation(text),
    salary: extractSalary(text),
    employment_type: extractEmploymentType(text),
    requirements: extractRequirements(text),
    responsibilities: extractResponsibilities(text),
    qualifications: extractQualifications(text),
    skills: extractSkills(text),
    experience_years: extractExperienceYears(text),
    source: source,
    parsed_at: new Date().toISOString(),
    raw_text: text.slice(0, 5000) // Keep first 5000 chars
  };
  
  return result;
}

// Main execution
async function main() {
  const options = parseArgs();
  
  let text = '';
  let source = 'text';
  
  try {
    if (options.url) {
      console.log(`Fetching job from: ${options.url}`);
      const html = await fetchUrl(options.url);
      text = extractTextFromHtml(html);
      source = options.url;
    } else if (options.file) {
      text = fs.readFileSync(options.file, 'utf8');
      source = options.file;
    } else if (options.text) {
      text = options.text;
    } else {
      console.log('JD Parser - Extract structured data from job descriptions\n');
      console.log('Usage:');
      console.log('  node jd-parser.js --url "https://linkedin.com/jobs/view/..."');
      console.log('  node jd-parser.js --file job-description.txt');
      console.log('  node jd-parser.js --text "Job description text..."');
      console.log('  node jd-parser.js --file jd.txt --output parsed.json\n');
      process.exit(1);
    }
    
    const result = parseJobDescription(text, source);
    
    if (options.output) {
      fs.writeFileSync(options.output, JSON.stringify(result, null, 2));
      console.log(`Parsed job saved to: ${options.output}`);
    } else {
      console.log('\n=== PARSED JOB DESCRIPTION ===\n');
      console.log(JSON.stringify(result, null, 2));
      console.log('\n================================\n');
    }
    
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Export for module use
module.exports = { parseJobDescription, extractJobTitle, extractCompany, extractLocation, extractSkills };

// Run if called directly
if (require.main === module) {
  main();
}
