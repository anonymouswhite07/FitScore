import fitz  # PyMuPDF
import spacy
import re
from typing import Dict, List, Tuple

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: spacy model 'en_core_web_sm' not found. Please run: python -m spacy download en_core_web_sm")
    nlp = None

# A comprehensive list of skills for extraction
COMMON_SKILLS = {
    # Tech - Languages
    "python", "java", "c++", "javascript", "typescript", "php", "ruby", "rust", "go", "swift", "kotlin", "scala", "perl", "r", "sql", "html", "css", "bash", "shell",
    # Tech - Frameworks & Libs
    "react", "node.js", "vue.js", "angular", "next.js", "express", "fastapi", "django", "flask", "spring", "laravel", "pytorch", "tensorflow", "keras", "scikit-learn", "pandas", "numpy", "opencv", "spacy", "nltk",
    # Tech - DevOps & Cloud
    "docker", "kubernetes", "aws", "gcp", "azure", "jenkins", "terraform", "ansible", "git", "ci/cd", "linux", "unix", "nginx", "apache", "prometheus", "grafana",
    # Tech - Databases
    "mongodb", "postgresql", "mysql", "redis", "elasticsearch", "cassandra", "dynamodb", "sqlite", "oracle", "firebase",
    # Management & Business
    "project management", "product management", "leadership", "strategy", "marketing", "sales", "finance", "accounting", "hr", "human resources", "operations", "supply chain", "business development", "crm", "erp", "tableau", "power bi", "excel", "data analysis", "risk management", "consulting", "agile", "scrum", "kanban", "pmp", "mba",
    # Soft Skills
    "communication", "teamwork", "problem solving", "time management", "creativity", "critical thinking", "adaptability", "empathy", "negotiation", "presentation", "mentoring", "customer service", "collaboration", "analytical skills"
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
    
    # 1. Extract skills using the common list
    for skill in COMMON_SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            skills.add(skill)
            
    # 2. Heuristic: Look for capitalized words that might be skills (e.g. "Solidity", "Redux")
    # This is a fallback for things not in our list
    if len(skills) < 3:
        # Find sequences of capitalized words (proper nouns)
        proper_nouns = [ent.text.lower() for ent in doc.ents if ent.label_ in ["ORG", "PRODUCT", "GPE"]]
        for pn in proper_nouns:
            if len(pn) > 2 and pn not in skills:
                skills.add(pn)

    # Extract years of experience
    experience_years = 0
    exp_matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience', text_lower)
    if exp_matches:
        experience_years = max([int(m) for m in exp_matches])
    else:
        date_matches = re.findall(r'(20\d{2})\s*[-to]+\s*(20\d{2}|present|now)', text_lower)
        total_years = 0
        for start, end in date_matches:
            if end in ['present', 'now']:
                end = 2024
            total_years += int(end) - int(start)
        if total_years > 0:
            experience_years = total_years

    # Education
    education = []
    edu_keywords = ["bachelor", "master", "phd", "b.s", "m.s", "degree", "university", "college", "graduate"]
    for sent in doc.sents:
        if any(keyword in sent.text.lower() for keyword in edu_keywords):
            education.append(sent.text.strip())
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
