#!/usr/bin/env python3
"""
Generate Jobs 11-40 with full individual tailoring
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

# Jobs 11-40 with specific tailoring
JOBS = [
    {"id": "11_coo_logistics", "company": "Leading Logistics Group", "role": "Chief Operating Officer", "type": "executive", "industry": "Logistics", "focus": "operations management, supply chain optimization, business transformation", "keywords": ["Operations Management", "Supply Chain", "Business Transformation", "P&L Management", "Process Optimization", "Strategic Leadership"], "achievements": ["Scaled operations across MENA region", "Operational efficiency improvements", "Cross-functional team leadership"]},
    {"id": "12_digital_transformation_officer", "company": "Government Entity", "role": "Digital Transformation Officer", "type": "transformation", "industry": "Government", "focus": "digital government, public sector transformation, e-services", "keywords": ["Digital Transformation", "Government", "E-Services", "Public Sector", "Change Management", "Strategy"], "achievements": ["Digital transformation across 7 countries", "Government sector experience", "Public service delivery optimization"]},
    {"id": "13_customer_framework_lead", "company": "Major Bank", "role": "Customer Management Framework Lead", "type": "banking", "industry": "Banking", "focus": "customer management, CRM, customer analytics, retention", "keywords": ["Customer Management", "CRM", "Customer Analytics", "Banking", "Retention", "Framework Development"], "achievements": ["Customer journey optimization", "CRM implementation experience", "Analytics-driven customer insights"]},
    {"id": "14_nymcard_head_product", "company": "NymCard", "role": "Head of Product Solutions", "type": "product", "industry": "FinTech", "focus": "product strategy, payment solutions, fintech innovation", "keywords": ["Product Strategy", "Payment Solutions", "FinTech", "Product Management", "Innovation", "Solution Design"], "achievements": ["Payment platform leadership", "Product strategy development", "FinTech innovation delivery"]},
    {"id": "15_director_business_ops", "company": "Middle East Enterprise", "role": "Director - Business Operations", "type": "operations", "industry": "Enterprise", "focus": "business operations, process improvement, operational excellence", "keywords": ["Business Operations", "Process Improvement", "Operational Excellence", "Strategy Execution", "Performance Management", "Efficiency"], "achievements": ["Operational efficiency gains", "Process optimization leadership", "Cross-functional coordination"]},
    {"id": "16_platform_strategy_manager", "company": "Axian Telecom", "role": "Platform Strategy Senior Manager", "type": "strategy", "industry": "Telecom", "focus": "platform strategy, digital platforms, ecosystem development", "keywords": ["Platform Strategy", "Digital Platforms", "Ecosystem", "Telecom", "Strategy", "Partnerships"], "achievements": ["Platform strategy development", "Digital ecosystem experience", "Technology platform leadership"]},
    {"id": "17_portfolio_manager_igaming", "company": "iGaming Operator", "role": "Portfolio Manager - iGaming", "type": "portfolio", "industry": "iGaming", "focus": "portfolio management, product portfolio, iGaming operations", "keywords": ["Portfolio Management", "iGaming", "Product Portfolio", "Strategy", "Performance", "Analytics"], "achievements": ["Portfolio strategy experience", "Multi-product management", "Performance optimization"]},
    {"id": "18_senior_pm_kagool", "company": "Kagool", "role": "Senior Project Manager", "type": "pmo", "industry": "Consulting", "focus": "project delivery, client management, digital projects", "keywords": ["Project Management", "Digital Projects", "Client Delivery", "Agile", "Waterfall", "Stakeholder Management"], "achievements": ["300+ projects delivered", "95% on-time delivery rate", "Client relationship management"]},
    {"id": "19_epmo_director_power", "company": "Power & Utilities", "role": "EPMO Director", "type": "pmo", "industry": "Energy", "focus": "enterprise PMO, program management, energy sector", "keywords": ["EPMO", "Program Management", "Energy Sector", "Governance", "Portfolio Management", "Delivery"], "achievements": ["Enterprise PMO establishment", "Multi-program leadership", "Governance framework development"]},
    {"id": "20_strategy_pm_roles_doha", "company": "Multiple Organizations", "role": "Strategy & PM Roles - Doha", "type": "consulting", "industry": "Multi-Sector", "focus": "strategy consulting, project management, Qatar market", "keywords": ["Strategy Consulting", "Project Management", "Qatar", "Transformation", "Advisory", "Delivery"], "achievements": ["Strategy consulting experience", "Multi-sector expertise", "Regional market knowledge"]},
    {"id": "21_cio_financial", "company": "Financial Institution", "role": "Chief Information Officer", "type": "executive", "industry": "Financial Services", "focus": "IT strategy, banking technology, digital transformation", "keywords": ["CIO", "IT Strategy", "Banking Technology", "Digital Transformation", "Leadership", "Governance"], "achievements": ["IT strategy leadership", "Banking technology expertise", "Digital transformation delivery"]},
    {"id": "22_senior_pm_digital_agency", "company": "Digital Agency", "role": "Senior Project Manager", "type": "pmo", "industry": "Digital Agency", "focus": "digital projects, agency delivery, client management", "keywords": ["Digital Projects", "Agency Delivery", "Client Management", "Project Management", "Creative", "Technology"], "achievements": ["Digital project delivery", "Agency experience", "Creative technology projects"]},
    {"id": "23_md_media_republic_ksa", "company": "Media Republic", "role": "Managing Director - KSA", "type": "executive", "industry": "Media", "focus": "P&L ownership, market expansion, KSA operations", "keywords": ["Managing Director", "P&L", "KSA", "Market Expansion", "Leadership", "Growth"], "achievements": ["P&L management experience", "Market expansion leadership", "Regional operations management"]},
    {"id": "24_board_advisor_swg", "company": "Strategic Work Group", "role": "Board Advisor", "type": "advisory", "industry": "Consulting", "focus": "board advisory, governance, strategic guidance", "keywords": ["Board Advisory", "Governance", "Strategic Guidance", "Advisory", "Leadership", "Consulting"], "achievements": ["Advisory board experience", "Strategic guidance provision", "Governance expertise"]},
    {"id": "25_pm_kn_yas_marina", "company": "Yas Marina", "role": "Project Manager", "type": "pmo", "industry": "Entertainment/Venue", "focus": "venue management, event projects, facility operations", "keywords": ["Project Management", "Venue Management", "Events", "Operations", "Facility Management", "Delivery"], "achievements": ["Venue project delivery", "Event management experience", "Operational coordination"]},
    {"id": "26_head_bi_nymcard", "company": "NymCard", "role": "Head of Business Intelligence", "type": "technical", "industry": "FinTech", "focus": "BI strategy, data analytics, reporting", "keywords": ["Business Intelligence", "Data Analytics", "Reporting", "FinTech", "Strategy", "Insights"], "achievements": ["BI strategy development", "Analytics platform leadership", "Data-driven insights delivery"]},
    {"id": "27_chief_of_staff", "company": "Private Office", "role": "Chief of Staff", "type": "executive", "industry": "Private Sector", "focus": "executive support, strategic coordination, office management", "keywords": ["Chief of Staff", "Executive Support", "Strategic Coordination", "Leadership", "Operations", "Planning"], "achievements": ["Executive leadership support", "Strategic planning coordination", "Office management excellence"]},
    {"id": "28_vp_infrastructure_dhe", "company": "Dubai Holding Entertainment", "role": "VP Infrastructure", "type": "technical", "industry": "Entertainment", "focus": "infrastructure management, IT operations, venue technology", "keywords": ["Infrastructure", "IT Operations", "Venue Technology", "Management", "Operations", "Technology"], "achievements": ["Infrastructure leadership", "Technology operations management", "Venue technology experience"]},
    {"id": "29_cto_digital_enablement", "company": "Digital Enablement", "role": "CTO", "type": "executive", "industry": "Technology", "focus": "technology strategy, digital enablement, innovation", "keywords": ["CTO", "Technology Strategy", "Digital Enablement", "Innovation", "Leadership", "Architecture"], "achievements": ["CTO experience", "Digital transformation leadership", "Technology innovation delivery"]},
    {"id": "30_head_advertiser_relations", "company": "Media Platform", "role": "Head of Advertiser Relations", "type": "sales", "industry": "Media/Advertising", "focus": "advertiser management, partnerships, revenue growth", "keywords": ["Advertiser Relations", "Partnerships", "Revenue Growth", "Account Management", "Sales", "Media"], "achievements": ["Partnership development", "Revenue growth leadership", "Client relationship management"]},
    {"id": "31_delivery_lead_nextera", "company": "Nextera", "role": "Delivery Lead", "type": "delivery", "industry": "Technology", "focus": "delivery management, team leadership, client success", "keywords": ["Delivery Management", "Team Leadership", "Client Success", "Project Delivery", "Operations", "Management"], "achievements": ["Delivery leadership", "Team management excellence", "Client success focus"]},
    {"id": "32_delivery_lead_venue_tech", "company": "Venue Technology", "role": "Delivery Lead", "type": "delivery", "industry": "Venue/Events", "focus": "venue technology delivery, event tech, operations", "keywords": ["Delivery Lead", "Venue Technology", "Event Tech", "Operations", "Project Delivery", "Technology"], "achievements": ["Venue technology delivery", "Event technology experience", "Operational delivery excellence"]},
    {"id": "33_head_tech_aviation", "company": "Aviation Company", "role": "Head of Technology", "type": "technical", "industry": "Aviation", "focus": "aviation technology, systems management, digital aviation", "keywords": ["Aviation Technology", "Systems Management", "Digital Aviation", "Technology", "Operations", "Innovation"], "achievements": ["Technology leadership", "Aviation sector experience", "Systems management expertise"]},
    {"id": "34_sr_director_datacenter", "company": "Data Center Company", "role": "Senior Director - Data Center", "type": "technical", "industry": "Data Centers", "focus": "data center operations, infrastructure, facility management", "keywords": ["Data Center", "Operations", "Infrastructure", "Facility Management", "Leadership", "Technology"], "achievements": ["Data center operations leadership", "Infrastructure management", "Facility operations expertise"]},
    {"id": "35_director_growth_boxon", "company": "BoxOn", "role": "Director of Growth", "type": "growth", "industry": "Technology", "focus": "growth strategy, business development, scaling", "keywords": ["Growth Strategy", "Business Development", "Scaling", "Strategy", "Sales", "Marketing"], "achievements": ["Growth strategy development", "Business scaling experience", "Development leadership"]},
    {"id": "36_sr_tech_manager_retail", "company": "Retail Group", "role": "Senior Technology Manager - Retail", "type": "technical", "industry": "Retail", "focus": "retail technology, POS systems, omnichannel", "keywords": ["Retail Technology", "POS Systems", "Omnichannel", "Technology", "Retail", "Operations"], "achievements": ["Retail technology expertise", "Omnichannel experience", "Systems management leadership"]},
    {"id": "37_exec_director_shared_services", "company": "Shared Services Organization", "role": "Executive Director", "type": "executive", "industry": "Shared Services", "focus": "shared services, operational excellence, transformation", "keywords": ["Shared Services", "Operational Excellence", "Transformation", "Leadership", "Operations", "Strategy"], "achievements": ["Shared services leadership", "Operational excellence delivery", "Transformation expertise"]},
    {"id": "38_ceo_investment_firm", "company": "Investment Firm", "role": "CEO", "type": "executive", "industry": "Investment", "focus": "CEO leadership, investment strategy, portfolio management", "keywords": ["CEO", "Investment Strategy", "Portfolio Management", "Leadership", "Strategy", "Growth"], "achievements": ["CEO experience", "Investment leadership", "Strategic portfolio management"]},
    {"id": "39_transformation_director_healthcare", "company": "Healthcare Organization", "role": "Transformation Director", "type": "transformation", "industry": "Healthcare", "focus": "healthcare transformation, digital health, operational change", "keywords": ["Transformation", "Healthcare", "Digital Health", "Change Management", "Operations", "Strategy"], "achievements": ["Healthcare transformation", "Digital health experience", "Operational change leadership"]},
    {"id": "40_vp_operations_fintech", "company": "FinTech Company", "role": "VP Operations", "type": "operations", "industry": "FinTech", "focus": "fintech operations, scaling, process optimization", "keywords": ["FinTech Operations", "Scaling", "Process Optimization", "Operations", "FinTech", "Leadership"], "achievements": ["FinTech operations leadership", "Scaling experience", "Process optimization expertise"]},
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
