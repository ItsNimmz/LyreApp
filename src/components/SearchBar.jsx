// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { searchSongs } from '../services/ApiService';

const SearchBar = ({ token, addSong }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (query) {
      const tracks = await searchSongs(token, query);
      setResults(tracks);
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          <FaSearch />
        </button>
      </div>
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((track) => (
            <li key={track.id}>
              {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
              <button onClick={() => addSong(track.id)}>Add</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
