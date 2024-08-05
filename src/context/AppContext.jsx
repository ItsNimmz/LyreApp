import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    // State to hold the token
    const [token, setToken] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [profile, setProfile] = useState(null);

    // Function to set the token
    const setAuthToken = (newToken) => {
        console.log('setting token')
        localStorage.setItem('AccessToken', newToken);
        setToken(newToken);
    };

    const setAuthAccessToken = (newToken) => {
        console.log('setting Access token')
        localStorage.setItem('AccessToken', newToken);
        setAccessToken(newToken);
    };

    const setUserProfile = (profile) => {
        localStorage.setItem('profile', profile);
        setProfile(profile);
    };

    // Context value containing only the token and its setter
    const contextValue = {
        token,
        setToken: setAuthToken,
        accessToken,
        setAccessToken: setAuthAccessToken,
        profile,
        setProfile: setUserProfile
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
