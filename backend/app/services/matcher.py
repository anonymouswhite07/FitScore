from typing import List, Dict

def match_skills(resume_skills: List[str], jd_skills: List[str]) -> Dict[str, List[str]]:
    """Compares skills and returns matched and missing skills."""
    resume_set = set(resume_skills)
    jd_set = set(jd_skills)
    
    matched = list(resume_set.intersection(jd_set))
    missing = list(jd_set.difference(resume_set))
    
    return {
        "matched_skills": matched,
        "missing_skills": missing
    }

def match_experience(resume_exp: int, jd_exp: int) -> str:
    """Calculates the experience gap and returns a descriptive string."""
    gap = resume_exp - jd_exp
    
    if gap >= 0:
        return f"Meets or exceeds experience requirement (+{gap} years)."
    else:
        return f"Falls short of experience requirement by {abs(gap)} years."
