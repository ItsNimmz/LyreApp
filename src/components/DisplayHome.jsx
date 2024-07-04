import React, {useContext} from 'react';
import NavBar from './NavBar';
import { albumsData } from '../assets/assets';
import Albumlist from './Albumlist';
import { songsData } from '../assets/assets';
import SongList from './SongList';
import { AppContext } from '../context/AppContext';

const DisplayHome = () => {
  const { accessToken } = useContext(AppContext);
  console.log('accessToken',accessToken)
  return (
    <>
      <NavBar />
      <div className='mb-4'>
        <h1 className='my-5  font-bold text-2xl'>Featured Charts</h1>
        <div className='flex overflow-auto'>
        {albumsData.map((item, index) => (
          <Albumlist key={index} name={item.name} desc={item.desc} id={item.id} image={item.image} />
        ))}
        </div>
        
      </div>
      <div className='mb-4'>
        <h1 className='my-5  font-bold text-2xl'>Today's Biggest Hits</h1>
        <div className='flex overflow-auto'>
          {songsData.map((item, index) => (
            <Albumlist 
              key={index} 
              name={item.name} 
              desc={item.desc} 
              id={item.id} 
              image={item.image} 
            />
          ))}
        </div>

        
      </div>
    </>
  );
};

export default DisplayHome;
