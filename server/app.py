from flask import Flask, request, render_template
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from scipy.sparse import csr_matrix
from rapidfuzz import process, fuzz
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
import logging
import psutil

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logging.info("Application started")

def log_memory_usage():
    process = psutil.Process()
    memory_info = process.memory_info()
    logging.info(f"Memory Usage: {memory_info.rss / 1024 ** 2:.2f} MB")


# Spotify API setup
sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(
    client_id='33923fe14a9d46049601501e59066d27',
    client_secret='52f295db11274f6db62ef7585d7e1cd1'))

# Define features for scaling and calculations
features = ['popularity', 'danceability', 'energy', 'loudness', 'speechiness', 
            'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']
default_weights = [1/len(features)] * len(features)

# Read and preprocess the data
logging.info("Reading and preprocessing track data")
tracks_data = pd.read_csv('filtered_songs.csv')

tracks_data = tracks_data[(tracks_data['popularity'] > 40) & (tracks_data['instrumentalness'] <= 0.85)]
logging.info("Track data loaded and processed")
log_memory_usage()

#Function to fetch a song from Spotify
def get_song_from_spotify(song_name, artist_name=None):
    try:
        search_query = song_name if not artist_name else f"{song_name} artist:{artist_name}"
        logging.info(f"Searching Spotify for: {search_query}")
        results = sp.search(q=search_query, limit=1, type='track')
        if results['tracks']['items']:
            track = results['tracks']['items'][0]
            logging.info(f"Found track on Spotify: {track['name']} by {', '.join(artist['name'] for artist in track['artists'])}")
            audio_features = sp.audio_features(track['id'])[0]
            song_details = {
                'id': track['id'],
                'name': track['name'],
                'popularity': track['popularity'],
                'duration_ms': track['duration_ms'],
                'explicit': int(track['explicit']),
                'artists': ', '.join([artist['name'] for artist in track['artists']]),
                'danceability': audio_features['danceability'],
                'energy': audio_features['energy'],
                'key': audio_features['key'],
                'loudness': audio_features['loudness'],
                'mode': audio_features['mode'],
                'speechiness': audio_features['speechiness'],
                'acousticness': audio_features['acousticness'],
                'instrumentalness': audio_features['instrumentalness'],
                'liveness': audio_features['liveness'],
                'valence': audio_features['valence'],
                'tempo': audio_features['tempo'],
                'time_signature': audio_features['time_signature'],
            }
            return song_details
        else:
            logging.warning(f"No results found on Spotify for: {search_query}")
            return None
    except Exception as e:
        logging.error(f"Error fetching song from Spotify: {e}")
        return None

# Enhanced Fuzzy Matching Function
def enhanced_fuzzy_matching(song_name, artist_name, df):
    logging.info(f"Performing fuzzy matching for: {song_name}, {artist_name}")
    combined_query = f"{song_name} {artist_name}".strip()
    df['combined'] = df['name'] + ' ' + df['artists']
    matches = process.extractOne(combined_query, df['combined'], scorer=fuzz.token_sort_ratio)
    return df.index[df['combined'] == matches[0]].tolist()[0] if matches else None

# Function to apply the selected scaler and calculate weighted cosine similarity
def calculate_weighted_cosine_similarity(input_song_index, weights, num_songs_to_output, tracks_data, scaler_choice):
    logging.info("Calculating weighted cosine similarity")
    if scaler_choice == 'Standard Scaler':
        scaler = StandardScaler()
    else:  # MinMaxScaler
        scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(tracks_data[features]) * weights
    tracks_sparse = csr_matrix(scaled_features)
    cosine_similarities = cosine_similarity(tracks_sparse[input_song_index], tracks_sparse).flatten()
    similar_song_indices = np.argsort(-cosine_similarities)[1:num_songs_to_output+1]
    return similar_song_indices

# Function to recommend songs
def recommend_songs(song_name, artist_name, num_songs_to_output, scaler_choice, *input_weights):
    num_songs_to_output = int(num_songs_to_output)
    weights = np.array([float(weight) for weight in input_weights]) if input_weights else default_weights
    weights /= np.sum(weights)
    song_index = enhanced_fuzzy_matching(song_name, artist_name, tracks_data)
    if song_index is not None:
        similar_indices = calculate_weighted_cosine_similarity(song_index, weights, num_songs_to_output, tracks_data, scaler_choice)
        similar_songs = tracks_data.iloc[similar_indices][['name', 'artists']]
        return similar_songs, ""  # Return empty message if recommendations are found
    else:
        return pd.DataFrame(columns=['name', 'artists']), "No song found with the given details."

# Route for the main page
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        song_name = request.form.get("song_name")
        artist_name = request.form.get("artist_name")
        num_songs_to_output = request.form.get("num_songs_to_output", 5)
        scaler_choice = request.form.get("scaler_choice")
        weights = [request.form.get(f"weight_{feature}", 1/len(features)) for feature in features]
        
        recommendations, message = recommend_songs(song_name, artist_name, num_songs_to_output, scaler_choice, *weights)
        
        if not isinstance(recommendations, pd.DataFrame):
            recommendations = pd.DataFrame(columns=['name', 'artists'])  # Ensure recommendations is a DataFrame
            
        return render_template("index.html", recommendations=recommendations.to_dict(orient='records'), message=message)
    
    return render_template("index.html", recommendations=[], message="")

if __name__ == "__main__":
    app.run(debug=True)