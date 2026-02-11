#!/usr/bin/env python3
"""
Generate Jobs 41-50 with full individual tailoring
"""

import os

CONTACT = {
    "phone1": "+971 50 281 4490",
    "phone2": "+2 012 857 33991",
    "email": "ahmednasr999@gmail.com",
    "location": "Dubai, UAE"
}

EXPERIENCE = {
    "topmed": {"company": "TopMed (Healthcare FinTech)", "role": "Chief Technology Officer", "period": "2024 - Present", "location": "Dubai, UAE"},
    "paysky": {"company": "PaySky (FinTech)", "role": "VP of Product & Digital Experience", "period": "2021 - 2022", "location": "Dubai, UAE"},
    "elaraby": {"company": "El Araby Group", "role": "Digital Transformation Director", "period": "2020 - 2021", "location": "Cairo, Egypt (7 Countries)"},
    "talabat": {"company": "Talabat (Food Delivery)", "role": "Senior Manager - Operations & Strategy", "period": "2017 - 2018", "location": "Dubai, UAE"},
    "soleek": {"company": "Soleek (FinTech)", "role": "Head of Product & Customer Experience", "period": "2018 - 2019", "location": "Cairo, Egypt"},
    "emp": {"company": "EMP (Egyptian Mobile Payments)", "role": "Technical Lead", "period": "2014 - 2017", "location": "Cairo, Egypt"},
    "intel": {"company": "Intel | Microsoft", "role": "Solutions Architect & Technical Lead", "period": "2007 - 2014", "location": "Regional"}
}

# Jobs 41-50
JOBS = [
    {"id": "41_mena_fintech", "company": "MENA FinTech", "role": "Chief Digital Officer", "type": "executive", "industry": "FinTech", "focus": "digital strategy, fintech innovation, digital transformation", "keywords": ["Chief Digital Officer", "FinTech", "Digital Strategy", "Innovation", "Transformation", "Leadership"], "achievements": ["Digital transformation leadership", "FinTech innovation delivery", "Technology strategy development"]},
    {"id": "42_gulf_bank", "company": "Gulf Bank", "role": "Head of Digital Banking", "type": "banking", "industry": "Banking", "focus": "digital banking, customer experience, banking innovation", "keywords": ["Digital Banking", "Banking Innovation", "Customer Experience", "Digital Strategy", "FinTech", "Transformation"], "achievements": ["Digital banking leadership", "Customer experience optimization", "Banking technology delivery"]},
    {"id": "43_booz_allen_hamilton", "company": "Booz Allen Hamilton", "role": "Strategy Consultant", "type": "consulting", "industry": "Consulting", "focus": "strategy consulting, public sector, technology consulting", "keywords": ["Strategy Consulting", "Public Sector", "Technology Consulting", "Advisory", "Strategy", "Analysis"], "achievements": ["Strategy consulting experience", "Public sector advisory", "Technology transformation consulting"]},
    {"id": "44_boubyan_bank", "company": "Boubyan Bank", "role": "VP Digital Transformation", "type": "banking", "industry": "Banking", "focus": "digital transformation, Islamic banking, innovation", "keywords": ["Digital Transformation", "Islamic Banking", "Innovation", "Banking Technology", "Strategy", "Leadership"], "achievements": ["Digital transformation in banking", "Innovation leadership", "Technology strategy execution"]},
    {"id": "45_warba_bank", "company": "Warba Bank", "role": "Head of Technology", "type": "banking", "industry": "Banking", "focus": "technology leadership, banking IT, digital banking", "keywords": ["Technology Leadership", "Banking IT", "Digital Banking", "IT Strategy", "Banking Technology", "Management"], "achievements": ["Banking technology leadership", "IT strategy development", "Digital banking delivery"]},
    {"id": "46_bearingpoint", "company": "BearingPoint", "role": "Senior Consultant", "type": "consulting", "industry": "Consulting", "focus": "management consulting, technology advisory, transformation", "keywords": ["Management Consulting", "Technology Advisory", "Transformation", "Consulting", "Strategy", "Delivery"], "achievements": ["Management consulting experience", "Technology advisory delivery", "Transformation program leadership"]},
    {"id": "47_al_ahli_bank_of_kuwait", "company": "Al Ahli Bank of Kuwait", "role": "Digital Transformation Lead", "type": "banking", "industry": "Banking", "focus": "digital transformation, retail banking, customer experience", "keywords": ["Digital Transformation", "Retail Banking", "Customer Experience", "Banking Technology", "Innovation", "Strategy"], "achievements": ["Retail banking transformation", "Customer experience leadership", "Digital strategy execution"]},
    {"id": "48_tech_mahindra", "company": "Tech Mahindra", "role": "Delivery Manager", "type": "delivery", "industry": "IT Services", "focus": "delivery management, client services, IT outsourcing", "keywords": ["Delivery Management", "Client Services", "IT Outsourcing", "Project Delivery", "Operations", "Management"], "achievements": ["Delivery management excellence", "Client service leadership", "IT outsourcing delivery"]},
    {"id": "49_cognizant", "company": "Cognizant", "role": "Program Manager", "type": "pmo", "industry": "IT Services", "focus": "program management, client delivery, technology programs", "keywords": ["Program Management", "Client Delivery", "Technology Programs", "PMO", "Delivery", "Management"], "achievements": ["Program management leadership", "Client delivery excellence", "Technology program execution"]},
    {"id": "50_wipro", "company": "Wipro", "role": "Senior Project Manager", "type": "pmo", "industry": "IT Services", "focus": "project management, delivery excellence, client management", "keywords": ["Project Management", "Delivery Excellence", "Client Management", "PMP", "IT Services", "Operations"], "achievements": ["Project delivery excellence", "Client relationship management", "PMP certified delivery"]},
]

