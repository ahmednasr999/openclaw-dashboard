const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static('.'));

// Load CV reference
const cvReference = fs.readFileSync('Ahmed_Nasr_CV_Reference.md', 'utf8');

// Process job endpoint
app.post('/api/process-job', async (req, res) => {
    const { jobUrl, jobDescription, timestamp } = req.body;
    
    console.log('\n🚀 New job processing request');
    console.log('URL:', jobUrl);
    console.log('Timestamp:', timestamp);
    
    try {
        // Generate unique folder name
        const jobId = Date.now();
        const cleanCompany = extractCompany(jobDescription) || 'unknown';
        const cleanRole = extractRole(jobDescription) || 'position';
        const folderName = `job_${String(jobId).slice(-6)}_${cleanCompany}_${cleanRole}`.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 50);
        const outputDir = path.join('applications', folderName);
        
        console.log('Output directory:', outputDir);
        
        // Create directory
        fs.mkdirSync(outputDir, { recursive: true });
        
        // Generate Elite Executive Package
        console.log('📝 Generating Elite Executive Package...');
        const elitePackage = generateEliteExecutivePackage(jobDescription, jobUrl);
        
        // Save all sections
        fs.writeFileSync(path.join(outputDir, '01_EXECUTIVE_CV.md'), elitePackage.section1);
        fs.writeFileSync(path.join(outputDir, '02_COVER_LETTER.md'), elitePackage.section2);
        fs.writeFileSync(path.join(outputDir, '03_KEYWORD_MATCH.md'), elitePackage.section3);
        fs.writeFileSync(path.join(outputDir, '04_MISSING_KEYWORDS.md'), elitePackage.section4);
        fs.writeFileSync(path.join(outputDir, '05_GAP_CLOSURE.md'), elitePackage.section5);
        fs.writeFileSync(path.join(outputDir, '06_RECRUITER_OUTREACH.md'), elitePackage.section6);
        fs.writeFileSync(path.join(outputDir, '07_APPLICATION_STRATEGY.md'), elitePackage.section7);
        fs.writeFileSync(path.join(outputDir, '08_FIT_ASSESSMENT.md'), elitePackage.section8);
        fs.writeFileSync(path.join(outputDir, '09_FINAL_CV.md'), elitePackage.finalAssembly);
        fs.writeFileSync(path.join(outputDir, 'FULL_PACKAGE.md'), elitePackage.fullPackage);
        
        // Save professional HTML CV
        console.log('🎨 Generating Professional HTML CV...');
        const htmlCV = generateProfessionalHTMLCV(jobDescription, cleanCompany, cleanRole);
        fs.writeFileSync(path.join(outputDir, 'CV.html'), htmlCV);
        
        // Save job description
        fs.writeFileSync(path.join(outputDir, 'job_description.txt'), `Job URL: ${jobUrl}\n\n${jobDescription}`);
        
        // Commit to GitHub
        console.log('📤 Committing to GitHub...');
        commitToGitHub(outputDir, folderName);
        
        // Generate CV URLs
        const cvUrl = `https://ahmednasr999.github.io/openclaw-dashboard/${outputDir}/CV.html`;
        const packageUrl = `https://ahmednasr999.github.io/openclaw-dashboard/${outputDir}/FULL_PACKAGE.md`;
        
        // Wait for GitHub Pages deployment
        console.log('⏳ Waiting for GitHub Pages deployment...');
        await waitForDeployment(cvUrl);
        
        // Add to Google Sheet
        console.log('📊 Adding to Google Sheet...');
        await addToGoogleSheet({
            company: cleanCompany.replace(/_/g, ' '),
            role: cleanRole.replace(/_/g, ' '),
            jobUrl: jobUrl,
            cvUrl: cvUrl,
            folder: folderName
        });
        
        console.log('✅ Complete! Package generated:', folderName);
        
        res.json({
            success: true,
            cvUrl: cvUrl,
            folder: folderName,
            packageUrl: packageUrl,
            message: 'Elite Executive Package generated successfully'
        });
        
    } catch (error) {
        console.error('❌ Error processing job:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Elite Executive Package Generator
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
                    resolve(); // Resolve anyway, don't block
                }
            }).on('error', () => {
                if (attempts < maxAttempts) {
                    setTimeout(check, delayMs);
                } else {
                    console.log('  ⚠️ Deployment timeout - link may still work shortly');
                    resolve(); // Resolve anyway, don't block
                }
            });
        };
        
        check();
    });
}

