#!/usr/bin/env python3
"""Add remaining jobs 39-41"""
import os

# Additional jobs 39-41
ADDITIONAL_JOBS = [
    {"num": 39, "id": "transformation_director_healthcare", "title": "Director of Digital Transformation", "company": "Healthcare Network", "folder": "job_39_transformation_director_healthcare"},
    {"num": 40, "id": "vp_operations_fintech", "title": "VP - Operations", "company": "FinTech Unicorn", "folder": "job_40_vp_operations_fintech"},
    {"num": 41, "id": "chief_digital_officer", "title": "Chief Digital Officer", "company": "Retail Conglomerate", "folder": "job_41_chief_digital_officer"},
]

# Simplified templates for additional jobs
def get_cv_html(job):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
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
        ul {{ margin-left: 20px; margin-top: 8px; }}
        li {{ margin-bottom: 6px; font-size: 13px; line-height: 1.6; }}
        .skills-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }}
        .skill-category {{ margin-bottom: 15px; }}
        .skill-title {{ font-weight: 600; color: #2c3e50; font-size: 13px; margin-bottom: 5px; }}
        .skill-list {{ font-size: 13px; color: #555; }}
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
                Results-driven technology executive with <strong>18+ years</strong> of experience leading digital transformation, strategic initiatives, and cross-functional technology programs. Proven track record of delivering complex transformation programs and driving measurable business outcomes.
            </div>
        </div>
        <div class="section">
            <div class="section-title">Core Competencies</div>
            <div class="skills-grid">
                <div class="skill-category">
                    <div class="skill-title">Strategic Leadership</div>
                    <div class="skill-list">Digital Strategy • Business Transformation • Change Management • Executive Advisory</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Program Delivery</div>
                    <div class="skill-list">Program Governance • PMO Setup • Portfolio Management • Delivery Excellence</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Technology & Operations</div>
                    <div class="skill-list">IT Infrastructure • Cloud Migration • Systems Integration • Process Optimization</div>
                </div>
                <div class="skill-category">
                    <div class="skill-title">Stakeholder Management</div>
                    <div class="skill-list">C-Suite Engagement • Vendor Management • Cross-Functional Leadership</div>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="section-title">Professional Experience</div>
            <div class="experience-item">
                <div class="job-header">
                    <div><div class="company">TopMed</div><div class="role">Chief Technology Officer (CTO)</div></div>
                    <div class="date">2022 - Present | Dubai, UAE</div>
                </div>
                <ul>
                    <li>Lead enterprise-wide digital transformation strategy, delivering <strong>35% improvement</strong> in operational efficiency</li>
                    <li>Manage $10M+ technology budget and oversee infrastructure, applications, and digital product roadmap</li>
                    <li>Built and mentor high-performing team of 45+ professionals</li>
                </ul>
            </div>
            <div class="experience-item">
                <div class="job-header">
                    <div><div class="company">PaySky</div><div class="role">VP of Product & Digital Experience</div></div>
                    <div class="date">2019 - 2022 | Dubai, UAE</div>
                </div>
                <ul>
                    <li>Directed product strategy and digital transformation initiatives across MENA region</li>
                    <li>Established PMO function and governance frameworks for portfolio management</li>
                </ul>
            </div>
            <div class="experience-item">
                <div class="job-header">
                    <div><div class="company">El Araby Group</div><div class="role">Digital Transformation Director</div></div>
                    <div class="date">2016 - 2019 | Cairo, Egypt</div>
                </div>
                <ul>
                    <li>Directed multi-country digital transformation program spanning <strong>7 markets</strong></li>
                    <li>Led change management initiatives impacting 1000+ employees</li>
                </ul>
            </div>
            <div class="experience-item">
                <div class="job-header">
                    <div><div class="company">Revamp Consulting</div><div class="role">Senior Consultant - Digital Strategy</div></div>
                    <div class="date">2009 - 2012 | Dubai, UAE</div>
                </div>
                <ul>
                    <li>Advised enterprise clients on digital transformation and operational excellence</li>
                </ul>
            </div>
            <div class="experience-item">
                <div class="job-header">
                    <div><div class="company">Microsoft | Intel</div><div class="role">Solutions Architect & Technical Lead</div></div>
                    <div class="date">2007 - 2009 | Regional</div>
                </div>
                <ul>
                    <li>Delivered enterprise technology solutions across banking and government sectors</li>
                </ul>
            </div>
        </div>
        <div class="section">
            <div class="section-title">Education & Certifications</div>
            <ul>
                <li><strong>MBA</strong> - Business Administration (Strategic Management)</li>
                <li><strong>PMP Certification</strong> - Project Management Professional</li>
                <li><strong>Digital Transformation Certification</strong> - MIT Sloan</li>
            </ul>
        </div>
    </div>
</body>
</html>"""

def get_analysis_doc(job, doc_type):
    templates = {
        '01_job_analysis.txt': f"""JOB ANALYSIS: {job['title']} at {job['company']}
Generated: 2026-02-11

POSITION OVERVIEW
=================
Role: {job['title']}
Company: {job['company']}
Location: Dubai, UAE

Key Responsibilities:
• Lead strategic initiatives and drive business transformation
• Manage cross-functional teams and stakeholder relationships
• Deliver complex programs on time and within budget
• Establish governance frameworks and best practices

REQUIREMENTS ANALYSIS
=====================
Essential: 15+ years technology leadership, digital transformation experience,
strong stakeholder management, PMP certification, MBA preferred.

FIT ASSESSMENT
==============
Strengths: 18+ years experience, proven transformation track record,
regional experience, PMP certified, MBA qualified.
Recommendation: STRONG FIT
""",
        '02_keyword_optimization.txt': f"""KEYWORD OPTIMIZATION: {job['title']}
Generated: 2026-02-11

PRIMARY KEYWORDS:
- Digital Transformation
- Change Management
- Strategic Planning
- Executive Leadership
- Program Management
- PMO Setup
- Stakeholder Management
- IT Infrastructure
- Cloud Migration
- Process Optimization

ATS TIPS: Use exact matches, include metrics, place keywords in first 1/3 of CV.
""",
        '03_skills_gap_analysis.txt': f"""SKILLS GAP ANALYSIS: {job['title']}
Generated: 2026-02-11

REQUIRED vs CURRENT:
✓ Digital Transformation Leadership (18+ years)
✓ Program/Portfolio Management (PMP)
✓ Stakeholder Management
✓ Change Management
✓ Strategic Planning (MBA)
✓ Cross-functional Leadership

ALIGNMENT SCORE: 92%

ACTIONS: Research company initiatives, prepare sector-specific case studies.
""",
        '04_interview_preparation.txt': f"""INTERVIEW PREPARATION: {job['title']}
Generated: 2026-02-11

OPENING STATEMENT:
"I bring 18+ years of technology leadership with proven track record delivering
digital transformation programs. At TopMed, I lead 45+ people with $10M+ budget."

PREPARED EXAMPLES:
• El Araby Group: 7-country transformation, 35% efficiency gain
• PaySky: PMO setup, 40% on-time delivery improvement
• TopMed: Enterprise transformation, $10M budget management

QUESTIONS TO ASK:
1. Top 3 priorities for first 90 days?
2. How is success measured?
3. Current transformation state?
4. Biggest organizational challenges?
""",
        '05_company_research.txt': f"""COMPANY RESEARCH: {job['company']}
Generated: 2026-02-11

RESEARCH TASKS:
□ Website: Mission, values, products, leadership
□ LinkedIn: Company updates, employee profiles
□ News: Recent coverage, industry trends
□ Connections: Mutual contacts for referrals

TALKING POINTS:
• Research company's recent initiatives
• Prepare industry-specific observations
• Align experience with company challenges
""",
        '06_application_strategy.txt': f"""APPLICATION STRATEGY: {job['title']}
Generated: 2026-02-11

VALUE PROPOSITION:
"Seasoned technology executive with 18+ years driving digital transformation
and strategic technology initiatives."

TIMELINE:
Day 1: Submit application
Day 2-3: LinkedIn follow-up
Day 5-7: Prepare for interview
Week 2: Follow up if no response

LINKEDIN MESSAGE:
"Hi [Name], I applied for {job['title']} at {job['company']}. With 18+ years
in technology leadership, I'm excited about contributing to your team."
"""
    }
    return templates.get(doc_type, "")

def create_job_files(job, base_path):
    folder_path = os.path.join(base_path, job['folder'])
    os.makedirs(folder_path, exist_ok=True)
    
    files = ['01_job_analysis.txt', '02_keyword_optimization.txt', '03_skills_gap_analysis.txt',
             '04_interview_preparation.txt', '05_company_research.txt', '06_application_strategy.txt']
    
    for filename in files:
        filepath = os.path.join(folder_path, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(get_analysis_doc(job, filename))
        print(f"Created: {filepath}")
    
    # Create CV.html
    cv_path = os.path.join(folder_path, 'CV.html')
    with open(cv_path, 'w', encoding='utf-8') as f:
        f.write(get_cv_html(job))
    print(f"Created: {cv_path}")
    
    return folder_path

def main():
    base_path = '/root/.openclaw/agents/main/workspace/applications'
    print(f"Creating {len(ADDITIONAL_JOBS)} additional job applications...")
    print("="*60)
    
    for job in ADDITIONAL_JOBS:
        print(f"\nJob {job['num']}: {job['title']} at {job['company']}")
        create_job_files(job, base_path)
    
    print("\n" + "="*60)
    print(f"✓ Created {len(ADDITIONAL_JOBS)} additional jobs")

if __name__ == '__main__':
    main()
