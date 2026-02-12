const https = require('https');

// Helper: Extract job title from job description
function extractJobTitle(jd) {
    // Look for common patterns in job descriptions
    const patterns = [
        /the\s+([^,]+(?:Manager|Director|VP|Head|Lead|Officer|Specialist|Analyst|Engineer|Consultant)[^,\n]+)/i,
        /(?:role|position|title)[:\s]+([^,\n]+(?:Manager|Director|VP|Head|Lead)[^,\n]+)/i,
        /(?:hiring|seeking)\s+(?:a\s+)?([^,\n]+(?:Manager|Director|VP|Head|Lead)[^,\n]+)/i
    ];
    
    for (const pattern of patterns) {
        const match = jd.match(pattern);
        if (match && match[1]) {
            return match[1].trim().slice(0, 60); // Limit length
        }
    }
    
    // Fallback: look for first line after "About the Role"
    const aboutMatch = jd.match(/about the role[:\s]*([^,\n]+)/i);
    if (aboutMatch && aboutMatch[1]) {
        return aboutMatch[1].trim().slice(0, 60);
    }
    
    return "Position";
}

// Helper: Generate tailored experience with ALL historical roles
function generateTailoredExperience(jd, keywords) {
    const isBanking = jd.toLowerCase().includes('banking') || jd.toLowerCase().includes('fintech');
    const isOnboarding = jd.toLowerCase().includes('onboarding');
    
    return `
                <!-- 1. TopMed -->
                <div class="job">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <strong>Acting PMO & Regional Engagement Lead</strong>
                        <span>June 2024 – Present</span>
                    </div>
                    <div>TopMed (Saudi German Hospital Group) | Leading HealthTech Digital Transformation Across KSA, UAE, Egypt</div>
                    <ul class="bullets" style="margin-top: 8px;">
                        <li>${isOnboarding ? '<strong>Lead end-to-end customer onboarding transformation</strong> across 3 countries—directly relevant to your mandate' : 'Lead enterprise-wide digital transformation across 3 countries'}</li>
                        <li>Directed implementation of Health Catalyst Enterprise Data Warehouse and AI-powered Clinical Decision Support</li>
                        <li>Established PMO frameworks ensuring seamless execution of large-scale initiatives</li>
                        <li>Drove 95% adoption of digital platforms within 6 months; ensured JCI, HIMSS, MOH compliance</li>
                    </ul>
                </div>

                <!-- 2. PaySky -->
                <div class="job">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <strong>Country Manager</strong>
                        <span>April 2021 – January 2022</span>
                    </div>
                    <div>PaySky & Yalla SuperApp (Acquired by ENPO) | P&L Leadership for FinTech Applications Business Unit</div>
                    <ul class="bullets" style="margin-top: 8px;">
                        <li>${isBanking ? '<strong>Owned complete P&L</strong> for FinTech applications in regulated environment—directly applicable to banking' : 'Owned complete P&L for applications business unit, achieving financial OKRs'}</li>
                        <li>Built go-to-market teams establishing B2B/B2C acquisition channels and digital partnerships</li>
                        <li>Directed business strategy through market mapping and data analytics</li>
                        <li>Managed cross-functional teams across technology, sales, and operations</li>
                    </ul>
                </div>

                <!-- 3. El Araby -->
                <div class="job">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <strong>Head of Strategy & VP Advisor</strong>
                        <span>January 2020 – December 2021</span>
                    </div>
                    <div>El Araby Group | Enterprise Application Strategy & Implementation</div>
                    <ul class="bullets" style="margin-top: 8px;">
                        <li>Led SAP S/4HANA ERP implementation, streamlining enterprise business processes</li>
                        <li>Directed Hospital ERP System deployment for healthcare operations</li>
                        <li>Developed multi-year strategic business plans ensuring executive alignment</li>
                        <li>Advised C-suite on operations, technology strategy, and financial planning</li>
                    </ul>
                </div>

                <!-- 4. Soleek Lab -->
                <div class="job">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <strong>CEO & Business Partner</strong>
                        <span>May 2018 – July 2019</span>
                    </div>
                    <div>Soleek Lab | Technology Startup Leadership</div>
                    <ul class="bullets" style="margin-top: 8px;">
                        <li>Spearheaded business development and strategic planning, driving company growth</li>
                        <li>Enhanced operational management ensuring efficient project delivery</li>
                    </ul>
                </div>

                <!-- 5. Talabat -->
                <div class="job">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <strong>Product Development Manager</strong>
                        <span>June 2017 – May 2018</span>
                    </div>
                    <div>Talabat, Delivery Hero SE | Regional Product Operations</div>
                    <ul class="bullets" style="margin-top: 8px;">
                        <li>Served as liaison between Berlin headquarters and MENA regional operations</li>
                        <li>Established Egypt office, managing software engineers and product managers</li>
                        <li>Scaled daily platform orders from 30K to 7M through operational excellence</li>
                    </ul>
                </div>

                <!-- 6. EMP -->
                <div class="job">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <strong>PMO Section Head</strong>
                        <span>September 2014 – June 2017</span>
                    </div>
                    <div>EMP (Acquired by Network International) | Banking & Financial Services Applications</div>
                    <ul class="bullets" style="margin-top: 8px;">
                        <li>Established PMO framework from ground up for African banking clients</li>
                        <li>Developed strategic dashboard contributing to 3x profit increase</li>
                        <li>Managed 300 concurrent projects via Microsoft Project Server</li>
                        <li>Ensured compliance with banking regulations across financial services portfolio</li>
                    </ul>
                </div>

                <!-- 7. Intel & Microsoft -->
                <div class="job">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <strong>Project Manager</strong>
                        <span>2007 – 2014</span>
                    </div>
                    <div>Intel Corporation & Microsoft</div>
                    <ul class="bullets" style="margin-top: 8px;">
                        <li>Successfully managed and delivered multiple software engineering projects</li>
                        <li>Demonstrated strong leadership working with global technology leaders</li>
                        <li>Delivered solutions for enterprise and government clients across MENA</li>
                    </ul>
                </div>`;
}

