---
name: linkedin-cv-factory
description: LinkedIn CV Factory - Advanced CV tailoring system that takes a Master CV and LinkedIn job descriptions to create ATS-optimized, tailored CVs. Analyzes job requirements, restructures experience sections, rephrases accomplishments with job keywords, and ensures high ATS compatibility while maintaining 100% factual accuracy. Use when creating tailored CVs for specific LinkedIn job applications, optimizing for ATS systems, or restructuring existing CVs to match job requirements.
---

# LinkedIn CV Factory

Create tailored, ATS-optimized CVs by matching Master CV content to specific job requirements.

## Input Requirements

**Required:**
- Master CV (complete work history, skills, accomplishments)
- Job URL or Job Description text

**Optional:**
- Target company name
- Specific focus areas (e.g., "emphasize leadership")

## Process

### Step 1: Job Analysis
1. Parse job description for:
   - Required skills (technical and soft)
   - Experience level and years
   - Industry/domain keywords
   - Core responsibilities
   - Must-have vs nice-to-have qualifications

2. Extract ATS-critical terms:
   - Job-specific buzzwords
   - Industry terminology
   - Tool/platform names
   - Certification requirements

### Step 2: Master CV Mapping
1. Match job requirements to Master CV sections:
   - Identify transferable experience
   - Map similar accomplishments
   - Find relevant projects/roles
   - Match skill sets

2. Prioritize content by relevance:
   - Most relevant experience → Top placement
   - Direct matches → Expanded bullets
   - Indirect matches → Reframed language
   - Irrelevant content → Minimized/omitted

### Step 3: Restructuring
1. Reorder sections:
   - Summary → Tailored to job focus
   - Experience → Most relevant roles first
   - Skills → Job-aligned keywords prominent
   - Projects → Selective inclusion

2. Rephrase accomplishments:
   - Replace generic verbs with job-specific action words
   - Mirror job description language
   - Add measurable impacts where present in Master CV
   - Use STAR format (Situation, Task, Action, Result)

### Step 4: ATS Optimization
1. Keyword density:
   - T1 keywords: 3-5x frequency (critical skills)
   - T2 keywords: 2-3x frequency (secondary skills)
   - T3 keywords: 1-2x frequency (supporting terms)

2. Format compatibility:
   - Clean section headers
   - Standard fonts
   - No tables/images
   - Simple bullet structure

3. Calculate ATS Score:
   - Keyword match percentage
   - Format compliance check
   - Seniority alignment
   - Industry relevance

### Step 5: Accuracy Verification
1. Cross-check every claim:
   - Dates match Master CV
   - Titles unchanged
   - Metrics preserved
   - No invented experience

2. Flag any embellishments:
   - Highlight reframed vs fabricated
   - Note transferable skill mappings
   - Identify gaps honestly

## Output

### 1. Tailored CV (PDF)
- Professional formatting
- Job-specific title
- Optimized content structure
- Contact info preserved

### 2. ATS Compatibility Report
```
ATS Score: XX%

Keyword Coverage:
- Matched: X of Y required
- Strong matches: [list]
- Missing: [list]

Format Check:
- ✓ Section headers
- ✓ Font compatibility
- ✓ Bullet structure
- ✓ No problematic elements
```

### 3. Matched Keywords List
```
T1 (Critical - 3-5x):
- keyword1: X occurrences
- keyword2: X occurrences

T2 (Important - 2-3x):
- keyword3: X occurrences
- keyword4: X occurrences

T3 (Supporting - 1-2x):
- keyword5: X occurrences
```

### 4. Transformation Summary
```
Changes Made:
- Section reordering: [what changed]
- Bullet rephrasing: X bullets updated
- Keywords added: X terms
- Experience emphasized: [which roles]

Honest Assessment:
- Fit level: Strong/Moderate/Weak
- Missing qualifications: [list]
- Recommended cover letter angle: [suggestion]
```

## Important Constraints

**NEVER:**
- Invent job titles, dates, or companies
- Add skills not in Master CV
- Fabricate metrics or accomplishments
- Claim experience in tools/platforms not used

**ALWAYS:**
- Maintain 100% factual accuracy
- Preserve all dates and chronology
- Keep contact information identical
- Flag when reframing (not fabricating)

## Usage Workflow

1. Load Master CV into context
2. Parse job description (URL or text)
3. Execute 5-step process above
4. Generate outputs
5. Present for review before saving

## Scripts

Use `scripts/tailor-cv.py` for structured processing when available.

## References

- `references/ats-best-practices.md` - ATS optimization guidelines
- `references/keyword-tiers.md` - Keyword categorization rules
- `references/action-verbs.md` - Power verbs by function

---

*This skill prioritizes accuracy over optimization. A lower ATS score with honest content beats a high score with fabricated claims.*