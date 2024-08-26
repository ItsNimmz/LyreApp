# Lyre - Music Recommendation App

Lyre is a cloud-hosted music recommendation web application that analyzes user preferences to generate personalized music recommendations. The app allows users to create profiles, classify music genres, search for songs, and generate dynamic playlists based on their listening habits.

## Features

- **User Profile Creation**: Allows users to register and create personalized profiles.
- **Genre Classification**: Classifies music genres using machine learning algorithms.
- **Music Recommendation**: Provides song recommendations based on user preferences and listening history.
- **Playlist Generation**: Automatically generates playlists tailored to user moods and genres.
- **Search Functionality**: Allows users to search for songs, albums, and artists.

## Project Structure

- **index.html**: Entry point for the web application.
- **App.jsx**: Main React component that renders the user interface and handles interactions between frontend and backend.
- **main.jsx**: JavaScript module that initializes the React app.

## Technologies Used

- **Frontend**: 
  - React for UI development
  - JSX for component structure
  - HTML5, CSS3 for layout and design
- **Backend**:
  - Flask for API management
  - MySQL database for storing user data and music preferences
  - Machine learning models for genre classification and recommendation engine
- **Deployment**: 
  - Hosted on Render.com for full cloud deployment
  
## Installation

### Prerequisites

- Node.js and npm for running the frontend
- Python 3.11.5 for backend services
- Flask for serving the backend API
- MySQL for database management

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ItsNimmz/LyreApp.git
   cd LyreApp

2. **Frontend Setup**:

   ```bash
   cd client
   npm install 

## Running the Application

1. **Frontend**:
   ```bash
   cd client
   npm start

2. **Backend**:
   ```bash
   cd backend
   python app.py

3. **Access the App**:
    Navigate to https://lyreapp.onrender.com/ in your browser

## Deployment

The application is deployed on Render.com, offering full cloud integration for seamless music recommendation and playlist generation. Follow these steps to deploy your own version:
1. Set up a Render.com account and create a new web service.
2. Link the repository and set the necessary environment variables (API keys, database credentials, etc.).
3. Deploy the frontend and backend services.

## Usage

- **Register**: Create an account to start receiving personalized music recommendations.
- **Search**: Use the search bar to find songs, albums, and artists.
- **Playlists**: Generate and manage custom playlists based on your favorite genres.
- **Recommendations**: Get real-time recommendations based on your listening habits.

## License

This project is licensed under the MIT License - see the LICENSE file for details.




