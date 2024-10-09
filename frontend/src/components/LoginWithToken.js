import { useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginWithToken = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    console.log('Token from URL:', token);


    const loginWithToken = async () => {
      try {
        const response = await axiosClient.get(`/api/users/login-with-token?token=${token}`);
        console.log('Response data:', response.data);

        localStorage.setItem('authToken', response.data.authToken);
        setUser(response.data.user);

        if (!response.data.user.profileFilled) {
          navigate('/complete-profile');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error logging in with token:', error);
      }
    };

    if (token) {
      loginWithToken();
    }
  }, [setUser, navigate]);

  return <div>Iniciando sesión...</div>;

};

export default LoginWithToken;
