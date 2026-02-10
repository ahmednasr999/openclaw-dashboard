---
name: ats-scorer
description: Score CVs against job descriptions for ATS compatibility. Extracts keywords from JD, matches against CV content, provides match percentage and missing keywords.
---

# ATS Scorer

Analyze job descriptions and CVs for ATS keyword matching.

## Purpose

Prevent rejections at the ATS filter stage by ensuring your CV contains the right keywords.

## How It Works

1. **Extract keywords** from job description (skills, requirements, experience)
2. **Match against** your CV content
3. **Calculate score** (% match)
4. **Identify gaps** (missing keywords to add)

## Input

- Job description text
- Your CV content

## Output

```json
{
  "match_score": 85,
  "found_keywords": ["project management", "agile", "stakeholder"],
  "missing_keywords": ["scrum master", "jira", "pmp certification"],
  "recommendations": ["Add 'scrum master' to experience section"]
}
```

## Usage

```bash
node ats-scorer.js "job_description.txt" "cv_content.txt"
```

Or integrated in CV generation pipeline.
