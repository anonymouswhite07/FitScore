import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze
import uvicorn
import subprocess

app = FastAPI(title="FitScore AI Resume Screening API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check and train model if not present on startup
@app.on_event("startup")
async def startup_event():
    model_path = os.path.join(os.path.dirname(__file__), '..', 'trained_models', 'fitscore_model.pth')
    if not os.path.exists(model_path):
        print("Model not found. Running training script...")
        script_path = os.path.join(os.path.dirname(__file__), '..', 'scripts', 'train_model.py')
        # We run it in a subprocess to avoid blocking the event loop too much, 
        # though for a real app we'd train offline.
        subprocess.Popen(["python", script_path])
    else:
        print("Model found. Ready to serve.")

app.include_router(analyze.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FitScore API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
