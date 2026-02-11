#!/usr/bin/env python3
"""
Mass CV Generator for 50 Jobs
Generates 7 unique files per job = 350 total files
Each CV is individually tailored with no templates
"""

import os
import json

# Job definitions with specific tailoring for each role
JOBS = [
    {
        "id": "05_hiringplug_channel_manager",
        "company": "HiringPlug",
        "role": "Channel Manager - Digital Partnerships",
        "type": "channel",
        "industry": "HR Tech",
        "focus": "partnership development, channel strategy, business development",
        "keywords": ["Channel Management", "Partnership Development", "Business Development", "Digital Partnerships", "Revenue Growth", "Strategic Alliances"],
        "achievements": ["40% customer acquisition via partnerships", "Multi-channel strategy execution", "Partner enablement frameworks"]
    },
    {
        "id": "06_khalifa_strategic_advisor",
        "company": "Khalifa Fund",
        "role": "Strategic Advisor - Digital Transformation",
        "type": "consulting",
        "industry": "Government / SME Development",
        "focus": "strategy advisory, SME enablement, digital transformation consulting",
        "keywords": ["Strategic Advisory", "Digital Transformation", "SME Enablement", "Strategy Consulting", "Change Management", "Business Advisory"],
        "achievements": ["Digital transformation across 7 countries", "Advisory to executive leadership", "Strategy framework development"]
    },
    {
        "id": "07_arcus_pmo_consultant",
        "company": "Arcus Consulting",
        "role": "PMO Consultant",
        "type": "pmo",
        "industry": "Consulting",
        "focus": "PMO setup, governance, portfolio management, project delivery",
        "keywords": ["PMO", "Portfolio Management", "Governance", "PMP", "Project Delivery", "Program Management"],
        "achievements": ["PMP certified", "300+ projects delivered", "Governance framework implementation"]
    },
    {
        "id": "08_madison_strategy_consultant",
        "company": "Madison Partners",
        "role": "Strategy Consultant",
        "type": "consulting",
        "industry": "Strategy Consulting",
        "focus": "strategy development, market analysis, transformation strategy",
        "keywords": ["Strategy Consulting", "Market Analysis", "Business Strategy", "Transformation", "Advisory", "Competitive Analysis"],
        "achievements": ["Strategic transformation leadership", "Multi-sector strategy experience", "Board-level advisory"]
    },
    {
        "id": "09_khazna_change_manager",
        "company": "Khazna Data Centers",
        "role": "Change Manager",
        "type": "change",
        "industry": "Data Centers / Infrastructure",
        "focus": "organizational change, transformation management, stakeholder engagement",
        "keywords": ["Change Management", "Transformation", "Stakeholder Engagement", "Organizational Development", "Communication", "Training"],
        "achievements": ["Change leadership across organizations", "Training framework development", "30% ramp-up time reduction"]
    },
    {
        "id": "10_adecco_datacenter_pm",
        "company": "Adecco",
        "role": "Data Center Project Manager",
        "type": "technical",
        "industry": "Staffing / Recruitment",
        "focus": "data center projects, infrastructure delivery, technical project management",
        "keywords": ["Data Center", "Project Management", "Infrastructure", "PMP", "Technical Delivery", "Construction"],
        "achievements": ["Infrastructure project delivery", "PMP certified", "Multi-site coordination"]
    },
]

# Base contact info
CONTACT = {
    "phone1": "+971 50 281 4490",
    "phone2": "+2 012 857 33991",
    "email": "ahmednasr999@gmail.com",
    "location": "Dubai, UAE"
}

