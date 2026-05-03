import os
import torch
import numpy as np
from app.models.dl_model import FitScoreModel

# Global model instance
model = None

def load_model():
    global model
    model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'trained_models', 'fitscore_model.pth')
    
    model = FitScoreModel()
    if os.path.exists(model_path):
        model.load_state_dict(torch.load(model_path))
        model.eval()
        print("DL Model loaded successfully.")
    else:
        print("Warning: Trained DL Model not found. Please run train_model.py. Using random weights.")
        model.eval()

def predict_score(resume_emb: np.ndarray, jd_emb: np.ndarray) -> float:
    """Predicts a fit score (0-100) using the PyTorch DL model."""
    if model is None:
        load_model()
        
    # Concatenate embeddings
    combined = np.concatenate([resume_emb, jd_emb])
    tensor_input = torch.tensor(combined, dtype=torch.float32).unsqueeze(0)
    
    with torch.no_grad():
        score_tensor = model(tensor_input)
        score_val = score_tensor.item()
        
    # Scale to 0-100
    return round(score_val * 100, 2)
