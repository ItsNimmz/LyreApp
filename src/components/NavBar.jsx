import React, { useRef, useState, useCallback, useEffect } from 'react';
import { MdArrowBack, MdArrowForward, MdPhotoCamera, MdError, MdMic, MdEmojiEmotions, MdSentimentNeutral, MdSentimentDissatisfied, MdSentimentVeryDissatisfied  } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import Modal from 'react-modal';
import axios from 'axios';
import {createSongsRecommendations, fetchTrack, fetchSearchResult} from '../services/ApiService';
import { CircleLoader, SyncLoader } from 'react-spinners';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Swal from 'sweetalert2';


const NavBar = () => {

  const Token = localStorage.getItem('AccessToken');

  const [showModal, setShowModal] = useState(false);
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [numSongs, setNumSongs] = useState(5); // default value
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState('');
  const [VoiceSearchResult, setVoiceSearchResult] = useState([]);

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(''); // Add your token management here
  const [genreRecommendations, setGenreRecommendations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Add your query management here

  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  //profile scrion
  const [isOpen, setIsOpen] = useState(false);
  const [showAccInfo, setshowAccInfo] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // Web camera section
  const [emotion, setEmotion] = useState('');
  const [isOpened, setIsOpened] = useState(false);
  const [voiceModal, setVoiceModal] = useState(false);
  const [listeningState, setListening] = useState(false);
  const { transcript, resetTranscript, listening,browserSupportsSpeechRecognition } = useSpeechRecognition();

  const openWebcam = () => {
    setIsOpened(true);
  }

  const onClose = () => {
    setIsResultOpen(false);
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
    const profileName = localStorage.getItem('profile');
    formData.append('profileName', profileName);
    setIsOpened(false);
    setIsResultOpen(true);
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await axios.post('http://127.0.0.1:4000/detect_emotion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Extract emotions from response
      const { emotions, combined_genres } = response.data;
      setEmotion(emotions);

      // Display emotions in an alert
      if (emotions && emotions.length > 0) {
          // alert(`Detected emotions: ${emotions.join(', ')}`);
          setIsLoading(false);
          // Fetch recommendations based on combined genres
          const totalTrack = [];
          for (let i = 0; i < combined_genres.length; i += 30) {
            const batch = combined_genres.slice(i, i + 3);
            const data = await fetchRecommendations(batch);
            data.map(item => totalTrack.push(item));
          }
          const trackData = [];
          for (let i = 0; i < totalTrack.length; i ++) {
            const data = await fetchTrack(Token, totalTrack[i]['id']);
            trackData[i] = {  
              image: data.images[0].url,
              name: data.name,
            };
            if (i == 4) {  // Exit after the 5th iteration (index 4 is the 5th iteration)
              break;
            }
          }
          setModalIsOpen(true)
          setGenreRecommendations(trackData);
      } else {
        console.log('------------------->>>>>>>>>>>>>>>>')
          setErrorMessage('Something Went Wrong!')
          setIsLoading(false);
      }

    } catch (error) {
      console.error('Error detecting emotion:', error);
      setErrorMessage(error.response ? error.response.data : '');
      setIsLoading(false);
      setEmotion('Error detecting emotion');
    }
  };

 // Function to display genre-based recommendations
 const fetchRecommendations = async (genres) => {
  if (Token) {
      try {
          const genresString = genres.join(',');
          const result = await createSongsRecommendations(Token, genresString.toLowerCase());

          const recommendations = result.map((track, index) => {
            if(index < 5) {
              return {
                id: track.id
              }
            }
          })
          // Set recommendations and open modal
          return recommendations;
          // setGenreRecommendations(recommendations);
          // setModalIsOpen(true);
      } catch (error) {
          console.log('Error fetching recommendations:', error);
      }
  } else {
      console.log('Access token is not available.');
  }
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
          localStorage.setItem('genre', data.genres || []);
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
      localStorage.setItem('genre', selectedGenres || []);
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
  
    try {
      const response = await fetch('https://cap2-emotion-detection1.onrender.com/recommender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          song_name: songName,
          artist_name: artistName,
          num_songs_to_output: numSongs,
          scaler_choice: 'Standard Scalar',
        }),
      });
  
      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setRecommendations(data.recommendations);
      setMessage(data.message);
      // setShowModal(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setMessage('Error fetching recommendations. Please try again later.');
    }
  };
  const startListening = async () => {
    setListening(true);
    if (browserSupportsSpeechRecognition) {
      await SpeechRecognition.startListening({ continuous: true });
    } else {
      alert('Speech Recognition is not supported in this browser.');
    }
  };
  const stopListening = async () => {
    // setListening(false);
    await SpeechRecognition.stopListening();
    setModalIsOpen(false);
    if (transcript) {
      const query =  transcript.trim();
      if (Token) {
        const searchResult = await fetchSearchResult(Token, query);
        if(searchResult){
          setVoiceSearchResult(searchResult.tracks.items)        
        }
      }
    }
    resetTranscript(); // Clear the transcript after sending it
  };
  const handleVoiceOpenModal = async() => {
    setVoiceModal(false);
    setVoiceSearchResult([]);
    setListening(false)
    
  };
  const [openFeedback, setOpenFeedback] = useState(false);
  const [activeIcon, setActiveIcon] = useState(null); 
  const handleIconClick = (iconName) => {
    setActiveIcon(iconName);
  };
  const closeFeedback = () => {
    setOpenFeedback(false);
    setActiveIcon(null)
  };

  const handleFeedSubmit = async () => {
    if (activeIcon) {
      try {
        const response = await fetch('https://cap2-emotion-detection1.onrender.com/save-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: profileName, feedback: activeIcon }),
        });
        console.log('Feedback submitted!');
      } catch (error) {
        console.error('Error submitting feedback:', error);
        console.log('Error submitting feedback.');
      }
      closeFeedback();
      Swal.fire({
        title: 'Thank you!',
        text: 'Thanks for your feedback!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'bg-black bg-opacity-90 text-white p-3 max-w-xs',
          confirmButton: 'bg-green-500 hover:bg-green-600 focus:ring-green-300',
        },
      });
    } else {
      alert('Please select an emotion.');
    }
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
              className='bg-white px-4 py-1 rounded-2xl text-black cursor-pointer'
            >
              Recommender
            </button>
          </div>

          {/* <p className='bg-black py-1 px-3 rounded-2xl text-[15px] cursor-pointer'>
            Install App
          </p> */}
          <MdMic
            onClick={() => setVoiceModal(true)}
            className="text-4xl cursor-pointer text-white-700 hover:text-white-900"
          />
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


      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Recommendation Form"
        className="bg-black p-4 rounded-lg shadow-lg max-w-md mx-auto my-4 border border-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
        shouldCloseOnOverlayClick={true}
      >
        {recommendations.length === 0 && (
        <div className="text-white">
          <h2 className="text-xl mb-4 text-center">Get Recommendations</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <label className="mb-2">
              Song Name:
              <input
                type="text"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                className="mt-1 p-1 ml-12 rounded text-black"
              />
            </label>
            <label className="mb-2">
              Artist Name:
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="mt-1 p-1 ml-12 rounded text-black"
              />
            </label>
            <label className="mb-2">
              Number of Songs:
              <input
                type="number"
                value={numSongs}
                onChange={(e) => setNumSongs(e.target.value)}
                className="mt-1 p-1 ml-3 rounded text-black"
              />
            </label>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Get Recommendations
            </button>
          </form>
          </div>
          )}
          {message && <p className="mt-4">{message}</p>}
          {recommendations.length > 0 && (
            <div className="mt-2 overflow-y-auto max-h-[65vh]">
              <h1 className="text-2xl font-bold mb-6 text-center text-white">Recommendations</h1>
              <ul className="list-disc ml-5">
                {recommendations.map((rec, index) => (
                  <li key={index} className="mb-4 flex gap-4">
                    <img src={'/rec.png'} alt={'image'} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-semibold text-start text-white">{rec.name}</p>
                      <p className="text-sm text-gray-400 text-start">{rec.artists}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => {
                    setShowModal(false);
                    setRecommendations([]);
                    setTimeout(() => {
                      setOpenFeedback(true);
                    }, 2000);
                  }}
                >
                  Close
                </button>
              </div>

            </div>
        )}
      </Modal>
          <Modal
           isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}
           contentLabel="Playlist Tracks" 
           className="bg-black p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-8 w-[30%] "
          overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
           >
             <div className="text-white text-center max-h-[65vh] overflow-y-auto ">
              <h2 className="text-lg font-semibold mb-6 text-center">Tracks For You</h2>
                <ul>
                {genreRecommendations.map((track, index) => (
                  <li key={index} className="mb-4 flex gap-4">
                    <img src={track.image} alt={track.name} className="w-16 h-16 object-cover rounded" />
                    <p className="font-semibold text-start">{track.name}</p>
                  </li>
                    ))}
                </ul>
                <button
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-center"
            onClick={() => {
              setModalIsOpen(false);
            }}
          >
            Close
          </button>
            </div>
        </Modal>
    <Modal
      isOpen={isResultOpen}
      onRequestClose={onClose}
      contentLabel="Webcam Modal"
      className="bg-black p-3 rounded-lg shadow-lg max-w-2xl mx-auto my-8 border-white"
      overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center border-white"
>
      <div className="modal-content border-white">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <CircleLoader color="green" loading={isLoading} size={50} />
            <p className="mt-4 text-white">Processing...</p>
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center text-center p-6 rounded">
            <MdError size={30} color="red" />
            <h1 className="text-red-500 text-xl font-bold mb-4">Error</h1>
            <p className='text-white'>{errorMessage}</p>
            <button
            onClick={onClose}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-60 mt-5"
          >
            Close
        </button>
          </div>
        ) : null}

      </div>
    </Modal>
    <Modal
        isOpen={voiceModal}
        onRequestClose={() => setVoiceModal(false)}
        contentLabel="Voice Recorder"
        className="bg-black p-4 rounded-lg shadow-lg max-w-sm mx-auto my-4 border border-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
        shouldCloseOnOverlayClick={true}
      >
        <div className="flex flex-col items-center">
          {listeningState ? (
            VoiceSearchResult.length > 0 ? (
              <div className='flex flex-col items-center'>
                <h2 className="text-lg font-semibold mb-6 text-center text-white">Search Results</h2>
                <div>
              <ul>
                {VoiceSearchResult.map((track) => (
                  <li key={track.id} className="mb-4 flex gap-4">
                    <img src={track.album.images[0].url} alt={track.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-semibold text-start text-white">{track.name}</p>
                      <p className="text-sm text-gray-400 text-start ">{track.artists.map(artist => artist.name).join(', ')}</p>
                    </div>
                  </li>
                  
                ))}
              </ul>
              </div>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-center"
                onClick={handleVoiceOpenModal}
              >
                Close
          </button>
              </div>
            ) : (
              <div className='flex flex-col items-center'>
                <SyncLoader color="green" loading={true} size={20} />
                <p className='text-white pt-3'>{transcript}</p>
                <button
                  onClick={stopListening}
                  className="mt-5 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                >
                  Stop Recording
                </button>
              </div>
            )
          ) : (
            <div>
              <button
                onClick={startListening}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Start Recording
              </button>
            </div>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={openFeedback}
        onRequestClose={closeFeedback}
        contentLabel="Webcam Modal"
        className="bg-black p-4 rounded-lg shadow-lg max-w-md mx-auto my-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
      >
        <h1 className='text-white items-center mb-7 text-lg font-semibold flex justify-center'>Rate Your Experience</h1>
        <div className="flex gap-8">
        <MdEmojiEmotions
          size={55}
          color={activeIcon === 'happy' ? 'green' : 'gray'}
          onClick={() => handleIconClick('happy')}
          className={`cursor-pointer ${activeIcon === 'happy' ? 'scale-110' : ''}`} // Add a scaling effect when active
        />
          <MdSentimentNeutral
          size={55}
          color={activeIcon === 'neutral' ? 'white' : 'gray'}
          onClick={() => handleIconClick('neutral')}
          className={`cursor-pointer ${activeIcon === 'neutral' ? 'scale-110' : ''}`}
        />
        <MdSentimentDissatisfied
          size={55}
          color={activeIcon === 'sad' ? 'red' : 'gray'}
          onClick={() => handleIconClick('sad')}
          className={`cursor-pointer ${activeIcon === 'sad' ? 'scale-110' : ''}`}
        />
        <MdSentimentVeryDissatisfied
          size={55}
          color={activeIcon === 'verySad' ? 'darkred' : 'gray'}
          onClick={() => handleIconClick('verySad')}
          className={`cursor-pointer ${activeIcon === 'verySad' ? 'scale-110' : ''}`}
        />
        </div>
        <div className="flex justify-center gap-7 mt-7 items-center">
        <button onClick={handleFeedSubmit} className="bg-green-500 text-white px-1 py-1 rounded hover:bg-green-600">
          Submit
        </button>
        <button onClick={closeFeedback} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
          Close
        </button>
        </div>
      </Modal>
    </>
  );
};

export default NavBar;
