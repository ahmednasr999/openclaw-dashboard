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