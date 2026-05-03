# FitScore User Manual

Welcome to **FitScore**, an AI-powered Resume Screening System that uses Deep Learning and NLP to match candidates to job descriptions.

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Kaggle Account** (for training on real data)

### 2. Installation

#### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Configuration
Create a `.env` file in the `backend/` directory and add your Kaggle API Token:
```env
KAGGLE_API_TOKEN=your_token_here
```

---

## 🧠 Training the AI Model

FitScore comes with a dummy model, but for best results, you should train it on real data.

1. Ensure your `.env` file has a valid Kaggle Token.
2. Run the Kaggle training script:
```bash
cd backend
.\venv\Scripts\python scripts\train_kaggle_model.py
```
This script will:
- Download the Resume Dataset from Kaggle.
- Generate 20,000 semantic matching pairs.
- Train a PyTorch Deep Learning model.
- Save the weights to `trained_models/fitscore_model.pth`.

---

## 💻 Running the Application

### 1. Start the Backend API
```bash
cd backend
.\venv\Scripts\uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.

### 2. Start the Frontend UI
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🛠️ Features
- **AI Matching**: Uses SBERT embeddings and a PyTorch neural network to calculate fit scores.
- **Skill Extraction**: Automatically identifies skills in both resumes and JDs.
- **Skill Gap Analysis**: Suggests what skills the candidate is missing.
- **Explainable AI**: Provides a human-readable summary of the match.

## 📄 API Documentation
- **POST `/analyze`**
  - **Inputs**: `resume` (PDF file), `job_description` (string).
  - **Returns**: Match score, similarity, matched/missing skills, and summary.
