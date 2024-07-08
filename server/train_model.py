# server/train_model.py
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
import pickle

# Example data collection
user_interactions = [
    {'user_id': 1, 'track_id': 'track_1', 'interaction': 5},
    {'user_id': 1, 'track_id': 'track_2', 'interaction': 4},
    {'user_id': 2, 'track_id': 'track_3', 'interaction': 5},
    # Add more data
]

df = pd.DataFrame(user_interactions)

# Prepare data for Surprise library
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(df[['user_id', 'track_id', 'interaction']], reader)

# Train-test split
trainset, testset = train_test_split(data, test_size=0.2)

# Train a collaborative filtering model (SVD)
algo = SVD()
algo.fit(trainset)

# Save the model
with open('svd_model.pkl', 'wb') as f:
    pickle.dump(algo, f)
