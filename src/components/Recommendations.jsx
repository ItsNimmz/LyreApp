// src/components/Recommendations.jsx
import React, { useState } from 'react';
import { getRecommendations, getSpotifyRecommendations } from '../services/ApiService';
const Recommendations = ({ token, userId, userTracks }) => {
  // State hook to store recommendations
  const [recommendations, setRecommendations] = useState([]);

  // Function to fetch recommendations
  const fetchRecommendations = async () => {
    // Fetch AI-based recommendations
    const aiRecommendations = await getRecommendations(userId, userTracks);
    const seedTracks = aiRecommendations.map((rec) => rec[0]);
    // Fetch Spotify recommendations based on AI recommendations
    const spotifyRecs = await getSpotifyRecommendations(token, seedTracks);
    // Update the recommendations state
    setRecommendations(spotifyRecs);
  };

  return (
    <div>
      <button onClick={fetchRecommendations}>Get Recommendations</button>
      <ul>
        {recommendations.map((track) => (
          <li key={track.id}>
            {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
