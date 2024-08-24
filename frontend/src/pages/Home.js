
import React from 'react';
import EventList from '../components/EventList';
import Navbar from '../components/Navbar/Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      <main className='discover_container'>
        <EventList />
      </main>
    </>
  );
};

export default Home