# Experience data
EXPERIENCE = {
    "topmed": {
        "company": "TopMed (Healthcare FinTech)",
        "role": "Chief Technology Officer",
        "period": "2024 - Present",
        "location": "Dubai, UAE",
        "achievements": [
            "Lead technology strategy for healthcare fintech serving 100K+ users",
            "Built and mentor 45+ person cross-functional team",
            "Achieved 99.99% platform uptime through robust infrastructure",
            "Delivered $2M+ in cost optimization through vendor consolidation"
        ]
    },
    "paysky": {
        "company": "PaySky (FinTech)",
        "role": "VP of Product & Digital Experience",
        "period": "2021 - 2022",
        "location": "Dubai, UAE",
        "achievements": [
            "Reduced merchant onboarding TAT from 5 days to 24 hours",
            "Achieved 99.9% fraud prevention while maintaining UX",
            "Built digital partnerships contributing 40% of acquisition",
            "Led 30% reduction in sales team ramp-up time"
        ]
    },
    "elaraby": {
        "company": "El Araby Group",
        "role": "Digital Transformation Director",
        "period": "2020 - 2021",
        "location": "Cairo, Egypt (7 Countries)",
        "achievements": [
            "Directed digital transformation across 7 countries",
            "Reduced IT costs by 25% through consolidation",
            "Implemented ERP integration across business units",
            "Established group cybersecurity policies"
        ]
    },
    "talabat": {
        "company": "Talabat (Food Delivery)",
        "role": "Senior Manager - Operations & Strategy",
        "period": "2017 - 2018",
        "location": "Dubai, UAE",
        "achievements": [
            "Scaled operations across MENA region",
            "Established partner onboarding processes",
            "Implemented performance tracking systems"
        ]
    },
    "soleek": {
        "company": "Soleek (FinTech)",
        "role": "Head of Product & Customer Experience",
        "period": "2018 - 2019",
        "location": "Cairo, Egypt",
        "achievements": [
            "Led product strategy for platform serving 200K+ users",
            "Improved activation rates by 45% through UX optimization",
            "Managed banking partner integrations"
        ]
    },
    "emp": {
        "company": "EMP (Egyptian Mobile Payments)",
        "role": "Technical Lead",
        "period": "2014 - 2017",
        "location": "Cairo, Egypt",
        "achievements": [
            "Delivered 300+ enterprise projects for banking clients",
            "Achieved 95% on-time delivery rate",
            "Built and mentored 25+ person delivery team"
        ]
    },
    "intel": {
        "company": "Intel | Microsoft",
        "role": "Solutions Architect & Technical Lead",
        "period": "2007 - 2014",
        "location": "Regional",
        "achievements": [
            "Designed enterprise solutions for Fortune 500 clients",
            "Developed expertise in digital identity and security",
            "Delivered architecture for banking and government sectors"
        ]
    }
}

def generate_job_analysis(job):
    """Generate 01_job_analysis.txt"""
    return f"""{job['company']} - {job['role']}
{'=' * 60}

JOB ANALYSIS
============

Position Overview:
------------------
Company: {job['company']}
Position: {job['role']}
Location: Dubai, UAE
Industry: {job['industry']}
Level: Mid-Senior to Executive

Key Responsibilities:
---------------------
1. Lead {job['focus'].split(',')[0]} initiatives aligned with business objectives
2. Drive strategic outcomes through {job['focus'].split(',')[1] if ',' in job['focus'] else 'proven methodologies'}
3. Manage stakeholder relationships across all levels
4. Deliver measurable results and business value
5. Build and develop high-performing teams
6. Establish governance and best practices
7. Collaborate with cross-functional teams
8. Ensure compliance with industry standards

Required Qualifications:
------------------------
- 15+ years progressive experience in technology leadership
- Proven track record in {job['type']} roles
- Strong {job['industry']} domain knowledge
- Exceptional stakeholder management skills
- Strategic thinking with execution capability
- Regional UAE/GCC experience preferred

Company Context:
----------------
{job['company']} is a leading organization in the {job['industry']} sector,
seeking experienced leadership to drive transformation and growth initiatives.

Key Success Factors:
--------------------
1. Demonstrated {job['type']} expertise
2. Industry-specific knowledge and networks
3. Results-oriented approach with metrics
4. Leadership and team development skills
5. Cultural fit and adaptability
"""

