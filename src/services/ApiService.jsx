// src/services/api.js

import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useContext, useState } from "react";

const CLIENT_ID = '33923fe14a9d46049601501e59066d27';
const CLIENT_SECRET = '52f295db11274f6db62ef7585d7e1cd1';
const REDIRECT_URI = 'https://lyreapp.onrender.com/';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// Example API call: Fetch user data
export const getAccessToken =  () => {
    const {token, accessToken, setAccessToken } = useContext(AppContext);
    const postData = {
      grant_type: 'authorization_code',
      code: token,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    };
    axios.post(TOKEN_ENDPOINT, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if(response.data.access_token){
        setAccessToken(response.data.access_token);
      }
      console.log('response.data',accessToken);
    })
    .catch(error => {
      console.error('Error fetching token:', error);
    });
};



export const fetchNewReleases = async (accessToken) => {
  if (!accessToken) {
    console.error('Access token is not available');
    return [];
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/browse/new-releases', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('New Releases:', data.albums.items);
    return data.albums.items;
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return [];
  }
};

export const fetchFeaturedPlaylists = async (accessToken) => {
  if (!accessToken) {
    console.error('Access token is not available');
    return [];
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data.playlists.items;
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
};

//User's Saved(Liked) Songs
export const fetchSavedTracks = async (accessToken) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
};

export const fetchSongs = async () => {
  return 'null'
};

export const fetchUserProfile = async (accessToken) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    localStorage.setItem('profile', data.display_name);
    localStorage.setItem('profileId', data.id);
    return data.display_name;
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
};


export const fetchSearchResult = async (accessToken,query) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/search?q='+query+'&type=track&limit=5&offset=0', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
};


//User's Recent Songs
export const fetchRecentTracks = async (accessToken) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=20', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
};


//User's playlist
export const fetchPlaylist = async (accessToken) => {
  const profileId = localStorage.getItem('profileId');
  try {
    const response = await fetch('https://api.spotify.com/v1/users/'+profileId+'/playlists?limit=50&offset=0', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
};


//User's playlist tracks
export const fetchPlaylistTracks = async (accessToken, playlistId) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/playlists/'+playlistId+'/tracks?limit=50&offset=0', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
};

//create Recommendations based on genre
export const createSongsRecommendations = async (accessToken, genre) => {
  const seed = genre ? 'seed_genres='+genre : '';

  try {
    const response = await fetch('https://api.spotify.com/v1/recommendations?'+seed, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data.tracks;
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
};

export const createPlaylist = async (accessToken) => {
  const profileId = localStorage.getItem('profileId');
  try {
    const response = await fetch('https://api.spotify.com/v1/users/'+profileId+'/playlists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Auto Lyre',
        description: 'New Playlist',
        public: true ,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();

    return data
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  } 
  
};


export const addItemsPlaylist = async (accessToken, playlistId, trackId) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=spotify:track:${encodeURIComponent(trackId)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: ["string"],
        position: 0,
      }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  } 
  
};

export const fetchTrack = async (accessToken,id) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/tracks/'+id, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data.album;
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
};