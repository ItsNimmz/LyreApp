# server/app.py
from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load the trained model
with open('svd_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/recommend', methods=['POST'])
def recommend():
    user_id = request.json['user_id']
    track_ids = request.json['track_ids']

    # Get recommendations from the model
    recommendations = []
    for track_id in track_ids:
        prediction = model.predict(user_id, track_id)
        recommendations.append((track_id, prediction.est))

    # Sort recommendations by estimated rating
    recommendations.sort(key=lambda x: x[1], reverse=True)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)
