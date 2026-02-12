# CV Arsenal System — Complete State (Feb 12, 2026)

## 🎯 SYSTEM STATUS: FULLY OPERATIONAL

**Last Updated:** 2026-02-12 03:17 UTC  
**Repository:** ahmednasr999/openclaw-dashboard  
**Server:** http://100.99.230.14:3001

---

## ✅ WHAT WE BUILT

### 1. Elite Executive Job Processor (Web Form)
**URL:** `http://100.99.230.14:3001/job-processor.html`

**Features:**
- ✅ CV pre-loaded display (Ahmed Nasr credentials)
- ✅ Collapsible prompt editor (editable before submit)
- ✅ GitHub Pages deployment wait (no 404 errors)
- ✅ Dynamic job title extraction from JD
- ✅ Auto-generated filename: `{Job Title} - Ahmed Nasr Resume.pdf`

**Input:** LinkedIn job URL + Job description  
**Output:** 10 files per job

---

### 2. ATS-Optimized Prompt (v2.1)

**Key Features:**
- **3-Tier Keyword System:**
  - T1: 3-5x frequency (core skills)
  - T2: 2-3x frequency (secondary)
  - T3: 1-2x frequency (nice-to-have)
- **Industry-Weighted Scoring (NEW):**
  - Keyword Coverage: 40%
  - Industry Alignment: 40% (detects port/maritime/oil/gas/mining/construction mismatches)
  - Seniority Match: 20%
  - Auto-flags fundamental industry mismatches (e.g., Port COO = 30% industry score)
- **Placement Hierarchy:** Summary 40%, Skills 30%, Experience 20%, Education 10%
- **ATS Score Calculation:** Formula with industry alignment weighting
- **ATS Analysis Output:** breakdown, matched/missing keywords, industry fit warning
- **Seniority Language Map:** Junior → Executive word conversion
- **8-Point Validation Checklist**

**Quality Tests:**
1. Would Korn Ferry present to Fortune 500 board?
2. Would this score 85%+ in ATS parser?
3. Is this CV different from previous? (uniqueness test)

---

### 3. Generated Output Structure (Per Job)

```
applications/job_XXXXX_company_role/
├── CV.html                              ← Professional HTML CV (print-ready)
├── 01_EXECUTIVE_CV.md                   ← ATS-optimized CV (markdown)
├── 02_COVER_LETTER.md                   ← Executive cover letter
├── 03_KEYWORD_MATCH.md                  ← ATS score analysis
├── 04_MISSING_KEYWORDS.md               ← Gap analysis
├── 05_GAP_CLOSURE.md                    ← Strategic closure plan
├── 06_RECRUITER_OUTREACH.md             ← LinkedIn message
├── 07_APPLICATION_STRATEGY.md           ← Week-by-week timeline
├── 08_FIT_ASSESSMENT.md                 ← Strong/Moderate/Weak rating
├── 09_FINAL_CV.md                       ← Clean consolidated CV
├── FULL_PACKAGE.md                      ← All sections combined
└── job_description.txt                  ← Original JD
```

---

### 4. CV Content (7 Historical Roles)

**Header Format:**
```
AHMED NASR | MBA (In Progress) | PMP | CSM | CBAP | MCAD | MCP | Lean Six Sigma
Dubai, UAE | +971 50 281 4490 | +20 128 573 3991 | ahmednasr999@gmail.com
```

**All Roles Included:**
1. **Acting PMO & Regional Engagement Lead** | TopMed | Jun 2024 – Present
2. **Country Manager** | PaySky | Apr 2021 – Jan 2022
3. **Head of Strategy & VP Advisor** | El Araby | Jan 2020 – Dec 2021
4. **CEO & Business Partner** | Soleek Lab | May 2018 – Jul 2019
5. **Product Development Manager** | Talabat | Jun 2017 – May 2018
6. **PMO Section Head** | EMP | Sep 2014 – Jun 2017
7. **Project Manager** | Intel & Microsoft | 2007 – 2014

