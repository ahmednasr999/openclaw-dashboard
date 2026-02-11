---
name: batch-processor
description: Process multiple job applications in one run. Reads from a JSON file of job URLs/links, fetches and parses each JD, scores with ATS Scorer, and generates tailored CVs. Outputs a batch report with scores and recommendations.
---

# Batch Processor

Process multiple job applications efficiently.

## Purpose

Automate the CV tailoring workflow for multiple job applications at once.

## How It Works

1. **Read** job list from JSON file
2. **For each job**:
   - Fetch JD from URL (or use provided text)
   - Parse with JD Parser
   - Score with ATS Scorer
   - Generate tailored CV (if cv-tailor available)
3. **Output** batch report with all scores and recommendations

## Input Format

```json
[
  {
    "id": "job-001",
    "url": "https://linkedin.com/jobs/view/...",
    "company": "Example Corp",
    "notes": "Dream company"
  },
  {
    "id": "job-002",
    "url": "https://linkedin.com/jobs/view/...",
    "text": "Pasted job description..."
  }
]
```

## Output Report

```json
{
  "batch_id": "batch-2026-02-11-001",
  "processed_at": "2026-02-11T08:30:00Z",
  "total_jobs": 5,
  "successful": 4,
  "failed": 1,
  "results": [
    {
      "id": "job-001",
      "job_title": "Senior PM",
      "company": "Example Corp",
      "ats_score": 78,
      "match_level": "good",
      "cv_generated": true,
      "cv_path": "output/cv-example-corp.pdf"
    }
  ],
  "recommendations": ["Focus on jobs with >70% match"]
}
```

## Usage

```bash
# Process batch
node batch-processor.js jobs.json --cv-file ahmed-nasr-cv.txt

# With output directory
node batch-processor.js jobs.json --cv-file cv.txt --output-dir ./applications

# Generate report only (no CVs)
node batch-processor.js jobs.json --cv-file cv.txt --report-only
```

## Dependencies

- jd-parser skill
- ats-scorer skill
- cv-tailor skill (optional)
