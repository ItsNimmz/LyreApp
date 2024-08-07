import React, { useRef, useState, useCallback, useEffect } from 'react';
import { MdArrowBack, MdArrowForward, MdPhotoCamera } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import Modal from 'react-modal';
import axios from 'axios';

const NavBar = () => {

  //profile scrion
  const [isOpen, setIsOpen] = useState(false);
  const [showAccInfo, setshowAccInfo] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // Web camera section
  const [emotion, setEmotion] = useState('');
  const [isOpened, setIsOpened] = useState(false);
  const openWebcam = () => {
    setIsOpened(true);
  }
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    return imageSrc;
  }, [webcamRef]);

  const handleCapture = async () => {
    const imageSrc = capture();

    const base64Response = await fetch(imageSrc);
    const blob = await base64Response.blob();
    const formData = new FormData();
    formData.append('image', blob, 'captured_image.jpg');
    const profileId = localStorage.getItem('profileId');
    formData.append('profileId', profileId);

    try {
      const response = await axios.post('https://cap2-emotion-detection1.onrender.com/detect_emotion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEmotion(response.data.emotions);
      console.log('------You look so ', response.data.emotions[0], '---------------------------')
    } catch (error) {
      console.error('Error detecting emotion:', error);
      setEmotion('Error detecting emotion');
    }
    setIsOpened(false);
  };
  const handleCancel = () => {
    setIsOpened(false);
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  }
  const showAccInfoFn = () => {
    setshowAccInfo(true)
  }
  const profileName = localStorage.getItem('profile');
  const genres = ['Pop', 'Rock', 'Jazz', 'Hip Hop', 'Classical', 'R&B', 'Country', 'Reggae', 'Blues', 'Electronic',
    'Folk', 'Latin', 'Metal', 'Soul', 'Punk', 'Funk', 'Disco', 'Gospel', 'House', 'Techno',
    'Trance', 'K-Pop', 'Ska', 'Dubstep', 'Ambient', 'Grunge', 'Indie', 'Swing', 'Bluegrass', 'Opera'];
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`https://cap2-emotion-detection1.onrender.com/get-genres/${profileName}`);
        if (response.ok) {
          const data = await response.json();
          setSelectedGenres(data.genres || []);
        } else {
          console.error('Failed to fetch genres');
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    if (showAccInfo) {
      fetchGenres();
    }
  }, [showAccInfo, profileName]);

  const handleGenreClick = (genre) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  };



  ///////////////for saving genre
  const saveGenres = async () => {
    const response = await fetch('https://cap2-emotion-detection1.onrender.com/save-genres', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: profileName, genres: selectedGenres }),
    });
    if (response.ok) {
      console.log('Genres saved successfully');
      setshowAccInfo(false)
      setIsOpen(false);
    } else {
      console.error('Failed to save genres');
    }
  };

  const handleAccInfoCancel = () => {
    setshowAccInfo(false);
    setIsOpen(false);
  }

  //Recommender form section
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://cap2-emotion-detection1.onrender.com/recommender', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        song_name: songName,
        artist_name: artistName,
        num_songs_to_output: numSongs,
        scaler_choice: scalerChoice,
        ...Object.entries(weights).map(([key, value]) => `weight_${key}=${value}`).join('&'),
      }),
    });

    const data = await response.json();
    setRecommendations(data.recommendations);
    setMessage(data.message);
    setShowModal(false);
  };


  return (
    <>
      <div className='w-full flex justify-between items-center font-semibold'>
        <div className='flex items-center gap-2'>
          <MdArrowBack
            onClick={() => navigate(-1)}
            className='w-8 h-8 bg-black p-2 rounded-rxl cursor-pointer text-white'
          />
          <MdArrowForward
            onClick={() => navigate(+1)}
            className='w-8 h-8 bg-black p-2 rounded-rxl cursor-pointer text-white'
          />
        </div>
        <div className='flex items-center gap-4'>
          <div>
            <MdPhotoCamera size={30} onClick={() => setIsOpened(true)} className="cursor-pointer" />
            <Modal
              isOpen={isOpened}
              onRequestClose={handleCancel}
              contentLabel="Webcam Modal"
              className="bg-black p-4 rounded-lg shadow-lg max-w-md mx-auto my-4"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-auto"
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleCapture}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
                >
                  Capture Emotion
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </Modal>
          </div>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className='bg-black px-4 py-1 rounded-2xl text-white cursor-pointer'
            >
              Recommender
            </button>

            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                  <form onSubmit={handleSubmit}>
                    <label>
                      Song Name:
                      <input type="text" value={songName} onChange={(e) => setSongName(e.target.value)} />
                    </label>
                    <label>
                      Artist Name:
                      <input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
                    </label>
                    <label>
                      Number of Songs:
                      <input type="number" value={numSongs} onChange={(e) => setNumSongs(e.target.value)} />
                    </label>
                    <label>
                      Scaler Choice:
                      <input type="text" value={scalerChoice} onChange={(e) => setScalerChoice(e.target.value)} />
                    </label>
                    {/* Add input fields for weights if needed */}
                    <button type="submit">Get Recommendations</button>
                  </form>
                  <div>
                    <h3>Recommendations:</h3>
                    <ul>
                      {recommendations.map((rec, index) => (
                        <li key={index}>{rec.name} by {rec.artists}</li>
                      ))}
                    </ul>
                    {message && <p>{message}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className='bg-black py-1 px-3 rounded-2xl text-[15px] cursor-pointer'>
            Install App
          </p>
          <p className='bg-purple-500 text-black w-7 h-7 rounded-full flex items-center justify-center cursor-pointer' onClick={toggleDropdown}>
            A
          </p>
          {isOpen && (
            <div className="profile-menu absolute right-0 mt-20">
              <ul className="p-2 bg-white text-black rounded-md shadow-lg cursor-pointer">
                <li onClick={showAccInfoFn}>Account Information</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <p className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer'>All</p>
        <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer'>Music</p>

      </div>
      <Modal
        isOpen={showAccInfo}
        onRequestClose={handleCancel}
        contentLabel="account info Modal"
        className="bg-black p-6 rounded-lg shadow-lg max-w-2xl mx-auto my-8"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
      >
        <div className='text-white'>
          <h2 className="text-lg font-semibold mb-6">User Details</h2>
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="text-lg font-medium">Username:<strong> {profileName}</strong></p>
            </div>
            <div>
              <p className="text-lg font-medium"><strong>Genres:</strong></p>
              <ul className="grid grid-cols-5 gap-4 mt-2">
                {genres.map((genre, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer ${selectedGenres.includes(genre) ? 'text-green-500' : 'text-yellow-100'}`}
                    onClick={() => handleGenreClick(genre)}
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={saveGenres}
            >
              Save
            </button>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={handleAccInfoCancel}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NavBar;
