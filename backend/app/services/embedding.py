from sentence_transformers import SentenceTransformer
import torch
import numpy as np

# Load the SBERT model once globally when the module is imported
# all-MiniLM-L6-v2 outputs 384-dimensional embeddings
try:
    sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Error loading SentenceTransformer: {e}")
    sbert_model = None

def get_embedding(text: str) -> np.ndarray:
    """Generates an embedding for the given text using SBERT."""
    if sbert_model is None or not text:
        return np.zeros(384)
    embedding = sbert_model.encode(text)
    return embedding

def compute_cosine_similarity(emb1: np.ndarray, emb2: np.ndarray) -> float:
    """Computes cosine similarity between two embeddings."""
    if np.linalg.norm(emb1) == 0 or np.linalg.norm(emb2) == 0:
        return 0.0
    similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
    return float(similarity)
