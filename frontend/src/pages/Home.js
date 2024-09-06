
import React from 'react';
import EventList from '../components/EventList';
import MainNavbar from '../components/Navbar/MainNavbar';
import { useAuth } from '../context/AuthContext';


const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <MainNavbar />
      <main className='discover_container'>
        <h1>Bienvenido {user ? user.name : 'Invitado'}</h1>

        <EventList />
      </main>
    </>
  );
};

export default Home
