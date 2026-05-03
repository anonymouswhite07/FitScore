import os
import torch
import torch.nn as nn
import torch.optim as optim
import sys

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.models.dl_model import FitScoreModel

def generate_dummy_data(num_samples=1000):
    # Features: 768 dimensions (concatenated 384+384 SBERT embeddings)
    X = torch.rand((num_samples, 768))
    # Labels: continuous values between 0 and 1
    # Let's create a simple rule: if sum of first 50 dims > 25, score is high
    y = (X[:, :50].sum(dim=1) > 25).float().unsqueeze(1)
    # Add some noise
    y = y * 0.8 + 0.1 + (torch.rand(y.shape) * 0.1)
    y = torch.clamp(y, 0.0, 1.0)
    return X, y

def train():
    model_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'trained_models')
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'fitscore_model.pth')

    X, y = generate_dummy_data(2000)
    
    model = FitScoreModel()
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    print("Training DL Model...")
    epochs = 50
    for epoch in range(epochs):
        optimizer.zero_grad()
        outputs = model(X)
        loss = criterion(outputs, y)
        loss.backward()
        optimizer.step()
        
        if (epoch + 1) % 10 == 0:
            print(f"Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}")

    torch.save(model.state_dict(), model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train()
