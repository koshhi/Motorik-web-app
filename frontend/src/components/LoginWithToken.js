import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginWithToken = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshUserData, setToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const loginWithToken = async () => {
      try {
        const token = new URLSearchParams(location.search).get('token');
        const response = await axiosClient.get(`/api/users/login-with-token?token=${token}`);


        if (response.data.success) {
          localStorage.setItem('authToken', response.data.authToken);
          setToken(response.data.authToken);
          await refreshUserData();

          const destination = response.data.returnTo || '/';
          if (!response.data.user.profileFilled) {
            navigate('/complete-profile', { state: { returnTo: destination } });
          } else {
            navigate(destination);
          }

        }
      } catch (error) {
        if (error.response?.data?.error === 'TokenExpiredError') {
          setError('El enlace de inicio de sesión ha expirado. Por favor, solicita uno nuevo.');
        } else {
          setError('Error al iniciar sesión');
        }
        console.error('Error:', error);
      }
    };

    loginWithToken();
  }, [navigate, refreshUserData, setToken, location.search]);


  if (error) return <div>{error}</div>;
  return <div>Iniciando sesión...</div>;
};

export default LoginWithToken;