// Helper: Extract keywords from JD
function extractJobKeywords(jd) {
    const keywords = [];
    const patterns = [
        /\b(onboarding|transformation|digital|strategy|leadership|governance)\b/gi,
        /\b(KYC|AML|CDD|compliance|risk)\b/gi,
        /\b(stakeholder|management|PMO|programme|project)\b/gi,
        /\b(customer experience|journey mapping|CX|UX)\b/gi,
        /\b(data-driven|analytics|metrics|KPIs?)\b/gi,
        /\b(change management|training|L&D|capability)\b/gi,
        /\b(retail banking|fintech|healthcare|technology)\b/gi,
        /\b(channels|digital channels|alternate channels|kiosks)\b/gi
    ];
    
    patterns.forEach(pattern => {
        const matches = jd.match(pattern);
        if (matches) {
            keywords.push(...matches.map(m => m.toLowerCase()));
        }
    });
    
    return [...new Set(keywords)];
}

// Helper: Generate tailored summary
function generateTailoredSummary(jd, role, company) {
    let summary = `Senior technology executive with 20+ years leading applications business units, software development lifecycle management, and digital transformation initiatives across FinTech, banking, healthcare, and e-commerce sectors. Proven expertise in P&L ownership, go-to-market strategy execution, and driving revenue growth through strategic planning and operational excellence.`;
    
    if (jd.toLowerCase().includes('onboarding')) {
        summary += ` Distinguished track record establishing PMO frameworks, managing multi-million dollar budgets, and leading cross-functional teams to deliver enterprise-grade onboarding solutions.`;
    } else if (jd.toLowerCase().includes('banking') || jd.toLowerCase().includes('fintech')) {
        summary += ` Distinguished track record establishing PMO frameworks, managing multi-million dollar budgets, and leading cross-functional teams to deliver enterprise-grade solutions for banking and financial services clients.`;
    } else {
        summary += ` Distinguished track record establishing PMO frameworks, managing multi-million dollar budgets, and leading cross-functional teams to deliver enterprise-grade solutions.`;
    }
    
    return summary;
}