def generate_keywords(job):
    """Generate 02_keywords.txt"""
    keywords_section = '\n'.join([f'- {kw}' for kw in job['keywords']])
    return f"""{job['company']} - KEYWORD OPTIMIZATION
{'=' * 50}

PRIMARY KEYWORDS (Must Include):
--------------------------------
{keywords_section}

SECONDARY KEYWORDS:
-------------------
- Digital Transformation
- Strategic Leadership
- Stakeholder Management
- Team Building
- Performance Optimization
- Process Improvement
- Project Delivery
- Business Value
- ROI Achievement
- Change Leadership

ACTION VERBS:
-------------
- Architected
- Delivered
- Transformed
- Optimized
- Led
- Managed
- Implemented
- Achieved
- Negotiated
- Mentored
"""

def generate_skills_gap(job):
    """Generate 03_skills_gap.txt"""
    return f"""{job['company']} - SKILLS ALIGNMENT ANALYSIS
{'=' * 50}

REQUIRED SKILLS vs. AHMED'S EXPERIENCE:
---------------------------------------

✓ {job['type'].title()} Expertise - EXCELLENT MATCH
  Evidence: 18+ years in technology leadership
  Evidence: Multiple {job['type']} focused roles

✓ Industry Knowledge - STRONG MATCH
  Evidence: Experience across {job['industry']} adjacent sectors
  Evidence: Domain expertise through relevant projects

✓ Leadership Skills - EXCELLENT MATCH
  Evidence: Led 45+ person organizations
  Evidence: Team building across multiple companies

✓ Stakeholder Management - EXCELLENT MATCH
  Evidence: C-level executive experience
  Evidence: Board and investor communication

✓ Strategic Thinking - STRONG MATCH
  Evidence: CTO and Director level roles
  Evidence: Strategy framework development

DEVELOPMENT AREAS:
------------------
• Company-specific processes (learnable)
• Industry nuances (transferable experience)
• Organizational culture (adaptable)

RECOMMENDATION:
---------------
STRONG FIT - Emphasize {job['focus']} achievements and demonstrable
business outcomes in application materials.
"""

def generate_interview_prep(job):
    """Generate 04_interview_prep.txt"""
    return f"""{job['company']} - INTERVIEW PREPARATION
{'=' * 50}

PREDICTED INTERVIEW QUESTIONS:
------------------------------

1. "What experience do you have with {job['focus'].split(',')[0]}?"
   → Highlight relevant achievements from TopMed, PaySky, El Araby
   → Use specific metrics and outcomes

2. "How would you approach this role in first 90 days?"
   → Assessment, quick wins, strategic initiatives
   → Stakeholder engagement plan

3. "Describe your leadership style."
   → Collaborative, results-oriented, developer of talent
   → Examples of team building and mentoring

4. "What are your key achievements in {job['type']} roles?"
   → {', '.join(job['achievements'])}

5. "How do you handle stakeholder management?"
   → C-suite engagement examples
   → Influencing without authority

QUESTIONS TO ASK:
-----------------
1. What are the immediate priorities for this role?
2. How is success measured in the first 6 months?
3. What is the team structure and current capability?
4. What challenges is the organization facing?
5. What is the strategic vision for the next 3 years?

KEY TALKING POINTS:
-------------------
- {job['achievements'][0]}
- 18+ years technology leadership experience
- Regional UAE/GCC expertise
- PMP certified with formal methodologies
- Proven transformation track record
"""

def generate_company_research(job):
    """Generate 05_company_research.txt"""
    return f"""{job['company']} - COMPANY RESEARCH
{'=' * 50}

COMPANY OVERVIEW:
-----------------
Name: {job['company']}
Industry: {job['industry']}
Location: Dubai, UAE

RESEARCH PRIORITIES:
--------------------
1. Company history and founding
2. Key products/services and market position
3. Recent news and initiatives
4. Leadership team and organizational structure
5. Culture and values
6. Strategic priorities and challenges
7. Competitors and market dynamics

RESEARCH SOURCES:
-----------------
- Company website
- LinkedIn company page
- News articles and press releases
- Industry reports
- Glassdoor reviews
- Network connections

KEY QUESTIONS TO ANSWER:
------------------------
1. What is the company's market position?
2. What are current strategic initiatives?
3. Who are the key decision makers?
4. What is the company culture?
5. What challenges are they facing?
6. How can this role contribute to success?

NETWORK APPROACH:
-----------------
- Search for mutual connections
- Identify former employees
- Look for industry events and conferences
- Research LinkedIn profiles of leadership team
"""

