#!/usr/bin/env python3
"""
Convert all CV.md files to CV.html with print-friendly styling
"""

import os
import re
import glob
from pathlib import Path

# HTML Template with professional CV styling
HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - CV</title>
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

def parse_markdown_cv(md_content):
    """Parse markdown CV content and convert to HTML sections"""
    lines = md_content.strip().split('\n')
    html_parts = []
    current_section = None
    in_list = False
    list_items = []
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines
        if not line:
            if in_list and list_items:
                html_parts.append('<ul class="job-details">' + ''.join(list_items) + '</ul>')
                list_items = []
                in_list = False
            i += 1
            continue
        
        # Name (first line, all caps, no markdown)
        if i == 0 and line.isupper() and len(line) < 50:
            html_parts.append(f'<div class="header">')
            html_parts.append(f'<div class="name">{line}</div>')
            i += 1
            continue
        
        # Title (second line)
        if i == 1 and '|' in line:
            html_parts.append(f'<div class="title">{line}</div>')
            i += 1
            continue
        
        # Contact info (third line with email/phone)
        if i == 2 and ('@' in line or '+' in line):
            # Make links clickable
            contact = line
            contact = re.sub(r'(\+\d[\d\-\s]+)', r'\1', contact)
            contact = re.sub(r'(\S+@\S+)', r'\1', contact)
            contact = re.sub(r'(linkedin\.com/\S+)', r'<a href="https://\1">\1</a>', contact)
            html_parts.append(f'<div class="contact-info">{contact}</div>')
            i += 1
            continue
        
        # Visa badge
        if 'DUBAI VISA READY' in line or '**DUBAI VISA READY**' in line:
            html_parts.append('<div class="visa-badge">DUBAI VISA READY - Available for immediate start in UAE</div>')
            html_parts.append('</div>')  # Close header
            i += 1
            continue
        
        # Section headers (ALL CAPS)
        if line.isupper() and len(line) < 50 and not line.startswith('•'):
            if in_list and list_items:
                html_parts.append('<ul class="job-details">' + ''.join(list_items) + '</ul>')
                list_items = []
                in_list = False
            current_section = line
            html_parts.append(f'<div class="section">')
            html_parts.append(f'<div class="section-title">{line}</div>')
            html_parts.append(f'<div class="section-content">')
            i += 1
            continue
        
        # Target position box
        if line.startswith('TARGET POSITION:'):
            html_parts.append(f'<div class="target-position">{line}</div>')
            i += 1
            continue
        
        # List items with bullet points
        if line.startswith('•') or line.startswith('-'):
            in_list = True
            item_text = line[1:].strip()
            # Bold text before colons
            item_text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', item_text)
            list_items.append(f'<li>{item_text}</li>')
            i += 1
            continue
        
        # Regular paragraph text
        if in_list and list_items:
            html_parts.append('<ul class="job-details">' + ''.join(list_items) + '</ul>')
            list_items = []
            in_list = False
        
        # Check if this is a job entry (has pipe separators)
        if '|' in line and not line.startswith('•'):
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 3:
                job_title = parts[0]
                company = parts[1]
                location_date = ' | '.join(parts[2:])
                html_parts.append(f'<div class="job">')
                html_parts.append(f'<div class="job-header">')
                html_parts.append(f'<span class="job-title">{job_title}</span> | ')
                html_parts.append(f'<span class="job-company">{company}</span> | ')
                html_parts.append(f'<span class="job-date">{location_date}</span>')
                html_parts.append('</div>')
            else:
                html_parts.append(f'<p>{line}</p>')
        else:
            # Bold formatting
            line = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', line)
            # Match Score highlighting
            if 'Match Score:' in line or 'Keywords Found:' in line or 'Missing Keywords:' in line:
                line = f'<div style="margin-top: 5px;">{line}</div>'
            html_parts.append(f'<p>{line}</p>')
        
        i += 1
    
    # Close any open lists
    if in_list and list_items:
        html_parts.append('<ul class="job-details">' + ''.join(list_items) + '</ul>')
    
    # Close any open sections
    while html_parts and not html_parts[-1].endswith('</div>') or (html_parts and html_parts[-1].count('<div') > html_parts[-1].count('</div>')):
        html_parts.append('</div>')  # Close section-content
        html_parts.append('</div>')  # Close section
    
    return '\n'.join(html_parts)

def convert_cv_to_html(cv_md_path):
    """Convert a single CV.md to CV.html"""
    cv_md_path = Path(cv_md_path)
    cv_html_path = cv_md_path.parent / 'CV.html'
    
    # Read markdown content
    with open(cv_md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Get title from filename
    job_folder = cv_md_path.parent.name
    title = job_folder.replace('job_', '').replace('_', ' ').title()
    
    # Parse and convert
    html_content = parse_markdown_cv(md_content)
    
    # Wrap in template
    full_html = HTML_TEMPLATE.format(title=title, content=html_content)
    
    # Write HTML file
    with open(cv_html_path, 'w', encoding='utf-8') as f:
        f.write(full_html)
    
    return cv_html_path

def main():
    """Convert all CV.md files to HTML"""
    workspace = Path('/root/.openclaw/agents/main/workspace')
    applications_dir = workspace / 'applications'
    
    # Find all CV.md files
    cv_files = sorted(glob.glob(str(applications_dir / 'job_*/CV.md')))
    
    print(f"Found {len(cv_files)} CV.md files to convert")
    
    converted = []
    errors = []
    
    for cv_md_path in cv_files:
        try:
            html_path = convert_cv_to_html(cv_md_path)
            converted.append(html_path)
            print(f"✓ Converted: {cv_md_path} -> {html_path}")
        except Exception as e:
            errors.append((cv_md_path, str(e)))
            print(f"✗ Error converting {cv_md_path}: {e}")
    
    print(f"\n{'='*60}")
    print(f"Conversion Complete!")
    print(f"Successfully converted: {len(converted)}")
    print(f"Errors: {len(errors)}")
    
    if errors:
        print("\nErrors:")
        for path, error in errors:
            print(f"  - {path}: {error}")
    
    return converted, errors

if __name__ == '__main__':
    main()
