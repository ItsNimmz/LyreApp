import React, { useContext } from 'react'
import SidebarComponent from './components/SidebarComponent'
import PlayerComponent from './components/PlayerComponent'
import Display from './components/Display'



const App = () => {
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

export default App