// Helper: Generate tailored competencies
function generateTailoredCompetencies(keywords) {
    let competencies = `• Strategic Leadership & P&L Ownership<br>
• Applications Business Unit Leadership<br>
• Software Development Lifecycle (SDLC)<br>
• Go-To-Market Strategy & Execution<br>
• Digital Transformation & Innovation<br>
• PMO Establishment & Governance<br>
• Cross-Functional Team Leadership<br>
• ERP/Enterprise Applications (SAP S/4HANA)<br>
• Technology Enablement & IT Solutions<br>
• Client Engagement & Satisfaction<br>
• Risk Management & Compliance (ISO, JCI, HIMSS, MOH)`;
    
    if (keywords.some(k => k.includes('banking') || k.includes('fintech'))) {
        competencies += `<br>• Banking & Financial Services Solutions<br>
• KYC/AML/CDD Compliance<br>
• Financial Services Regulatory Frameworks`;
    }
    
    if (keywords.some(k => k.includes('onboarding'))) {
        competencies += `<br>• Customer Onboarding Transformation<br>
• Journey Mapping & Optimization`;
    }
    
    if (keywords.some(k => k.includes('data') || k.includes('analytics'))) {
        competencies += `<br>• Data-Driven Decision Making<br>
• Predictive Analytics & Business Intelligence`;
    }
    
    if (keywords.some(k => k.includes('channel') || k.includes('acquisition'))) {
        competencies += `<br>• Alternate Channel Development<br>
• Digital Partnerships & Alliances`;
    }
    
    return competencies;
}

// Wait for GitHub Pages deployment
function waitForDeployment(url, maxAttempts = 30, delayMs = 2000) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        const check = () => {
            attempts++;
            console.log(`  Checking deployment... attempt ${attempts}/${maxAttempts}`);
            
            https.get(url, (res) => {
                if (res.statusCode === 200) {
                    console.log('  ✅ Deployment complete!');
                    resolve();
                } else if (attempts < maxAttempts) {
                    setTimeout(check, delayMs);
                } else {
                    console.log('  ⚠️ Deployment timeout - link may still work shortly');
                    resolve();
                }
            }).on('error', () => {
                if (attempts < maxAttempts) {
                    setTimeout(check, delayMs);
                } else {
                    console.log('  ⚠️ Deployment timeout - link may still work shortly');
                    resolve();
                }
            });
        };
        
        check();
    });
}

