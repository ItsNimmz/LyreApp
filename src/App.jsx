import React, { useContext } from 'react'
import MainComponent from './components/MainComponent';
import Login from './components/Login';
import { useState, useEffect  } from "react";
import { AppContext } from './context/AppContext';

const App = () => {

  // const [token, setToken] = useState(null);
  // useEffect(() => {
    const { token, setToken } = useContext(AppContext);

    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);
    const params = new URLSearchParams(urlObj.search);
    const code = params.get('code');

    if (code && !token) {
      setToken(code);
    }
  // }, []);
  return (
     <div>{code ? <MainComponent /> : <Login />}</div>
  )
}

export default App