**Key Metrics (Accurate):**
- 95% AI adoption in 6 months
- 233x operational scale
- 3x profit increase
- AED 50M+ budget
- 50+ cross-functional teams
- 300+ projects
- 500K+ merchant platform
- 40% friction reduction

---

### 5. Tailoring Logic (Dynamic per Job)

**What Changes Per Job:**
- ✅ Executive summary highlights relevant achievements FIRST
- ✅ Experience bullets reordered (most relevant on top)
- ✅ 3-5 matching bullets wrapped in `<strong>` tags
- ✅ Job-specific competency sections added (Banking/FinTech, Data/Analytics)
- ✅ Relevance context added: "— directly matching your [requirement]"
- ✅ Banner: `✓ TAILORED FOR: [Company] — [Role] | ATS Score: XX%`

**Keyword Detection:**
- onboarding, transformation, digital, banking, fintech
- KYC/AML, compliance, risk, governance
- channels, acquisition, data, analytics
- stakeholder, PMO, programme, project

---

### 6. Technical Stack

**Backend:**
- Node.js + Express
- Google Sheets API (auto-update tracker)
- GitHub auto-commit on every job
- GitHub Pages deployment wait (polls until 200 OK)

**Frontend:**
- HTML/CSS (no frameworks)
- Print-optimized CSS
- Black & white professional design
- "Save as PDF" button (floating)

**Storage:**
- GitHub: `ahmednasr999/openclaw-dashboard`
- Google Sheets: `10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA`

---

## 📋 FILE LOCATIONS

| File | Purpose |
|------|---------|
| `server.js` | Main Express server |
| `server_helpers.js` | Helper functions (extract, generate, tailor) |
| `job-processor.html` | Web form interface |
| `Ahmed_Nasr_CV_Reference.md` | Source of truth for CV data |
| `skills/elite-executive-kit/PROMPT.md` | Backup prompt |
| `skills/elite-executive-kit/PROMPT_v2.md` | Improved prompt reference |

---

## 🔧 MAINTENANCE NOTES

**If Server Fails:**
```bash
cd /root/.openclaw/agents/main/workspace
pkill -f "node server.js"
nohup node server.js > server.log 2>&1 &
```

**If Functions Missing:**
All helpers are in `server_helpers.js` — check imports in `server.js`

**GitHub Pages Delay:**
- Normal: 30-60 seconds
- Timeout after 30 attempts (60 seconds)
- User sees link after deployment confirmed

---

## 💰 COST TRACKING

**Current Spend:** ~$44 USD (2,220 EGP) for 50 CVs
**Per CV Cost:** ~$0.88 (vs $200-500 market rate)
**Google Sheets API:** Free tier
**GitHub:** Free public repo

---

## 🎯 USER PREFERENCES (Ahmed Nasr)

**Golden Rules:**
1. One message at a time
2. Lead with recommendations
3. Google Sheets preferred over Notion
4. Sample first → feedback → "yes" → execute
5. Real data only — never fictional examples

**CV Requirements:**
- HTML files with print button
- Black & white professional design
- No colors
- Dynamic job title for PDF filename
- All 7 historical roles included
- Both phone numbers (+971 and +20)

**Contact Info Used:**
- +971 50 281 4490
- +20 128 573 3991
- ahmednasr999@gmail.com
- linkedin.com/in/ahmednasr

---

## ✅ NEVER FORGET

**Critical System Rules:**
- User requires explicit approval before execution (trust-building phase)
- Use real data only — never fictional examples
- Private things stay private
- Ask before external actions

**What Makes This System Work:**
1. **Accuracy:** All metrics from Ahmed_Nasr_CV_Reference.md
2. **Tailoring:** Each CV.html is UNIQUE per job
3. **ATS Optimization:** 85-90% score target with keyword density
4. **Completeness:** 10 files per job, all sections covered
5. **Automation:** GitHub commit + Google Sheets + deployment wait

---

*This is the definitive reference. If anything conflicts, this document wins.*
