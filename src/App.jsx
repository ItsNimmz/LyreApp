import React, { useContext } from 'react'
import MainComponent from './components/MainComponent';
import Login from './components/Login';
import { useState, useEffect  } from "react";
import { AppContext } from './context/AppContext';

const App = () => {
  console.log('in app component')
  // const [token, setToken] = useState(null);
  // useEffect(() => {
    const { token, setToken } = useContext(AppContext);
    const tokenLocal = localStorage.getItem('AccessToken');
    const currentUrl = window.location.href;
    // const urlObj = new URL(currentUrl);
    // const params = new URLSearchParams(urlObj.search);
    const hash = currentUrl.split('#')[1];
    const params = new URLSearchParams(hash);
    const code = params.get('access_token');

    if (code && !token && !tokenLocal) {
      setToken(code);
    }
  // }, []);
  return (
     <div>{code ? <MainComponent /> : <Login />}</div>
  )
}

export default App
