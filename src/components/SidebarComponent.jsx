import React from 'react'
import { MdHomeFilled, MdSearch, MdLayers,MdArrowForward, MdAdd   } from "react-icons/md";
const SidebarComponent  = () => {
  return (
    <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
        <div className='bg-[#121212] h-[15%] rounded flex flex-col justify-around'>
            <div className='flex items-center gap-3 pl-8 cursor-pointer'>
                <MdHomeFilled size={30}/>
                <p className='font-bold'>Home</p>
            </div>
            <div className='flex items-center gap-3 pl-8 cursor-pointer'>
                <MdSearch size={30}/>
                <p className='font-bold'>Search</p>
            </div>
          </div>
            <div className='bg-[#121212] h-[85%] rounded'>
              <div className='p-4 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <MdLayers size={30}/>
                  <p className='font-semibold'>Your Library</p>
                </div>
                <div className='flex items-center gap-3'>
                  <MdArrowForward  size={25}/>
                  <MdAdd size={25} />
                </div>
              </div>
            <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
              <h1>Create Your First Playlist</h1>
              <p className='font-light'>It's easy we will help you</p>
              <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Create Playlist</button>
            </div>
            <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4'>
              <h1>Let's find some podcast to follow</h1>
              <p className='font-light'>We will keep ypu update on new episodes</p>
              <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Brows Podcast</button>
            </div>
          </div>
    </div>
  )
}

export default SidebarComponent 

