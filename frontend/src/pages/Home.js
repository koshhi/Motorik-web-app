
import React from 'react';
import EventList from '../components/EventList';
import MainNavbar from '../components/Navbar/MainNavbar';

const Home = () => {
  return (
    <>
      <MainNavbar />
      <main className='discover_container'>
        <EventList />
      </main>
    </>
  );
};

export default Home
