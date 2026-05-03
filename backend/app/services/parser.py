import fitz  # PyMuPDF
import spacy
import re
from typing import Dict, List, Tuple

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: spacy model 'en_core_web_sm' not found. Please run: python -m spacy download en_core_web_sm")
    nlp = None

# A basic predefined list of skills for extraction (in a real scenario, this would be a comprehensive DB/ontology)
COMMON_SKILLS = {
    "python", "java", "c++", "javascript", "react", "node.js", "sql", "machine learning", "deep learning", 
    "nlp", "pytorch", "tensorflow", "fastapi", "django", "flask", "docker", "kubernetes", "aws", "gcp",
    "azure", "mongodb", "postgresql", "mysql", "git", "ci/cd", "agile", "scrum", "html", "css", "tailwind",
    "typescript", "vue.js", "angular"
}

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extracts text from a PDF file."""
    text = ""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text("text") + " "
    except Exception as e:
        print(f"Error parsing PDF: {e}")
    return text

def extract_entities(text: str) -> Dict[str, any]:
    """Uses spaCy and regex to extract skills, experience, and education."""
    if not nlp:
        return {"skills": [], "experience_years": 0, "education": []}
    
    doc = nlp(text)
    
    skills = set()
    text_lower = text.lower()
    
    # Extract skills using the common list
    for skill in COMMON_SKILLS:
        # Simple word boundary regex to avoid partial matches (e.g., 'c' in 'car')
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            skills.add(skill)
            
    # Extract years of experience using regex (e.g., "5 years of experience")
    experience_years = 0
    exp_matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience', text_lower)
    if exp_matches:
        experience_years = max([int(m) for m in exp_matches])
    else:
        # Check dates like 2018 - 2023
        date_matches = re.findall(r'(20\d{2})\s*[-to]+\s*(20\d{2}|present|now)', text_lower)
        total_years = 0
        for start, end in date_matches:
            if end in ['present', 'now']:
                end = 2024 # Assumed current year for simplicity
            total_years += int(end) - int(start)
        if total_years > 0:
            experience_years = total_years

    # Education (simple extraction)
    education = []
    edu_keywords = ["bachelor", "master", "phd", "b.s", "m.s", "degree", "university", "college"]
    for sent in doc.sents:
        if any(keyword in sent.text.lower() for keyword in edu_keywords):
            education.append(sent.text.strip())
            # Limit to 3 sentences to avoid taking whole resume
            if len(education) >= 3:
                break
                
    return {
        "skills": list(skills),
        "experience_years": experience_years,
        "education": education
    }

def process_resume(pdf_bytes: bytes) -> Tuple[str, Dict[str, any]]:
    raw_text = extract_text_from_pdf(pdf_bytes)
    entities = extract_entities(raw_text)
    return raw_text, entities

def process_jd(text: str) -> Dict[str, any]:
    entities = extract_entities(text)
    return entities