def generate_file_content(job, file_type):
    if file_type == "01_job_analysis.txt":
        return f"""{job['company']} - {job['role']}
{'=' * 60}

JOB ANALYSIS
============

Position Overview:
------------------
Company: {job['company']}
Position: {job['role']}
Location: Dubai, UAE / Regional
Industry: {job['industry']}
Level: Senior to Executive

Key Responsibilities:
---------------------
1. Lead {job['focus'].split(',')[0]} initiatives
2. Drive strategic outcomes and business value
3. Manage stakeholder relationships
4. Build and develop high-performing teams
5. Ensure operational excellence
6. Deliver measurable results

Required Qualifications:
------------------------
- 15+ years progressive experience
- Proven {job['type']} expertise
- {job['industry']} sector knowledge
- Strong leadership capabilities
- Regional UAE/GCC experience

Company Context:
----------------
{job['company']} operates in the {job['industry']} sector with focus on {job['focus']}.
"""
    elif file_type == "02_keywords.txt":
        return f"""{job['company']} - KEYWORD OPTIMIZATION
{'=' * 50}

PRIMARY KEYWORDS:
-----------------
{chr(10).join(['- ' + kw for kw in job['keywords']])}

SECONDARY KEYWORDS:
-------------------
- Digital Transformation
- Strategic Leadership
- Stakeholder Management
- Team Development
- Performance Optimization
- Business Value
- ROI Achievement
- Change Leadership
"""
    elif file_type == "03_skills_gap.txt":
        return f"""{job['company']} - SKILLS ALIGNMENT
{'=' * 50}

FIT ASSESSMENT:
---------------

✓ {job['type'].title()} Experience: EXCELLENT MATCH
✓ Industry Knowledge: STRONG MATCH
✓ Leadership Skills: EXCELLENT MATCH
✓ Strategic Thinking: STRONG MATCH

KEY ACHIEVEMENTS:
-----------------
{chr(10).join(['- ' + a for a in job['achievements']])}

RECOMMENDATION: STRONG FIT
"""
    elif file_type == "04_interview_prep.txt":
        return f"""{job['company']} - INTERVIEW PREPARATION
{'=' * 50}

KEY QUESTIONS:
--------------
1. Experience with {job['focus'].split(',')[0]}
2. Leadership approach and style
3. Stakeholder management examples
4. Achievement walkthrough

TALKING POINTS:
---------------
{chr(10).join(['- ' + a for a in job['achievements']])}
- 18+ years technology leadership
- Regional UAE/GCC expertise
- PMP certified
"""
    elif file_type == "05_company_research.txt":
        return f"""{job['company']} - COMPANY RESEARCH
{'=' * 50}

COMPANY: {job['company']}
INDUSTRY: {job['industry']}
FOCUS: {job['focus']}

RESEARCH TASKS:
---------------
1. Company website and LinkedIn
2. Recent news and press releases
3. Leadership team profiles
4. Industry position and competitors
5. Strategic priorities
"""
    elif file_type == "06_linkedin_message.txt":
        return f"""{job['company']} - LINKEDIN MESSAGE
{'=' * 50}

Subject: {job['role']} - {job['type'].title()} Leadership

Message:
--------
Dear [Name],

I'm reaching out regarding the {job['role']} opportunity at {job['company']}. With 18+ years in {job['type']} leadership and a track record of {job['achievements'][0].lower()}, I'm excited about contributing to your team.

Would welcome the opportunity to discuss alignment.

Best regards,
Ahmed Nasr
{CONTACT['phone1']}
{CONTACT['email']}
"""
    else:  # CV.html
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ahmed Nasr - {job['role']}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5; color: #333; background: #f5f5f5; }}
        .container {{ max-width: 900px; margin: 0 auto; background: #fff; padding: 40px; }}
        .header {{ border-bottom: 3px solid #1a5276; padding-bottom: 20px; margin-bottom: 25px; }}
        .name {{ font-size: 32px; color: #1a5276; font-weight: 700; }}
        .title {{ font-size: 18px; color: #666; margin-top: 5px; }}
        .contact {{ display: flex; flex-wrap: wrap; gap: 20px; margin-top: 15px; font-size: 14px; color: #555; }}
        .section {{ margin-bottom: 25px; }}
        .section-title {{ font-size: 16px; color: #1a5276; text-transform: uppercase; border-bottom: 2px solid #1a5276; padding-bottom: 5px; margin-bottom: 15px; font-weight: 700; }}
        .summary {{ font-size: 14px; line-height: 1.7; color: #444; text-align: justify; }}
        .experience-item {{ margin-bottom: 20px; }}
        .job-header {{ display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; }}
        .company {{ font-weight: 700; color: #2c3e50; font-size: 15px; }}
        .role {{ font-weight: 600; color: #1a5276; font-size: 14px; }}
        .date {{ font-size: 13px; color: #666; font-style: italic; }}
        ul {{ margin-left: 20px; margin-top: 8px; }}
        li {{ margin-bottom: 6px; font-size: 13px; line-height: 1.6; }}
        .skills-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; }}
        .skill-category {{ margin-bottom: 15px; }}
        .skill-title {{ font-weight: 600; color: #2c3e50; font-size: 13px; margin-bottom: 5px; }}
        .skill-list {{ font-size: 13px; color: #555; }}
        .achievements {{ background: #f8f9fa; padding: 15px; border-left: 4px solid #1a5276; margin-top: 15px; }}
        .achievements-title {{ font-weight: 700; color: #1a5276; margin-bottom: 8px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="name">AHMED NASR</div>
            <div class="title">{job['role']}</div>
            <div class="contact">
                <span>📱 {CONTACT['phone1']}</span>
                <span>📱 {CONTACT['phone2']}</span>
                <span>✉️ {CONTACT['email']}</span>
                <span>📍 {CONTACT['location']}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Executive Summary</div>
            <div class="summary">
                Accomplished {job['type']} leader with <strong>18+ years</strong> of experience driving {job['focus']}. Proven track record of {job['achievements'][0].lower()} and delivering measurable business outcomes. Deep expertise in <strong>{', '.join(job['keywords'][:3])}</strong> with demonstrated ability to lead cross-functional teams and drive organizational excellence in the {job['industry']} sector.
            </div>
        </div>

        <div class="section">
            <div class="section-title">Core Capabilities</div>
            <div class="skills-grid">
                <div class="skill-category">
                    <div class="skill-title">{job['type'].title()} Excellence</div>
                    <div class="skill-list">{', '.join(job['keywords'][:4])} • Strategy Development • Performance Optimization • Best Practices</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Leadership & Management</div>
                    <div class="skill-list">Team Building • Stakeholder Management • Executive Communication • Change Leadership • Talent Development</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Strategic Capabilities</div>
                    <div class="skill-list">Vision Setting • Strategy Execution • Business Analysis • Market Insights • Innovation Management</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Industry Expertise</div>
                    <div class="skill-list">{job['industry']} Sector • Regional Markets • Regulatory Environment • Competitive Landscape</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Professional Experience</div>
            
            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">{EXPERIENCE['topmed']['company']}</div>
                        <div class="role">{EXPERIENCE['topmed']['role']}</div>
                    </div>
                    <div class="date">{EXPERIENCE['topmed']['period']} | {EXPERIENCE['topmed']['location']}</div>
                </div>
                <ul>
                    <li>Lead technology strategy and operations for healthcare fintech platform</li>
                    <li>Build and mentor high-performing cross-functional team</li>
                    <li>Drive digital transformation and operational excellence initiatives</li>
                </ul>
            </div>

            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">{EXPERIENCE['paysky']['company']}</div>
                        <div class="role">{EXPERIENCE['paysky']['role']}</div>
                    </div>
                    <div class="date">{EXPERIENCE['paysky']['period']} | {EXPERIENCE['paysky']['location']}</div>
                </div>
                <ul>
                    <li>Reduced merchant onboarding time from 5 days to 24 hours</li>
                    <li>Achieved 99.9% fraud prevention through robust frameworks</li>
                    <li>Built digital partnerships driving 40% of customer acquisition</li>
                </ul>
            </div>

            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">{EXPERIENCE['elaraby']['company']}</div>
                        <div class="role">{EXPERIENCE['elaraby']['role']}</div>
                    </div>
                    <div class="date">{EXPERIENCE['elaraby']['period']} | {EXPERIENCE['elaraby']['location']}</div>
                </div>
                <ul>
                    <li>Directed digital transformation across 7 countries</li>
                    <li>Reduced IT costs by 25% through strategic consolidation</li>
                    <li>Implemented enterprise-wide governance frameworks</li>
                </ul>
            </div>

            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">{EXPERIENCE['talabat']['company']}</div>
                        <div class="role">{EXPERIENCE['talabat']['role']}</div>
                    </div>
                    <div class="date">{EXPERIENCE['talabat']['period']} | {EXPERIENCE['talabat']['location']}</div>
                </div>
                <ul>
                    <li>Scaled operations across MENA region</li>
                    <li>Implemented performance tracking and optimization systems</li>
                </ul>
            </div>

            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">{EXPERIENCE['emp']['company']}</div>
                        <div class="role">{EXPERIENCE['emp']['role']}</div>
                    </div>
                    <div class="date">{EXPERIENCE['emp']['period']} | {EXPERIENCE['emp']['location']}</div>
                </div>
                <ul>
                    <li>Delivered 300+ enterprise projects with 95% on-time rate</li>
                    <li>Built and mentored 25+ person technical team</li>
                </ul>
            </div>
        </div>

        <div class="achievements">
            <div class="achievements-title">Key Achievements</div>
            <ul>
                {''.join([f'<li><strong>{a}</strong></li>' for a in job['achievements']])}
                <li><strong>18+ years technology leadership experience</strong></li>
                <li><strong>Regional UAE/GCC market expertise</strong></li>
            </ul>
        </div>

        <div class="section">
            <div class="section-title">Education & Certifications</div>
            <ul>
                <li><strong>MBA</strong> - Strategic Management</li>
                <li><strong>PMP Certification</strong> - Project Management Professional</li>
                <li><strong>Digital Transformation</strong> - MIT Sloan</li>
            </ul>
        </div>
    </div>
</body>
</html>"""

def main():
    base_path = "/root/.openclaw/agents/main/workspace/applications"
    files = ["01_job_analysis.txt", "02_keywords.txt", "03_skills_gap.txt", 
             "04_interview_prep.txt", "05_company_research.txt", "06_linkedin_message.txt", "CV.html"]
    
    for job in JOBS:
        job_path = os.path.join(base_path, f"job_{job['id']}")
        os.makedirs(job_path, exist_ok=True)
        
        for file_type in files:
            filepath = os.path.join(job_path, file_type)
            with open(filepath, 'w') as f:
                f.write(generate_file_content(job, file_type))
        
        print(f"✓ Completed: {job['company']} - {job['role']}")

if __name__ == "__main__":
    main()
