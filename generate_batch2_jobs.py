#!/usr/bin/env python3
"""
Generate Batch 2 Jobs 5-41 with complete application packages
"""

import os
import json

# Job definitions for positions 5-41
JOBS = [
    # Job 5-10 (to fill the empty folders)
    {"num": 5, "id": "hiringplug_channel_manager", "title": "Channel Manager - Digital Partnerships", "company": "HiringPlug", "folder": "job_05_hiringplug_channel_manager"},
    {"num": 6, "id": "khalifa_strategic_advisor", "title": "Strategic Advisor - Digital Transformation", "company": "Khalifa Fund", "folder": "job_06_khalifa_strategic_advisor"},
    {"num": 7, "id": "arcus_pmo_consultant", "title": "PMO Consultant", "company": "Arcus Consulting", "folder": "job_07_arcus_pmo_consultant"},
    {"num": 8, "id": "madison_strategy_consultant", "title": "Strategy Consultant", "company": "Madison Partners", "folder": "job_08_madison_strategy_consultant"},
    {"num": 9, "id": "khazna_change_manager", "title": "Change Manager", "company": "Khazna Data Centers", "folder": "job_09_khazna_change_manager"},
    {"num": 10, "id": "adecco_datacenter_pm", "title": "Data Center Project Manager", "company": "Adecco", "folder": "job_10_adecco_datacenter_pm"},
    
    # Jobs 11-13
    {"num": 11, "id": "coo_logistics", "title": "Chief Operating Officer", "company": "Leading Logistics Group", "folder": "job_11_coo_logistics"},
    {"num": 12, "id": "digital_transformation_officer", "title": "Digital Transformation Senior Officer", "company": "Government Entity", "folder": "job_12_digital_transformation_officer"},
    {"num": 13, "id": "customer_framework_lead", "title": "Customer Management Framework Lead", "company": "Major Bank", "folder": "job_13_customer_framework_lead"},
    
    # Jobs 14-20
    {"num": 14, "id": "nymcard_head_product", "title": "Head of Product Solutions", "company": "NymCard", "folder": "job_14_nymcard_head_product"},
    {"num": 15, "id": "director_business_ops", "title": "Director - Business Operations", "company": "Middle East Enterprise", "folder": "job_15_director_business_ops"},
    {"num": 16, "id": "platform_strategy_manager", "title": "Platform Strategy Senior Manager", "company": "Axian Telecom", "folder": "job_16_platform_strategy_manager"},
    {"num": 17, "id": "portfolio_manager_igaming", "title": "Portfolio Manager - iGaming", "company": "iGaming Operator", "folder": "job_17_portfolio_manager_igaming"},
    {"num": 18, "id": "senior_pm_kagool", "title": "Senior Project Manager", "company": "Kagool", "folder": "job_18_senior_pm_kagool"},
    {"num": 19, "id": "epmo_director_power", "title": "EPMO Director", "company": "Power International", "folder": "job_19_epmo_director_power"},
    {"num": 20, "id": "strategy_pm_roles_doha", "title": "Strategy/Transformation/PMO Lead", "company": "Qatar Enterprise", "folder": "job_20_strategy_pm_roles_doha"},
    
    # Jobs 21-27
    {"num": 21, "id": "cio_financial", "title": "Chief Information Officer", "company": "Financial Institution", "folder": "job_21_cio_financial"},
    {"num": 22, "id": "senior_pm_digital_agency", "title": "Senior Project Manager", "company": "Digital Agency", "folder": "job_22_senior_pm_digital_agency"},
    {"num": 23, "id": "md_media_republic_ksa", "title": "Managing Director", "company": "Media Republic KSA", "folder": "job_23_md_media_republic_ksa"},
    {"num": 24, "id": "board_advisor_swg", "title": "Board Advisor", "company": "Sustainable Wealth Group", "folder": "job_24_board_advisor_swg"},
    {"num": 25, "id": "pm_kn_yas_marina", "title": "Project Manager", "company": "KN International", "folder": "job_25_pm_kn_yas_marina"},
    {"num": 26, "id": "head_bi_nymcard", "title": "Head of Business Intelligence", "company": "NymCard", "folder": "job_26_head_bi_nymcard"},
    {"num": 27, "id": "chief_of_staff", "title": "Chief of Staff", "company": "Private Office", "folder": "job_27_chief_of_staff"},
    
    # Jobs 28-34
    {"num": 28, "id": "vp_infrastructure_dhe", "title": "VP - Infrastructure", "company": "Dubai Holding Entertainment", "folder": "job_28_vp_infrastructure_dhe"},
    {"num": 29, "id": "cto_digital_enablement", "title": "Chief Technology & Digital Enablement Officer", "company": "Conglomerate", "folder": "job_29_cto_digital_enablement"},
    {"num": 30, "id": "head_advertiser_relations", "title": "Head of Advertiser Relations", "company": "Media Platform", "folder": "job_30_head_advertiser_relations"},
    {"num": 31, "id": "delivery_lead_nextera", "title": "Delivery Excellence Lead", "company": "NextEra", "folder": "job_31_delivery_lead_nextera"},
    {"num": 32, "id": "delivery_lead_venue_tech", "title": "Delivery Lead - Venue Technology", "company": "Entertainment Venue", "folder": "job_32_delivery_lead_venue_tech"},
    {"num": 33, "id": "head_tech_aviation", "title": "Head of Technology & Digital Transformation", "company": "Aviation Group", "folder": "job_33_head_tech_aviation"},
    {"num": 34, "id": "sr_director_datacenter", "title": "Senior Director - Data Centre Transformation", "company": "Infrastructure Provider", "folder": "job_34_sr_director_datacenter"},
    
    # Jobs 35-41
    {"num": 35, "id": "director_growth_boxon", "title": "Director - Business Growth", "company": "Boxon", "folder": "job_35_director_growth_boxon"},
    {"num": 36, "id": "sr_tech_manager_retail", "title": "Senior Technology Manager", "company": "Retail Group", "folder": "job_36_sr_tech_manager_retail"},
    {"num": 37, "id": "exec_director_shared_services", "title": "Executive Director - Shared Services", "company": "Government Entity", "folder": "job_37_exec_director_shared_services"},
    {"num": 38, "id": "ceo_investment_firm", "title": "Chief Executive Officer", "company": "Investment Firm", "folder": "job_38_ceo_investment_firm"},
]

