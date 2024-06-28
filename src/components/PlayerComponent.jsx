import React from 'react'
import { songsData } from '../assets/assets'
import { MdShuffle, MdSkipPrevious, MdSkipNext, MdPause, MdPlayArrow, MdLoop, MdMic, MdQueue, MdSpeaker, MdZoomIn, MdVolumeUp   } from "react-icons/md";
const PlayerComponent = () => {
  return (
    <div className='h-[10%] bg-black flex justify-between items-center text-white px-4'>
        <div className='hidden lg:flex items-center gap-4'>
            <img className='w-12' src={songsData[0].image} alt="" />
            <div>
                <p>{songsData[0].name}</p>
                <p>{songsData[0].desc.slice(0,12)}</p>
            </div>
        </div>
        <div className='flex flex-col items-center gap-1 m-auto'>
            <div className='flex gap-4'>
                <MdShuffle className='cursor-pointer' size={20}/>
                <MdSkipPrevious className='cursor-pointer' size={25}/>
                <MdPlayArrow className='cursor-pointer' size={25}/>
                <MdSkipNext className='cursor-pointer' size={25}/>
                <MdLoop className='cursor-pointer' size={20}/>
            </div>
            <div className='flex items-center gap-5'>
                <p>1:06</p>
                <div className='w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer'>
                    <hr className='h-1 border-none w-20 bg-green-800 rounded-full'/> 
                </div>
                <p>3:20</p>
            </div>
        </div>
        <div className='hidden lg:flex items-center gap-2 opacity-75'>
        <MdMic className='cursor-pointer' size={25}/>
        <MdQueue className='cursor-pointer' size={25}/>
        <MdSpeaker className='cursor-pointer' size={25}/>
        <MdVolumeUp className='cursor-pointer' size={20}/>
        <div className='w-20 bg-slate-50 h-1 rounded'></div>
        <MdZoomIn className='cursor-pointer' size={20}/>
        </div>
    </div>
  )
}

export default PlayerComponent