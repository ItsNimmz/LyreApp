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
    const tokenLocal = localStorage.getItem('token');
    const redirected = localStorage.getItem('redirected');
    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);
    const params = new URLSearchParams(urlObj.search);
    const code_1 = params.get('code');
    if (code_1) {
      console.log('jhgfdsdfghjf')
      localStorage.setItem('code', code_1);
      setToken(code_1);
      if(!redirected){
        console.log('fghjk',code_1)
        localStorage.setItem('redirected', true);
        window.location.href = '/';
      }
    }
    const code = localStorage.getItem('code');
    if(code ==null){
      console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    }
  // }, []);
  return (
     <div>{code ? <MainComponent /> : <Login />}</div>
  )
}

export default App
