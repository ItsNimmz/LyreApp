import React from 'react'
import SidebarComponent from './SidebarComponent'
import Display from './Display'
import PlayerComponent from './PlayerComponent'
import { getAccessToken } from '../services/ApiService'
const MainComponent = () => {
  getAccessToken();
  console.log('in Main component')
  return (
    <div className='h-screen bg-black'>
        <div className='h-[90%] flex'>
          <SidebarComponent />
          <Display />
        </div>
        <PlayerComponent />
    </div>
  )
}

export default MainComponent
