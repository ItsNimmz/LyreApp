import React, { useContext } from 'react'
import MainComponent from './components/MainComponent';
import Login from './components/Login';
import { useState, useEffect  } from "react";

const App = () => {

  const [token, setToken] = useState(null);
  useEffect(() => {
    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);
    const params = new URLSearchParams(urlObj.search);
    const code = params.get('code');

    if (code) {
      setToken(code);
    }
  }, []);

  return (
     <div>{token ? <MainComponent /> : <Login />}</div>
  )
}

export default App
