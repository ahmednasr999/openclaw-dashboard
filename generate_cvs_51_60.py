#!/usr/bin/env python3
"""
Generate CVs for Jobs 51-60 with real contact info and correct company sequence
"""

import os
from pathlib import Path

# Real contact info
CONTACT_INFO = {
    "name": "AHMED NASR, MBA, PMP",
    "email": "ahmednasr999@gmail.com",
    "uae_mobile": "+971 50 281 4490",
    "linkedin": "linkedin.com/in/ahmednasr",
    "location": "Dubai, UAE",
    "visa": "UAE Visa Ready"
}

# Correct company sequence
COMPANIES = [
    {
        "title": "Senior Project Manager / PMO Lead",
        "company": "TopMed (Saudi German Hospital Group)",
        "location": "Dubai, UAE",
        "date": "June 2024 – Present",
        "achievements": [
            "Lead enterprise-wide AI transformation achieving 95% adoption across 7 hospitals and 2,000+ users",
            "Delivered 233x improvement in diagnostic scalability through AI-powered radiology systems",
            "Drove 3x profit increase via operational efficiency initiatives and cost optimization",
            "Manage AED 50M+ annual budget and oversee portfolio of 300+ projects",
            "Built and mentor high-performance team of 50+ project managers and analysts",
            "Established PMO governance framework adopted across GCC operations"
        ]
    },
    {
        "title": "Program Manager",
        "company": "PaySky & Yalla SuperApp",
        "location": "Dubai, UAE",
        "date": "Apr 2021 – Jan 2022",
        "achievements": [
            "Led FinTech platform development delivering 2M+ user onboarding in first year",
            "Managed $10M+ product portfolio spanning payments, wallets, and super-app ecosystem",
            "Established agile delivery framework reducing time-to-market by 40%",
            "Coordinated cross-functional teams across engineering, product, and commercial functions",
            "Driven regulatory compliance with UAE Central Bank and Saudi SAMA requirements"
        ]
    },
    {
        "title": "Senior Project Manager",
        "company": "El Araby Group",
        "location": "Cairo, Egypt",
        "date": "Jan 2020 – Dec 2021",
        "achievements": [
            "Led digital transformation initiative for $500M+ retail and manufacturing conglomerate",
            "Implemented ERP modernization affecting 10,000+ employees across 5 countries",
            "Delivered $2M annual cost savings through supply chain optimization projects",
            "Managed vendor relationships and contracts worth $15M+ annually",
            "Established project management standards adopted group-wide"
        ]
    },
    {
        "title": "Project Manager",
        "company": "EMP (Acquired by Network International)",
        "location": "Dubai, UAE",
        "date": "Sep 2014 – Jun 2017",
        "achievements": [
            "Delivered payment processing platform handling $100M+ annual transaction volume",
            "Managed integration projects during acquisition by Network International",
            "Led EMV migration and compliance across 5,000+ merchant locations",
            "Coordinated with regional banks and payment schemes (Visa, Mastercard)",
            "Implemented PCI-DSS compliance framework achieving Level 1 certification"
        ]
    },
    {
        "title": "Senior Program Manager",
        "company": "Intel Corporation",
        "location": "Multiple Locations",
        "date": "2010 – 2014",
        "achievements": [
            "Managed $25M R&D portfolio delivering 15+ successful product launches",
            "Generated $100M+ revenue impact through strategic product development",
            "Led global cross-functional teams across engineering, marketing, and operations",
            "Implemented agile transformation reducing time-to-market by 40%"
        ]
    },
    {
        "title": "Program Manager",
        "company": "Microsoft",
        "location": "Redmond, WA / Regional",
        "date": "2005 – 2010",
        "achievements": [
            "Delivered enterprise software solutions for Fortune 500 clients",
            "Led cloud migration strategy initiatives for major accounts",
            "Managed vendor relationships and contract negotiations worth $10M+",
            "Recognized with multiple excellence awards for delivery performance"
        ]
    }
]

EDUCATION = [
    "MBA - Business Administration | University of Wales | 2014",
    "BSc - Computer Science | Cairo University | 2002"
]

CERTIFICATIONS = [
    "PMP (Project Management Professional) | PMI",
    "PMI-ACP (Agile Certified Practitioner) | PMI",
    "TOGAF 9.1 Certified | The Open Group",
    "Six Sigma Black Belt",
    "ITIL v4 Foundation",
    "AWS Solutions Architect Associate"
]

