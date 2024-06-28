import React from 'react'
import SidebarComponent from './components/SidebarComponent'

const App = () => {
  return (
    <div className='h-screen bg-black'>
        <div className='h-[90%] flex'>
          <SidebarComponent />
        </div>
    </div>
  )
}

export default App
