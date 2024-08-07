import React, { useState, useRef, useEffect } from 'react';
import { MdHomeFilled, MdSearch, MdLayers,MdArrowForward, MdAdd   } from "react-icons/md";
import { fetchSearchResult, fetchPlaylist, fetchPlaylistTracks, createSongsRecommendations, createPlaylist, addItemsPlaylist } from '../services/ApiService';
import { CircleLoader } from 'react-spinners';

import Modal from 'react-modal';
const SidebarComponent  = () => {
  const accessToken = localStorage.getItem('AccessToken');
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [playlists, setPlaylist] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createdPlaylistId, setCreatedPlaylistId] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchPlaylists = async() => {
      const trackData = await fetchPlaylist(accessToken);
      setPlaylist(trackData);
    };

    fetchPlaylists();
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleSearchClick = () => {
    if (searchActive && searchQuery.trim() !== '') {
      setModalIsOpen(true);
    } else {
      setSearchActive(true);
    }
  };

  const handleClickOutside = (event) => {
    if (searchActive) {
      setSearchActive(false);
    }
  };
  const searchInSpotify = async() =>{
    setSelectedPlaylist(null);
    const query =  searchQuery.trim();
    if (accessToken) {
      const searchResult = await fetchSearchResult(accessToken, query);
      if(searchResult){
        setSearchResult(searchResult.tracks.items)
        setModalIsOpen(true);
      }
    }
  }
  
  const handlePlaylistClick = async (playlistId) => {
    setIsOpened(false);
    setSelectedPlaylist(playlistId);
    const playlistTracks = await fetchPlaylistTracks(accessToken, playlistId);
    setTracks(playlistTracks);
    setModalIsOpen(true);
  };
  //for playlist creation
  const [isOpened, setIsOpened] = useState(false);
  const [recPlaylist, setRecPlaylist] = useState([]);
  const handleOpenModal = async() => {
    setLoading(true);
    setIsOpened(true);
    await generatePlaylist();
    
  };

  const handleCancel = () => {
    setIsOpened(false);
  };

  const generatePlaylist = async () => {
    setLoading(true);
    try {
      const genre = localStorage.getItem('genre');
      if(!genre){
        console.log('no genre given')
        return false;
      }
      const result = await createSongsRecommendations(accessToken, genre.toLowerCase());
      if(result){
        const playlist = await createPlaylist(accessToken);
        if(playlist && playlist.id){
          console.log('Playlist has been created')
          result.slice(0, 11).forEach(async(item) => {
            await addItemsPlaylist(accessToken, playlist.id, item.id);
          });
          setCreatedPlaylistId(playlist.id);
        }
      }
    } catch (error) {
      console.log('failed to create playlist::',error)
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      // setIsOpened(false);
    }
  };
  return (
    <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
        <div className='bg-[#121212] h-[15%] rounded flex flex-col justify-around'>
            <div className='flex items-center gap-3 pl-8 cursor-pointer'>
                <MdHomeFilled size={30}/>
                <p className='font-bold'>Home</p>
            </div>
            <div className='flex items-center gap-3 pl-8 cursor-pointer' onClick={handleSearchClick}>
          <MdSearch size={30} />
          {!searchActive ? (
            <p className='font-bold'>Search</p>
          ) : (
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='bg-[#242424] text-white p-2 rounded w-[80%]'
              placeholder='Type to search...'
              
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchInSpotify();
                }
              }}
            />
          )}
          {/* {!searchActive ? (
            <p className='font-bold'></p>
          ) : (
            <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className='bg-[#242424] text-white p-2 rounded ml-2'
          >
            <option value="track">Track</option>
            <option value="album">Album</option>
            <option value="artist">Artist</option>
          </select>
          )} */}
        </div>
          </div>
            <div className='bg-[#121212] h-[85%] rounded'>
              <div className='p-4 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <MdLayers size={30}/>
                  <p className='font-semibold'>Your Library</p>
                </div>
                <div className='flex items-center gap-3'>
                  <MdArrowForward  size={25}/>
                  <MdAdd size={25} />
                </div>
              </div>
            <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
              <h1>Auto-Generate Your Playlist</h1>
              <p className='font-light'>Personalized playlists based on your genre preferences</p>
              <button  onClick={handleOpenModal} className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Generate Playlist</button>
            </div>
            <div className='p-4 bg-[#242424] m-2 rounded font-semibold  items-start justify-start gap-1 pl-4 mt-4'>
              <h1>Your Playlists</h1>
              <div className='playlist-list flex flex-col gap-3 mt-4 max-h-80 overflow-y-auto'>
            {playlists.length > 0 ? (
              playlists.map(playlist => (
                <div key={playlist.id} className="playlist-item flex items-center gap-4 p-2 bg-[#333] rounded w-full cursor-pointer"
                onClick={() => handlePlaylistClick(playlist.id)}>
                  <div className="playlist-image w-16 h-16 overflow-hidden rounded">
                    <img
                      src={playlist.images ? playlist.images[0]?.url : '/playlist.png'}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="playlist-info flex-1">
                    <h3 className="text-white font-medium">{playlist.name}</h3>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">No playlists available</p>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setSearchQuery('');
          setTracks([]);
        }}
        contentLabel={selectedPlaylist ? "Playlist Tracks" : "Search Modal"}
        className="bg-black p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-8 w-[30%] "
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
      >
        <div className="text-white text-center max-h-[65vh] overflow-y-auto ">
          {selectedPlaylist ? (
            <>
              <h2 className="text-lg font-semibold mb-6 text-center">Tracks in Playlist</h2>
              <ul>
                {tracks.map((track) => (
                  <li key={track.id} className="mb-4 flex gap-4">
                    <img src={track.track.album.images[0].url} alt={track.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-semibold text-start">{track.name}</p>
                      <p className="text-sm text-gray-400 text-start">{track.track.artists.map(artist => artist.name).join(', ')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-6 text-center">Search Results</h2>
              <ul>
                {searchResult.map((track) => (
                  <li key={track.id} className="mb-4 flex gap-4">
                    <img src={track.album.images[0].url} alt={track.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-semibold text-start">{track.name}</p>
                      <p className="text-sm text-gray-400 text-start">{track.artists.map(artist => artist.name).join(', ')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-center"
            onClick={() => {
              setModalIsOpen(false);
              setSearchQuery('');
              setTracks([]);
            }}
          >
            Close
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isOpened}
        onRequestClose={handleCancel}
        contentLabel="Loading Modal"
        className="bg-black p-4 rounded-lg shadow-lg max-w-md mx-auto my-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
        shouldCloseOnOverlayClick={false}
      >
        <div className="text-white text-center max-h-[65vh] overflow-y-auto ">
        {loading ? (
            <>
               <div className="flex flex-col items-center">
                  <CircleLoader color="green" loading={loading} size={50} />
                  <p className="text-white mt-4">
                    We are creating a customized playlist for you. It might take a moment...
                  </p>
                  <button
                    onClick={handleCancel}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                  >
                    Cancel
                  </button>
              </div>
            </>
          ) : (
            <>
            <p className="text-white mt-4">
                    Let's see what we've made 
                  </p>
              <button
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                    onClick={() => handlePlaylistClick(createdPlaylistId)}
                  >
                    Go to songs
                  </button>
              
            </>
          )}
          
         </div>
      </Modal>
    </div>
  )
}

export default SidebarComponent 