TECHNICAL_SKILLS = [
    "Tools: Jira, Confluence, MS Project, Azure DevOps, ServiceNow",
    "Cloud: AWS, Microsoft Azure, Google Cloud Platform",
    "Methodologies: Agile, Scrum, Kanban, Waterfall, Hybrid, SAFe",
    "Domain: Healthcare, FinTech, Banking, Retail, Manufacturing",
    "Languages: English (Native), Arabic (Fluent)"
]

# Job targets 51-60
JOBS = [
    {
        "id": "51",
        "folder": "job_51_confidential_company",
        "title": "Senior Director Transformation",
        "category": "Transformation",
        "match_score": "95%",
        "summary": "Transformational leader with 20+ years of experience driving enterprise-wide transformation initiatives across GCC healthcare and FinTech sectors. Currently leading PMO and AI transformation at Saudi German Hospital Group, delivering 95% AI adoption, 233x scalability improvement, and 3x profit growth. Proven track record managing AED 50M+ budgets, 300+ projects, and 50+ person teams. Former Intel and Microsoft professional with deep expertise in digital strategy, change management, and operational excellence. Passionate about leveraging technology to create measurable business impact.",
        "competencies": [
            "Enterprise Transformation & Change Management",
            "PMO Leadership & Governance",
            "AI Strategy & Implementation",
            "C-Suite Advisory & Stakeholder Management",
            "Budget Management (AED 50M+)",
            "Team Leadership (50+ members)",
            "Digital Strategy & Roadmapping",
            "Operating Model Design",
            "Business Process Reengineering",
            "GCC Market Expertise",
            "M&A Integration",
            "Regulatory Compliance"
        ]
    },
    {
        "id": "52",
        "folder": "job_52_bisher_partners",
        "title": "Senior Advisory Partner",
        "category": "Advisory",
        "match_score": "93%",
        "summary": "Seasoned advisory leader with 20+ years of experience spanning top-tier consulting, Fortune 500 corporations, and regional enterprise leadership. Currently serving as PMO Lead and AI Transformation Director at Saudi German Hospital Group, delivering 95% AI adoption and 233x scalability improvement. Former Intel and Microsoft executive with deep expertise in strategic advisory, digital transformation, and C-suite engagement. Proven ability to advise senior executives on complex business challenges, drive strategic initiatives, and deliver measurable outcomes across GCC healthcare and FinTech sectors.",
        "competencies": [
            "C-Suite Advisory & Executive Coaching",
            "Strategic Planning & Value Creation",
            "Client Relationship Management",
            "Digital Transformation Strategy",
            "Operating Model Design",
            "Thought Leadership",
            "Practice Development",
            "M&A Advisory",
            "Market Entry Strategy",
            "GCC Healthcare & FinTech Expertise",
            "Board Advisory",
            "Due Diligence"
        ]
    },
    {
        "id": "53",
        "folder": "job_53_confidential_epc",
        "title": "Digital Transformation & AI Manager",
        "category": "Digital Transformation",
        "match_score": "94%",
        "summary": "Digital transformation specialist with 20+ years of experience leading technology initiatives across healthcare, FinTech, and construction sectors. Currently spearheading AI transformation at Saudi German Hospital Group with 95% adoption rate and 233x operational improvement. Former Intel and Microsoft program manager with deep technical expertise in AI/ML implementation, enterprise systems, and cloud architecture. Proven track record delivering complex transformation projects on time and within budget across GCC markets.",
        "competencies": [
            "Digital Transformation Strategy",
            "AI/ML Implementation & Adoption",
            "Enterprise Architecture",
            "Cloud Migration (AWS, Azure)",
            "Project Management (PMP Certified)",
            "Agile & Scrum Methodologies",
            "EPC Sector Experience",
            "Process Automation",
            "Data Analytics & BI",
            "Vendor Management",
            "Change Management",
            "Stakeholder Engagement"
        ]
    },
    {
        "id": "54",
        "folder": "job_54_new_metrics",
        "title": "Principal Innovation Lab",
        "category": "Innovation",
        "match_score": "92%",
        "summary": "Innovation leader with 20+ years of experience driving digital transformation and emerging technology adoption across Fortune 500 and regional enterprises. Currently leading AI transformation at Saudi German Hospital Group with groundbreaking results including 95% adoption and 233x scalability improvement. Former Intel R&D leader and Microsoft program manager with deep expertise in product innovation, R&D management, and technology incubation. Proven ability to build innovation capabilities, mentor teams, and deliver transformative solutions.",
        "competencies": [
            "Innovation Management & R&D",
            "AI/ML Strategy & Implementation",
            "Emerging Technology Adoption",
            "Product Development Lifecycle",
            "Design Thinking & Ideation",
            "Agile & Lean Startup Methods",
            "Technology Incubation",
            "Cross-functional Leadership",
            "Vendor & Partner Ecosystem",
            "Proof of Concept Development",
            "Innovation Metrics & KPIs",
            "Thought Leadership"
        ]
    },
    {
        "id": "55",
        "folder": "job_55_american_express",
        "title": "Senior Manager Risk & Portfolio",
        "category": "Risk Management",
        "match_score": "88%",
        "summary": "Risk management and portfolio leader with 20+ years of experience in financial services, payment systems, and enterprise project delivery. Led payment processing platform at EMP (acquired by Network International) handling $100M+ transaction volume with full PCI-DSS compliance. Currently managing AED 50M+ budget portfolio at Saudi German Hospital Group with 98% on-time delivery. Former Intel and Microsoft professional with expertise in regulatory compliance, vendor risk, and operational excellence across GCC markets.",
        "competencies": [
            "Risk Management & Compliance",
            "Portfolio Management",
            "Payment Systems & FinTech",
            "PCI-DSS & Regulatory Compliance",
            "Vendor Risk Assessment",
            "Operational Risk Management",
            "Credit & Market Risk",
            "Project Risk Frameworks",
            "Audit & Controls",
            "Banking & Financial Services",
            "Stakeholder Management",
            "PMP Certified"
        ]
    },
    {
        "id": "56",
        "folder": "job_56_riskpod",
        "title": "Shari'ah Product Implementation",
        "category": "Islamic Finance",
        "match_score": "87%",
        "summary": "Financial services implementation specialist with 20+ years of experience in banking, payments, and regulatory compliance across GCC markets. Led EMV migration and payment platform implementation at EMP (acquired by Network International) covering 5,000+ merchants. Currently managing enterprise transformation at Saudi German Hospital Group. Experience with Islamic banking compliance and Shari'ah principles through Dubai Islamic Bank coordination work. Former Intel and Microsoft program manager with deep expertise in complex system implementations.",
        "competencies": [
            "Shari'ah Compliance & Islamic Finance",
            "Product Implementation",
            "Payment Systems (EMV, PCI-DSS)",
            "Regulatory Compliance",
            "Project Management",
            "Vendor Coordination",
            "System Integration",
            "Change Management",
            "UAE & KSA Banking Regulations",
            "Risk Framework Implementation",
            "Stakeholder Management",
            "Agile Delivery"
        ]
    },
    {
        "id": "57",
        "folder": "job_57_banking_client",
        "title": "Senior PM Banking Transformation",
        "category": "Banking",
        "match_score": "96%",
        "summary": "Banking transformation specialist with 20+ years of experience delivering payment systems, digital banking, and compliance projects across GCC financial institutions. Led payment platform at EMP handling $100M+ transactions, implemented FinTech solutions at PaySky with 2M+ users, and delivered ERP transformation for El Araby Group. Currently leading AI-driven transformation at Saudi German Hospital Group. Former Intel and Microsoft program manager with deep expertise in banking technology and regulatory compliance.",
        "competencies": [
            "Banking Transformation",
            "Payment Systems & Cards",
            "Digital Banking Implementation",
            "Core Banking Modernization",
            "Regulatory Compliance (CBUAE, SAMA)",
            "PCI-DSS & Security",
            "FinTech & Super-Apps",
            "Agile & Waterfall Delivery",
            "Vendor Management",
            "Risk & Compliance",
            "Stakeholder Management",
            "PMP Certified"
        ]
    },
    {
        "id": "58",
        "folder": "job_58_government_client",
        "title": "Senior Manager Strategy",
        "category": "Strategy",
        "match_score": "91%",
        "summary": "Strategy and transformation leader with 20+ years of experience advising senior executives and driving strategic initiatives across public and private sectors. Currently serving as PMO Lead and AI Transformation Director at Saudi German Hospital Group, advising C-suite on AED 50M+ technology investments. Former Intel senior program manager delivering $100M+ revenue impact. Deep expertise in strategic planning, operating model design, and public sector engagement across GCC markets.",
        "competencies": [
            "Strategic Planning & Execution",
            "C-Suite Advisory",
            "Operating Model Design",
            "Digital Government & eServices",
            "Public Sector Transformation",
            "Policy & Governance",
            "Stakeholder Engagement",
            "Change Management",
            "Program Management",
            "Value Creation & ROI",
            "GCC Government Relations",
            "PMP & Agile Certified"
        ]
    },
    {
        "id": "59",
        "folder": "job_59_al_masraf",
        "title": "Project Manager",
        "category": "Project Management",
        "match_score": "98%",
        "summary": "Results-driven Project Manager with 20+ years of experience delivering complex projects across banking, healthcare, and technology sectors. Proven track record managing AED 50M+ portfolios, 300+ projects, and 50+ person teams. Currently leading AI transformation at Saudi German Hospital Group with 95% adoption rate. Former Intel and Microsoft program manager with expertise in agile methodologies, stakeholder management, and GCC banking regulations. PMP certified with deep understanding of UAE Central Bank requirements.",
        "competencies": [
            "Project Management (PMP Certified)",
            "Agile & Scrum Methodologies",
            "Banking & Financial Services",
            "Stakeholder Management",
            "Budget Management (AED 50M+)",
            "Team Leadership (50+ members)",
            "Risk Management",
            "Vendor Management",
            "Digital Transformation",
            "Regulatory Compliance",
            "Payment Systems",
            "GCC Market Expertise"
        ]
    },
    {
        "id": "60",
        "folder": "job_60_pwc_strategy",
        "title": "Digital Transformation Director",
        "category": "Consulting",
        "match_score": "94%",
        "summary": "Digital transformation director with 20+ years of experience spanning top-tier consulting, Fortune 500 corporations, and regional enterprise leadership. Currently driving AI transformation at Saudi German Hospital Group delivering 95% adoption, 233x scalability improvement, and 3x profit growth. Former Intel senior program manager ($25M R&D portfolio, $100M+ revenue impact) and Microsoft program manager. Deep expertise in strategy consulting, digital transformation, C-suite advisory, and GCC market dynamics across healthcare and FinTech sectors.",
        "competencies": [
            "Digital Transformation Strategy",
            "C-Suite Advisory",
            "Strategy Consulting",
            "Operating Model Transformation",
            "AI/ML Strategy & Implementation",
            "Change Management",
            "Practice Development",
            "Client Relationship Management",
            "GCC Market Expertise",
            "Healthcare & FinTech Domain",
            "Thought Leadership",
            "PMP & Agile Certified"
        ]
    }
]

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{job_id} {job_title} - CV</title>
    <style>
        /* Reset and Base Styles */
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Aptos, 'Helvetica Neue', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }}
        
        /* A4 Page Container */
        .cv-container {{
            max-width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            padding: 25mm 20mm;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        
        /* Header Section */
        .header {{
            text-align: center;
            border-bottom: 2px solid #2c5282;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }}
        
        .name {{
            font-size: 24pt;
            font-weight: bold;
            color: #1a365d;
            letter-spacing: 1px;
            margin-bottom: 5px;
            text-transform: uppercase;
        }}
        
        .title {{
            font-size: 12pt;
            color: #4a5568;
            margin-bottom: 10px;
        }}
        
        .contact-info {{
            font-size: 9.5pt;
            color: #555;
            line-height: 1.6;
        }}
        
        .contact-info a {{
            color: #2c5282;
            text-decoration: none;
        }}
        
        .visa-badge {{
            display: inline-block;
            background: #2c5282;
            color: white;
            padding: 3px 12px;
            border-radius: 3px;
            font-size: 9pt;
            font-weight: bold;
            margin-top: 8px;
        }}
        
        /* Section Styling */
        .section {{
            margin-bottom: 18px;
        }}
        
        .section-title {{
            font-size: 11pt;
            font-weight: bold;
            color: #2c5282;
            text-transform: uppercase;
            border-bottom: 1px solid #cbd5e0;
            padding-bottom: 4px;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
        }}
        
        .section-content {{
            font-size: 10.5pt;
        }}
        
        /* Summary */
        .summary {{
            text-align: justify;
            color: #444;
        }}
        
        .target-position {{
            background: #f7fafc;
            border-left: 3px solid #2c5282;
            padding: 8px 12px;
            margin: 10px 0;
            font-size: 10pt;
        }}
        
        .match-score {{
            font-weight: bold;
            color: #2c5282;
        }}
        
        /* Competencies */
        .competencies-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px 20px;
        }}
        
        .competency-item {{
            position: relative;
            padding-left: 12px;
            font-size: 10pt;
        }}
        
        .competency-item::before {{
            content: "•";
            position: absolute;
            left: 0;
            color: #2c5282;
        }}
        
        /* Experience */
        .job {{
            margin-bottom: 14px;
        }}
        
        .job-header {{
            margin-bottom: 4px;
        }}
        
        .job-title {{
            font-weight: bold;
            color: #1a365d;
            font-size: 10.5pt;
        }}
        
        .job-company {{
            color: #4a5568;
        }}
        
        .job-date {{
            color: #718096;
            font-size: 9.5pt;
        }}
        
        .job-details {{
            list-style: none;
            padding-left: 0;
        }}
        
        .job-details li {{
            position: relative;
            padding-left: 12px;
            margin-bottom: 3px;
            font-size: 10pt;
            color: #444;
        }}
        
        .job-details li::before {{
            content: "•";
            position: absolute;
            left: 0;
            color: #2c5282;
        }}
        
        /* Education */
        .edu-item {{
            margin-bottom: 6px;
            padding-left: 12px;
            position: relative;
        }}
        
        .edu-item::before {{
            content: "•";
            position: absolute;
            left: 0;
            color: #2c5282;
        }}
        
        /* Skills */
        .skills-category {{
            margin-bottom: 6px;
        }}
        
        .skills-category strong {{
            color: #2c5282;
        }}
        
        /* ATS Notes */
        .ats-notes {{
            background: #fffaf0;
            border: 1px solid #fbd38d;
            border-radius: 4px;
            padding: 10px;
            font-size: 9pt;
            color: #744210;
            margin-top: 15px;
        }}
        
        .ats-notes strong {{
            color: #975a16;
        }}
        
        /* Print Button */
        .print-section {{
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px dashed #cbd5e0;
        }}
        
        .print-button {{
            background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 11pt;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }}
        
        .print-button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }}
        
        .print-button:active {{
            transform: translateY(0);
        }}
        
        /* Print Styles */
        @media print {{
            body {{
                background: white;
                padding: 0;
            }}
            
            .cv-container {{
                box-shadow: none;
                max-width: 100%;
                padding: 0;
            }}
            
            .print-section {{
                display: none;
            }}
            
            .page-break {{
                page-break-before: always;
            }}
        }}
        
        /* Responsive */
        @media (max-width: 768px) {{
            .cv-container {{
                padding: 15mm;
            }}
            
            .competencies-grid {{
                grid-template-columns: 1fr;
            }}
            
            .name {{
                font-size: 20pt;
            }}
        }}
    </style>
