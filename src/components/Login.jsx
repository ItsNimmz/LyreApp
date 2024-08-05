import React from 'react'

const clientId = '33923fe14a9d46049601501e59066d27';
const redirectUrl = 'http://localhost:5173/';
const scope = 'user-library-read user-read-playback-state user-modify-playback-state user-read-recently-played';
const apiUrl = 'https://accounts.spotify.com/authorize'

const Login = () => {
  
  const loginToSpotify = () => {
    const state = generateRandomString(16);
    // const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}`;
    
    // // Redirect to the Spotify authorization page
    // window.location.href = authorizationUrl;

    window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${encodeURIComponent(scope)}&response_type=token&show_dialog=true`;
  }

  const generateRandomString = (length) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

  return (
    <div className='h-screen bg-custom-gradient h-screen'>
        <div className='w-[100%] flex flex-col items-center justify-center gap-[5rem] pt-[10%]'>
            <img className='h-[10vh] md:h-[20vh]'
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png"
                alt="spotify logo"
            />
        <button onClick={loginToSpotify} className='px-8 py-4 font-bold text-lg border-dashed border-black bg-white rounded-lg'>
            Login with Spotify
        </button>
        </div>
    </div>
  )
}


export default Login
