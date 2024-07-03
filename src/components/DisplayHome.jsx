import React from 'react';
import NavBar from './NavBar';
import { albumsData } from '../assets/assets';
import Albumlist from './Albumlist';

const DisplayHome = () => {
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
    </>
  );
};

export default DisplayHome;
