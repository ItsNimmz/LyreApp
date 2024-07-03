import React, { useContext } from 'react'
import MainComponent from './components/MainComponent';
import Login from './components/Login';
import { useState, useEffect  } from "react";
import { AppContext } from './context/AppContext';

const App = () => {

  // const [token, setToken] = useState(null);
  // useEffect(() => {
    const { setToken } = useContext(AppContext);
    
    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);
    const params = new URLSearchParams(urlObj.search);
    const token = params.get('code');

    if (token) {
      setToken(token);
    }
  // }, []);
  return (
     <div>{token ? <MainComponent /> : <Login />}</div>
  )
}

export default App
