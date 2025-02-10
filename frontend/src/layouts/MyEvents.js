import { Outlet } from 'react-router-dom';
import MyEventsHeader from '../components/MyEventsHeader';
import MainNavbar from '../components/Navbar/MainNavbar';
import { EventProvider } from '../context/EventContext';

const MyEvents = () => {
  return (
    <>
      <MainNavbar />
      <EventProvider>
        <MyEventsHeader />
        <Outlet />
      </EventProvider>
    </>
  );
};

export default MyEvents;
