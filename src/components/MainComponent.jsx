import React from 'react'
import SidebarComponent from './SidebarComponent'
import Display from './Display'
import PlayerComponent from './PlayerComponent'

const MainComponent = () => {
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
