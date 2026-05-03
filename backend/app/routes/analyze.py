from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from app.services.parser import process_resume, process_jd
from app.services.embedding import get_embedding, compute_cosine_similarity
from app.services.matcher import match_skills, match_experience
from app.services.scorer import predict_score
from app.services.explain import generate_explanation
from app.utils.text_cleaning import clean_text

router = APIRouter()

@router.post("/analyze")
async def analyze_fit(resume: UploadFile = File(...), job_description: str = Form(...)):
    # Security Check: File type
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    # Security Check: File size (Max 5MB)
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    file_size = 0
    
    # Efficiently check size
    pdf_bytes = await resume.read()
    if len(pdf_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum allowed size is 5MB.")
    
    # 1. Parsing
    resume_text, resume_entities = process_resume(pdf_bytes)
    
    # Security: Sanitize all inputs
    job_description = clean_text(job_description)
    resume_text = clean_text(resume_text)
    
    jd_entities = process_jd(job_description)
    
    # 2. Embedding
    resume_emb = get_embedding(resume_text)
    jd_emb = get_embedding(job_description)
    
    # 3. Similarity & DL Scoring
    similarity = compute_cosine_similarity(resume_emb, jd_emb)
    dl_score = predict_score(resume_emb, jd_emb)
    
    # Combine similarity and DL score (weights could be adjusted)
    # DL score is already 0-100.
    final_score = (dl_score * 0.7) + (similarity * 100 * 0.3)
    final_score = round(min(final_score, 100.0), 2)
    
    # 4. Matching
    skill_match_result = match_skills(resume_entities["skills"], jd_entities["skills"])
    exp_gap = match_experience(resume_entities["experience_years"], jd_entities["experience_years"])
    
    # 5. Explainability
    summary = generate_explanation(
        score=final_score,
        similarity=similarity,
        matched_skills=skill_match_result["matched_skills"],
        missing_skills=skill_match_result["missing_skills"],
        experience_gap=exp_gap
    )
    
    return {
        "score": final_score,
        "similarity": round(similarity, 4),
        "matched_skills": skill_match_result["matched_skills"],
        "missing_skills": skill_match_result["missing_skills"],
        "experience_gap": exp_gap,
        "summary": summary
    }
