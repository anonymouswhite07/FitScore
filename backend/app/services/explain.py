from typing import Dict, List

def generate_explanation(score: float, similarity: float, matched_skills: List[str], missing_skills: List[str], experience_gap: str) -> str:
    """Generates a human-readable explanation of the score."""
    explanation = []
    
    # Base summary
    if score > 80:
        explanation.append("This candidate is a highly strong fit for the role.")
    elif score > 60:
        explanation.append("This candidate is a moderate fit for the role.")
    else:
        explanation.append("This candidate is a poor fit for the role.")
        
    # Semantic match
    if similarity > 0.7:
        explanation.append("Their resume context aligns well semantically with the job description.")
    elif similarity < 0.4:
        explanation.append("Their resume lacks the core semantic context of the job description.")
        
    # Skills
    if len(matched_skills) > 0:
        explanation.append(f"Strengths: They possess key skills such as {', '.join(matched_skills[:3])}.")
    if len(missing_skills) > 0:
        explanation.append(f"Improvement Suggestions: Consider upskilling in {', '.join(missing_skills[:3])} to better match the requirements.")
        
    # Experience
    explanation.append(f"Experience: {experience_gap}")
    
    return " ".join(explanation)
