import { Outlet } from 'react-router-dom';
import MyEventsHeader from '../components/MyEventsHeader';
import MainNavbar from '../components/Navbar/MainNavbar';

const MyEventsLayout = () => {
  return (
    <>
      <MainNavbar />
      <MyEventsHeader />
      <Outlet />
    </>
  );
};

export default MyEventsLayout;
