import torch
import torch.nn as nn
import torch.nn.functional as F

class FitScoreModel(nn.Module):
    def __init__(self, input_dim=768):
        super(FitScoreModel, self).__init__()
        # Concatenated embedding is 384 (JD) + 384 (Resume) = 768
        self.fc1 = nn.Linear(input_dim, 256)
        self.fc2 = nn.Linear(256, 64)
        self.fc3 = nn.Linear(64, 1)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        # Output is a score between 0 and 1
        x = torch.sigmoid(self.fc3(x))
        return x
