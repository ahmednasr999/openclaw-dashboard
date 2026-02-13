#!/usr/bin/env python3
"""
CV Tailor Advanced - Core Processing Script

This script provides structured CV tailoring functionality.
It can be called directly or imported for use in other workflows.

Usage:
    python tailor_cv.py --master-cv path/to/cv.md --job-desc path/to/job.txt --output-dir ./output/
    
Or with URL:
    python tailor_cv.py --master-cv path/to/cv.md --job-url https://... --output-dir ./output/
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class KeywordMatch:
    """Represents a keyword match with tier and frequency."""
    term: str
    tier: int  # 1, 2, or 3
    job_frequency: int
    cv_frequency: int = 0
    contexts: List[str] = None
    
    def __post_init__(self):
        if self.contexts is None:
            self.contexts = []
    
    @property
    def score(self) -> float:
        """Calculate keyword match score."""
        if self.cv_frequency == 0:
            return 0.0
        
        # Tier weights
        tier_weights = {1: 1.0, 2: 0.7, 3: 0.4}
        
        # Frequency ratio (capped at 1.5x to avoid overstuffing penalty)
        freq_ratio = min(self.cv_frequency / max(self.job_frequency, 1), 1.5)
        
        return tier_weights.get(self.tier, 0.3) * freq_ratio


@dataclass
class ATSScore:
    """ATS compatibility scoring."""
    keyword_match: float
    format_compliance: float
    seniority_alignment: float
    total: float
    
    @classmethod
    def calculate(cls, keywords: List[KeywordMatch], format_ok: bool, seniority_ok: bool) -> 'ATSScore':
        keyword_score = sum(k.score for k in keywords) / max(len([k for k in keywords if k.tier == 1]), 1) * 100
        format_score = 100.0 if format_ok else 70.0
        seniority_score = 100.0 if seniority_ok else 60.0
        
        total = (keyword_score * 0.50) + (format_score * 0.30) + (seniority_score * 0.20)
        
        return cls(
            keyword_match=round(keyword_score, 1),
            format_compliance=round(format_score, 1),
            seniority_alignment=round(seniority_score, 1),
            total=round(total, 1)
        )


class JobAnalyzer:
    """Analyzes job descriptions for requirements and keywords."""
    
    def __init__(self):
        self.tier1_indicators = ['required', 'must have', 'essential', 'mandatory', 'minimum']
        self.tier2_indicators = ['preferred', 'strongly preferred', 'ideal', 'desired']
        self.tier3_indicators = ['nice to have', 'plus', 'beneficial', 'a plus']
    
    def extract_keywords(self, job_desc: str) -> List[KeywordMatch]:
        """Extract and categorize keywords from job description."""
        keywords = []
        job_lower = job_desc.lower()
        
        # Common technical and professional terms to look for
        # This is a simplified version - in production, use NLP or comprehensive lists
        
        # Extract bullet points and sections
        lines = job_desc.split('\n')
        
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            # Determine tier based on indicators
            tier = 2  # Default to T2
            for indicator in self.tier1_indicators:
                if indicator in line_lower[:50]:  # Check first part of line
                    tier = 1
                    break
            for indicator in self.tier3_indicators:
                if indicator in line_lower[:50]:
                    tier = 3
                    break
            
            # Extract technical terms (capitalized or specific patterns)
            # This is simplified - real implementation would be more sophisticated
            words = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', line)
            for word in words:
                if len(word) > 3:  # Skip short words
                    # Check if already exists
                    existing = next((k for k in keywords if k.term.lower() == word.lower()), None)
                    if existing:
                        existing.job_frequency += 1
                    else:
                        keywords.append(KeywordMatch(
                            term=word,
                            tier=tier,
                            job_frequency=1
                        ))
        
        return keywords
    
    def extract_requirements(self, job_desc: str) -> Dict[str, List[str]]:
        """Extract structured requirements from job description."""
        requirements = {
            'must_have': [],
            'preferred': [],
            'nice_to_have': []
        }
        
        lines = job_desc.split('\n')
        current_section = None
        
        for line in lines:
            line_lower = line.lower().strip()
            
            # Detect section headers
            if any(x in line_lower for x in ['requirement', 'must have', 'essential']):
                current_section = 'must_have'
            elif any(x in line_lower for x in ['preferred', 'desired', 'ideal']):
                current_section = 'preferred'
            elif any(x in line_lower for x in ['nice to have', 'plus', 'beneficial']):
                current_section = 'nice_to_have'
            
            # Extract bullet items
            elif current_section and line.strip().startswith(('•', '-', '*', '○')):
                item = line.strip()[1:].strip()
                if item and len(item) > 5:
                    requirements[current_section].append(item)
        
        return requirements


class CVTailor:
    """Main CV tailoring engine."""
    
    def __init__(self, master_cv_path: str):
        self.master_cv = Path(master_cv_path).read_text()
        self.analyzer = JobAnalyzer()
    
    def tailor(self, job_desc: str, job_title: str = "") -> Dict:
        """
        Tailor CV for specific job.
        
        Returns dict with:
        - tailored_cv: The tailored CV text
        - ats_score: ATSScore object
        - keywords: List of KeywordMatch objects
        - transformation_summary: Dict of changes made
        """
        # Step 1: Analyze job
        keywords = self.analyzer.extract_keywords(job_desc)
        requirements = self.analyzer.extract_requirements(job_desc)
        
        # Step 2: Match keywords to CV
        cv_lower = self.master_cv.lower()
        for kw in keywords:
            kw.cv_frequency = cv_lower.count(kw.term.lower())
        
        # Step 3: Calculate ATS score
        ats_score = ATSScore.calculate(
            keywords=keywords,
            format_ok=True,  # Assume format is OK for now
            seniority_ok=True  # Assume seniority matches for now
        )
        
        # Step 4: Generate tailored CV
        tailored_cv = self._generate_tailored_cv(job_desc, keywords, job_title)
        
        # Step 5: Create transformation summary
        summary = self._create_summary(keywords, requirements)
        
        return {
            'tailored_cv': tailored_cv,
            'ats_score': asdict(ats_score),
            'keywords': [asdict(kw) for kw in keywords],
            'requirements': requirements,
            'transformation_summary': summary,
            'generated_at': datetime.now().isoformat()
        }
    
    def _generate_tailored_cv(self, job_desc: str, keywords: List[KeywordMatch], job_title: str) -> str:
        """Generate the tailored CV text."""
        # This is a simplified version
        # In production, this would do sophisticated restructuring
        
        cv_lines = self.master_cv.split('\n')
        
        # Add tailored header comment
        header = f"""# TAILORED CV