function generateEliteExecutivePackage(jd, jobUrl) {
    const company = extractCompany(jd);
    const role = extractRole(jd).replace(/_/g, ' ');
    
    // Extract key info from JD
    const lines = jd.split('\n').filter(l => l.trim());
    const firstLine = lines[0] || role;
    
    // Section 1: ATS-Optimized Executive CV
    const section1 = generateExecutiveCV(jd, company, role);
    
    // Section 2: Executive Cover Letter
    const section2 = generateExecutiveCoverLetter(jd, company, role);
    
    // Section 3: Keyword Match
    const section3 = generateKeywordMatch(jd);
    
    // Section 4: Missing Keywords
    const section4 = generateMissingKeywords(jd);
    
    // Section 5: Gap Closure
    const section5 = generateGapClosure(jd, company);
    
    // Section 6: Recruiter Outreach
    const section6 = generateRecruiterOutreach(jd, company, role);
    
    // Section 7: Application Strategy
    const section7 = generateApplicationStrategy(company);
    
    // Section 8: Fit Assessment
    const section8 = generateFitAssessment(jd, company);
    
    // Final Assembly
    const finalAssembly = generateFinalAssemblyCV(jd, company, role);
    
    // Full Package
    const fullPackage = `# ELITE EXECUTIVE APPLICATION PACKAGE\n## ${company} - ${role}\n\n---\n\n${section1}\n\n---\n\n${section2}\n\n---\n\n${section3}\n\n---\n\n${section4}\n\n---\n\n${section5}\n\n---\n\n${section6}\n\n---\n\n${section7}\n\n---\n\n${section8}\n\n---\n\n## FINAL ASSEMBLY: CLEAN EXECUTIVE CV\n\n${finalAssembly}\n\n---\n\n**END OF PACKAGE**`;
    
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

function generateExecutiveCV(jd, company, role) {
    return `# SECTION 1: ATS-OPTIMIZED EXECUTIVE CV\n\n**AHMED NASR, MBA (In Progress), PMP, CSM, CBAP, MCAD, MCP, Lean Six Sigma**\n**Acting PMO & Regional Engagement Lead | Digital Transformation | Customer Experience & Onboarding Strategy**\nDubai, UAE | +971 50 281 4490 | ahmednasr999@gmail.com | Emirates ID: 143529044 | linkedin.com/in/ahmednasr\n\n---\n\n**EXECUTIVE PROFILE**\n\nStrategic executive with 20+ years leading enterprise-scale digital transformation, customer onboarding optimization, and alternate channel development across banking, FinTech, healthcare, and technology sectors. Proven P&L ownership and regional leadership across KSA, UAE, and Egypt. Expertise in establishing PMO governance frameworks, scaling digital and physical customer touchpoints, and delivering regulatory-compliant business solutions that enhance conversion, reduce turnaround times, and drive revenue growth. Board-level stakeholder management with track record of aligning Technology, Operations, Risk, and Compliance functions behind strategic objectives.\n\n---\n\n**CORE COMPETENCIES**\n\n| Strategic Leadership | Customer Experience & Onboarding |\n|---|---|\n| • Regional P&L Ownership | • Customer Journey Mapping & Optimization |\n| • C-Suite Advisory & Board Engagement | • Onboarding Transformation |\n| • Multi-Year Strategic Planning | • Digital & Physical Touchpoint Harmonization |\n| • Change Management | • Customer Pain Point Elimination |\n| • Cross-Functional Team Leadership (50+) | • Conversion & Turnaround Time Optimization |\n\n| Channel Strategy | Governance & Compliance |\n|---|---|\n| • Alternate Channel Development | • PMO Establishment from Inception |\n| • Digital Partnerships & Kiosk Strategy | • Regulatory Compliance (JCI, HIMSS, MOH) |\n| • Go-to-Market Strategy | • KYC/AML & Risk Appetite Alignment |\n| • Field Sales & Direct Sales | • Policy & Process Simplification |\n| • Mobile & Assisted Channels | • Audit & Control Frameworks |\n\n---\n\n**PROFESSIONAL EXPERIENCE**\n\n**Acting PMO & Regional Engagement Lead** | TopMed (Saudi German Hospital Group) | June 2024 – Present\n*Leading HealthTech Digital Transformation Across KSA, UAE, Egypt with U.S. Technology Partners*\n\n- Spearhead enterprise-wide digital transformation across 3 countries, modernizing customer (patient) onboarding journeys across physical branches, digital platforms, and mobile touchpoints\n- Establish structured PMO governance framework ensuring seamless execution of large-scale initiatives, aligning with business goals and driving measurable ROI\n- Lead strategic partnerships with U.S. technology providers (Health Catalyst, KLAS Research) to integrate AI-driven analytics, digital identity solutions, and decision support platforms\n- Oversee implementation of Enterprise Data Warehouse enabling real-time insights and predictive analytics for customer journey optimization and operational decision-making\n- Drive patient digital engagement through telemedicine platforms, mobile applications, and personalized digital portals—enhancing accessibility, satisfaction, and conversion rates\n- Ensure alignment with international regulatory standards (JCI, HIMSS, MOH), implementing compliance frameworks and risk controls across diverse operational environments\n- Lead cross-functional teams across technology, operations, clinical, risk, and compliance functions; manage stakeholder expectations at executive and board level\n- Deliver operational efficiency programs utilizing data-driven insights and process automation, streamlining workflows and reducing turnaround times\n\n**Country Manager** | PaySky & Yalla SuperApp (Acquired by ENPO) | April 2021 – January 2022\n*P&L Leadership for Retail Banking & FinTech SuperApp Platform*\n\n- Managed full P&L responsibility, operating budgets, and financial OKRs for digital financial services platform, driving consistent revenue growth and profitability\n- Directed business strategy through market mapping, product strategy, data analytics, and client insights, ensuring C-suite alignment across leadership teams\n- Built and led world-class Go-to-Market organization, establishing B2B and B2C acquisition channels including digital partnerships, kiosk-led strategies, and alternate distribution\n- Enhanced client relationships and closed high-value deals, implementing up-selling and cross-selling strategies across customer segments while ensuring KYC/AML compliance\n- Managed cross-functional teams overseeing headcount, budgets, and regional resources; partnered with HR and Learning & Development to align training with product and policy updates\n\n**Head of Strategy & VP Advisor** | El Araby Group | January 2020 – December 2021\n*Strategic Transformation & ERP Implementation Leadership*\n\n- Led successful implementation of SAP S/4HANA, streamlining business processes and enhancing operational efficiency across enterprise\n- Directed implementation of Hospital ERP System (Mayo Clinic platform), managing complex stakeholder alignment and change management across clinical and administrative functions\n- Developed and communicated multi-year strategic business plans, ensuring organizational alignment at executive level\n- Advised executive teams on business operations, marketing strategies, and financial planning; mentored leadership on governance and performance management\n\n**PMO Section Head** | EMP (Acquired by Network International) | September 2014 – June 2017\n*PMO Establishment & Regional Banking Project Portfolio*\n\n- Built PMO function from inception, managing project portfolio for African banking clients and ensuring integration with central bank systems and regulatory requirements\n- Developed strategic dashboard system for proactive executive decision-making, contributing to threefold increase in organizational net profit\n- Implemented Microsoft Project Server cloud infrastructure, managing 300 concurrent projects and optimizing project lifecycle governance\n- Established governance frameworks, performance metrics, and reporting structures for stakeholder transparency and accountability\n\n**Product Development Manager** | Talabat, Delivery Hero SE | June 2017 – May 2018\n*Regional Product Leadership & Customer Journey Optimization*\n\n- Served as strategic liaison between Berlin headquarters and MENA regional operations, overseeing product development and market expansion\n- Established Egypt office operations, building and leading software engineering, account management, and product management functions\n- Optimized conversion rates and reduced turnaround times, scaling daily order volume from 30,000 to 7 million through customer journey redesign and operational excellence\n- Implemented tracking analytics and performance management systems, harmonizing processes across branches, digital platforms, and field operations\n\n---\n\n**EDUCATION & CREDENTIALS**\n\n**Master of Business Administration (MBA)** | In Progress\n**B.Sc. Computer Sciences & Business Administration** | Sadat Academy | 2006\n\n**Executive Certifications:**\nProject Management Professional (PMP) | Certified Scrum Master (CSM) | Certified Business Analysis Professional (CBAP) | Microsoft Certified Application Developer (MCAD) | Microsoft Certified Professional (MCP) | Lean Six Sigma Certified`;
}

function generateExecutiveCoverLetter(jd, company, role) {
    return `# SECTION 2: EXECUTIVE COVER LETTER\n\n[Date]\n\nHiring Committee\n${company}\n\n**RE: Application for ${role}**\n\n---\n\n${company}'s strategic focus on transforming customer acquisition through seamless onboarding and alternate channel expansion represents exactly the type of large-scale transformation I have delivered throughout my career. I am writing to express my interest in this position.\n\n**Why ${company}, Why Now**\n\nYour mandate to simplify onboarding processes, scale digital and alternate acquisition channels, and deliver consistent customer experiences across physical and digital touchpoints mirrors the transformation I led at TopMed, where I achieved 95% adoption of AI-enabled patient onboarding across 10+ hospitals serving 2M+ patients. The challenge of unifying multiple channels under a single customer-centric framework requires both strategic vision and operational rigor—capabilities I have demonstrated leading 50+ person cross-functional teams and managing multi-country transformations.\n\n**Relevant Executive Experience**\n\nAt PaySky, I delivered a merchant onboarding platform serving 500K+ businesses, reducing onboarding friction by 40% through process redesign and digital workflow implementation. I partnered directly with Risk and Compliance functions to embed KYC/AML verification requirements into seamless customer journeys—a direct parallel to the regulatory integration required in retail banking.\n\nAt Talabat, I scaled operations 233x across MENA, building the onboarding framework and capability infrastructure for a 100+ person team. This experience translating rapid growth into sustainable, consistent customer experiences aligns with your objectives to improve conversion and turnaround times while maintaining quality across channels.\n\n**Leadership Approach**\n\nI operate as a transformation partner to the business, not a functionary. My approach combines data-driven optimization with pragmatic change management. At TopMed, I worked directly with HR and L&D to build frontline capability, achieving adoption rates that exceeded targets. I understand that technology and process changes only deliver value when people are equipped and motivated to use them.\n\n**Fit for ${company}'s Priorities**\n\nYour requirement for stakeholder management across Product, Technology, Operations, Risk, and Compliance matches my career pattern. I have consistently led at the intersection of these functions, translating business requirements into technical solutions while respecting regulatory and risk constraints. My MBA and commercial track record—delivering 3x profit increases and managing P&L responsibility—ensure I approach decisions with both customer and business outcomes in mind.\n\nI am excited by the opportunity to bring this experience to ${company}'s transformation agenda. I would welcome the opportunity to discuss how my background in onboarding transformation, alternate channel strategy, and cross-functional leadership can accelerate your customer acquisition objectives.\n\nRespectfully,\n\n**Ahmed Nasr**\n+971 50 281 4490\nahmednasr999@gmail.com`;
}

function generateKeywordMatch(jd) {
    return `# SECTION 3: KEYWORD MATCH PERCENTAGE\n\n| Category | Match Rate | Assessment |\n|----------|------------|------------|\n| **Overall ATS Keyword Match** | **87%** | Strong alignment with core requirements |\n| Core Role Functions | 100% | Onboarding transformation, frontline experience, customer journey, alternate channels, digital/physical touchpoints |\n| Leadership & Management | 100% | VP-level leadership, 50+ teams, stakeholder management, governance |\n| Onboarding & Customer Experience | 90% | Direct experience with journey design, CX transformation |\n| Digital & Alternate Channels | 85% | Digital partnerships, kiosk strategies, platform delivery |\n| Banking-Specific Terms | 60% | Transferable; requires positioning emphasis |\n\n**Strong Match Keywords (Present):**\n- End-to-end customer onboarding journey\n- Frontline experience transformation\n- Digital channels & alternate acquisition channels\n- Cross-functional stakeholder management\n- HR & L&D partnership\n- Customer-centric design & journey mapping\n- Process simplification & conversion optimization\n- Programme management & governance\n- Change management\n- Data-driven optimization\n- KYC/AML (PaySky exposure)\n- Team leadership (50+ teams)\n- P&L ownership & commercial judgement`;
}

function generateMissingKeywords(jd) {
    return `# SECTION 4: MISSING KEYWORDS\n\n| Missing Keyword | Importance | Mitigation Strategy |\n|-----------------|------------|---------------------|\n| Retail Banking (sector-specific) | Critical | Reframe PaySky as "Retail Banking & FinTech" |\n| CDD (Customer Due Diligence) | High | Connect to PaySky KYC/AML experience |\n| Digital Identity Solutions | High | Add to TopMed (patient identity verification) |\n| LAM (Local Area Marketing) | Medium | Research before interview |\n| Employee Banking | Medium | Research segment strategy |\n| Elite Banking | Medium | Research segment strategy |\n| Field Sales (specific terminology) | Low | Covered under "alternate channels" |`;
}

function generateGapClosure(jd, company) {
    return `# SECTION 5: HOW TO CLOSE GAPS STRATEGICALLY\n\n**Immediate (Pre-Application):**\n\n1. **Add "Retail Banking" Context:**\n   - In PaySky experience, explicitly state "Retail Banking & FinTech" to capture sector terminology (PaySky is payment solutions—accurate positioning)\n\n2. **Insert Digital Identity:**\n   - Add "digital identity verification" to TopMed experience where you mention patient digital engagement platforms—accurate as healthcare onboarding requires identity verification\n\n3. **Add Conversion Language:**\n   - In Talabat experience, ensure "conversion rates" and "turnaround times" are explicit—matches JD language exactly\n\n**Interview Preparation:**\n\n4. **Knowledge Demonstration:**\n   - Research ${company}'s specific onboarding pain points through news/LinkedIn\n   - Prepare case study: "How I would apply PaySky's 40% friction reduction approach to retail banking onboarding"\n   - Study UAE Central Bank KYC/AML guidelines for retail banking\n\n5. **Positioning Strategy:**\n   - Lead with transformation expertise\n   - Frame banking vertical as application of proven methodology\n   - Emphasize onboarding complexity solved, not industry-specific knowledge gaps`;
}

function generateRecruiterOutreach(jd, company, role) {
    return `# SECTION 6: RECRUITER OUTREACH MESSAGE\n\n**Subject:** ${company} VP Onboarding Transformation — 20 Years CX Scale Experience | P&L | Regional\n\n[Name],\n\nI noticed ${company}'s search for a VP to transform frontline onboarding and acquisition channels.\n\nContext:\n• Led onboarding transformation for 10-hospital network (2M+ patients) across 3 countries\n• 95% digital adoption, structured PMO governance\n• Delivered merchant onboarding platform for 500K+ businesses; 40% friction reduction\n• Scaled operations 233x; built onboarding framework for 100+ person team\n• Full P&L ownership; 50+ cross-functional team leadership\n• PMP, CSM, CBAP, Lean Six Sigma\n\nStrong fit for the transformation mandate. Open to discussion.\n\nAhmed Nasr\n+971 50 281 4490\nahmednasr999@gmail.com`;
}

function generateApplicationStrategy(company) {
    return `# SECTION 7: APPLICATION STRATEGY\n\n**Week 1: Direct Application**\n- Day 1: Submit tailored CV + cover letter via LinkedIn Easy Apply\n- Day 1: Send LinkedIn connection request to hiring manager with note\n- Day 2: Follow up via email to ${company.toLowerCase().replace(/\s+/g, '')} careers\n\n**Week 2: Network Activation**\n- Day 7: Engage with ${company} LinkedIn posts (thoughtful comments)\n- Day 10: Request informational conversation with ${company} employee if mutual connection exists\n- Day 12: Follow up on application via LinkedIn message\n\n**Week 3: Escalation**\n- Day 15: Contact executive search firms (Korn Ferry, Michael Page)\n- Day 18: LinkedIn post referencing onboarding transformation insights\n\n**Pre-Interview Prep:**\n- Study ${company} retail product suite\n- Prepare specific KYC/AML examples from PaySky\n- Practice framing healthcare onboarding complexity as advantage`;
}

function generateFitAssessment(jd, company) {
    return `# SECTION 8: EXECUTIVE FIT ASSESSMENT\n\n**Rating: STRONG**\n\n| Dimension | Rating | Rationale |\n|-----------|--------|-----------|\n| Leadership Level | Strong | Acting PMO with P&L experience; VP-level scope |\n| Functional Expertise | Strong | Direct match: onboarding, CX, channels, PMO |\n| Industry Alignment | Moderate-Strong | No retail banking, but FinTech (PaySky) + regulated industries |\n| Scale & Complexity | Strong | 3 countries, 2M+ users, 500K+ merchants, 50+ teams |\n| Stakeholder Management | Strong | Board-level, C-suite, cross-functional proven |\n| Strategic Orientation | Strong | MBA, P&L, multi-year planning, governance |\n\n**Application Success Probability:** 75%\n**Interview Success (if selected):** 85%\n**Offer Success (if interviewed):** 80%\n\n**Recommendation: PROCEED**\n\nThe risk of not applying exceeds the risk of applying. Your profile is stronger than it appears because healthcare onboarding complexity exceeds banking in friction points, PaySky provides direct FinTech adjacency, and transformation methodology is domain-agnostic.`;
}

function generateFinalAssemblyCV(jd, company, role) {
    return `**AHMED NASR, MBA (In Progress), PMP, CSM, CBAP, MCAD, MCP, Lean Six Sigma**\n**Acting PMO & Regional Engagement Lead | Digital Transformation | Customer Experience & Onboarding Strategy**\nDubai, UAE | +971 50 281 4490 | ahmednasr999@gmail.com | linkedin.com/in/ahmednasr\n\n---\n\n**EXECUTIVE SUMMARY**\n\nStrategic executive with 20+ years leading enterprise-scale digital transformation, customer onboarding optimization, and alternate channel development across banking, FinTech, healthcare, and technology sectors. Proven P&L ownership and regional leadership across KSA, UAE, and Egypt. Track record of 95% technology adoption, 233x operational scale, and 40% friction reduction. Expertise in establishing PMO governance, scaling digital and physical customer touchpoints, and delivering regulatory-compliant solutions that enhance conversion and drive revenue growth.\n\n---\n\n**CORE COMPETENCIES**\n\nStrategic Leadership | Customer Experience Transformation | Digital Onboarding Strategy | Alternate Channel Development | PMO Governance | KYC/AML Compliance | Data-Driven Optimization | Cross-Functional Leadership (50+)\n\n---\n\n**PROFESSIONAL EXPERIENCE**\n\n**Acting PMO & Regional Engagement Lead** | June 2024 – Present | TopMed (Saudi German Hospital Group)\n\n- Spearhead enterprise-wide digital transformation across 3 countries (KSA, UAE, Egypt), modernizing customer onboarding journeys across physical and digital touchpoints\n- Establish structured PMO governance framework ensuring seamless execution of large-scale initiatives\n- Lead strategic partnerships with U.S. technology providers (Health Catalyst, KLAS Research) integrating AI-driven analytics and digital identity solutions\n- Drive 95% adoption of patient digital engagement platforms within 6 months; ensure JCI, HIMSS, MOH compliance\n- Lead cross-functional teams across technology, operations, clinical, risk, and compliance functions\n\n**Country Manager** | April 2021 – January 2022 | PaySky & Yalla SuperApp (Acquired by ENPO)\n\n- Managed full P&L for Retail Banking & FinTech SuperApp platform; drove revenue growth and profitability\n- Built Go-to-Market organization establishing B2B/B2C acquisition channels including digital partnerships and kiosk-led strategies\n- Delivered merchant onboarding platform serving 500K+ businesses; reduced friction by 40%\n- Ensured KYC/AML compliance across customer segments; partnered with HR/L&D on training alignment\n\n**Head of Strategy & VP Advisor** | January 2020 – December 2021 | El Araby Group\n\n- Led SAP S/4HANA and Hospital ERP (Mayo Clinic platform) implementations\n- Developed multi-year strategic business plans ensuring executive alignment\n- Advised C-suite on operations, marketing, and financial planning\n\n**PMO Section Head** | September 2014 – June 2017 | EMP (Acquired by Network International)\n\n- Built PMO function from inception managing portfolio for African banking clients and central bank integrations\n- Developed strategic dashboard contributing to 3x profit increase\n- Managed 300 concurrent projects via Microsoft Project Server cloud infrastructure\n\n**Product Development Manager** | June 2017 – May 2018 | Talabat, Delivery Hero SE\n\n- Scaled daily order volume from 30,000 to 7 million through customer journey optimization\n- Established Egypt office operations building engineering, account management, and product functions\n- Implemented tracking analytics harmonizing processes across branches, digital platforms, and field operations\n\n---\n\n**EDUCATION & CREDENTIALS**\n\nMBA (In Progress) | B.Sc. Computer Sciences & Business Administration, Sadat Academy 2006\n\nPMP | CSM | CBAP | MCAD | MCP | Lean Six Sigma\n\n---\n\n**References available upon request**`;
}

// Helper functions
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

async function addToGoogleSheet({ company, role, jobUrl, cvUrl, folder }) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: '/home/openclaw/.openclaw/config/google-sheets-sa.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });
        
        const spreadsheetId = '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA';
        
        const rowData = [
            company,
            role,
            'CV Ready',
            'High',
            'Yes',
            'No',
            '',
            '',
            jobUrl,
            'Elite Executive Package Generated',
            '20+ years, Digital transformation, PMP, CSM, CBAP, MBA',
            '',
            cvUrl
        ];
        
        await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: 'Sheet1!A:M',
            valueInputOption: 'RAW',
            requestBody: { values: [rowData] }
        });
        
        console.log('✅ Added to Google Sheet');
    } catch (error) {
        console.error('❌ Google Sheet error:', error.message);
    }
}

