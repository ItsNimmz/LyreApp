import React, { useState, useRef, useEffect } from 'react';
import { MdHomeFilled, MdSearch, MdLayers,MdArrowForward, MdAdd   } from "react-icons/md";
import { fetchSearchResult } from '../services/ApiService';

import Modal from 'react-modal';
const SidebarComponent  = () => {
  const accessToken = localStorage.getItem('AccessToken');
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('track');
  const searchRef = useRef(null);

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
    const query =  searchQuery.trim();
    if (accessToken) {
      const searchResult = await fetchSearchResult(accessToken, query);
      if(searchResult){
        console.log('heyyyyyyyyy',searchResult.tracks.items)
        setSearchResult(searchResult.tracks.items)
        setModalIsOpen(true);
      }
    }
  }
  

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
              <h1>Create Your First Playlist</h1>
              <p className='font-light'>It's easy we will help you</p>
              <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Create Playlist</button>
            </div>
            <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4'>
              <h1>Let's find some podcast to follow</h1>
              <p className='font-light'>We will keep ypu update on new episodes</p>
              <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Brows Podcast</button>
            </div>
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Search Modal"
            className="bg-black p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-8 w-[30%]"
            overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
          >
            <div className="text-white text-center">
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
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-center"
                onClick={() => {
                  setModalIsOpen(false);
                  setSearchActive(false);
                  setSearchQuery('');
                }}
              >
                Close
              </button>
            </div>
          </Modal>
    </div>
  )
}

export default SidebarComponent 

