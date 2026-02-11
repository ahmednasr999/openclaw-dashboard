# CV Workflow Skills

This directory contains skills for Ahmed Nasr's CV workflow automation.

## Available Skills

### 1. JD Parser (`jd-parser/`)
Extract structured data from job descriptions.

**Features:**
- Parse from LinkedIn URLs or pasted text
- Extract: job title, company, location, salary, requirements, responsibilities, qualifications
- Local parsing (no API calls)
- Outputs structured JSON

**Usage:**
```bash
node skills/jd-parser/scripts/jd-parser.js --file job-description.txt
node skills/jd-parser/scripts/jd-parser.js --url "https://linkedin.com/jobs/view/..."
```

### 2. ATS Scorer (`ats-scorer/`)
Score CVs against job descriptions for ATS compatibility.

**Features:**
- Keyword extraction from job descriptions
- Match percentage calculation
- Missing keywords identification
- Tailoring recommendations

**Usage:**
```bash
node skills/ats-scorer/scripts/ats-scorer.js job-description.txt cv-content.txt
```

### 3. Batch Processor (`batch-processor/`)
Process multiple job applications in one run.

**Features:**
- Read job list from JSON file
- Automatic JD fetching and parsing
- ATS scoring for each job
- Batch report generation (JSON + Markdown)
- Match prioritization recommendations

**Usage:**
```bash
node skills/batch-processor/scripts/batch-processor.js jobs.json --cv-file cv.txt
```

## Quick Start

1. **Create a jobs file:**
```json
[
  {
    "id": "job-001",
    "url": "https://linkedin.com/jobs/view/...",
    "company": "Example Corp",
    "notes": "Dream job"
  }
]
```

2. **Run batch processing:**
```bash
node skills/batch-processor/scripts/batch-processor.js my-jobs.json \
  --cv-file my-cv.txt \
  --output-dir ./applications
```

3. **Review the report:**
```bash
cat ./applications/batch-report.md
```

## Workflow Integration

```
Job URLs/Text → JD Parser → ATS Scorer → Batch Report → Tailored CVs
```

All skills work independently and can be combined for a complete workflow.
