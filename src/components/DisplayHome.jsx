import React, {useContext, useEffect, useState} from 'react';
import NavBar from './NavBar';
import { albumsData } from '../assets/assets';
import Albumlist from './Albumlist';
import { songsData } from '../assets/assets';
import SongList from './SongList';
import { AppContext } from '../context/AppContext';
import { fetchNewReleases } from '../services/ApiService';
import { fetchFeaturedPlaylists } from '../services/ApiService';
import { fetchSavedTracks, fetchUserProfile, fetchRecentTracks } from '../services/ApiService';



const DisplayHome = () => {
  // const { accessToken } = useContext(AppContext);
  // console.log('accessToken',accessToken)
  const accessToken = localStorage.getItem('AccessToken');
  
  //fetchNewReleases();
  // const newReleases = fetchNewReleases();

  // init user in dashboard each time
  const [newReleases, setNewReleases] = useState([]);  //New Releases
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]); // Featured Playlists
  const [savedTracks, setSavedTracks] = useState([]); // Saved tracks (Liked songs)
  const [recentTracks, setRecentTracks] = useState([]); // Recent tracks 

 

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
        await fetchUserProfile(accessToken);
        setSavedTracks(tracks);
      }
    };
    const getRecentTracks = async () => {
      if (accessToken) {
        const tracks = await fetchRecentTracks(accessToken);
        setRecentTracks(tracks);
      }
    };

    getNewReleases(); // Fetch new releases
    getFeaturedPlaylists(); // Fetch featured playlists
    getSavedTracks(); // Fetch saved tracks
    getRecentTracks();
  }, [accessToken]);


  
  return (
    <>
      <NavBar />
      <div className='mb-4'>
        <h1 className='my-5  font-bold text-2xl'>New Releases</h1>
        <div className='flex overflow-auto'>
        {/* {albumsData.map((item, index) => (
          <Albumlist key={index} name={item.name} desc={item.desc} id={item.id} image={item.image} />
        ))} */}
{/* 
        {newReleases.map((item, index) => (
          <Albumlist key={index} name={item.name} totaltracks={item.totaltracks}  id={item.id} image={item.images} />
        ))} */}

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
        <h1 className='my-5 font-bold text-2xl'>Featured Playlists</h1> {/* New section for featured playlists */}
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
        <h1 className='my-5 font-bold text-2xl'>Recently Played </h1> {/* New section for recently played tracks */}
        <div className='flex overflow-auto'>
          {recentTracks.length > 0 ? (
            recentTracks.map((track, index) => (
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
        <h1 className='my-5 font-bold text-2xl'>Liked Songs </h1> {/* New section for saved tracks */}
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

      {/* <div className='mb-4'>
        <h1 className='my-5  font-bold text-2xl'>Today's Biggest Hits</h1>
        <div className='flex overflow-auto'>
          {songsData.map((item, index) => (
            <Albumlist 
              key={index} 
              name={item.name} 
              desc={item.desc} 
              id={item.id} 
              image={item.image} 
            />
          ))}
        </div>

        
      </div> */}
    </>
  );
};


export default DisplayHome;