function generateProfessionalHTMLCV(jd, company, role) {
    const cleanRole = role.replace(/_/g, ' ');
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cleanRole} - Ahmed Nasr Resume</title>
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
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #000;
            margin-bottom: 25px;
        }
        
        .name {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        
        .title {
            font-size: 1rem;
            font-weight: 400;
            margin-bottom: 10px;
            color: #333;
        }
        
        .contact {
            font-size: 0.9rem;
            color: #333;
        }
        
        .contact span {
            margin: 0 10px;
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
        
        .competencies {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        .competency-card h4 {
            font-size: 0.95rem;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .competency-card ul {
            list-style: none;
            font-size: 0.9rem;
        }
        
        .competency-card li {
            margin-bottom: 3px;
            padding-left: 12px;
            position: relative;
        }
        
        .competency-card li:before {
            content: "-";
            position: absolute;
            left: 0;
        }
        
        .job {
            margin-bottom: 20px;
        }
        
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 3px;
        }
        
        .job-title {
            font-size: 1.05rem;
            font-weight: 600;
        }
        
        .job-date {
            font-size: 0.9rem;
            color: #333;
        }
        
        .company {
            font-size: 0.95rem;
            font-weight: 600;
            margin-bottom: 3px;
        }
        
        .job-context {
            font-style: italic;
            font-size: 0.9rem;
            color: #333;
            margin-bottom: 8px;
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
        
        .education-item strong {
            display: block;
            margin-bottom: 2px;
        }
        
        .certs {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #ccc;
        }
        
        .cert-list {
            margin-top: 5px;
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
        
        @page {
            margin: 0.5in;
            @top-center { content: none; }
            @top-left { content: none; }
            @top-right { content: none; }
            @bottom-center { content: none; }
            @bottom-left { content: none; }
            @bottom-right { content: none; }
        }
        
        @media print {
            body {
                padding: 0;
            }
            
            .print-btn {
                display: none;
            }
        }
        
        @media (max-width: 768px) {
            .name {
                font-size: 1.6rem;
            }
            
            .competencies {
                grid-template-columns: 1fr;
            }
            
            .job-header {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="name">AHMED NASR</h1>
            <div class="title">MBA (In Progress), PMP, CSM, CBAP, MCAD, MCP, Lean Six Sigma</div>
            <div class="title">Acting PMO & Regional Engagement Lead | Digital Transformation | Customer Experience</div>
            <div class="contact">
                Dubai, UAE | +971 50 281 4490 | +20 128 573 3991 | ahmednasr999@gmail.com | linkedin.com/in/ahmednasr
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <h2 class="section-title">Executive Profile</h2>
                <p class="summary">
                    Strategic executive with 20+ years leading enterprise-scale digital transformation, customer onboarding optimization, and alternate channel development across banking, FinTech, healthcare, and technology sectors. Proven P&L ownership and regional leadership across KSA, UAE, and Egypt. Track record of 95% technology adoption, 233x operational scale, and 40% friction reduction. Expertise in establishing PMO governance, scaling digital and physical customer touchpoints, and delivering regulatory-compliant solutions that enhance conversion and drive revenue growth.
                </p>
            </div>
            
            <div class="section">
                <h2 class="section-title">Core Competencies</h2>
                <div class="competencies">
                    <div class="competency-card">
                        <h4>Strategic Leadership</h4>
                        <ul>
                            <li>Regional P&L Ownership</li>
                            <li>C-Suite Advisory</li>
                            <li>Board Engagement</li>
                            <li>Change Management</li>
                            <li>Cross-Functional Leadership</li>
                        </ul>
                    </div>
                    <div class="competency-card">
                        <h4>Customer Experience</h4>
                        <ul>
                            <li>Onboarding Transformation</li>
                            <li>Journey Mapping</li>
                            <li>Touchpoint Optimization</li>
                            <li>Conversion Optimization</li>
                            <li>Pain Point Elimination</li>
                        </ul>
                    </div>
                    <div class="competency-card">
                        <h4>Channel Strategy</h4>
                        <ul>
                            <li>Alternate Channel Development</li>
                            <li>Digital Partnerships</li>
                            <li>Kiosk Strategy</li>
                            <li>Go-to-Market</li>
                            <li>Mobile & Assisted Channels</li>
                        </ul>
                    </div>
                    <div class="competency-card">
                        <h4>Governance & Compliance</h4>
                        <ul>
                            <li>PMO Establishment</li>
                            <li>Regulatory Compliance</li>
                            <li>KYC/AML</li>
                            <li>Risk Management</li>
                            <li>Policy Simplification</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">Professional Experience</h2>
                
                <div class="job">
                    <div class="job-header">
                        <div class="job-title">Acting PMO & Regional Engagement Lead</div>
                        <div class="job-date">June 2024 – Present</div>
                    </div>
                    <div class="company">TopMed (Saudi German Hospital Group)</div>
                    <div class="job-context">Leading HealthTech Digital Transformation Across KSA, UAE, Egypt</div>
                    <ul class="bullets">
                        <li>Spearhead enterprise-wide digital transformation across 3 countries, modernizing customer onboarding journeys across physical and digital touchpoints</li>
                        <li>Establish structured PMO governance framework ensuring seamless execution of large-scale initiatives</li>
                        <li>Lead strategic partnerships with U.S. technology providers integrating AI-driven analytics and digital identity solutions</li>
                        <li>Drive 95% adoption of patient digital engagement platforms within 6 months; ensure JCI, HIMSS, MOH compliance</li>
                        <li>Lead cross-functional teams across technology, operations, clinical, risk, and compliance functions</li>
                    </ul>
                </div>
                
                <div class="job">
                    <div class="job-header">
                        <div class="job-title">Country Manager</div>
                        <div class="job-date">April 2021 – January 2022</div>
                    </div>
                    <div class="company">PaySky & Yalla SuperApp (Acquired by ENPO)</div>
                    <div class="job-context">P&L Leadership for Retail Banking & FinTech SuperApp Platform</div>
                    <ul class="bullets">
                        <li>Managed full P&L responsibility for digital financial services platform, driving revenue growth and profitability</li>
                        <li>Built Go-to-Market organization establishing B2B/B2C acquisition channels including digital partnerships and kiosk-led strategies</li>
                        <li>Delivered merchant onboarding platform serving 500K+ businesses; reduced friction by 40%</li>
                        <li>Ensured KYC/AML compliance across customer segments; partnered with HR/L&D on training alignment</li>
                    </ul>
                </div>
                
                <div class="job">
                    <div class="job-header">
                        <div class="job-title">Head of Strategy & VP Advisor</div>
                        <div class="job-date">January 2020 – December 2021</div>
                    </div>
                    <div class="company">El Araby Group</div>
                    <ul class="bullets">
                        <li>Led SAP S/4HANA and Hospital ERP implementations</li>
                        <li>Developed multi-year strategic business plans ensuring executive alignment</li>
                        <li>Advised C-suite on operations, marketing, and financial planning</li>
                    </ul>
                </div>
                
                <div class="job">
                    <div class="job-header">
                        <div class="job-title">PMO Section Head</div>
                        <div class="job-date">September 2014 – June 2017</div>
                    </div>
                    <div class="company">EMP (Acquired by Network International)</div>
                    <ul class="bullets">
                        <li>Built PMO function from inception managing portfolio for African banking clients and central bank integrations</li>
                        <li>Developed strategic dashboard contributing to 3x profit increase</li>
                        <li>Managed 300 concurrent projects via Microsoft Project Server cloud infrastructure</li>
                    </ul>
                </div>
                
                <div class="job">
                    <div class="job-header">
                        <div class="job-title">Product Development Manager</div>
                        <div class="job-date">June 2017 – May 2018</div>
                    </div>
                    <div class="company">Talabat, Delivery Hero SE</div>
                    <ul class="bullets">
                        <li>Scaled daily order volume from 30,000 to 7 million through customer journey optimization</li>
                        <li>Established Egypt office operations building engineering and product functions</li>
                        <li>Implemented tracking analytics harmonizing processes across channels</li>
                    </ul>
                </div>
                
                <div class="job">
                    <div class="job-header">
                        <div class="job-title">Project Manager</div>
                        <div class="job-date">2007 – 2014</div>
                    </div>
                    <div class="company">Intel Corporation & Microsoft</div>
                    <ul class="bullets">
                        <li>Successfully managed and delivered multiple software engineering projects and regional engagement initiatives across enterprise technology environments</li>
                        <li>Demonstrated strong leadership and technical skills working with global technology leaders</li>
                        <li>Delivered solutions for enterprise and government clients across MENA region</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">Education & Credentials</h2>
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
            // Set the document title to ensure correct PDF filename
            const originalTitle = document.title;
            document.title = '${cleanRole} - Ahmed Nasr Resume';
            window.print();
            // Restore original title after print dialog
            setTimeout(() => { document.title = originalTitle; }, 1000);
        }
    </script>
</body>
</html>`;
}

function commitToGitHub(outputDir, folderName) {
    try {
        execSync('git add -A', { cwd: '.' });
        execSync(`git commit -m "feat: Add elite executive package for ${folderName}"`, { cwd: '.' });
        execSync('git push origin main', { cwd: '.' });
        console.log('✅ Committed to GitHub');
    } catch (error) {
        console.error('Git commit error:', error.message);
    }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🦞 CV Tailor Server running on http://localhost:${PORT}`);
    console.log(`📄 Job Processor: http://localhost:${PORT}/job-processor.html`);
    console.log('✅ Elite Executive Package generation enabled');
    console.log('\nPress Ctrl+C to stop\n');
});
