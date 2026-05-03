import os
import sys
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from tqdm import tqdm
import kagglehub
import random

from dotenv import load_dotenv

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.models.dl_model import FitScoreModel
from app.services.embedding import get_embedding

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

class FitScoreDataset(Dataset):
    def __init__(self, X, y):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.float32).unsqueeze(1)
        
    def __len__(self):
        return len(self.X)
        
    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

def download_and_prepare_data():
    print("Downloading resume dataset from Kaggle...")
    path = kagglehub.dataset_download("snehaanbhawal/resume-dataset")
    csv_path = os.path.join(path, "Resume", "Resume.csv")
    if not os.path.exists(csv_path):
        csv_path = os.path.join(path, "Resume.csv")
    
    df = pd.read_csv(csv_path)
    # We need the text and category
    df = df[['Category', 'Resume_str']].dropna()
    print(f"Loaded {len(df)} resumes.")
    
    # Pre-compute embeddings for all unique resumes to save massive computation time
    # Instead of computing embeddings for 100k pairs (200k passes), we compute 2.4k passes
    # and then construct the pairs using the cached embeddings.
    print("Pre-computing SBERT embeddings for all unique resumes (this may take a few minutes)...")
    resumes = df['Resume_str'].tolist()
    categories = df['Category'].tolist()
    
    embeddings = []
    # Using tqdm for progress bar
    for text in tqdm(resumes, desc="Computing Embeddings"):
        # Truncate text to avoid overly long processing if necessary (SBERT truncates anyway, but doing it here saves memory)
        emb = get_embedding(text[:3000]) 
        embeddings.append(emb)
    
    embeddings = np.array(embeddings)
    
    # Group indices by category
    cat_to_indices = {}
    for i, cat in enumerate(categories):
        if cat not in cat_to_indices:
            cat_to_indices[cat] = []
        cat_to_indices[cat].append(i)
        
    print("Generating 20,000 data pairs (10k positive, 10k negative)...")
    X_pairs = []
    y_labels = []
    
    num_positive = 10000
    num_negative = 10000
    
    # Generate positive pairs (same category)
    pos_count = 0
    all_categories = list(cat_to_indices.keys())
    
    with tqdm(total=num_positive, desc="Generating Positive Pairs") as pbar:
        while pos_count < num_positive:
            cat = random.choice(all_categories)
            indices = cat_to_indices[cat]
            if len(indices) < 2:
                continue
            idx1, idx2 = random.sample(indices, 2)
            emb_concat = np.concatenate([embeddings[idx1], embeddings[idx2]])
            X_pairs.append(emb_concat)
            # Label for positive match is high (e.g. 0.9 to 1.0)
            y_labels.append(random.uniform(0.85, 1.0))
            pos_count += 1
            pbar.update(1)
            
    # Generate negative pairs (different category)
    neg_count = 0
    with tqdm(total=num_negative, desc="Generating Negative Pairs") as pbar:
        while neg_count < num_negative:
            cat1, cat2 = random.sample(all_categories, 2)
            idx1 = random.choice(cat_to_indices[cat1])
            idx2 = random.choice(cat_to_indices[cat2])
            emb_concat = np.concatenate([embeddings[idx1], embeddings[idx2]])
            X_pairs.append(emb_concat)
            # Label for negative match is low (e.g. 0.0 to 0.3)
            y_labels.append(random.uniform(0.0, 0.3))
            neg_count += 1
            pbar.update(1)
            
    # Shuffle the dataset
    combined = list(zip(X_pairs, y_labels))
    random.shuffle(combined)
    X_pairs, y_labels = zip(*combined)
    
    return np.array(X_pairs), np.array(y_labels)

def train():
    model_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'trained_models')
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'fitscore_model.pth')

    X, y = download_and_prepare_data()
    print(f"Dataset prepared. X shape: {X.shape}, y shape: {y.shape}")
    
    # Setup PyTorch Dataset and DataLoader
    dataset = FitScoreDataset(X, y)
    batch_size = 256
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on device: {device}")
    
    model = FitScoreModel().to(device)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    print("Training DL Model on 20k Kaggle samples...")
    epochs = 15 # Can be adjusted
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        
        # Use tqdm for epoch progress
        batch_iter = tqdm(dataloader, desc=f"Epoch {epoch+1}/{epochs}")
        for inputs, targets in batch_iter:
            inputs, targets = inputs.to(device), targets.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            batch_iter.set_postfix({'loss': loss.item()})
            
        epoch_loss = running_loss / len(dataset)
        print(f"Epoch [{epoch+1}/{epochs}] completed. Average Loss: {epoch_loss:.4f}")

    torch.save(model.state_dict(), model_path)
    print(f"Model successfully saved to {model_path}")
    print("Training Complete! The AI is now powered by 20,000 real Kaggle resume pairs.")

if __name__ == "__main__":
    train()