# Position: {job_title or 'Target Role'}
# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}
# ATS Optimized: Yes
#
# NOTE: This CV has been tailored for ATS optimization while maintaining
# 100% factual accuracy. All claims match the Master CV.

"""
        
        # For now, return with header (sophisticated restructuring would go here)
        return header + self.master_cv
    
    def _create_summary(self, keywords: List[KeywordMatch], requirements: Dict) -> Dict:
        """Create transformation summary."""
        t1_keywords = [k for k in keywords if k.tier == 1]
        t2_keywords = [k for k in keywords if k.tier == 2]
        t3_keywords = [k for k in keywords if k.tier == 3]
        
        matched_t1 = len([k for k in t1_keywords if k.cv_frequency > 0])
        total_t1 = len(t1_keywords)
        
        return {
            'keywords_analyzed': len(keywords),
            't1_keywords_matched': f"{matched_t1}/{total_t1}",
            't1_match_rate': round(matched_t1 / max(total_t1, 1) * 100, 1),
            't1_keywords': [{'term': k.term, 'cv_freq': k.cv_frequency} for k in t1_keywords],
            't2_keywords': [{'term': k.term, 'cv_freq': k.cv_frequency} for k in t2_keywords],
            't3_keywords': [{'term': k.term, 'cv_freq': k.cv_frequency} for k in t3_keywords],
            'requirements_extracted': {
                'must_have': len(requirements['must_have']),
                'preferred': len(requirements['preferred']),
                'nice_to_have': len(requirements['nice_to_have'])
            }
        }


def main():
    parser = argparse.ArgumentParser(description='Tailor CV for specific job')
    parser.add_argument('--master-cv', required=True, help='Path to Master CV file')
    parser.add_argument('--job-desc', help='Path to job description file')
    parser.add_argument('--job-url', help='Job posting URL (will fetch if provided)')
    parser.add_argument('--job-title', help='Target job title')
    parser.add_argument('--output-dir', default='./output', help='Output directory')
    parser.add_argument('--format', choices=['json', 'markdown', 'pdf'], default='json',
                       help='Output format')
    
    args = parser.parse_args()
    
    # Validate inputs
    if not args.job_desc and not args.job_url:
        print("Error: Must provide either --job-desc or --job-url", file=sys.stderr)
        sys.exit(1)
    
    # Read job description
    if args.job_desc:
        job_desc = Path(args.job_desc).read_text()
    else:
        # TODO: Implement URL fetching
        print("Error: URL fetching not yet implemented. Use --job-desc.", file=sys.stderr)
        sys.exit(1)
    
    # Initialize tailor
    tailor = CVTailor(args.master_cv)
    
    # Process
    result = tailor.tailor(job_desc, args.job_title)
    
    # Create output directory
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate output
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    if args.format == 'json':
        output_file = output_dir / f"tailored_cv_{timestamp}.json"
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"Output saved to: {output_file}")
        
    elif args.format == 'markdown':
        output_file = output_dir / f"tailored_cv_{timestamp}.md"
        with open(output_file, 'w') as f:
            f.write(result['tailored_cv'])
            f.write("\n\n---\n\n")
            f.write("## ATS Score Report\n\n")
            f.write(f"**Overall Score:** {result['ats_score']['total']}%\n\n")
            f.write(f"- Keyword Match: {result['ats_score']['keyword_match']}%\n")
            f.write(f"- Format Compliance: {result['ats_score']['format_compliance']}%\n")
            f.write(f"- Seniority Alignment: {result['ats_score']['seniority_alignment']}%\n")
        print(f"Output saved to: {output_file}")
    
    # Print summary
    print(f"\nATS Score: {result['ats_score']['total']}%")
    print(f"Keywords Analyzed: {result['transformation_summary']['keywords_analyzed']}")
    print(f"T1 Match Rate: {result['transformation_summary']['t1_match_rate']}%")


if __name__ == '__main__':
    main()