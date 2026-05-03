# FitScore 🚀 AI Resume Screening System

FitScore is a full-stack AI-powered application that evaluates how well a candidate's resume matches a job description using SBERT embeddings, PyTorch Deep Learning, and spaCy entity extraction.

## ✨ Features
- **Deep Learning Scoring**: Goes beyond keyword matching using a trained neural network.
- **Semantic Similarity**: Understands the context of resumes and job descriptions.
- **Explainability**: Provides human-readable reasons for scores and suggests improvements.
- **Skill Gap Analysis**: Visualizes matched and missing skills in a sleek dashboard.

## 🛠️ Tech Stack
- **Backend**: FastAPI, PyTorch, SBERT, spaCy, PyMuPDF.
- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Lucide Icons.
- **Data**: Trained on 20,000+ real resume pairs from Kaggle.

## 📖 Documentation
For installation, training, and usage instructions, please refer to the **[USER_MANUAL.md](USER_MANUAL.md)**.

## 🚀 Quick Start
1. Configure `.env` with your `KAGGLE_API_TOKEN`.
2. Run `backend/scripts/train_kaggle_model.py`.
3. Start the backend: `uvicorn app.main:app --reload`.
4. Start the frontend: `npm run dev`.

---
Developed by Antigravity AI