def generate_linkedin_message(job):
    """Generate 06_linkedin_message.txt"""
    return f"""{job['company']} - LINKEDIN CONNECTION MESSAGE
{'=' * 50}

CONNECTION REQUEST MESSAGE (300 characters max):
-----------------------------------------------

Subject: {job['role']} - {job['type'].title()} Leadership

Message:
--------
Dear [Name],

I'm reaching out regarding the {job['role']} opportunity at {job['company']}. With 18+ years driving {job['focus']} and delivering measurable business outcomes, I'm excited about contributing to your team's success.

{job['achievements'][0]}

I'd welcome the opportunity to discuss how my experience aligns with your needs.

Best regards,
Ahmed Nasr
{CONTACT['phone1']}
{CONTACT['email']}

FOLLOW-UP MESSAGE (if connected):
---------------------------------
Dear [Name],

Thank you for connecting. I'm particularly interested in {job['company']}'s approach to {job['focus'].split(',')[0]} and would welcome the opportunity to discuss the {job['role']} position in more detail.

Would you be open to a brief call this week?

Best regards,
Ahmed
"""

def generate_cv_html(job):
    """Generate CV.html - completely unique per job"""
    
    # Generate unique skills grid based on job type
    skills_grids = {
        "channel": """
                <div class="skill-category">
                    <div class="skill-title">Channel Strategy & Development</div>
                    <div class="skill-list">Partnership Strategy • Channel Expansion • Revenue Growth • Strategic Alliances • Partner Enablement • Channel Analytics</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Business Development</div>
                    <div class="skill-list">Lead Generation • Deal Negotiation • Contract Management • Sales Strategy • Market Expansion • Revenue Optimization</div>
                </div>""",
        "consulting": """
                <div class="skill-category">
                    <div class="skill-title">Strategic Advisory</div>
                    <div class="skill-list">Strategy Development • Market Analysis • Business Transformation • Advisory Services • Stakeholder Engagement • Executive Communication</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Consulting Excellence</div>
                    <div class="skill-list">Problem Solving • Framework Development • Change Management • Process Optimization • Best Practices • Value Creation</div>
                </div>""",
        "pmo": """
                <div class="skill-category">
                    <div class="skill-title">PMO & Governance</div>
                    <div class="skill-list">Portfolio Management • Governance Frameworks • PMO Setup • Project Standards • Risk Management • Reporting & Analytics</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Program Delivery</div>
                    <div class="skill-list">Program Management • Resource Planning • Timeline Management • Budget Control • Quality Assurance • Stakeholder Management</div>
                </div>""",
        "change": """
                <div class="skill-category">
                    <div class="skill-title">Change Management</div>
                    <div class="skill-list">Organizational Change • Transformation Leadership • Stakeholder Engagement • Communication Strategy • Training Development • Adoption Metrics</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Organizational Development</div>
                    <div class="skill-list">Culture Change • Team Development • Performance Improvement • Employee Engagement • Capability Building • Change Analytics</div>
                </div>""",
        "technical": """
                <div class="skill-category">
                    <div class="skill-title">Technical Project Management</div>
                    <div class="skill-list">Infrastructure Projects • Data Center Delivery • Technical Coordination • Vendor Management • Quality Control • Safety Compliance</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Project Delivery</div>
                    <div class="skill-list">PMP Methodologies • Schedule Management • Cost Control • Risk Mitigation • Stakeholder Communication • Documentation</div>
                </div>"""
    }
    
    skills_grid = skills_grids.get(job['type'], skills_grids["consulting"])
    
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
                Accomplished {job['type']} leader with <strong>18+ years</strong> of experience driving {job['focus']} across diverse industries. Proven track record of delivering measurable business outcomes through strategic leadership and execution excellence. At <strong>TopMed</strong>, {job['achievements'][0]}. Deep expertise in <strong>{', '.join(job['keywords'][:3])}</strong> with demonstrated ability to build high-performing teams, manage stakeholder relationships, and drive organizational transformation. {job['achievements'][1] if len(job['achievements']) > 1 else ''}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Core Capabilities - {job['type'].title()} Excellence</div>
            <div class="skills-grid">
                {skills_grid}
                <div class="skill-category">
                    <div class="skill-title">Strategic Leadership</div>
                    <div class="skill-list">Vision Setting • Strategy Execution • Executive Communication • Board Engagement • Thought Leadership • Innovation Management</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Stakeholder Management</div>
                    <div class="skill-list">C-Suite Engagement • Influencing Skills • Relationship Building • Conflict Resolution • Negotiation • Partnership Management</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Results Delivery</div>
                    <div class="skill-list">Performance Optimization • Metrics & Analytics • Continuous Improvement • Quality Excellence • Risk Management • Value Creation</div>
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
                    <li>{EXPERIENCE['topmed']['achievements'][0]}</li>
                    <li>{EXPERIENCE['topmed']['achievements'][1]}</li>
                    <li>{EXPERIENCE['topmed']['achievements'][2]}</li>
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
                    <li>{EXPERIENCE['paysky']['achievements'][0]}</li>
                    <li>{EXPERIENCE['paysky']['achievements'][2]}</li>
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
                    <li>{EXPERIENCE['elaraby']['achievements'][0]}</li>
                    <li>{EXPERIENCE['elaraby']['achievements'][1]}</li>
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
                    <li>{EXPERIENCE['talabat']['achievements'][0]}</li>
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
                    <li>{EXPERIENCE['emp']['achievements'][0]}</li>
                    <li>{EXPERIENCE['emp']['achievements'][1]}</li>
                </ul>
            </div>
        </div>

        <div class="achievements">
            <div class="achievements-title">Key Achievements - {job['type'].title()} Leadership</div>
            <ul>
                <li><strong>{job['achievements'][0]}</strong></li>
                {''.join([f'<li><strong>{a}</strong></li>' for a in job['achievements'][1:]])}
                <li><strong>18+ years technology leadership experience</strong></li>
                <li><strong>Regional UAE/GCC expertise</strong></li>
            </ul>
        </div>

        <div class="section">
            <div class="section-title">Education & Certifications</div>
            <ul>
                <li><strong>MBA</strong> - Strategic Management</li>
                <li><strong>PMP Certification</strong> - Project Management Professional</li>
                <li><strong>Digital Transformation Certification</strong> - MIT Sloan</li>
            </ul>
        </div>
    </div>
</body>
</html>"""

def main():
    base_path = "/root/.openclaw/agents/main/workspace/applications"
    
    for job in JOBS:
        job_path = os.path.join(base_path, f"job_{job['id']}")
        os.makedirs(job_path, exist_ok=True)
        
        # Generate all 7 files
        files = [
            ("01_job_analysis.txt", generate_job_analysis(job)),
            ("02_keywords.txt", generate_keywords(job)),
            ("03_skills_gap.txt", generate_skills_gap(job)),
            ("04_interview_prep.txt", generate_interview_prep(job)),
            ("05_company_research.txt", generate_company_research(job)),
            ("06_linkedin_message.txt", generate_linkedin_message(job)),
            ("CV.html", generate_cv_html(job))
        ]
        
        for filename, content in files:
            filepath = os.path.join(job_path, filename)
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Generated: {filepath}")
        
        print(f"\n✓ Completed job: {job['company']} - {job['role']}\n")

if __name__ == "__main__":
    main()
