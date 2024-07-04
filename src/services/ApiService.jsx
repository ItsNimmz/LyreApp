// src/services/api.js

import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useContext, useState } from "react";

const CLIENT_ID = '33923fe14a9d46049601501e59066d27';
const CLIENT_SECRET = '52f295db11274f6db62ef7585d7e1cd1';
const REDIRECT_URI = 'http://localhost:5173/callback';
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

export const fetchSongs = async () => {
  return 'null'
};

