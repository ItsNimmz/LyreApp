// src/components/Recommendations.jsx
import React, { useState } from 'react';
import { getRecommendations, getSpotifyRecommendations } from '../services/ApiService';
const Recommendations = ({ token, userId, userTracks }) => {
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async () => {
    const aiRecommendations = await getRecommendations(userId, userTracks);
    const seedTracks = aiRecommendations.map((rec) => rec[0]);
    const spotifyRecs = await getSpotifyRecommendations(token, seedTracks);
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
