import React from 'react'
import SidebarComponent from './components/SidebarComponent'
import PlayerComponent from './components/PlayerComponent'


const App = () => {
  return (
    <div className='h-screen bg-black'>
        <div className='h-[90%] flex'>
          <SidebarComponent />
        </div>
        <PlayerComponent />
    </div>
  )
}

export default App
