import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import Albumlist from './Albumlist';
import { fetchNewReleases, fetchFeaturedPlaylists, fetchSavedTracks } from '../services/ApiService';
import SearchBar from './SearchBar';
import Recommendations from './Recommendations';
import '../style.css';

const DisplayHome = () => {
  const accessToken = localStorage.getItem('AccessToken');

  const [newReleases, setNewReleases] = useState([]);  // New Releases
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]); // Featured Playlists
  const [savedTracks, setSavedTracks] = useState([]); // Saved tracks (Liked songs)
  const [userTracks, setUserTracks] = useState([]); // Tracks added by the user
  const [showRecommendations, setShowRecommendations] = useState(false); // Toggle to show/hide recommendations

  useEffect(() => {
    const getNewReleases = async () => {
      if (accessToken) {
        const releases = await fetchNewReleases(accessToken);
        setNewReleases(releases);
      }
    };
    const getFeaturedPlaylists = async () => {
      if (accessToken) {
        const playlists = await fetchFeaturedPlaylists(accessToken);
        setFeaturedPlaylists(playlists);
      }
    };
    const getSavedTracks = async () => {
      if (accessToken) {
        const tracks = await fetchSavedTracks(accessToken);
        setSavedTracks(tracks);
      }
    };

    getNewReleases(); // Fetch new releases
    getFeaturedPlaylists(); // Fetch featured playlists
    getSavedTracks(); // Fetch saved tracks
  }, [accessToken]);

  const addSong = (trackId) => {
    setUserTracks([...userTracks, trackId]);
  };

  const toggleRecommendations = () => {
    setShowRecommendations(!showRecommendations);
  };
  return (
    <>
      <NavBar />
      <div className="search-bar-section mb-4">
        <SearchBar token={accessToken} addSong={addSong} />
      </div>

      {/* New Section: User Added Songs */}
      <div className='user-tracks-section mb-4'>
        <h2 className='font-bold text-xl'>Your Added Songs</h2>
        <div className='flex overflow-auto'>
          {userTracks.length > 0 ? (
            userTracks.map((trackId, index) => (
              <Albumlist
                key={index}
                name={item.name}
                totaltracks={item.total_tracks}
                id={item.id}
                image={item.images[0]?.url}
              />
            ))
          ) : (
            <p>No songs added yet.</p>
          )}
        </div>
        {/* Button to toggle Recommendations */}
        <button className='toggle-recommendations-button' onClick={toggleRecommendations}>
          {showRecommendations ? 'Hide Recommendations' : 'Show Recommendations'}
        </button>
      </div>

      {/* Conditional Rendering for Recommendations */}
      {showRecommendations && (
        <div className='recommended-songs-section mb-4'>
          <h2 className='font-bold text-xl'>Recommended Songs</h2>
          <Recommendations token={accessToken} userId={'YOUR_USER_ID'} userTracks={userTracks} />
        </div>
      )}

      <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl'>New Releases</h1>
        <div className='flex overflow-auto'>
          {newReleases.length > 0 ? (
            newReleases.map((item, index) => (
              <Albumlist
                key={index}
                name={item.name}
                totaltracks={item.total_tracks}
                id={item.id}
                image={item.images[0]?.url}
              />
            ))
          ) : (
            <p>Loading New Releases.....</p>
          )}
        </div>
      </div>

      <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl'>Featured Playlists</h1>
        <div className='flex overflow-auto'>
          {featuredPlaylists.length > 0 ? (
            featuredPlaylists.map((playlist, index) => (
              <Albumlist
                key={index}
                name={playlist.name}
                totaltracks={playlist.tracks.total}
                id={playlist.id}
                image={playlist.images[0]?.url}
              />
            ))
          ) : (
            <p>Loading User's Featured Playlists......</p>
          )}
        </div>
      </div>

      <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl'>Liked Songs </h1>
        <div className='flex overflow-auto'>
          {savedTracks.length > 0 ? (
            savedTracks.map((track, index) => (
              <Albumlist
                key={index}
                name={track.track.name}
                totaltracks={track.track.album.total_tracks}
                id={track.track.id}
                image={track.track.album.images[0]?.url}
              />
            ))
          ) : (
            <p>Loading Liked Songs...</p>
          )}
        </div>
      </div>

      <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl'>Recommended Songs</h1>
        <Recommendations token={accessToken} userId={'YOUR_USER_ID'} userTracks={userTracks} />
      </div>
    </>
  );
};

export default DisplayHome;
