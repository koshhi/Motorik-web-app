import { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ProfileHeader from '../components/ProfileHeader';
import MainNavbar from '../components/Navbar/MainNavbar';

const UserProfileLayout = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`);
        if (response.data.success) {
          setProfileUser(response.data.user);
        }
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  console.log(profileUser);

  if (!profileUser) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <>
      <MainNavbar />
      <ProfileHeader profileUser={profileUser} user={user} userId={userId} />
      <Outlet />
    </>
  );
};

export default UserProfileLayout;
