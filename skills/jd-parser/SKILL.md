---
name: jd-parser
description: Parse job descriptions from LinkedIn URLs or pasted text. Extracts job title, company, location, salary, requirements, responsibilities, and qualifications into structured JSON.
---

# JD Parser

Extract structured data from job descriptions.

## Purpose

Convert unstructured job description text into structured data for CV tailoring and analysis.

## How It Works

1. **Fetch** content from LinkedIn URLs or use pasted text
2. **Parse** key fields using regex and pattern matching
3. **Extract**: job title, company, location, salary, requirements, responsibilities, qualifications
4. **Output** structured JSON

## Input

- LinkedIn job URL OR raw job description text

## Output

```json
{
  "job_title": "Senior Project Manager",
  "company": "Example Corp",
  "location": "Dubai, UAE",
  "salary": "$120,000 - $150,000",
  "employment_type": "Full-time",
  "requirements": ["5+ years PM experience", "PMP certification"],
  "responsibilities": ["Lead cross-functional teams", "Manage project budgets"],
  "qualifications": ["Bachelor's degree", "Agile/Scrum knowledge"],
  "skills": ["Project Management", "Agile", "Stakeholder Management"],
  "experience_years": "5+",
  "raw_text": "..."
}
```

## Usage

```bash
# From URL
node jd-parser.js --url "https://linkedin.com/jobs/view/..."

# From file
node jd-parser.js --file job-description.txt

# From stdin
node jd-parser.js --text "Job description text here..."
```

## Dependencies

- cheerio (for HTML parsing)
- No API calls - pure local parsing