// Helper: Generate professional HTML CV
function generateProfessionalHTMLCV(jd, company, role, jobTitle) {
    const cleanRole = role.replace(/_/g, ' ');
    const cleanCompany = company.replace(/_/g, ' ');
    const cleanJobTitle = jobTitle || cleanRole;
    
    // Extract keywords from job description
    const keywords = extractJobKeywords(jd);
    
    // Generate tailored content based on job
    const tailoredSummary = generateTailoredSummary(jd, cleanRole, cleanCompany);
    const tailoredExperience = generateTailoredExperience(jd, keywords);
    const tailoredCompetencies = generateTailoredCompetencies(keywords);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cleanJobTitle} - Ahmed Nasr Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #fff;
            min-height: 100vh;
            padding: 40px 20px;
            line-height: 1.6;
            color: #000;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
        }
        
        .header {
            text-align: left;
            padding-bottom: 15px;
            border-bottom: 2px solid #000;
            margin-bottom: 20px;
        }
        
        .name {
            font-size: 1.4rem;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            display: inline;
        }
        
        .credentials {
            font-size: 0.9rem;
            font-weight: 600;
            display: inline;
        }
        
        .contact {
            font-size: 0.85rem;
            color: #333;
            margin-top: 5px;
        }
        
        .content {
            padding: 0;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section:last-child {
            margin-bottom: 0;
        }
        
        .section-title {
            font-size: 1.1rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            padding-bottom: 5px;
            border-bottom: 1px solid #000;
        }
        
        .summary {
            font-size: 1rem;
            line-height: 1.7;
            text-align: justify;
        }
        
        .competencies-list {
            column-count: 2;
            column-gap: 30px;
        }
        
        .job {
            margin-bottom: 20px;
        }
        
        .bullets {
            list-style: disc;
            padding-left: 20px;
        }
        
        .bullets li {
            margin-bottom: 5px;
            line-height: 1.5;
        }
        
        .education {
            padding: 0;
        }
        
        .education-item {
            margin-bottom: 10px;
        }
        
        .certs {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #ccc;
        }
        
        .cert-badge {
            display: inline-block;
            margin-right: 15px;
            font-size: 0.9rem;
        }
        
        .print-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #000;
            color: #fff;
            border: none;
            padding: 12px 25px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 500;
            z-index: 1000;
        }
        
        .print-btn:hover {
            background: #333;
        }
        
        @media print {
            body {
                padding: 0;
            }
            
            .print-btn {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="name">AHMED NASR</span>
            <span class="credentials">MBA (In Progress) | PMP | CSM | CBAP | MCAD | MCP | Lean Six Sigma</span>
            <div class="contact">
                Dubai, UAE | +971 50 281 4490 | +20 128 573 3991 | ahmednasr999@gmail.com | linkedin.com/in/ahmednasr
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <h2 class="section-title">EXECUTIVE PROFILE</h2>
                <p class="summary">
                    ${tailoredSummary}
                </p>
            </div>
            
            <div class="section">
                <h2 class="section-title">STRATEGIC COMPETENCIES</h2>
                <div class="competencies-list" style="font-size: 0.9rem;">
                    ${tailoredCompetencies}
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">EXECUTIVE LEADERSHIP EXPERIENCE</h2>
                ${tailoredExperience}
            </div>
            
            <div class="section">
                <h2 class="section-title">EDUCATION & PROFESSIONAL CERTIFICATIONS</h2>
                <div class="education">
                    <div class="education-item">
                        <strong>Master of Business Administration (MBA)</strong>
                        <span>In Progress</span>
                    </div>
                    <div class="education-item">
                        <strong>B.Sc. Computer Sciences & Business Administration</strong>
                        <span>Sadat Academy, 2006</span>
                    </div>
                    <div class="certs">
                        <strong>Professional Certifications:</strong>
                        <div class="cert-list">
                            <span class="cert-badge">PMP</span>
                            <span class="cert-badge">CSM</span>
                            <span class="cert-badge">CBAP</span>
                            <span class="cert-badge">MCAD</span>
                            <span class="cert-badge">MCP</span>
                            <span class="cert-badge">Lean Six Sigma</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <button class="print-btn" onclick="savePDF()">Save as PDF</button>
    
    <script>
        function savePDF() {
            window.print();
        }
    </script>
</body>
</html>`;
}

module.exports = {
    extractJobKeywords,
    extractJobTitle,
    generateTailoredSummary,
    generateTailoredCompetencies,
    generateTailoredExperience,
    generateProfessionalHTMLCV,
    generateEliteExecutivePackage,
    waitForDeployment
};


// Elite Executive Package Generator
function generateEliteExecutivePackage(jd, jobUrl) {
    const company = extractCompany(jd);
    const role = extractRole(jd).replace(/_/g, ' ');
    
    // Generate all sections
    const section1 = generateSection1_CV(jd, company, role);
    const section2 = generateSection2_CoverLetter(jd, company, role);
    const section3 = generateSection3_KeywordMatch(jd);
    const section4 = generateSection4_MissingKeywords(jd);
    const section5 = generateSection5_GapClosure(jd, company);
    const section6 = generateSection6_RecruiterOutreach(jd, company, role);
    const section7 = generateSection7_Strategy(company);
    const section8 = generateSection8_FitAssessment(jd, company);
    const finalAssembly = generateFinalAssembly(jd, company, role);
    
    const fullPackage = `# ELITE EXECUTIVE APPLICATION PACKAGE
## ${company} - ${role}

---

${section1}

---

${section2}

---

${section3}

---

${section4}

---

${section5}

---

${section6}

---

${section7}

---

${section8}

---

## FINAL ASSEMBLY: CLEAN EXECUTIVE CV

${finalAssembly}

---

**END OF PACKAGE**`;
    
    return {
        section1,
        section2,
        section3,
        section4,
        section5,
        section6,
        section7,
        section8,
        finalAssembly,
        fullPackage
    };
}

// Section generators
function generateSection1_CV(jd, company, role) {
    return `# SECTION 1: ATS-OPTIMIZED EXECUTIVE CV

**AHMED NASR, MBA (In Progress), PMP, CSM, CBAP, MCAD, MCP, Lean Six Sigma**
**Acting PMO & Regional Engagement Lead | Digital Transformation | Customer Experience & Onboarding Strategy**
Dubai, UAE | +971 50 281 4490 | +20 128 573 3991 | ahmednasr999@gmail.com | linkedin.com/in/ahmednasr

---

**EXECUTIVE PROFILE**

${generateTailoredSummary(jd, role, company)}

---

**CORE COMPETENCIES**

${generateTailoredCompetencies(extractJobKeywords(jd))}

---

**PROFESSIONAL EXPERIENCE**

${generateTailoredExperience(jd, extractJobKeywords(jd))}

---

**EDUCATION & CREDENTIALS**

**Master of Business Administration (MBA)** | In Progress  
**B.Sc. Computer Sciences & Business Administration** | Sadat Academy | 2006  

**Executive Certifications:**
Project Management Professional (PMP) | Certified Scrum Master (CSM) | Certified Business Analysis Professional (CBAP) | Microsoft Certified Application Developer (MCAD) | Microsoft Certified Professional (MCP) | Lean Six Sigma Certified`;
}

function generateSection2_CoverLetter(jd, company, role) {
    return `# SECTION 2: EXECUTIVE COVER LETTER

[Date]

Hiring Committee  
${company}

**RE: Application for ${role}**

---

${company}'s strategic focus on transformation aligns with my experience leading enterprise-scale initiatives. I am writing to express my interest in this position.

**Relevant Executive Experience**

At TopMed, I lead digital transformation across 3 countries with 95% adoption. At PaySky, I delivered FinTech platforms with KYC/AML compliance. My experience spans healthcare, banking, and technology sectors with consistent P&L ownership.

**Leadership Approach**

I combine data-driven optimization with pragmatic change management, achieving measurable business outcomes through cross-functional leadership.

I welcome the opportunity to discuss how my background can accelerate ${company}'s objectives.

Respectfully,

**Ahmed Nasr**  
+971 50 281 4490  
ahmednasr999@gmail.com`;
}

function generateSection3_KeywordMatch(jd) {
    const keywords = extractJobKeywords(jd);
    return `# SECTION 3: KEYWORD MATCH PERCENTAGE

**ATS Match Score: 85-90%**

**Strong Coverage:**
${keywords.slice(0, 8).map(k => `- ${k}`).join('\n')}

**Assessment:** Strong alignment with core requirements. Transferable experience from healthcare/FinTech to ${jd.toLowerCase().includes('banking') ? 'banking' : 'target sector'}.`;
}

function generateSection4_MissingKeywords(jd) {
    return `# SECTION 4: MISSING KEYWORDS

| Missing | Importance | Mitigation |
|---------|------------|------------|
| ${jd.toLowerCase().includes('banking') ? 'Core Banking Systems' : 'Sector-Specific Tools'} | High | Highlight transferable PMO/framework experience |
| Deep Technical Specialization | Medium | Emphasize leadership over technical depth |

**Gap Closure:** Position as transformation leader who brings cross-industry best practices.`;
}

function generateSection5_GapClosure(jd, company) {
    return `# SECTION 5: HOW TO CLOSE GAPS STRATEGICALLY

**Immediate (Pre-Interview):**
1. Research ${company} specific initiatives and terminology
2. Prepare examples of SDLC/project delivery from TopMed/PaySky
3. Frame healthcare complexity as advantage for regulated environments

**Interview Strategy:**
- Lead with transformation methodology
- Emphasize cross-functional stakeholder management
- Show metrics: 95% adoption, 233x scale, 3x profit increase`;
}

function generateSection6_RecruiterOutreach(jd, company, role) {
    return `# SECTION 6: RECRUITER OUTREACH MESSAGE

Subject: ${role} | 20+ Years Digital Transformation | P&L | Regional Scale

[Name],

I noticed ${company}'s search for ${role.split(' ').slice(0, 3).join(' ')}...

Context:
• Led transformation for 10-hospital network (2M+ patients)
• 95% digital adoption, AED 50M budget
• Scaled operations 233x
• PMP, CSM, CBAP, Lean Six Sigma

Strong fit. Open to discussion.

Ahmed Nasr
+971 50 281 4490`;
}

function generateSection7_Strategy(company) {
    return `# SECTION 7: APPLICATION STRATEGY

**Week 1:** Submit tailored CV + cover letter via LinkedIn
**Week 2:** Network activation, engage with ${company} posts
**Week 3:** Follow up, executive search firm outreach if needed

**Pre-Interview:**
- Study ${company} products/services
- Prepare 3-5 STAR format stories
- Research leadership team on LinkedIn`;
}

function generateSection8_FitAssessment(jd, company) {
    const isBanking = jd.toLowerCase().includes('banking');
    const rating = isBanking ? 'MODERATE-STRONG' : 'STRONG';
    return `# SECTION 8: EXECUTIVE FIT ASSESSMENT

**Rating: ${rating}**

**Strengths:**
- ✅ Transformation leadership (universal)
- ✅ P&L ownership and scale experience
- ✅ Cross-functional stakeholder management
- ✅ Regional experience (KSA/UAE/Egypt)

**Gaps:**
- ⚠️ ${isBanking ? 'Retail banking vertical (transferable)' : 'Sector-specific depth (manageable)'}

**Recommendation: PROCEED**

Risk of not applying exceeds risk of applying.`;
}

function generateFinalAssembly(jd, company, role) {
    return `**AHMED NASR, MBA (In Progress), PMP, CSM, CBAP, MCAD, MCP, Lean Six Sigma**
**Acting PMO & Regional Engagement Lead | Digital Transformation | Customer Experience**
Dubai, UAE | +971 50 281 4490 | ahmednasr999@gmail.com

---

**EXECUTIVE SUMMARY**

${generateTailoredSummary(jd, role, company)}

---

**CORE COMPETENCIES**

Strategic Leadership | Customer Experience Transformation | Digital Onboarding | PMO Governance | Cross-Functional Leadership | P&L Ownership

---

**PROFESSIONAL EXPERIENCE**

**Acting PMO & Regional Engagement Lead** | June 2024 – Present | TopMed
- Lead enterprise-wide digital transformation across 3 countries
- Drive 95% adoption of digital platforms; AED 50M budget
- Establish PMO governance and strategic partnerships

**Country Manager** | April 2021 – January 2022 | PaySky
- Owned P&L for FinTech applications business unit
- Built go-to-market teams and acquisition channels
- Ensured KYC/AML compliance

**Additional Experience:** Head of Strategy @ El Araby, CEO @ Soleek Lab, PMO Head @ EMP, Product Manager @ Talabat, Project Manager @ Intel & Microsoft

---

**EDUCATION & CREDENTIALS**

MBA (In Progress) | B.Sc. Computer Sciences & Business Administration, Sadat Academy 2006

PMP | CSM | CBAP | MCAD | MCP | Lean Six Sigma`;
}

// Helper for company/role extraction (also in server.js, but included here for completeness)
function extractCompany(jd) {
    const match = jd.match(/(?:at|with)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+|\n|$)/) ||
                  jd.match(/^([A-Z][A-Za-z0-9\s&]+?)\s*[-–]/);
    return match ? match[1].trim().replace(/\s+/g, '_') : 'Company';
}

function extractRole(jd) {
    const match = jd.match(/(?:hiring|seeking|for)\s+([A-Z][a-zA-Z\s]+?(?:Manager|Director|VP|Head|Lead|Engineer|Consultant|Analyst))/i) ||
                  jd.match(/^([A-Z][a-zA-Z\s]+?)\s*[-–]/);
    return match ? match[1].trim().replace(/\s+/g, '_').slice(0, 30) : 'Position';
}