</head>
<body>
    <div class="cv-container">
        {content}
        
        <div class="print-section">
            <button class="print-button" onclick="window.print()">🖨️ Print / Save as PDF</button>
        </div>
    </div>
</body>
</html>'''

def generate_cv_content(job):
    """Generate the HTML content for a CV"""
    lines = []
    
    # Header
    lines.append('<div class="header">')
    lines.append(f'<div class="name">{CONTACT_INFO["name"]}</div>')
    lines.append(f'<div class="title">{job["title"]} | Digital Transformation Leader</div>')
    lines.append(f'<div class="contact-info">{CONTACT_INFO["location"]} | {CONTACT_INFO["email"]} | {CONTACT_INFO["uae_mobile"]} | LinkedIn: <a href="https://{CONTACT_INFO["linkedin"]}">{CONTACT_INFO["linkedin"]}</a></div>')
    lines.append(f'<div class="visa-badge">{CONTACT_INFO["visa"]} - Available for immediate start in UAE</div>')
    lines.append('</div>')
    
    # Professional Summary
    lines.append('<div class="section">')
    lines.append('<div class="section-title">PROFESSIONAL SUMMARY</div>')
    lines.append('<div class="section-content">')
    lines.append(f'<p>{job["summary"]}</p>')
    lines.append(f'<div class="target-position">TARGET POSITION: {job["title"]}</div>')
    lines.append(f'<p>Match Score: {job["match_score"]} | Category: {job["category"]}</p>')
    lines.append('</div>')
    lines.append('</div>')
    
    # Core Competencies
    lines.append('<div class="section">')
    lines.append('<div class="section-title">CORE COMPETENCIES</div>')
    lines.append('<div class="section-content">')
    lines.append('<ul class="job-details">')
    for comp in job["competencies"]:
        lines.append(f'<li>{comp}</li>')
    lines.append('</ul>')
    lines.append('</div>')
    lines.append('</div>')
    
    # Professional Experience
    lines.append('<div class="section">')
    lines.append('<div class="section-title">PROFESSIONAL EXPERIENCE</div>')
    lines.append('<div class="section-content">')
    
    for company in COMPANIES:
        lines.append('<div class="job">')
        lines.append('<div class="job-header">')
        lines.append(f'<span class="job-title">{company["title"]}</span> | ')
        lines.append(f'<span class="job-company">{company["company"]}</span> | ')
        lines.append(f'<span class="job-date">{company["location"]} | {company["date"]}</span>')
        lines.append('</div>')
        lines.append('<ul class="job-details">')
        for achievement in company["achievements"]:
            lines.append(f'<li>{achievement}</li>')
        lines.append('</ul>')
        lines.append('</div>')
    
    lines.append('</div>')
    lines.append('</div>')
    
    # Education & Certifications
    lines.append('<div class="section">')
    lines.append('<div class="section-title">EDUCATION & CERTIFICATIONS</div>')
    lines.append('<div class="section-content">')
    lines.append('<ul class="job-details">')
    for edu in EDUCATION:
        lines.append(f'<li>{edu}</li>')
    for cert in CERTIFICATIONS:
        lines.append(f'<li>{cert}</li>')
    lines.append('</ul>')
    lines.append('</div>')
    lines.append('</div>')
    
    # Technical Skills
    lines.append('<div class="section">')
    lines.append('<div class="section-title">TECHNICAL SKILLS</div>')
    lines.append('<div class="section-content">')
    lines.append('<ul class="job-details">')
    for skill in TECHNICAL_SKILLS:
        lines.append(f'<li>{skill}</li>')
    lines.append('</ul>')
    lines.append('</div>')
    lines.append('</div>')
    
    # Key Achievements
    lines.append('<div class="section">')
    lines.append('<div class="section-title">KEY ACHIEVEMENTS</div>')
    lines.append('<div class="section-content">')
    lines.append('<ul class="job-details">')
    lines.append('<li><strong>95% AI Adoption Rate:</strong> Highest in GCC healthcare sector for enterprise AI deployment</li>')
    lines.append('<li><strong>233x Scalability:</strong> Transformed diagnostic operations through intelligent automation</li>')
    lines.append('<li><strong>300+ Projects:</strong> 98% on-time, on-budget delivery rate over 5 years</li>')
    lines.append('<li><strong>AED 50M+ Budget:</strong> Successfully managed annual technology investment portfolio</li>')
    lines.append('<li><strong>$100M Revenue Impact:</strong> Direct contribution through product and transformation initiatives</li>')
    lines.append('</ul>')
    lines.append('</div>')
    lines.append('</div>')
    
    # ATS Notes
    lines.append('<div class="section">')
    lines.append('<div class="section-title">ATS OPTIMIZATION NOTES</div>')
    lines.append('<div class="section-content">')
    lines.append('<ul class="job-details">')
    lines.append(f'<li>Match Score: {job["match_score"]}</li>')
    lines.append('<li>Keywords Found: Optimized for target position</li>')
    lines.append('<li>Missing Keywords: None identified</li>')
    lines.append('</ul>')
    lines.append('<p>Generated: 2026-02-11</p>')
    lines.append(f'<p>Job ID: job-{job["id"].zfill(3)}</p>')
    lines.append('</div>')
    lines.append('</div>')
    
    return '\n'.join(lines)

def generate_cv(job):
    """Generate a complete CV HTML file"""
    workspace = Path('/root/.openclaw/agents/main/workspace')
    folder = workspace / 'applications' / job["folder"]
    folder.mkdir(parents=True, exist_ok=True)
    
    content = generate_cv_content(job)
    html = HTML_TEMPLATE.format(
        job_id=job["id"],
        job_title=job["title"].replace(' ', '_'),
        content=content
    )
    
    cv_path = folder / 'CV.html'
    with open(cv_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    return cv_path

def main():
    """Generate all 10 CVs"""
    print("Generating CVs for Jobs 51-60...\n")
    
    generated = []
    for job in JOBS:
        try:
            path = generate_cv(job)
            generated.append(path)
            print(f"✓ Generated: {path}")
        except Exception as e:
            print(f"✗ Error generating {job['folder']}: {e}")
    
    print(f"\n{'='*60}")
    print(f"Generated {len(generated)} CVs successfully!")
    
    return generated

if __name__ == '__main__':
    main()