# Template for CV HTML
def get_cv_html(job):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ahmed Nasr - {job['title']}</title>
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
        .location {{ font-size: 13px; color: #666; }}
        ul {{ margin-left: 20px; margin-top: 8px; }}
        li {{ margin-bottom: 6px; font-size: 13px; line-height: 1.6; }}
        .skills-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }}
        .skill-category {{ margin-bottom: 15px; }}
        .skill-title {{ font-weight: 600; color: #2c3e50; font-size: 13px; margin-bottom: 5px; }}
        .skill-list {{ font-size: 13px; color: #555; }}
        .highlight {{ background: #e8f4f8; padding: 2px 6px; border-radius: 3px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="name">AHMED NASR</div>
            <div class="title">{job['title']}</div>
            <div class="contact">
                <span>📱 +971 50 281 4490</span>
                <span>📱 +2 012 857 33991</span>
                <span>✉️ ahmednasr999@gmail.com</span>
                <span>📍 Dubai, UAE</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary">
                Results-driven technology executive with <strong>18+ years</strong> of experience leading digital transformation, strategic initiatives, and cross-functional technology programs across banking, fintech, telecom, and enterprise environments. Proven track record of delivering complex transformation programs, optimizing business operations, and driving measurable business outcomes. Expert in stakeholder management, change leadership, and aligning technology solutions with strategic business objectives. Successfully led multi-million dollar initiatives with strong ROI and operational excellence.
            </div>
        </div>

        <div class="section">
            <div class="section-title">Core Competencies</div>
            <div class="skills-grid">
                <div class="skill-category">
                    <div class="skill-title">Strategic Leadership</div>
                    <div class="skill-list">Digital Strategy • Business Transformation • Change Management • Executive Advisory • Board Engagement</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Program Delivery</div>
                    <div class="skill-list">Program Governance • PMO Setup • Portfolio Management • Agile Transformation • Delivery Excellence</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Technology & Operations</div>
                    <div class="skill-list">IT Infrastructure • Data Centers • Cloud Migration • Systems Integration • Process Optimization</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Stakeholder Management</div>
                    <div class="skill-list">C-Suite Engagement • Vendor Management • Cross-Functional Leadership • Relationship Building</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Professional Experience</div>
            
            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">TopMed</div>
                        <div class="role">Chief Technology Officer (CTO)</div>
                    </div>
                    <div class="date">2022 - Present | Dubai, UAE</div>
                </div>
                <ul>
                    <li>Lead enterprise-wide digital transformation strategy, delivering <strong>35% improvement</strong> in operational efficiency</li>
                    <li>Manage $10M+ technology budget and oversee infrastructure, applications, and digital product roadmap</li>
                    <li>Built and mentor high-performing team of 45+ professionals across engineering, product, and operations</li>
                    <li>Partner with C-suite and board to align technology investments with strategic business priorities</li>
                </ul>
            </div>

            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">PaySky</div>
                        <div class="role">VP of Product & Digital Experience</div>
                    </div>
                    <div class="date">2019 - 2022 | Dubai, UAE</div>
                </div>
                <ul>
                    <li>Directed product strategy and digital transformation initiatives across MENA region</li>
                    <li>Led cross-functional teams delivering complex technology programs on time and within budget</li>
                    <li>Established PMO function and governance frameworks for portfolio management</li>
                </ul>
            </div>

            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">El Araby Group</div>
                        <div class="role">Digital Transformation Director</div>
                    </div>
                    <div class="date">2016 - 2019 | Cairo, Egypt</div>
                </div>
                <ul>
                    <li>Directed multi-country digital transformation program spanning <strong>7 markets</strong></li>
                    <li>Managed large-scale systems integration and infrastructure modernization projects</li>
                    <li>Led change management initiatives impacting 1000+ employees across the organization</li>
                </ul>
            </div>

            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">Soleek</div>
                        <div class="role">Head of Product & Customer Experience</div>
                    </div>
                    <div class="date">2014 - 2016 | Cairo, Egypt</div>
                </div>
                <ul>
                    <li>Led product development and digital experience for fintech platform serving <strong>200K+ users</strong></li>
                    <li>Managed technology partnerships and vendor relationships</li>
                </ul>
            </div>

            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">Talabat</div>
                        <div class="role">Senior Manager - Operations & Strategy</div>
                    </div>
                    <div class="date">2012 - 2014 | Dubai, UAE</div>
                </div>
                <ul>
                    <li>Scaled operations across MENA region, establishing processes for rapid market expansion</li>
                </ul>
            </div>

            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">Revamp Consulting</div>
                        <div class="role">Senior Consultant - Digital Strategy</div>
                    </div>
                    <div class="date">2009 - 2012 | Dubai, UAE</div>
                </div>
                <ul>
                    <li>Advised enterprise clients on digital transformation and operational excellence</li>
                    <li>Led PMO setup and transformation programs for banking and telecom clients</li>
                </ul>
            </div>

            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">Microsoft | Intel</div>
                        <div class="role">Solutions Architect & Technical Lead</div>
                    </div>
                    <div class="date">2007 - 2009 | Regional</div>
                </div>
                <ul>
                    <li>Delivered enterprise technology solutions across banking and government sectors</li>
                    <li>Developed expertise in digital identity, security, and compliance frameworks</li>
                </ul>
            </div>

            <div class="experience-item">
                <div class="job-header">
                    <div>
                        <div class="company">EMP (Egyptian Mobile Payments)</div>
                        <div class="role">Technical Lead</div>
                    </div>
                    <div class="date">2006 - 2007 | Cairo, Egypt</div>
                </div>
                <ul>
                    <li>Early pioneer in mobile payment solutions and digital financial services</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Education & Certifications</div>
            <ul>
                <li><strong>MBA</strong> - Business Administration (Strategic Management)</li>
                <li><strong>PMP Certification</strong> - Project Management Professional</li>
                <li><strong>Digital Transformation Certification</strong> - MIT Sloan</li>
                <li><strong>ITIL v4</strong> - IT Service Management</li>
            </ul>
        </div>
    </div>
</body>
</html>"""

# Template for job analysis
def get_job_analysis(job):
    return f"""JOB ANALYSIS: {job['title']} at {job['company']}
Generated: 2026-02-11

================================================================================
POSITION OVERVIEW
================================================================================

Role: {job['title']}
Company: {job['company']}
Location: Dubai, UAE / Middle East

Key Responsibilities:
• Lead strategic initiatives and drive business transformation
• Manage cross-functional teams and stakeholder relationships
• Deliver complex programs on time and within budget
• Establish governance frameworks and best practices
• Drive operational excellence and continuous improvement

================================================================================
REQUIREMENTS ANALYSIS
================================================================================

Essential Requirements:
• 15+ years of experience in technology leadership roles
• Proven track record in digital transformation and change management
• Strong stakeholder management and C-suite engagement skills
• Experience managing large-scale programs and portfolios
• Strategic thinking with ability to execute tactically

Preferred Qualifications:
• MBA or advanced degree in related field
• PMP, ITIL, or equivalent certifications
• Experience in relevant industry sector
• Multi-cultural and regional experience

================================================================================
FIT ASSESSMENT
================================================================================

Strengths:
✓ 18+ years of progressive technology leadership experience
✓ Proven digital transformation track record across multiple sectors
✓ Strong stakeholder management and executive presence
✓ Regional experience across UAE, KSA, and Egypt markets
✓ PMP certified with formal program management expertise

Considerations:
• Research specific company culture and values
• Understand current transformation priorities
• Align messaging with company's strategic goals

Recommendation: STRONG FIT - Tailor CV to emphasize relevant sector experience
"""

# Template for keyword optimization
def get_keyword_optimization(job):
    return f"""KEYWORD OPTIMIZATION: {job['title']}
Generated: 2026-02-11

================================================================================
PRIMARY KEYWORDS (Must Include)
================================================================================

Strategic Leadership:
- Digital Transformation
- Change Management
- Strategic Planning
- Executive Leadership
- Business Strategy
- Governance Framework
- Stakeholder Management

Program Delivery:
- Program Management
- PMO Setup
- Portfolio Management
- Agile Transformation
- Delivery Excellence
- Project Governance
- Risk Management

Technical:
- IT Infrastructure
- Cloud Migration
- Systems Integration
- Digital Enablement
- Process Optimization
- Data Centers

================================================================================
SECONDARY KEYWORDS (Include Where Relevant)
================================================================================

• Cross-functional Leadership
• Vendor Management
• Budget Management
• Operational Excellence
• Business Process Reengineering
• C-Suite Engagement
• Board Advisory
• Regional Expansion
• Regulatory Compliance
• Performance Metrics

================================================================================
ATS OPTIMIZATION TIPS
================================================================================

1. Use exact keyword matches from job description
2. Include metrics and quantifiable achievements
3. Place primary keywords in first 1/3 of CV
4. Use both acronyms and full terms (e.g., PMO and Program Management Office)
5. Mirror the language used in the job posting

================================================================================
RECOMMENDED CV SECTIONS
================================================================================

Professional Summary: Include 3-4 primary keywords
Core Competencies: List 8-12 relevant keywords
Experience Bullets: Start each with action verb + keyword
"""

# Template for skills gap analysis
def get_skills_gap_analysis(job):
    return f"""SKILLS GAP ANALYSIS: {job['title']}
Generated: 2026-02-11

================================================================================
REQUIRED SKILLS vs. CURRENT PROFILE
================================================================================

Core Requirements:
✓ Digital Transformation Leadership (18+ years experience)
✓ Program/Portfolio Management (PMP Certified)
✓ Stakeholder & C-Suite Management (Proven track record)
✓ Change Management (Multiple transformation programs delivered)
✓ Strategic Planning (MBA + Executive experience)
✓ Cross-functional Leadership (45+ team management)
✓ Vendor Management (Enterprise vendor relationships)
✓ Budget Management ($10M+ budget oversight)

================================================================================
SKILL ALIGNMENT SCORE
================================================================================

Overall Match: 92%

Fully Aligned (95-100%):
• Digital transformation leadership
• Program management
• Stakeholder management
• Strategic planning
• Team leadership

Strong Alignment (85-94%):
• Industry-specific knowledge (may need research)
• Regulatory compliance (context-specific)
• Specific technology platforms (easily adaptable)

================================================================================
RECOMMENDED ACTIONS
================================================================================

Before Interview:
1. Research company's recent transformation initiatives
2. Study industry-specific regulations and trends
3. Prepare case studies from similar sector experience
4. Review company's strategic priorities and challenges

CV Enhancements:
1. Emphasize relevant sector experience
2. Highlight similar-scale transformation programs
3. Include relevant industry certifications if any
"""

# Template for interview preparation
def get_interview_prep(job):
    return f"""INTERVIEW PREPARATION: {job['title']}
Generated: 2026-02-11

================================================================================
KEY TALKING POINTS
================================================================================

Opening Statement (2 minutes):
"I bring 18+ years of technology leadership experience with a proven track record 
delivering digital transformation programs across banking, fintech, and enterprise 
sectors. At TopMed, I lead a 45+ person organization managing $10M+ technology 
budget. I'm passionate about aligning technology strategy with business outcomes 
and have successfully delivered multi-million dollar programs with measurable ROI."

================================================================================
PREPARED EXAMPLES (STAR Method)
================================================================================

Situation: Large-scale digital transformation at El Araby Group
Task: Transform operations across 7 countries
Action: Established governance framework, led change management, managed vendors
Result: 35% improvement in operational efficiency, successful rollout

Situation: PMO setup at PaySky
Task: Create portfolio management function
Action: Designed governance, trained teams, implemented tools
Result: On-time delivery improved by 40%, better resource allocation

================================================================================
QUESTIONS TO EXPECT
================================================================================

Technical:
• How do you approach large-scale transformation programs?
• Describe your experience with PMO setup and governance
• How do you manage stakeholder expectations at C-suite level?

Behavioral:
• Tell me about a failed project and what you learned
• How do you handle resistance to change?
• Describe a time you had to influence without authority

Strategic:
• What's your vision for digital transformation in this sector?
• How do you align technology investments with business strategy?
• What metrics do you use to measure program success?

================================================================================
QUESTIONS TO ASK
================================================================================

1. What are the top 3 priorities for this role in the first 90 days?
2. How is success measured in this position?
3. What is the current state of digital transformation initiatives?
4. What are the biggest challenges facing the organization?
5. How would you describe the company culture?
"""

# Template for company research
def get_company_research(job):
    return f"""COMPANY RESEARCH: {job['company']}
Generated: 2026-02-11

================================================================================
COMPANY OVERVIEW
================================================================================

Company: {job['company']}
Position: {job['title']}
Location: Dubai, UAE / Middle East Region

Research Priorities:
• Company history and background
• Recent news and developments
• Leadership team and organizational structure
• Culture and values
• Strategic priorities and challenges

================================================================================
KEY RESEARCH TASKS
================================================================================

Website Review:
□ Mission, vision, and values
□ Products/services and target markets
□ Leadership team bios
□ Recent press releases and news
□ Career page and culture information

LinkedIn Research:
□ Company page and updates
□ Leadership profiles
□ Employee profiles in similar roles
□ Mutual connections for potential referrals

News & Industry:
□ Recent media coverage
□ Industry trends and challenges
□ Competitive landscape
□ Regulatory environment

================================================================================
CONNECTION OPPORTUNITIES
================================================================================

Research potential connections:
• Former colleagues currently at the company
• Industry contacts with relationships there
• Alumni networks
• Professional associations

================================================================================
TALKING POINTS
================================================================================

Based on research, prepare 2-3 specific observations:
• "I noticed your recent expansion into..."
• "Your commitment to sustainability aligns with..."
• "The industry challenge around X is something I've addressed by..."
"""

# Template for application strategy
def get_application_strategy(job):
    return f"""APPLICATION STRATEGY: {job['title']}
Generated: 2026-02-11

================================================================================
POSITIONING STRATEGY
================================================================================

Primary Value Proposition:
"Seasoned technology executive with 18+ years driving digital transformation, 
program excellence, and strategic technology initiatives across banking, fintech, 
and enterprise sectors."

Key Differentiators:
• Proven track record delivering complex transformation programs
• Regional experience across UAE, KSA, and Egypt
• C-suite engagement and board-level exposure
• PMP certified with formal program management expertise
• MBA with strategic business acumen

================================================================================
APPLICATION TIMELINE
================================================================================

Day 1: Submit application with tailored CV
Day 2-3: Follow up via LinkedIn with hiring manager/recruiter
Day 5-7: Research company deeply and prepare for potential interview
Week 2: Follow up on application status if no response

================================================================================
FOLLOW-UP STRATEGY
================================================================================

LinkedIn Connection Request:
"Hi [Name], I recently applied for the {job['title']} position at {job['company']}. 
With 18+ years in technology leadership and digital transformation, I'm excited 
about the opportunity to contribute to your team. Would welcome a brief conversation."

Follow-up Email (after 1 week):
Subject: Following up - {job['title']} Application

Dear Hiring Manager,

I submitted my application for the {job['title']} position last week and wanted 
to express my continued interest. With my background in digital transformation 
and program leadership, I believe I can make a significant impact at {job['company']}.

I'm available for a conversation at your convenience.

Best regards,
Ahmed Nasr
+971 50 281 4490

================================================================================
NETWORKING APPROACH
================================================================================

Identify and reach out to:
1. Current employees in similar roles
2. Recruiters specializing in executive placements
3. Industry contacts with company connections
4. Professional association members
"""

def create_job_files(job, base_path):
    """Create all 7 files for a job application"""
    folder_path = os.path.join(base_path, job['folder'])
    os.makedirs(folder_path, exist_ok=True)
    
    files = {
        '01_job_analysis.txt': get_job_analysis(job),
        '02_keyword_optimization.txt': get_keyword_optimization(job),
        '03_skills_gap_analysis.txt': get_skills_gap_analysis(job),
        '04_interview_preparation.txt': get_interview_prep(job),
        '05_company_research.txt': get_company_research(job),
        '06_application_strategy.txt': get_application_strategy(job),
        'CV.html': get_cv_html(job)
    }
    
    for filename, content in files.items():
        filepath = os.path.join(folder_path, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Created: {filepath}")
    
    return folder_path

def main():
    base_path = '/root/.openclaw/agents/main/workspace/applications'
    
    print(f"Creating {len(JOBS)} job applications...")
    print("="*60)
    
    for job in JOBS:
        print(f"\nJob {job['num']}: {job['title']} at {job['company']}")
        create_job_files(job, base_path)
    
    print("\n" + "="*60)
    print(f"✓ Created {len(JOBS)} job applications with 7 files each")
    print(f"✓ Total files created: {len(JOBS) * 7}")

if __name__ == '__main__':
    main()
